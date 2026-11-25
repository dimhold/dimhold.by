---
title: "Мадэль ведае пра 1440 хвілін у сутках і ставіць напамін праз 24"
description: "Я даў Qwen3-0.6B у llama.cpp 10 інструментаў і 80 запытаў на 2 ядрах працэсара. Усе 49 выклікаў аказаліся карэктным JSON з існымі інструментамі, правільных з іх 28. Праверка па схеме спыніла б адзін з 21 няправільнага."
date: 2025-06-01
lang: be
translationKey: local-tool-calls
tags: ["llm", "agents", "reliability"]
---

Два адказы з аднаго прагону, мадэль тая самая і спіс інструментаў той самы. Пытаюся, колькі хвілін у сутках:

```
A day has 24 hours, and each hour has 60 minutes, so there are 24 × 60 = 1,440 minutes in a day.
```

Потым прашу "Remind me in a day with the text: water", гэта значыць нагадаць праз суткі:

```
{"name": "create_reminder", "arguments": {"text": "water", "minutes": 24}}
```

Выклік карэктны. Інструмент выбраны правільна, у полі цэлы лік, як і патрабуе схема. Паміж мадэллю і маім напамінам няма нічога, што б яго спыніла.

Я прывык думаць, што маленькая лакальная мадэль ламаецца на форме, псуе JSON або выклікае інструмент, якога ёй ніхто не даваў. Таму агенту на сваёй машыне я паставіў бы праверку па схеме з паўторам пры памылцы. Што такая праверка ловіць насамрэч, я ні разу не мераў.

## Што я запускаў

Мадэль Qwen3-0.6B, афіцыйны файл GGUF у квантаванні Q8_0 на 639 МБ. Запускаў яе ў llama.cpp, зборка b5554 ад 31 мая, на 2 ядрах віртуальнай машыны і з кантэкстам у 4096 токенаў. На піку сервер заняў 1,2 ГБ памяці. Тэмпература 0, разважанне выключана пустым блокам think, як гэта робіць шаблон чата. Звычайна `llama-server` з інструментамі абмяжоўвае выклік граматыкай. Мне хацелася ўбачыць саму мадэль, таму промпт з шаблона я адпраўляў як звычайны тэкст на працяг.

Інструментаў 10, набор для памочніка на хатнім камп'ютары. Запытаў 80, усе па-англійску і да кожнага ёсць эталон. У 24 запытах усе аргументы стаяць у тэксце як ёсць. У 16 адзін з аргументаў трэба спачатку пералічыць. Яшчэ ў 16 не хапае абавязковага аргумента і правільна было б перапытаць. Для 16 прыдатнага інструмента няма, астатнія 8 проста пытанні. Выклік залічаны, толькі калі ён дакладна супадае з эталонам. У апошніх 3 групах я лічыў адказ правільным, калі выкліку ў ім няма.

Да прагону я запісаў, чаго чакаю: ад 3 да 10 выдуманых інструментаў, а горш за ўсё будзе з прапушчанымі аргументамі.

Іншыя робяць гэта на тысячах прыкладаў. Рэйтынг BFCL з Берклі параўноўвае выклікі з эталонам, а выдуманыя выклікі API яшчэ ў 2023 годзе лічылі аўтары Gorilla. Красавіцкая праца When2Call якраз пра тое, ці разумее мадэль, што выклікаць нічога не трэба.

## З формай усё добра

Выклік быў у 49 адказах. Усе 49 разбіраюцца як JSON, усе імёны ўзятыя са спіса. Ніводнага выдуманага імя аргумента і ніводнага згубленага. Схему парушыў толькі `"minutes": 1.5`. Выдуманых інструментаў я чакаў хаця б 3, а атрымаў 0.

Правільных выклікаў з 49 выйшла 28. З 21 няправільнага мая праверка па схеме спыніла б адзін.

<figure class="fig">
<svg viewBox="0 0 680 190" role="img" aria-label="49 адказаў з выклікам інструмента. У 49 JSON разбіраецца, у 49 інструмент існуе, у 48 аргументы адпавядаюць схеме, у 28 выклік правільны.">
  <text x="198" y="31" text-anchor="end" class="f-mono f-muted" style="font-size:12px">адказы з выклікам</text>
  <rect x="210" y="14" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="14" width="420.0" height="24" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="640" y="31" text-anchor="start" class="f-mono f-ink" style="font-size:12px">49</text>
  <text x="198" y="65" text-anchor="end" class="f-mono f-muted" style="font-size:12px">JSON разбіраецца</text>
  <rect x="210" y="48" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="48" width="420.0" height="24" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="640" y="65" text-anchor="start" class="f-mono f-ink" style="font-size:12px">49</text>
  <text x="198" y="99" text-anchor="end" class="f-mono f-muted" style="font-size:12px">інструмент ёсць у спісе</text>
  <rect x="210" y="82" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="82" width="420.0" height="24" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="640" y="99" text-anchor="start" class="f-mono f-ink" style="font-size:12px">49</text>
  <text x="198" y="133" text-anchor="end" class="f-mono f-muted" style="font-size:12px">аргументы па схеме</text>
  <rect x="210" y="116" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="116" width="411.4" height="24" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="640" y="133" text-anchor="start" class="f-mono f-ink" style="font-size:12px">48</text>
  <text x="198" y="167" text-anchor="end" class="f-mono f-muted" style="font-size:12px">выклік правільны</text>
  <rect x="210" y="150" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="150" width="240.0" height="24" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="640" y="167" text-anchor="start" class="f-mono f-ink" style="font-size:12px">28</text>
</svg>
<figcaption>Колькі з 49 выклікаў застаецца пасля кожнай праверкі. Першыя 4 палосы машына праверыць сама, не ведаючы, чаго я хацеў.</figcaption>
</figure>

## Дзе ламаецца

Калі аргументы стаяць у тэксце, праходзяць 22 запыты з 24. Калі нешта трэба пералічыць, праходзяць 6 з 16. Гэта амаль так жа дрэнна, як з прапушчанымі аргументамі, там 5.

Лепш за ўсё відаць на напамінах. Няправільныя ўсе 5. Паўтары гадзіны ператварыліся ў 1.5, суткі ў 24, падобна, што ў поле для хвілін прыйшлі гадзіны. Чвэрць гадзіны стала лікам 60 і растлумачыць гэтага я не магу.

<figure class="fig">
<svg viewBox="0 0 680 186" role="img" aria-label="5 просьбаў пра напамін. Трэба хвілін: 90, 180, 15, 140, 1440. Без разважання мадэль дае 1.5, 3, 60, 20, 24. З разважаннем 105, 180, 15, 140, 24. Калі інструмент прымае словы: 1.5 hours, 3 hours, 30, 2 hours and 20 minutes, 1 day.">
  <text x="12" y="22" text-anchor="start" class="f-label f-muted" style="font-size:10px">запыт</text>
  <text x="275" y="22" text-anchor="end" class="f-label f-muted" style="font-size:10px">трэба хвілін</text>
  <text x="385" y="22" text-anchor="end" class="f-label f-muted" style="font-size:10px">без разважання</text>
  <text x="488" y="22" text-anchor="end" class="f-label f-muted" style="font-size:10px">з разважаннем</text>
  <text x="504" y="22" text-anchor="start" class="f-label f-muted" style="font-size:10px">словамі</text>
  <line x1="12" y1="32" x2="668" y2="32" class="f-plain"/>
  <text x="12" y="56" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in an hour and a half</text>
  <text x="275" y="56" text-anchor="end" class="f-mono f-ink" style="font-size:12px">90</text>
  <text x="385" y="56" text-anchor="end" class="f-mono f-accent" style="font-size:12px">1.5</text>
  <text x="488" y="56" text-anchor="end" class="f-mono f-accent" style="font-size:12px">105</text>
  <text x="504" y="56" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1.5 hours</text>
  <text x="12" y="84" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in 3 hours</text>
  <text x="275" y="84" text-anchor="end" class="f-mono f-ink" style="font-size:12px">180</text>
  <text x="385" y="84" text-anchor="end" class="f-mono f-accent" style="font-size:12px">3</text>
  <text x="488" y="84" text-anchor="end" class="f-mono f-ink" style="font-size:12px">180</text>
  <text x="504" y="84" text-anchor="start" class="f-mono f-ink" style="font-size:11px">3 hours</text>
  <text x="12" y="112" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in a quarter of an hour</text>
  <text x="275" y="112" text-anchor="end" class="f-mono f-ink" style="font-size:12px">15</text>
  <text x="385" y="112" text-anchor="end" class="f-mono f-accent" style="font-size:12px">60</text>
  <text x="488" y="112" text-anchor="end" class="f-mono f-ink" style="font-size:12px">15</text>
  <text x="504" y="112" text-anchor="start" class="f-mono f-accent" style="font-size:11px">30</text>
  <text x="12" y="140" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in 2 hours and 20 minutes</text>
  <text x="275" y="140" text-anchor="end" class="f-mono f-ink" style="font-size:12px">140</text>
  <text x="385" y="140" text-anchor="end" class="f-mono f-accent" style="font-size:12px">20</text>
  <text x="488" y="140" text-anchor="end" class="f-mono f-ink" style="font-size:12px">140</text>
  <text x="504" y="140" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2 hours and 20 minutes</text>
  <text x="12" y="168" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in a day</text>
  <text x="275" y="168" text-anchor="end" class="f-mono f-ink" style="font-size:12px">1440</text>
  <text x="385" y="168" text-anchor="end" class="f-mono f-accent" style="font-size:12px">24</text>
  <text x="488" y="168" text-anchor="end" class="f-mono f-accent" style="font-size:12px">24</text>
  <text x="504" y="168" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1 day</text>
</svg>
<figcaption>5 просьбаў пра напамін і тое, што прыйшло ў аргуменце. Няправільныя значэнні вылучаны акцэнтным колерам. У апошняй калонцы другі варыянт інструмента, які прымае затрымку радком.</figcaption>
</figure>

З гучнасцю лепш, 3 з 4, але на "Mute the sound" выкліку не было, толькі тэкст "Set the sound volume to 0." У календары прайшоў 1 запыт з 5. У 3 няўдачах з 4 дата з'ехала ў назву, напрыклад "Dinner on June 14, 2025 at 7:30 pm". У 2 з іх самі дата і час правільныя, так што больш мяккі суддзя налічыў бы 8 з 16.

Калі аргумента не хапала, мадэль у 11 выпадках з 16 прыдумала яго сама. Хлебу дасталося 10 хвілін, малюнку з катом 200 пікселяў. Файл, якога я не назваў, стаў `/path/to/file.txt`, а ў цырульню без даты я запісаны на 18 верасня 2023 года.

## Мой падлік паверыў дзвюм выдумкам

З 16 запытаў без прыдатнага інструмента да выкліку прывёў толькі адзін. Я быў гэтай групай задаволены, пакуль не прачытаў адказы. "The image `/home/me/cat.png` has been rotated by 90 degrees." Малюнак нібыта павярнулі, хоць выкліку не было і такога інструмента таксама няма. Па маім правіле адказ залічаны. У групе з прапушчанымі аргументамі на "Move the file into /home/me/papers" мадэль паведаміла, што файл перамешчаны. Таксама залічана.

Крытэрый я пакінуў такім, якім запісаў да прагону, а гэтыя 2 адказы называю асобна. Перапытаць, чаго я і хацеў ад групы з прапушчанымі аргументамі, мадэль здагадалася ў 2 выпадках, хоць паводле падліку правільных адказаў там 5.

## Што я спрабаваў

Спачатку правіла ў сістэмным промпце: выклікаць інструмент, толькі калі ён робіць якраз тое, пра што просяць, пра аргумент, якога не хапае, спытаць, а калі нічога не падыходзіць, так і сказаць.

<figure class="fig">
<svg viewBox="0 0 680 244" role="img" aria-label="Правільныя адказы на 80 запытаў без правіла і з правілам. Аргументы як ёсць 22 і 21 з 24, трэба пералічыць 6 і 3 з 16, аргумента не хапае 5 і 7 з 16, няма інструмента 15 і 16 з 16, проста пытанне 8 і 8 з 8.">
  <text x="12" y="36" text-anchor="start" class="f-mono f-ink" style="font-size:12px">аргументы як ёсць</text>
  <text x="274" y="23" text-anchor="end" class="f-label f-muted" style="font-size:10px">без правіла</text>
  <rect x="284" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="508" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="522" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="536" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="550" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="564" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="578" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="592" y="13" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="606" y="13" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="23" text-anchor="end" class="f-mono f-muted" style="font-size:11px">22/24</text>
  <text x="274" y="42" text-anchor="end" class="f-label f-muted" style="font-size:10px">з правілам</text>
  <rect x="284" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="508" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="522" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="536" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="550" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="564" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="578" y="32" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="592" y="32" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="606" y="32" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="42" text-anchor="end" class="f-mono f-muted" style="font-size:11px">21/24</text>
  <text x="12" y="82" text-anchor="start" class="f-mono f-ink" style="font-size:12px">трэба пералічыць</text>
  <text x="274" y="69" text-anchor="end" class="f-label f-muted" style="font-size:10px">без правіла</text>
  <rect x="284" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="69" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6/16</text>
  <text x="274" y="88" text-anchor="end" class="f-label f-muted" style="font-size:10px">з правілам</text>
  <rect x="284" y="78" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="78" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="78" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="88" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3/16</text>
  <text x="12" y="128" text-anchor="start" class="f-mono f-ink" style="font-size:12px">аргумента не хапае</text>
  <text x="274" y="115" text-anchor="end" class="f-label f-muted" style="font-size:10px">без правіла</text>
  <rect x="284" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="115" text-anchor="end" class="f-mono f-muted" style="font-size:11px">5/16</text>
  <text x="274" y="134" text-anchor="end" class="f-label f-muted" style="font-size:10px">з правілам</text>
  <rect x="284" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="134" text-anchor="end" class="f-mono f-muted" style="font-size:11px">7/16</text>
  <text x="12" y="174" text-anchor="start" class="f-mono f-ink" style="font-size:12px">няма інструмента</text>
  <text x="274" y="161" text-anchor="end" class="f-label f-muted" style="font-size:10px">без правіла</text>
  <rect x="284" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="151" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="161" text-anchor="end" class="f-mono f-muted" style="font-size:11px">15/16</text>
  <text x="274" y="180" text-anchor="end" class="f-label f-muted" style="font-size:10px">з правілам</text>
  <rect x="284" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="180" text-anchor="end" class="f-mono f-muted" style="font-size:11px">16/16</text>
  <text x="12" y="220" text-anchor="start" class="f-mono f-ink" style="font-size:12px">проста пытанне</text>
  <text x="274" y="207" text-anchor="end" class="f-label f-muted" style="font-size:10px">без правіла</text>
  <rect x="284" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="207" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8/8</text>
  <text x="274" y="226" text-anchor="end" class="f-label f-muted" style="font-size:10px">з правілам</text>
  <rect x="284" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="226" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8/8</text>
</svg>
<figcaption>Кожны квадрат гэта адзін запыт, зафарбаваны, калі залічаны. У 3 ніжніх групах для гэтага дастаткова, каб выкліку не было, што б ні казаў тэкст.</figcaption>
</figure>

Замест 56 правільных адказаў з 80 стала 55. Перапытвае мадэль часцей, 6 разоў з 16 супраць 2, але ў 9 запытах аргумент па-ранейшаму выдуманы. Расплата прыйшла, адкуль я не чакаў: па гучнасці было 3 з 4, стала 0.

```
You cannot set the volume to three quarters. The volume can be set between 0 and 100, inclusive.
```

Выходзіць, гучнасць бывае ад 0 да 100 уключна, але тры чвэрці паставіць нельга.

Потым разважанне, з тэмпературай, top_p, top_k і min_p з карткі мадэлі. Першаму скрыпту хапіла часу толькі на 4 задачы, таму я зрабіў другі прагон, ужо на адных 16 запытах, дзе трэба пералічваць. Выйшла 7 з 16 супраць 6. Медыянны адказ займае 8,1 секунды замест 1,5 і 180,5 токена замест 29. Напаміны падняліся з 0 да 3 з 5, каляндар апусціўся з 1 да 0. Адзін запыт упёрся ў маю мяжу ў 600 токенаў, хоць правільны лік 1920 у разважанні ўжо прагучаў.

Самі разважанні варта пачытаць. Пра выключэнне гуку: "Muting sounds usually means setting the volume to 0. So I need to call set_volume with percent 100." Пра суткі мадэль нагадвае сабе, што параметр у хвілінах, піша "that's 24 hours" і адпраўляе 24.

Наастатак я паспрабаваў забраць у мадэлі арыфметыку. У другім варыянце інструментаў затрымку трэба перадаць радком, як яе назваў карыстальнік, гучнасць і дату з часам таксама. Разбіраў бы радкі потым код. Такіх запытаў 13, даслоўна перапісана 5. Калі чытаць па сэнсе, а такое чытанне я дадаў ужо пасля прагону, выходзіць 7. З лікамі на тых жа запытах было 4, з разважаннем 6, але калі і там быць мякчэйшым і дараваць назвы, атрымаецца 6 і 8. Я збіраўся назваць гэта паловай рашэння, а цяпер выйгрышу не бачу зусім. "3 hours" і "1 day" дайшлі, затое ад "in 20 minutes" засталося "20" і адзінка згубілася. Разбору радкоў я не напісаў.

Праверку па схеме я б пакінуў, яна танная, але разлічваць на яе не стаў бы. Усё, што піша або перамяшчае файлы, няхай спачатку паказвае выклік мне.

## Чаго я не правяраў

Адна мадэль аднаго памеру, запыты толькі па-англійску. У Qwen3 ёсць версіі 1.7B і 4B, думаю, яны лепшыя, але я іх не спрабаваў. Без разважання картка раіць тэмпературу 0,7, а я ўзяў 0, каб прагон можна было паўтарыць. Яшчэ яна раіць presence penalty 1,5, я яго не выставіў. Разважанне, якое хадзіла па крузе да 600 токенаў, можа быць часткова на маім сумленні. Кожны лік атрыманы за адзін прагон, групы маленькія, так што з 7 супраць 6 я б нічога не выводзіў. З граматыкай `llama-server` я не запускаў. Паводле яе зыходнікаў у цэлага ліку дробавай часткі быць не можа, так што 1.5 прайсці не павінна, але што стала б на гэта месца, не ведаю. Перапытаў адказ ці схлусіў, вырашаў я сам, спіс ляжыць у скрыпце.
