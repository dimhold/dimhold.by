---
title: "Claude 19 раз из 19 написал верную программу расчёта счёта, а потом выдумал, что она напечатала"
description: "Я всегда говорю, что деньги считает детерминированный движок, а модель только рассказывает, но половину со счетами ни разу не мерил. На польских счетах с VAT Claude Opus 5 без инструментов был точен до гроша в 18 из 20 на 5 строках и в 19 из 20 на 40 строках, когда ему велели считать самому. Каждый неверный ответ всё равно сходился. Без этого указания он в 18 ответах из 20 писал программу. Все 19 его программ верны, а в 9 ответах он выдумал, что программа напечатала."
date: 2026-11-22
lang: ru
translationKey: engine-cents
tags: ["llm", "numbers"]
---
Когда меня спрашивают, где место языковой модели рядом с деньгами, я отвечаю одной фразой. Итоги считает детерминированный движок, а модель только о них рассказывает. 8 октября я померил прогнозную половину этого разделения. Половину со счетами я не мерил никогда, просто повторял, поэтому на этот раз взял счёт.

## Постановка

Я живу в Варшаве, поэтому счёт польский, с VAT. В каждой строке количество, цена нетто за единицу в злотых, скидка и ставка VAT 23, 8, 5 или 0 процентов. Правило написано в задаче. Нетто каждой строки округляется до гроша, полгроша вверх. Потом строки группируются по ставке, VAT берётся от суммы каждой группы и снова округляется. Брутто равно нетто плюс VAT.

Движок это около 20 строк на Python 3.12.3 с `decimal` и `ROUND_HALF_UP`. 10 000 счетов по 40 строк он считает от 0,83 до 1,18 секунды, примерно 0,1 мс на счёт. 3 повтора дают один и тот же хеш всех результатов.

Модель это `claude-opus-5` через Claude Code 2.1.292. Запускал я её из пустой папки без инструментов и без серверов MCP. С фиксированным зерном я сгенерировал 10 счетов по 5 строк, 10 по 15 и 10 по 40. Каждый счёт ушёл модели 2 раза. Ответ должен был быть одной строкой JSON с тремя итогами. Совпадением считается, когда нетто, VAT и брутто все равны движку до гроша.

До подсчёта я записал, чего жду. На 5 строках модель точна хотя бы в 9 случаях из 10. На 40 строках она точна меньше чем в 7 из 10. А 2 прогона одного счёта хотя бы на одном счёте дают разные ответы.

Мысль, что код считает лучше модели, старая и не моя. PAL и Program of Thoughts в 2022 году вынесли арифметику из модели в программу. Я просто ни разу не видел этого на счёте.

## Маленькие счета

На 5 строках модель была точна 9 раз в каждом прогоне. На 15 строках она попала 9 и 10 раз. Промахи маленькие. Один счёт разошёлся на 5 грошей, другой на 85. Третий ошибся в нетто ровно на 1,00 злотого, из-за этого VAT сдвинулся на 8 грошей.

Больше, чем размер промаха, меня беспокоит то, что каждый неверный ответ сходится сам с собой. Нетто плюс VAT во всех равно брутто до гроша. Первая проверка, которую я бы написал, складывает 3 итога. Каждый из этих ответов её проходит.

## 40 строк и ответ, о котором я не просил

На 40 строках я получил 2 ответа JSON из 20. Оба точные. Остальные 18 оказались программой на Python с `Decimal`. Часть пришла блоком кода bash, часть вызовом инструмента Bash, которого у модели не было. Такого я вообще не планировал. Поэтому я остановился и, прежде чем считать дальше, записал новое правило: вынуть каждую программу из ответа и запустить.

Всего таких программ набралось 19, здесь 18 и ещё одна из другой части замера. Каждую я запустил через `python3 -I` в пустой временной папке. Все 19 напечатали правильные итоги до гроша.

Потом я дочитал ответы до конца. В 10 из 19 модель не остановилась на программе и сама написала вывод инструмента. 9 раз это были числа, 3 из них под заголовком `Tool Result`. Один раз просто `<redacted>`. Ни одно из 9 не совпало ни с верными итогами, ни даже с тем, что печатает её собственная программа. На одном счёте программа печатает нетто 739 434,56, а в выдуманном выводе под ней стоит 58 923,85. Для другого счёта модель в 2 прогонах выдумала 2 разных вывода, 995 552,96 и 1 304 665,13, а верное нетто 962 434,28.

<figure class="fig">
<svg viewBox="0 0 640 296" role="img" aria-label="Точечная диаграмма по 9 счетам из 40 строк. Для каждого показаны 2 нетто: то, что печатает собственная программа модели (оно совпадает с верным итогом), и то, что модель написала так, будто ответил инструмент. Прогон 1, счёт 0: программа 962 434,28, выдумано 995 552,96. Прогон 1, счёт 6: программа 634 763,20, выдумано 710 176,19. Прогон 2, счёт 0: программа 962 434,28, выдумано 1 304 665,13. Прогон 2, счёт 1: программа 724 844,42, выдумано 368 319,24. Прогон 2, счёт 3: программа 843 126,24, выдумано 1 448 668,85. Прогон 2, счёт 4: программа 739 434,56, выдумано 58 923,85. Прогон 2, счёт 5: программа 759 314,37, выдумано 861 885,72. Прогон 2, счёт 7: программа 664 085,65, выдумано 1 188 622,57. Прогон 2, счёт 8: программа 888 420,29, выдумано 1 403 374,42. Ни одно из 9 выдуманных чисел не совпадает с верным.">
  <text x="10" y="16" class="f-label f-muted">нетто в злотых: что печатает программа модели и что модель выдала за её вывод</text>
  <circle cx="176" cy="36" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/><text x="186" y="40" class="f-label f-ink">печатает её программа (= верный итог)</text>
  <circle cx="176" cy="52" r="5" style="fill:var(--accent)"/><text x="186" y="56" class="f-label f-ink">модель написала как вывод</text>
  <line x1="170.0" y1="58" x2="170.0" y2="262" class="f-plain"/>
  <text x="170.0" y="278" text-anchor="middle" class="f-label f-muted">0</text>
  <line x1="316.7" y1="58" x2="316.7" y2="262" class="f-plain"/>
  <text x="316.7" y="278" text-anchor="middle" class="f-label f-muted">500 000</text>
  <line x1="463.3" y1="58" x2="463.3" y2="262" class="f-plain"/>
  <text x="463.3" y="278" text-anchor="middle" class="f-label f-muted">1 000 000</text>
  <line x1="610.0" y1="58" x2="610.0" y2="262" class="f-plain"/>
  <text x="610.0" y="278" text-anchor="middle" class="f-label f-muted">1 500 000</text>
  <text x="160" y="76" text-anchor="end" class="f-mono f-ink">прогон 1, счёт 0</text>
  <line x1="452.3" y1="72" x2="462.0" y2="72" class="f-line"/>
  <circle cx="452.3" cy="72" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="462.0" cy="72" r="5" style="fill:var(--accent)"/>
  <text x="160" y="98" text-anchor="end" class="f-mono f-ink">прогон 1, счёт 6</text>
  <line x1="356.2" y1="94" x2="378.3" y2="94" class="f-line"/>
  <circle cx="356.2" cy="94" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="378.3" cy="94" r="5" style="fill:var(--accent)"/>
  <text x="160" y="120" text-anchor="end" class="f-mono f-ink">прогон 2, счёт 0</text>
  <line x1="452.3" y1="116" x2="552.7" y2="116" class="f-line"/>
  <circle cx="452.3" cy="116" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="552.7" cy="116" r="5" style="fill:var(--accent)"/>
  <text x="160" y="142" text-anchor="end" class="f-mono f-ink">прогон 2, счёт 1</text>
  <line x1="382.6" y1="138" x2="278.0" y2="138" class="f-line"/>
  <circle cx="382.6" cy="138" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="278.0" cy="138" r="5" style="fill:var(--accent)"/>
  <text x="160" y="164" text-anchor="end" class="f-mono f-ink">прогон 2, счёт 3</text>
  <line x1="417.3" y1="160" x2="594.9" y2="160" class="f-line"/>
  <circle cx="417.3" cy="160" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="594.9" cy="160" r="5" style="fill:var(--accent)"/>
  <text x="160" y="186" text-anchor="end" class="f-mono f-ink">прогон 2, счёт 4</text>
  <line x1="386.9" y1="182" x2="187.3" y2="182" class="f-line"/>
  <circle cx="386.9" cy="182" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="187.3" cy="182" r="5" style="fill:var(--accent)"/>
  <text x="160" y="208" text-anchor="end" class="f-mono f-ink">прогон 2, счёт 5</text>
  <line x1="392.7" y1="204" x2="422.8" y2="204" class="f-line"/>
  <circle cx="392.7" cy="204" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="422.8" cy="204" r="5" style="fill:var(--accent)"/>
  <text x="160" y="230" text-anchor="end" class="f-mono f-ink">прогон 2, счёт 7</text>
  <line x1="364.8" y1="226" x2="518.7" y2="226" class="f-line"/>
  <circle cx="364.8" cy="226" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="518.7" cy="226" r="5" style="fill:var(--accent)"/>
  <text x="160" y="252" text-anchor="end" class="f-mono f-ink">прогон 2, счёт 8</text>
  <line x1="430.6" y1="248" x2="581.7" y2="248" class="f-line"/>
  <circle cx="430.6" cy="248" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="581.7" cy="248" r="5" style="fill:var(--accent)"/>
</svg>
<figcaption>Инструментов у модели не было. Все 19 её программ при запуске печатают верные итоги. В 10 ответах она ещё и сама написала вывод, 9 раз числами и один раз &lt;redacted&gt;.</figcaption>
</figure>

Какое-то время я думал, что в 9 из этих ответов кода нет вообще. Мой первый скрипт извлечения нашёл программы только в 10 из 19, а остальные пометил как "кода нет". Модель завернула одну и ту же программу в 3 разных формата, а я не ждал больше одного.

## Считать вручную

Тогда я отправил те же 10 счетов по 40 строк ещё 2 раза, добавив в задачу одну фразу: "You have no tools and cannot run code. Compute the totals yourself." То есть инструментов нет, код запустить нельзя, считай сам.

Модель была точна в 10 из 10 в первом прогоне и в 9 из 10 во втором. Мой прогноз "меньше 7 из 10" не подтвердился. Единственный промах к тому же не связан с округлением. Модель целиком пропустила строку 27, 40 штук по 2462,10 со скидкой 15%, поэтому нетто меньше на 83 711,40, а VAT на 19 253,63.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Сетка из 8 рядов на 10 счетов. 5 строк: точно в 9 и 9 из 10, промахи на 5 и 85 грошей нетто. 15 строк: точно в 9 и 10, один промах на 1,00 злотого нетто. 40 строк: 18 ответов из 20 это программа вместо чисел, 2 ответа числами точны. 40 строк с запретом кода: точно в 10 и 9, в промахе пропущена строка 27.">
  <text x="10" y="16" class="f-label f-muted">по 10 счетов на размер, по 2 прогона: точно до гроша или нет</text>
  <text x="180" y="50" text-anchor="end" class="f-mono f-ink">5 строк, прогон 1</text>
  <rect x="192" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="38" width="20" height="18" style="fill:var(--accent)"/>
  <rect x="426" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="458" y="50" class="f-label f-accent">нетто −0,05</text>
  <text x="180" y="74" text-anchor="end" class="f-mono f-ink">5 строк, прогон 2</text>
  <rect x="192" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="62" width="20" height="18" style="fill:var(--accent)"/>
  <text x="458" y="74" class="f-label f-accent">нетто −0,85</text>
  <text x="180" y="98" text-anchor="end" class="f-mono f-ink">15 строк, прогон 1</text>
  <rect x="192" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="86" width="20" height="18" style="fill:var(--accent)"/>
  <text x="458" y="98" class="f-label f-accent">нетто +1,00</text>
  <text x="180" y="122" text-anchor="end" class="f-mono f-ink">15 строк, прогон 2</text>
  <rect x="192" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="180" y="146" text-anchor="end" class="f-mono f-ink">40 строк, прогон 1</text>
  <rect x="192" y="134" width="20" height="18" class="f-box"/><text x="202" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="218" y="134" width="20" height="18" class="f-box"/><text x="228" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="244" y="134" width="20" height="18" class="f-box"/><text x="254" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="270" y="134" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="134" width="20" height="18" class="f-box"/><text x="306" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="322" y="134" width="20" height="18" class="f-box"/><text x="332" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="348" y="134" width="20" height="18" class="f-box"/><text x="358" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="374" y="134" width="20" height="18" class="f-box"/><text x="384" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="400" y="134" width="20" height="18" class="f-box"/><text x="410" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="426" y="134" width="20" height="18" class="f-box"/><text x="436" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <text x="180" y="170" text-anchor="end" class="f-mono f-ink">40 строк, прогон 2</text>
  <rect x="192" y="158" width="20" height="18" class="f-box"/><text x="202" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="218" y="158" width="20" height="18" class="f-box"/><text x="228" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="244" y="158" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="158" width="20" height="18" class="f-box"/><text x="280" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="296" y="158" width="20" height="18" class="f-box"/><text x="306" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="322" y="158" width="20" height="18" class="f-box"/><text x="332" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="348" y="158" width="20" height="18" class="f-box"/><text x="358" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="374" y="158" width="20" height="18" class="f-box"/><text x="384" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="400" y="158" width="20" height="18" class="f-box"/><text x="410" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="426" y="158" width="20" height="18" class="f-box"/><text x="436" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <text x="180" y="200" text-anchor="end" class="f-mono f-accent">40, без кода, прогон 1</text>
  <rect x="192" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="180" y="224" text-anchor="end" class="f-mono f-accent">40, без кода, прогон 2</text>
  <rect x="192" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="212" width="20" height="18" style="fill:var(--accent)"/>
  <text x="458" y="224" class="f-label f-accent">пропущена строка 27</text>
  <rect x="190" y="242" width="12" height="12" class="f-ink" style="fill:currentColor" opacity="0.3"/><text x="208" y="252" class="f-label f-ink">точно</text>
  <rect x="265" y="242" width="12" height="12" style="fill:var(--accent)"/><text x="283" y="252" class="f-label f-ink">ошибка</text>
  <rect x="346.6" y="242" width="12" height="12" class="f-box"/><text x="364.6" y="252" class="f-label f-ink">программа вместо чисел</text>
</svg>
<figcaption>Claude Opus 5 без инструментов, правило названо в задаче. В каждом неверном ответе нетто плюс VAT всё равно сходится с брутто.</figcaption>
</figure>

Медианный вызов занял 42,9 секунды и стоил $0,11, на размышление ушло около 4000 токенов. На 5 строках это было 13,6 секунды и $0,024. Движок считает тот же счёт из 40 строк примерно за 0,1 мс. Все 100 вызовов этого замера стоили $5,71.

<figure class="fig">
<svg viewBox="0 0 640 184" role="img" aria-label="Горизонтальные столбцы на логарифмической шкале секунд. Движок на Decimal тратит около 0,1 мс на счёт из 40 строк. Модель тратит в медиане 13,6 секунды и $0,024 на 5 строк, 19,6 секунды и $0,045 на 15 строк, 42,9 секунды и $0,11 на 40 строк с запретом кода.">
  <text x="10" y="16" class="f-label f-muted">время на один счёт, логарифмическая шкала</text>
  <line x1="330.0" y1="30" x2="330.0" y2="154" class="f-line" stroke-dasharray="3 3"/>
  <text x="330.0" y="170" text-anchor="middle" class="f-label f-muted">1 мс</text>
  <line x1="450.0" y1="30" x2="450.0" y2="154" class="f-line" stroke-dasharray="3 3"/>
  <text x="450.0" y="170" text-anchor="middle" class="f-label f-muted">1 с</text>
  <line x1="521.1" y1="30" x2="521.1" y2="154" class="f-line" stroke-dasharray="3 3"/>
  <text x="521.1" y="170" text-anchor="middle" class="f-label f-muted">1 мин</text>
  <text x="240" y="49" text-anchor="end" class="f-mono f-ink">движок на Decimal, 40 строк</text>
  <rect x="250" y="37" width="36.7" height="16" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="289.7" y="35" width="104.4" height="20" style="fill:var(--surface)"/>
  <text x="292.7" y="49" class="f-mono f-ink">около 0,1 мс</text>
  <text x="240" y="79" text-anchor="end" class="f-mono f-ink">модель, 5 строк</text>
  <rect x="250" y="67" width="245.3" height="16" style="fill:var(--accent)"/>
  <rect x="498.3" y="65" width="120.8" height="20" style="fill:var(--surface)"/>
  <text x="501.3" y="79" class="f-mono f-ink">13,6 с, $0,024</text>
  <text x="240" y="109" text-anchor="end" class="f-mono f-ink">модель, 15 строк</text>
  <rect x="250" y="97" width="251.7" height="16" style="fill:var(--accent)"/>
  <rect x="504.7" y="95" width="120.8" height="20" style="fill:var(--surface)"/>
  <text x="507.7" y="109" class="f-mono f-ink">19,6 с, $0,045</text>
  <text x="240" y="139" text-anchor="end" class="f-mono f-ink">модель, 40 строк, без кода</text>
  <rect x="250" y="127" width="265.3" height="16" style="fill:var(--accent)"/>
  <rect x="518.3" y="125" width="112.6" height="20" style="fill:var(--surface)"/>
  <text x="521.3" y="139" class="f-mono f-ink">42,9 с, $0,11</text>
</svg>
<figcaption>Модель: медиана 20 вызовов на каждый столбец, стоимость по отчёту CLI. Движок: 10 000 счетов по 40 строк за 0,83–1,18 с, Python 3.12.3.</figcaption>
</figure>

## Когда правило не названо

Вторая моя догадка была про округление. Я дал 10 счетов по 15 строк без правила, только "до гроша". Я ждал, что модель будет перескакивать между округлением VAT в каждой строке, по ставке или только в самом конце.

Она не перескакивала. 18 ответов из 20 были числами. Все 18 совпадают с VAT от суммы по ставке. Построчное округление и округление по ставке дают разные итоги в 4 из этих 10 счетов. В этих 4 модель оба раза выбрала округление по ставке. В одном ответе она назвала это "standard Polish practice", стандартной польской практикой. Оставшиеся 2 ответа были планом и программой. Программа тоже оказалась верной.

## Что я из этого вынес

Я уже был готов написать, что модель не справляется со счётом. Умеет, в 19 случаях из 20 на 40 строках, когда ей велено считать самой. Её код был верен каждый раз. Неверный итог, который всё равно сходится, проходит мою первую проверку. Вывод инструмента, который никто не запускал, выглядит как доказательство, хотя им не является. Поэтому мои итоги по-прежнему считает код на Decimal.

## Чего я не проверял

Я проверил 1 модель, по 2 прогона на счёт. Счета синтетические. Не было корректировочных счетов и иностранной валюты, ничего не сканировалось с бумаги. Настоящего инструмента модель так и не получила, поэтому я знаю, что её программы верны, но не знаю, что она делает с настоящим результатом. Бюджет размышления я сам не задавал и само размышление не читал, так что где потерялась строка 27, я не знаю.
