---
title: "Datomic без ключа ліцэнзіі: 68 байтаў на абнаўленне і 39, калі нічога не змянілася"
description: "Datomic Pro 1.0.6733 запускаецца з ключом ліцэнзіі nonsense. Я правёў праз яго 100 000 абнаўленняў аднаго ліку і столькі ж праз SQLite з трыгерам гісторыі. У Datomic выйшла 68 байтаў на абнаўленне, у SQLite 30. Абнаўленне, якое запісвае тое самае значэнне, усё роўна каштуе 39 байтаў."
date: 2023-06-04
lang: be
translationKey: datomic-without-licence
tags: ["databases", "numbers", "time"]
---

Я дапісаў у файл налад транзактара Datomic радок `license-key=nonsense` і запусціў яго. Адказ быў `System started`. Ключ трапіў у лог як ёсць, за 2 хвіліны ніводнага іншага радка пра ліцэнзію там не з'явілася. Peer падключыўся, прачытаў 5000 рахункаў і запісаў баланс, пасля чаго я спыніў працэс сам. Потым я папрасіў той самы дыстрыбутыў апісаць гэты ключ камандай `bin/datomic describe-license` і атрымаў `BadPaddingException` з кода RSA. Без ключа тая ж каманда друкуе `nil`.

Значыць, ключ, наколькі мне відаць, больш ні на што не ўплывае, але код для яго чытання ўсё яшчэ ідзе ў камплекце. 27 красавіка каманда Datomic выпусціла версію 1.0.6726 і перавяла бінарныя файлы peer і транзактара на Apache 2.0. У спісе змен напісана, што ключ больш не патрэбны. У майскай 1.0.6733 ні ў адным з 8 шаблонаў налад ліцэнзія не згадваецца. Пры гэтым у jar транзактара ляжаць 10 класаў з імем `license_inline`. Ліцэнзія датычыцца толькі бінарных файлаў. У jar бібліятэкі peer 4792 класы Datomic, з зыходных тэкстаў на Clojure там толькі `data_readers.clj`, а ў COPYRIGHT стаіць All Rights Reserved.

Datomic я ведаю з дакладаў, шмат разоў паўтараў, што ён нічога не забывае і што гэта дорага, але ні разу яго не запускаў і ніякага ліку за словам "дорага" ў мяне не было.

## Што я запускаў

Datomic Pro 1.0.6733 са сховішчам dev, гэта файл H2, на JDK 17.0.7. Для параўнання SQLite 3.42.0 праз драйвер Xerial JDBC. 5000 рахункаў з уладальнікам, горадам і балансам. Далей 20 колаў, за кола кожны рахунак адзін раз атрымлівае новы выпадковы баланс, парадак таксама выпадковы. Усяго 100 000 абнаўленняў. У Datomic пасля кожных 5 колаў я прашу пабудаваць індэкс.

SQLite я прагнаў у двух варыянтах. Першы гэта звычайны `UPDATE`, старое ён забывае. У другім трыгер дадае радок з часам у табліцу `tx` і запісвае новы баланс у табліцу гісторыі. Прыкладна гэта я і напісаў бы рукамі.

Памерам Datomic я лічу рэзервовую копію, у ёй толькі жывыя сегменты, 359 файлаў з 361 сціснутыя gzip. Памер SQLite гэта файл пасля `VACUUM`. Ад абодвух адняты памер адразу пасля загрузкі.

Як Datomic уладкаваны ўнутры, у 2014 годзе разабраў Мікіта Пракопаў у сваім неафіцыйным даведніку, а Val Waeselynck у 2018 годзе пісаў пра Datomic як пра гатовы event sourcing. Я толькі палічыў байты.

## У колькі абыходзіцца абнаўленне

З чаго складаецца адно абнаўленне, відаць у справаздачы пра транзакцыю. Стары баланс адклікаецца, новы дадаецца і сама транзакцыя атрымлівае час. Гэта 3 датомы. Роўна столькі іх было ў кожнай са 100 000 транзакцый.

<figure class="fig">
<svg viewBox="0 0 660 220" role="img" aria-label="Тры транзакцыі ў тым выглядзе, у якім іх аддае Datomic. Новае значэнне гэта 3 датомы: стары баланс адкліканы, новы дададзены, час транзакцыі дададзены, 67,9 байта. Тое самае значэнне гэта 1 датом, толькі час, 39,4 байта. Сто абнаўленняў разам гэта 201 датом, 27,3 байта на абнаўленне.">
  <text x="109.0" y="20.0" text-anchor="middle" class="f-mono f-ink">новае значэнне</text>
  <rect x="5" y="30" width="208" height="32" class="f-box"/>
  <text x="15.0" y="51.0" text-anchor="start" class="f-mono f-accent">-</text>
  <text x="33.0" y="51.0" text-anchor="start" class="f-mono f-ink">:a/bal</text>
  <text x="203.0" y="51.0" text-anchor="end" class="f-mono f-muted">стары</text>
  <rect x="5" y="68" width="208" height="32" class="f-box"/>
  <text x="15.0" y="89.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="33.0" y="89.0" text-anchor="start" class="f-mono f-ink">:a/bal</text>
  <text x="203.0" y="89.0" text-anchor="end" class="f-mono f-muted">новы</text>
  <rect x="5" y="106" width="208" height="32" class="f-box"/>
  <text x="15.0" y="127.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="33.0" y="127.0" text-anchor="start" class="f-mono f-accent">:db/txInstant</text>
  <text x="203.0" y="127.0" text-anchor="end" class="f-mono f-muted">час</text>
  <text x="109.0" y="164.0" text-anchor="middle" class="f-label f-muted">3 датомы</text>
  <text x="109.0" y="190.0" text-anchor="middle" class="f-glyph f-ink">67,9</text>
  <text x="109.0" y="208.0" text-anchor="middle" class="f-label f-muted">байта на абнаўленне</text>
  <text x="330.0" y="20.0" text-anchor="middle" class="f-mono f-ink">тое самае</text>
  <rect x="226" y="106" width="208" height="32" class="f-box"/>
  <text x="236.0" y="127.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="254.0" y="127.0" text-anchor="start" class="f-mono f-accent">:db/txInstant</text>
  <text x="424.0" y="127.0" text-anchor="end" class="f-mono f-muted">час</text>
  <text x="330.0" y="60.0" text-anchor="middle" class="f-mono f-muted">пра баланс</text>
  <text x="330.0" y="78.0" text-anchor="middle" class="f-mono f-muted">нічога</text>
  <text x="330.0" y="164.0" text-anchor="middle" class="f-label f-muted">1 датом</text>
  <text x="330.0" y="190.0" text-anchor="middle" class="f-glyph f-ink">39,4</text>
  <text x="330.0" y="208.0" text-anchor="middle" class="f-label f-muted">байта на абнаўленне</text>
  <text x="551.0" y="20.0" text-anchor="middle" class="f-mono f-ink">100 у адной</text>
  <rect x="447" y="30" width="208" height="32" class="f-box"/>
  <text x="457.0" y="51.0" text-anchor="start" class="f-mono f-accent">-</text>
  <text x="475.0" y="51.0" text-anchor="start" class="f-mono f-ink">:a/bal</text>
  <text x="645.0" y="51.0" text-anchor="end" class="f-mono f-muted">x 100</text>
  <rect x="447" y="68" width="208" height="32" class="f-box"/>
  <text x="457.0" y="89.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="475.0" y="89.0" text-anchor="start" class="f-mono f-ink">:a/bal</text>
  <text x="645.0" y="89.0" text-anchor="end" class="f-mono f-muted">x 100</text>
  <rect x="447" y="106" width="208" height="32" class="f-box"/>
  <text x="457.0" y="127.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="475.0" y="127.0" text-anchor="start" class="f-mono f-accent">:db/txInstant</text>
  <text x="645.0" y="127.0" text-anchor="end" class="f-mono f-muted">час</text>
  <text x="551.0" y="164.0" text-anchor="middle" class="f-label f-muted">201 датом</text>
  <text x="551.0" y="190.0" text-anchor="middle" class="f-glyph f-ink">27,3</text>
  <text x="551.0" y="208.0" text-anchor="middle" class="f-label f-muted">байта на абнаўленне</text>
</svg>
<figcaption>Што было ў справаздачы пра транзакцыю. Мінус азначае адкліканне, плюс азначае даданне. Унізе рост рэзервовай копіі ў пераліку на абнаўленне.</figcaption>
</figure>

Звычайны SQLite не вырас зусім, 163 840 байтаў да абнаўленняў і 163 840 пасля. Datomic узяў 67,9 байта на абнаўленне, SQLite з трыгерам 29,6. З маёй самаробнай гісторыяй розніца ў 2,3 раза. Я чакаў большай, але Datomic сегменты сціскае, а SQLite не сціскае нічога. Тая ж копія без сціскання займае 22,6 МБ замест 7,0.

Потым я зрабіў абнаўленне, якое запісвае тое значэнне, што ўжо стаіць. Datomic гэта заўважае, новых датомаў балансу няма, у гісторыі рахунку іх 1 замест 41. Але транзакцыя ўсё роўна адбылася і яе час такі ж факт, як любы іншы. Каштуе яна 39,4 байта, 58 працэнтаў сапраўднага абнаўлення. Самому гэтаму працэнту я б не надта верыў, сегменты сціскаюцца цалкам і байты ў іх так проста не складаюцца.

Можна зайсці з іншага боку і пакласці ў адну транзакцыю 100 абнаўленняў. Тады ў справаздачы 201 датом, а цана падае да 27,3 байта. SQLite з адным радком у `tx` на 100 абнаўленняў паводзіць сябе гэтак жа, 29,6 ператвараецца ў 14,0. Да гэтага табліца `tx` займала 1,57 МБ з 3,43, калі глядзець да `VACUUM`. У абедзвюх базах прыкметная частка цаны гэта запіс пра транзакцыю, але колькі ў Datomic прыпадае на сам час, я сказаць не магу.

<figure class="fig">
<svg viewBox="0 0 660 262" role="img" aria-label="Байты на абнаўленне пасля 100 000 абнаўленняў без памеру пасля загрузкі. Па адным абнаўленні ў транзакцыі: Datomic 67,9, Datomic з noHistory 52,4, Datomic з тым самым значэннем 39,4, SQLite з трыгерам 29,6, SQLite з простым UPDATE 0. Па 100 абнаўленняў у транзакцыі: Datomic 27,3, Datomic з noHistory 13,2, SQLite з трыгерам 14,0.">
  <text x="5.0" y="16.0" text-anchor="start" class="f-label f-muted">адно абнаўленне ў транзакцыі, байты</text>
  <text x="190.0" y="39.0" text-anchor="end" class="f-mono f-ink">Datomic</text>
  <rect x="200.0" y="26.0" width="368.6" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="576.6" y="39.0" text-anchor="start" class="f-mono f-muted">67,9</text>
  <text x="190.0" y="63.0" text-anchor="end" class="f-mono f-ink">Datomic, noHistory</text>
  <rect x="200.0" y="50.0" width="284.3" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="492.3" y="63.0" text-anchor="start" class="f-mono f-muted">52,4</text>
  <text x="190.0" y="87.0" text-anchor="end" class="f-mono f-ink">Datomic, тое самае</text>
  <rect x="200.0" y="74.0" width="213.8" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="421.8" y="87.0" text-anchor="start" class="f-mono f-muted">39,4</text>
  <text x="190.0" y="111.0" text-anchor="end" class="f-mono f-ink">SQLite, трыгер</text>
  <rect x="200.0" y="98.0" width="160.8" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="368.8" y="111.0" text-anchor="start" class="f-mono f-muted">29,6</text>
  <text x="190.0" y="135.0" text-anchor="end" class="f-mono f-ink">SQLite, UPDATE</text>
  <text x="208.0" y="135.0" text-anchor="start" class="f-mono f-muted">0</text>
  <text x="5.0" y="172.0" text-anchor="start" class="f-label f-muted">100 абнаўленняў у транзакцыі, байты</text>
  <text x="190.0" y="195.0" text-anchor="end" class="f-mono f-ink">Datomic</text>
  <rect x="200.0" y="182.0" width="148.3" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="356.3" y="195.0" text-anchor="start" class="f-mono f-muted">27,3</text>
  <text x="190.0" y="219.0" text-anchor="end" class="f-mono f-ink">Datomic, noHistory</text>
  <rect x="200.0" y="206.0" width="71.6" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="279.6" y="219.0" text-anchor="start" class="f-mono f-muted">13,2</text>
  <text x="190.0" y="243.0" text-anchor="end" class="f-mono f-ink">SQLite, трыгер</text>
  <rect x="200.0" y="230.0" width="75.8" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="283.8" y="243.0" text-anchor="start" class="f-mono f-muted">14,0</text>
</svg>
<figcaption>Рост на адно абнаўленне. Для Datomic гэта рэзервовая копія са сціснутымі сегментамі, для SQLite файл пасля VACUUM без сціскання. Унізе ў SQLite адзін радок tx на 100 абнаўленняў.</figcaption>
</figure>

## noHistory забывае, але не ўсюды

У атрыбута ў Datomic ёсць сцяжок `:db/noHistory`. З ім адзіночнае абнаўленне таннее з 67,9 да 52,4 байта, я спадзяваўся на большае. У індэксе гісторыі застаецца 5000 датомаў балансу, а ў логу іх па-ранейшаму 205 000, столькі ж, колькі і без сцяжка. Пачкамі па 100 сцяжок дапамагае лепш, 13,2 байта супраць 27,3.

Чаго я зусім не чакаў, дык гэта таго, як на такім атрыбуце паводзіць сябе `as-of`. У мяне ў памяці быў 21 здымак балансаў, пасля загрузкі і пасля кожнага кола. Без сцяжка сышліся ўсе 105 000 значэнняў. Са сцяжком сышоўся апошні здымак, а ў кожным з астатніх 20 не знайшлося ніводнага з 5000 балансаў. Ні старога значэння, ні цяперашняга запыт не аддае. Усе 5000 рахункаў на месцы і з уладальнікамі, толькі без грошай.

Чытаць мінулае таксама нешта каштуе. Сума 5000 балансаў у цяперашняй базе кранае 1 сегмент індэкса AEVT. У мінулым сегментаў 72. Я спытаў пра пачатак, сярэдзіну і перадапошняе кола, усюды 72. Пасля 500 000 абнаўленняў іх 390. Цана расце разам з даўжынёй гісторыі і блізкая дата не ратуе, прынамсі ў гэтым запыце.

## Дзе я заблытаўся

Самае відавочнае гэта памераць файл H2. Пасля абнаўленняў у ім было 52,5 МБ, больш за 500 байтаў на кожнае. Але радкі ў табліцы сховішча займалі 19,4 МБ, пасля `gc-storage` яны занялі 8,0, а файл пры гэтым вырас да 58,2. Калі транзактар спыніўся, файл сціснуўся да 20,8 МБ. У іншым прагоне, дзе напрыканцы я выразаў даныя, ён так і застаўся на 43,9. Рэзервовая копія той жа базы важыць 7,0 МБ, таму пра гісторыю файл кажа мала, больш пра H2 і старыя сегменты індэксаў.

<figure class="fig">
<svg viewBox="0 0 660 180" role="img" aria-label="Памеры адной і той жа базы Datomic пасля 100 000 абнаўленняў у мегабайтах. Файл H2 да gc-storage 52,5, файл H2 пасля gc-storage 58,2, файл H2 пасля спынення транзактара 20,8, радкі ў табліцы сховішча да gc-storage 19,4, радкі пасля gc-storage 8,0, рэзервовая копія 7,0.">
  <text x="5.0" y="16.0" text-anchor="start" class="f-label f-muted">МБ</text>
  <text x="190.0" y="39.0" text-anchor="end" class="f-mono f-ink">файл H2</text>
  <rect x="200.0" y="26.0" width="341.3" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="549.3" y="39.0" text-anchor="start" class="f-mono f-muted">52,5</text>
  <text x="190.0" y="63.0" text-anchor="end" class="f-mono f-ink">файл H2 пасля gc</text>
  <rect x="200.0" y="50.0" width="378.2" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="586.2" y="63.0" text-anchor="start" class="f-mono f-muted">58,2</text>
  <text x="190.0" y="87.0" text-anchor="end" class="f-mono f-ink">файл H2, стоп</text>
  <rect x="200.0" y="74.0" width="134.9" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="342.9" y="87.0" text-anchor="start" class="f-mono f-muted">20,8</text>
  <text x="190.0" y="111.0" text-anchor="end" class="f-mono f-ink">радкі табліцы</text>
  <rect x="200.0" y="98.0" width="126.2" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="334.2" y="111.0" text-anchor="start" class="f-mono f-muted">19,4</text>
  <text x="190.0" y="135.0" text-anchor="end" class="f-mono f-ink">радкі пасля gc</text>
  <rect x="200.0" y="122.0" width="51.8" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="259.8" y="135.0" text-anchor="start" class="f-mono f-muted">8,0</text>
  <text x="190.0" y="159.0" text-anchor="end" class="f-mono f-ink">копія</text>
  <rect x="200.0" y="146.0" width="45.8" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="253.8" y="159.0" text-anchor="start" class="f-mono f-muted">7,0</text>
</svg>
<figcaption>Адна база і 100 000 абнаўленняў. У тэксце памерам лічыцца рэзервовая копія.</figcaption>
</figure>

А з пачкамі па 100 зборка смецця не прыбрала нічога, было 7 758 373 байты і стала на 50 больш, хоць копія важыць 2,99 МБ. Мне здалося, што я паспяшаўся. Я зрабіў асобны прагон з 3 выклікамі і 2 хвілінамі чакання. Першы выклік дадаў тыя ж 50 байтаў, далей лік не зрушыўся ні на байт. Пасля 500 000 абнаўленняў той жа выклік спрацаваў, 91,8 МБ ператварыліся ў 26,9, але копія важыць 13,95. Ад чаго гэта залежыць, я не ведаю.

Забыць знарок Datomic умее. Я адклікаў адзін рахунак, яго гісторыя вырасла з 44 датомаў да 48 і стары баланс 21505 у мінулым быў па-ранейшаму бачны. Пасля `:db/excise` і `sync-excise` у гісторыі і ў логу засталося па 0 датомаў і запыт у мінулае не вярнуў нічога. Сховішча пры гэтым падрасло на 740 КБ.

## Чаго я не правяраў

Усе лікі тут гэта памеры і колькасці, хуткасць я не мераў. Запускаў толькі сховішча dev. З SQL або Cassandra накладныя выдаткі могуць быць іншымі. Большасць варыянтаў я прагнаў адзін раз. Адзіночныя абнаўленні і пачкі прагнаў двойчы, копіі разышліся самае большае на 1,3 працэнта і ў адной з іх было выразанне даных. Выпадковыя балансы сціскаюцца дрэнна, сапраўдныя могуць сціснуцца лепш. Калі ключ правяраюць пазней чым праз 2 хвіліны пасля старту, я б гэтага не ўбачыў. Мой трыгер захоўвае менш, чым Datomic, у яго няма індэкса па атрыбуце і няма адкліканняў, так што ў гэтых 2,3 раза параўноўваюцца не зусім аднолькавыя рэчы.

Пры 3000 абнаўленняў у дзень па 68 байтаў выходзіць каля 74 МБ у год, гэтага я б не заўважыў. Але пачаў бы я ўсё роўна з таго, каб сабраць абнаўленні ў транзакцыі па сэнсе, а пра `noHistory` думаў бы пасля.
