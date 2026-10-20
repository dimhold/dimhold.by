---
title: "Арендатор вернулся арендодателем после круга через русский"
description: "Я прогнал 600 английских предложений через MarianMT на русский и обратно, 5 кругов. Числа вернулись 100 из 100. Во всех 21 предложении арендатор вернулся арендодателем и всё равно прошёл мою проверку отрицания. Верный русский перевод про сбор, который не возвращается, вернулся как not payable. В 16 предложениях русский читается как 2 человека вместо 1, а вернувшийся английский выглядел нормально."
date: 2022-12-13
lang: ru
translationKey: round-trip-drift
tags: ["machine-learning", "text", "reliability"]
---
У машинного перевода есть старая проверка. Переводишь текст, потом переводишь результат обратно. Если вернулся исходник, середине можно верить. Я в эту проверку верил и ни разу не подсчитывал, что она пропускает. Чтобы это подсчитать, нужна пара, в которой я сам могу прочитать середину и сказать, верна ли она. Для меня это пара с английского на русский и обратно.

Сомнение не новое. Гарольд Сомерс ещё в 2005 году писал, что обратный перевод плохо годится для оценки системы перевода. Плохая середина может вернуться так, будто всё в порядке. Я хотел посмотреть на это на своих предложениях, сразу на нескольких видах смысла и с отдельной проверкой середины.

## Стенд

Модели `opus-mt-en-ru` и `opus-mt-ru-en` от `Helsinki-NLP`, это MarianMT, ревизии сентября 2022 года со своим конфигом, то есть beam search на 4 луча. Python 3.9, torch 1.13, transformers 4.25.1, только CPU, 4 ядра виртуальной машины на AMD EPYC. Один круг из 600 предложений туда и 600 обратно занимает около 4 минут.

Скрипт с seed 2022 написал 600 коротких английских предложений, по 100 каждого из 6 видов. В каждом есть то, что регулярка может проверить после круга:

- число с валютой или датой, например `The invoice for 1,028,211 zlotys is due on 26 December.`;
- слово отрицания вроде `not` или `never` в 50 предложениях и те же 50 без него;
- модальный глагол `must`, `may` или `should`;
- граница `at least`, `at most`, `more than` или `less than` с числом;
- роль и местоимение, `The doctor called because she needs the invoice.`;
- имена людей и названия компаний, в основном польские и беларусские, часть с диакритикой.

Потом я прогнал 5 кругов. Каждый круг переводит английский, вернувшийся из предыдущего.

## Первый круг

Числа вернулись 100 из 100. Слово отрицания вернулось 50 из 50. В 50 предложениях без отрицания оно не появилось ни разу. Местоимения вернулись 100 из 100. Границы вернулись 92 раза. 7 раз `at least` или `at most` просто пропали. `The office is at most 80 kilometers from the station` вернулось как `The office is 80 kilometres from the station`. Один раз 3631 доллар превратился в 631.

Вид модальности вернулся 67 раз. `should` 32 раза из 33 стал `должен` по-русски и `must` или `has to` по-английски. В русском есть слово мягче, `следует`, но модель взяла его только один раз.

Хуже всего вышло с именами. Из 300 имён точно вернулись 113. Из 65 с польскими буквами только 7. Piotr стал Peter, Paweł Wiśniewski стал Pavel Vignevsky. Сеть магазинов Żabka по-русски стала `Абка`, по-английски `Abka`, компания Mleczna Dolina стала Melena Valley.

До этого места ожидание сбылось наполовину. Что пропадёт диакритика, я ждал, а что Piotr станет Peter, нет. А местоимения, за которые я боялся больше всего, вернулись все.

<figure class="fig">
<svg viewBox="0 0 640 376" role="img" aria-label="Столбцы для 1-го и 5-го круга. Число, валюта и дата: 100 и 98 из 100. Слово отрицания: 100 и 100 из 100. Местоимение: 100 и 99 из 100. Граница: 92 и 91 из 100. Модальный глагол: 67 и 67 из 100. Имена: 113 и 106 из 300. Нашлось при чтении 1-го круга: tenant вернулось 0 раз из 21, refundable 0 из 10, invoice 46 из 66.">
  <text x="12" y="18" class="f-label f-muted">вернулось после круга, из всех предложений этого вида</text>
  <rect x="230" y="30" width="12" height="10" class="f-box"/>
  <text x="248" y="39" class="f-mono f-ink" style="font-size:11px">1-й круг</text>
  <rect x="340" y="30" width="12" height="10" class="f-plain"/>
  <text x="358" y="39" class="f-mono f-ink" style="font-size:11px">5-й круг</text>
  <text x="12" y="66" class="f-mono f-accent" style="font-size:12px">проверяла регулярка</text>
  <text x="24" y="94" class="f-mono f-ink" style="font-size:11px">число, валюта, дата</text>
  <rect x="230" y="82" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="77" width="280" height="11" class="f-box"/>
  <text x="520" y="86" class="f-mono f-ink" style="font-size:11px">100/100</text>
  <rect x="230" y="96" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="91" width="274" height="11" class="f-plain"/>
  <text x="520" y="100" class="f-mono f-ink" style="font-size:11px">98/100</text>
  <text x="24" y="128" class="f-mono f-ink" style="font-size:11px">слово отрицания</text>
  <rect x="230" y="116" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="111" width="280" height="11" class="f-box"/>
  <text x="520" y="120" class="f-mono f-ink" style="font-size:11px">100/100</text>
  <rect x="230" y="130" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="125" width="280" height="11" class="f-plain"/>
  <text x="520" y="134" class="f-mono f-ink" style="font-size:11px">100/100</text>
  <text x="24" y="162" class="f-mono f-ink" style="font-size:11px">местоимение she/he</text>
  <rect x="230" y="150" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="145" width="280" height="11" class="f-box"/>
  <text x="520" y="154" class="f-mono f-ink" style="font-size:11px">100/100</text>
  <rect x="230" y="164" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="159" width="277" height="11" class="f-plain"/>
  <text x="520" y="168" class="f-mono f-ink" style="font-size:11px">99/100</text>
  <text x="24" y="196" class="f-mono f-ink" style="font-size:11px">at least / at most ...</text>
  <rect x="230" y="184" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="179" width="258" height="11" class="f-box"/>
  <text x="520" y="188" class="f-mono f-ink" style="font-size:11px">92/100</text>
  <rect x="230" y="198" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="193" width="255" height="11" class="f-plain"/>
  <text x="520" y="202" class="f-mono f-ink" style="font-size:11px">91/100</text>
  <text x="24" y="230" class="f-mono f-ink" style="font-size:11px">must / may / should</text>
  <rect x="230" y="218" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="213" width="188" height="11" class="f-box"/>
  <text x="520" y="222" class="f-mono f-ink" style="font-size:11px">67/100</text>
  <rect x="230" y="232" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="227" width="188" height="11" class="f-plain"/>
  <text x="520" y="236" class="f-mono f-ink" style="font-size:11px">67/100</text>
  <text x="24" y="264" class="f-mono f-ink" style="font-size:11px">имена</text>
  <rect x="230" y="252" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="247" width="105" height="11" class="f-box"/>
  <text x="520" y="256" class="f-mono f-ink" style="font-size:11px">113/300</text>
  <rect x="230" y="266" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="261" width="99" height="11" class="f-plain"/>
  <text x="520" y="270" class="f-mono f-ink" style="font-size:11px">106/300</text>
  <text x="12" y="292" class="f-mono f-accent" style="font-size:12px">нашлось при чтении 1-го круга</text>
  <text x="24" y="316" class="f-mono f-ink" style="font-size:11px">tenant</text>
  <rect x="230" y="312" width="280" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="316" class="f-mono f-ink" style="font-size:11px">0/21</text>
  <text x="24" y="338" class="f-mono f-ink" style="font-size:11px">refundable</text>
  <rect x="230" y="334" width="280" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="338" class="f-mono f-ink" style="font-size:11px">0/10</text>
  <text x="24" y="360" class="f-mono f-ink" style="font-size:11px">invoice</text>
  <rect x="230" y="356" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="351" width="195" height="11" class="f-box"/>
  <text x="520" y="360" class="f-mono f-ink" style="font-size:11px">46/66</text>
</svg>
<figcaption>Регулярка проверяет только слово, на котором держится смысл. На 3 нижних слова она не смотрела.</figcaption>
</figure>

## Где ошиблась моя проверка

Скрипт сказал, что с отрицанием всё идеально. Потом я глазами прочитал все 600 русских предложений первого круга и нашёл 3 вещи, которых скрипт не увидел.

Во всех 21 предложении арендатор стал арендодателем. `The tenant has not paid the rent for 30 months` ушло в русский как `Арендодатель не платил арендную плату`. То есть не платил арендодатель. Вернулось `The lessor did not pay rent for 30 months`. `not` на месте, проверка отрицания прошла, только должен теперь другой человек.

Вторая ошибка в обратную сторону. `The fee is not refundable after 3 days` стало `не подлежит возмещению`. Это верный перевод. Вернулось `This fee is not payable`. В 9 из 10 таких предложений русский был верным, а вернувшийся английский нет. Значит, в этих 9 ошибка случилась на обратном пути.

Третья вещь это invoice. Иногда модель переводит его как `счёт-фактура`, формальный документ. Иногда просто как `счёт`. Счёт-фактура вернулась как invoice 46 раз из 46. Просто `счёт` вернулся как invoice 0 раз из 20, чаще всего как `account`. По-русски `счёт` это ещё и банковский счёт.

## В другую сторону

С местоимениями, где проверка показала 100 из 100, нашлась своя беда.

В русском у глагола в прошедшем времени есть род. В 16 из 60 предложений с таким глаголом род глагола идёт за привычным родом профессии, а не за местоимением. `The accountant called because she needs the invoice` стало `Бухгалтер позвонил, потому что ей нужен счет`. Русский читатель, скорее всего, увидит здесь 2 человек. Позвонил мужчина, а счёт нужен какой-то женщине. Мужской род глагола после "бухгалтер" возможен и про женщину, так что это ещё не доказывает, что людей 2, но читателя туда толкает. В 13 случаях из 16 это мужской глагол рядом с `she`. С медсестрой 3 раза вышло наоборот: женский глагол рядом с `he`.

Вернулось `The accountant called because she needs an account`. Проверка местоимения прошла во всех 16 предложениях. У английского глагола рода нет, поэтому ошибке из середины в вернувшемся английском просто негде проявиться. Английская фраза и сама немного двусмысленна, `she` может быть кем-то другим, но я понимаю её так, что человек 1.

<figure class="fig">
<svg viewBox="0 0 640 296" role="img" aria-label="Таблица 2 на 2. Русский верен и английский вернулся верно: проверка работает, числа 100 из 100. Русский верен, а английский вернулся неверно: ложная тревога, not refundable стало &quot;не подлежит возмещению&quot;, это верно, и вернулось как not payable, 9 предложений из 10. Русский неверен, английский вернулся верно: проверка не видит, the accountant called because she needs the invoice стало &quot;Бухгалтер позвонил, потому что ей нужен счет&quot;, по-русски это 2 человека, а вернулось с she, 16 предложений из 16. Русский неверен и английский вернулся неверно: проверка работает, the tenant стал &quot;Арендодатель&quot; и вернулся как the lessor, 21 из 21.">
  <text x="12" y="18" class="f-label f-muted">верен ли русский и выглядит ли верным вернувшийся английский</text>
  <text x="250.5" y="46" class="f-label f-ink" text-anchor="middle">вернулось верно</text>
  <text x="507.5" y="46" class="f-label f-ink" text-anchor="middle">вернулось неверно</text>
  <text x="12" y="110" class="f-label f-ink">русский</text>
  <text x="12" y="124" class="f-label f-ink">верен</text>
  <text x="12" y="230" class="f-label f-ink">русский</text>
  <text x="12" y="244" class="f-label f-ink">неверен</text>
  <rect x="126" y="56" width="249" height="112" rx="4" class="f-plain"/>
  <text x="138" y="78" class="f-label f-muted">проверка работает</text>
  <text x="138" y="116" class="f-mono f-ink" style="font-size:13px">числа 100 из 100</text>
  <rect x="383" y="56" width="249" height="112" rx="4" class="f-plain"/>
  <text x="395" y="78" class="f-label f-muted">ложная тревога</text>
  <text x="395" y="102" class="f-mono f-ink" style="font-size:11px">not refundable</text>
  <text x="395" y="120" class="f-mono f-ink" style="font-size:11px">→ не подлежит возмещению</text>
  <text x="395" y="138" class="f-mono f-ink" style="font-size:11px">→ not payable</text>
  <text x="620" y="158" class="f-mono f-ink" text-anchor="end" style="font-size:12px">9 из 10</text>
  <rect x="126" y="176" width="249" height="112" rx="4" class="f-accent" fill-opacity="0.18"/>
  <text x="138" y="198" class="f-label f-accent">проверка не видит</text>
  <text x="138" y="222" class="f-mono f-ink" style="font-size:11px">the accountant ... she</text>
  <text x="138" y="240" class="f-mono f-ink" style="font-size:11px">→ Бухгалтер позвонил ... ей</text>
  <text x="138" y="258" class="f-mono f-ink" style="font-size:11px">→ the accountant ... she</text>
  <text x="363" y="278" class="f-mono f-ink" text-anchor="end" style="font-size:12px">16 из 16</text>
  <rect x="383" y="176" width="249" height="112" rx="4" class="f-plain"/>
  <text x="395" y="198" class="f-label f-muted">проверка работает</text>
  <text x="395" y="222" class="f-mono f-ink" style="font-size:11px">the tenant</text>
  <text x="395" y="240" class="f-mono f-ink" style="font-size:11px">→ Арендодатель</text>
  <text x="395" y="258" class="f-mono f-ink" style="font-size:11px">→ the lessor</text>
  <text x="620" y="278" class="f-mono f-ink" text-anchor="end" style="font-size:12px">21 из 21</text>
</svg>
<figcaption>Опасна нижняя левая клетка: ошибка была в середине, а в английском ей не на чем вернуться.</figcaption>
</figure>

## Ещё круги

Я ждал, что текст перестанет меняться после 2 или 3 кругов. Почти так и вышло. По сравнению с предыдущим кругом в 1-м изменились 540 предложений, потом 172, 63, 31 и 25. Слово в слово исходник вернулся только в 60 случаях из 600.

После первого круга что-то потеряли 138 предложений, после 5 кругов 142. Я уже собирался написать, что круги со 2-го по 5-й добавляют 4 новые потери. Потом посмотрел на них. Первая на совести моей регулярки: `at most 1817` вернулось как `does not require more than 1,817`, а это то же самое. Мой шаблон знал только `not more than`, написанное подряд. Вторая это просто разнобой разделителей в `1,028 211`. А 2 действительно меняют смысл. `Our rent went up to 54,466 zlotys` во 2-м круге стало `54 466 человек`. К 5-му кругу аренда была уже `$54,466`. Во 2-м круге разработчик, который был `she`, ушёл в русский как `Застройщик`, то есть строитель домов. Местоимение в русском пропало, а английский вернулся с `he`.

Из 25 предложений, которые ещё меняются в 5-м круге, 17 качаются между 2 вариантами, чаще всего `she needs the bill` и `she needs an account`. Только 8 ещё меняются как-то иначе.

<figure class="fig">
<svg viewBox="0 0 640 260" role="img" aria-label="Изменилось с предыдущего круга: 540, 172, 63, 31, 25 из 600 в кругах с 1-го по 5-й. Предложений, потерявших что-то к этому кругу: 138, 142, 142, 142, 142.">
  <text x="12" y="18" class="f-label f-muted">600 предложений, 5 кругов</text>
  <rect x="12" y="30" width="12" height="10" class="f-box"/>
  <text x="30" y="39" class="f-mono f-ink" style="font-size:11px">изменилось с предыдущего круга</text>
  <rect x="320" y="30" width="12" height="10" class="f-accent"/>
  <text x="338" y="39" class="f-mono f-ink" style="font-size:11px">потеряло что-то к этому кругу</text>
  <line x1="40" y1="230" x2="628" y2="230" class="f-line"/>
  <rect x="60" y="86" width="40" height="144" class="f-box"/>
  <text x="80" y="80" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">540</text>
  <rect x="104" y="193" width="40" height="37" class="f-accent"/>
  <text x="124" y="187" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">138</text>
  <text x="102" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">круг 1</text>
  <rect x="172" y="184" width="40" height="46" class="f-box"/>
  <text x="192" y="178" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">172</text>
  <rect x="216" y="192" width="40" height="38" class="f-accent"/>
  <text x="236" y="186" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">142</text>
  <text x="214" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">круг 2</text>
  <rect x="284" y="213" width="40" height="17" class="f-box"/>
  <text x="304" y="207" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">63</text>
  <rect x="328" y="192" width="40" height="38" class="f-accent"/>
  <text x="348" y="186" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">142</text>
  <text x="326" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">круг 3</text>
  <rect x="396" y="222" width="40" height="8" class="f-box"/>
  <text x="416" y="216" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">31</text>
  <rect x="440" y="192" width="40" height="38" class="f-accent"/>
  <text x="460" y="186" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">142</text>
  <text x="438" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">круг 4</text>
  <rect x="508" y="223" width="40" height="7" class="f-box"/>
  <text x="528" y="217" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">25</text>
  <rect x="552" y="192" width="40" height="38" class="f-accent"/>
  <text x="572" y="186" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">142</text>
  <text x="550" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">круг 5</text>
</svg>
<figcaption>В 1-м круге изменение считается от исходника. Из 25 предложений, которые ещё меняются в 5-м круге, 17 качаются между 2 вариантами.</figcaption>
</figure>

## Чего я не проверял

Это одна пара моделей. Второй я планировал NLLB-200 на 600 млн параметров, который Meta выпустила в июле этого года. Он не поместился на диск машины. Проверки это регулярки по словам, на которых держится смысл. Смысла они не понимают: refundable в payable прошло проверку отрицания. Первый круг я прочитал глазами. Круги со 2-го по 5-й не читал, так что там может быть что-то ещё. Предложения короткие, около 9 слов, из шаблонов. Разных предложений с отрицанием всего 36, так что 100 предложений там весят меньше, чем кажется. Русский был только серединой. Польский или беларусский в середине я не пробовал.

С числами обратный перевод справился. Бухгалтера он пропустил во всех 16 предложениях, а верный русский перевод про невозвратный сбор забраковал 9 раз из 10. В следующий раз, когда мне понадобится такая проверка, я прочитаю середину сам или попрошу того, кто знает этот язык.
