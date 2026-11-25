---
title: "Rust 1.0 не собрал мою гонку, а по его же подсказке счётчик напечатал 0"
description: "39 маленьких программ для rustc 1.0.0 и та же гонка на C и Java 8. Все 20 программ с нарушенным правилом совместного доступа отклонены, все 7 неверных программ без гонки данных собрались, а подсказка из сообщения об ошибке дала счётчик, который печатает 0."
date: 2015-05-31
lang: ru
translationKey: rust-borrow-race
tags: ["compilers", "reliability", "types"]
---

15 мая вышел Rust 1.0. Я дал ему программу, с которой всегда начинаю, когда разбираюсь с потоками: 2 потока, каждый миллион раз прибавляет 1 к общему счётчику. Она не собралась.

```
error: closure may outlive the current function, but it borrows `counter`, which is owned by the current function [E0373]
help: to force the closure to take ownership of `counter` (and any other referenced variables), use the `move` keyword, as shown:
      let a = thread::spawn(move || for _ in 0..1000000 { counter += 1; });
```

Я сделал то, что написано в help, в обоих потоках. Собралось без ошибок и без предупреждений. Запустил 20 раз и все 20 раз увидел 0.

Объясняется это быстро. Целое число копируется, поэтому с `move` каждый поток считает в своей копии, а main печатает третью. Общего больше ничего нет и гоняться не за что. Пользы от программы, правда, тоже никакой.

Слова про потокобезопасность из анонсов я принимал как обычно принимаю такие слова, не спрашивая, что именно там безопасно. Гонка данных и неверный результат были у меня в голове одним и тем же. Аарон Турон в апрельской статье "Fearless Concurrency with Rust" выражается точнее, он обещает отсутствие гонок данных. Поэтому я решил посчитать и то и другое.

## 39 маленьких программ

Я написал 39 программ длиной от 6 до 19 строк в 5 группах и до первой сборки записал в файл, какую из них компилятор примет, а какую нет. Компилятор rustc 1.0.0 (a59de37e9). Для сравнения тот же счётчик и растущий список на C с gcc и на Java 8. Всё запускалось на 2 ядрах виртуальной машины.

Первая группа это 20 программ, в которых нарушено какое-нибудь правило совместного доступа. По-настоящему гонка была бы только в 10: 2 потока работают с одной памятью без блокировки и хотя бы один пишет. Отмечал я их вручную, уже после прогона. Остальные 10 нарушают те же правила, но гонки в них нет, а в 3 вообще один поток.

<figure class="fig">
<svg viewBox="0 0 680 204" role="img" aria-label="39 маленьких программ на Rust, собранных rustc 1.0.0, один квадрат на программу. Программы, где нарушено правило совместного доступа: отклонено 20 из 20, из них 11 с ошибками владения и заимствования, 7 с ошибками Send и Sync, 2 с другими. Неверные программы без гонки данных: компилируются 7 из 7. Код с unsafe: компилируются 3 из 3. Верные программы с данными в локальной переменной: отклонено 6 из 6. Верные программы с Arc или каналом: компилируются 3 из 3.">
  <text x="158.0" y="31.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">правило нарушено</text>
  <rect x="170.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <circle cx="178.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="191.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <circle cx="199.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="212.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <circle cx="220.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="233.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <circle cx="241.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="254.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="275.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="296.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="317.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="338.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="359.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="380.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="409.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <circle cx="417.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="430.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <circle cx="438.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="451.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <circle cx="459.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="472.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <circle cx="480.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="493.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <rect x="514.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <rect x="535.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <rect x="564.0" y="18.0" width="17.0" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <circle cx="572.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="585.0" y="18.0" width="17.0" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <circle cx="593.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <text x="170.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">владение, заимствование: 11</text>
  <text x="409.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Send, Sync: 7</text>
  <text x="564.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">другое: 2</text>
  <text x="158.0" y="87.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">неверно, без гонки</text>
  <rect x="170.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="191.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="212.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="233.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="254.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="275.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="296.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <text x="325.0" y="87.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">компилируется</text>
  <text x="158.0" y="119.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">unsafe</text>
  <rect x="170.0" y="106.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="191.0" y="106.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="212.0" y="106.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <text x="241.0" y="119.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">компилируется</text>
  <text x="158.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">верно, без Arc</text>
  <rect x="170.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="191.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="212.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="233.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="254.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="275.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="304.0" y="151.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">отклонено</text>
  <text x="158.0" y="183.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">верно, Arc/канал</text>
  <rect x="170.0" y="170.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="191.0" y="170.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="212.0" y="170.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <text x="241.0" y="183.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">компилируется</text>
</svg>
<figcaption>Квадрат это одна программа, закрашенный значит, что rustc 1.0.0 её не принял. В первой строке 20 отказов разложены по тому, о чём говорит сообщение, точкой отмечены 10 программ, где гонка была бы на самом деле.</figcaption>
</figure>

Отклонены все 20 и сбылись все 39 прогнозов. Звучит лучше, чем есть на самом деле, ведь я писал программы, уже зная правила. Интереснее оказалось читать сообщения. Слова "race" нет ни в одном из 20. 11 из них про владение и заимствование: значение уже перемещено, замыкание живёт слишком долго, второе изменяемое заимствование. Это те самые правила, благодаря которым Rust освобождает память без сборщика мусора. И только 7 говорят, что что-то нельзя передать или разделить "between threads safely". Последние 2 это статическая переменная вне `unsafe` и `+=` над Mutex, который никто не захватил.

Из 10 программ с настоящей гонкой 4 ловят правила владения, ещё 4 ловят Send и Sync. Мне нравится, что заметную часть работы делают правила, придуманные для памяти, но у них есть цена. Я написал ещё 6 правильных программ, где данные лежат в локальной переменной main. Отклонены были все 6. Самая простая это локальный Mutex и 2 потока, main дожидается обоих, а rustc всё равно говорит, что замыкание может пережить функцию. Для такого случая есть `thread::scoped`, но в 1.0.0 он отвечает "use of unstable library feature 'scoped': memory unsafe if destructor is avoided, see #24292". 3 правильные программы с Arc или каналом собираются и дали 2 000 000 во всех 120 запусках.

Подсказку про `move` получили 5 программ из 39. Я механически применил её ко всем. 4 получили следующую ошибку, про уже перемещённое значение, а пятая это счётчик, который печатает 0. Правильной не стала ни одна.

## Та же гонка на C и Java

gcc с `-Wall -Wextra` и javac с `-Xlint:all` не выдали ни одного предупреждения. Чтобы увидеть гонку в Rust, пришлось написать `unsafe`, здесь это `static mut`. Вот по 100 запусков каждой программы, верный ответ 2 000 000.

| программа | верных запусков | наименьший результат |
|---|---|---|
| C, gcc -O0 | 61 | 986 351 |
| C, gcc -O2 | 100 | 2 000 000 |
| Java 8 | 15 | 966 766 |
| Rust unsafe | 13 | 1 328 963 |
| Rust unsafe -O | 33 | 1 000 000 |

<figure class="fig">
<svg viewBox="0 0 680 328" role="img" aria-label="Итоговое значение счётчика с гонкой в 100 запусках каждой программы, верное значение 2 000 000. C без оптимизации: 61 верный запуск, остальные разбросаны начиная с 986 351. C с -O2: 100 верных. Java 8: 15 верных, остальные разбросаны начиная с 966 766. Rust с unsafe без оптимизации: 13 верных. Rust с unsafe и -O: 33 верных и 67 запусков ровно на 1 000 000.">
  <line x1="130" y1="66" x2="590" y2="66" class="f-plain"/>
  <text x="120.0" y="60.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">C, gcc -O0</text>
  <rect x="131.0" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="151.9" y="63.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="172.8" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="193.7" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="214.6" y="64.2" width="18.9" height="1.8" style="fill:var(--accent);stroke:none"/>
  <rect x="235.5" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="256.5" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="277.4" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="298.3" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="340.1" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="361.0" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="402.8" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="423.7" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="444.6" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="465.5" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="486.5" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="507.4" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="528.3" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="570.1" y="44.0" width="18.9" height="22.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="40.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">61</text>
  <text x="602.0" y="60.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">61 / 100</text>
  <line x1="130" y1="124" x2="590" y2="124" class="f-plain"/>
  <text x="120.0" y="118.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">C, gcc -O2</text>
  <rect x="570.1" y="88.0" width="18.9" height="36.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="84.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">100</text>
  <text x="602.0" y="118.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">100 / 100</text>
  <line x1="130" y1="182" x2="590" y2="182" class="f-plain"/>
  <text x="120.0" y="176.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Java 8</text>
  <rect x="131.0" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="151.9" y="179.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="172.8" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="193.7" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="319.2" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="381.9" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="402.8" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="423.7" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="444.6" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="465.5" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="486.5" y="180.2" width="18.9" height="1.8" style="fill:var(--accent);stroke:none"/>
  <rect x="507.4" y="179.8" width="18.9" height="2.2" style="fill:var(--accent);stroke:none"/>
  <rect x="528.3" y="179.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="549.2" y="166.9" width="18.9" height="15.1" style="fill:var(--accent);stroke:none"/>
  <text x="558.6" y="162.9" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">42</text>
  <rect x="570.1" y="176.6" width="18.9" height="5.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="172.6" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">15</text>
  <text x="602.0" y="176.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">15 / 100</text>
  <line x1="130" y1="240" x2="590" y2="240" class="f-plain"/>
  <text x="120.0" y="234.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Rust unsafe</text>
  <rect x="277.4" y="238.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="298.3" y="237.8" width="18.9" height="2.2" style="fill:var(--accent);stroke:none"/>
  <rect x="319.2" y="238.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="340.1" y="238.2" width="18.9" height="1.8" style="fill:var(--accent);stroke:none"/>
  <rect x="361.0" y="237.5" width="18.9" height="2.5" style="fill:var(--accent);stroke:none"/>
  <rect x="381.9" y="237.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="402.8" y="235.0" width="18.9" height="5.0" style="fill:var(--accent);stroke:none"/>
  <text x="412.3" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">14</text>
  <rect x="423.7" y="236.0" width="18.9" height="4.0" style="fill:var(--accent);stroke:none"/>
  <text x="433.2" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <rect x="444.6" y="237.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="465.5" y="237.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="486.5" y="237.8" width="18.9" height="2.2" style="fill:var(--accent);stroke:none"/>
  <rect x="507.4" y="237.8" width="18.9" height="2.2" style="fill:var(--accent);stroke:none"/>
  <rect x="528.3" y="238.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="549.2" y="238.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="570.1" y="235.3" width="18.9" height="4.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="231.3" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">13</text>
  <text x="602.0" y="234.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">13 / 100</text>
  <line x1="130" y1="298" x2="590" y2="298" class="f-plain"/>
  <text x="120.0" y="292.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Rust unsafe -O</text>
  <rect x="151.9" y="273.9" width="18.9" height="24.1" style="fill:var(--accent);stroke:none"/>
  <text x="161.4" y="269.9" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">67</text>
  <rect x="570.1" y="286.1" width="18.9" height="11.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="282.1" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">33</text>
  <text x="602.0" y="292.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">33 / 100</text>
  <text x="161.4" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 000 000</text>
  <text x="265.9" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 250 000</text>
  <text x="370.5" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 500 000</text>
  <text x="475.0" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 750 000</text>
  <text x="579.5" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2 000 000</text>
  <text x="602.0" y="22.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">верно</text>
</svg>
<figcaption>Итог одного и того же счётчика с гонкой, 100 запусков на строку. Высота столбца это число запусков в полосе шириной 50 000, число подписано у столбцов от 10 запусков.</figcaption>
</figure>

Я ждал, что с оптимизацией гонка станет хуже. В Rust сказать трудно: верных запусков стало 33 вместо 13, а остальные 67 потеряли ровно половину. В C гонка стала невидимой, потому что gcc превратил весь цикл в одну команду `addq $1000000, counter(%rip)`. rustc 1.0.0 взял счётчик в регистр, сделал там миллион прибавлений и записал результат в самом конце. ThreadSanitizer при этом сообщил о гонке в 10 запусках из 10 того же файла на C с -O2, хотя каждый из них напечатал 2 000 000.

<figure class="fig">
<svg viewBox="0 0 680 240" role="img" aria-label="Что делают со счётчиком в памяти два потока. В варианте gcc -O2 каждый поток выполняет одну команду, которая прибавляет к памяти 1 000 000, два сложения не накладываются и получается 2 000 000. В варианте rustc -O каждый поток читает счётчик в регистр, миллион раз прибавляет 1 в регистре и записывает обратно. Оба потока читают 0, вторая запись затирает первую и получается 1 000 000.">
  <text x="10.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">gcc -O2: addq $1000000, counter(%rip)</text>
  <text x="86.0" y="48.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">поток 1</text>
  <line x1="100" y1="44" x2="560" y2="44" class="f-plain"/>
  <text x="86.0" y="76.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">поток 2</text>
  <line x1="100" y1="72" x2="560" y2="72" class="f-plain"/>
  <rect x="160.0" y="36.0" width="14.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <rect x="230.0" y="64.0" width="14.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="182.0" y="40.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0 + 1000000</text>
  <text x="252.0" y="68.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1000000 + 1000000</text>
  <text x="568.0" y="62.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">counter =</text>
  <text x="568.0" y="78.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">2 000 000</text>
  <text x="10.0" y="124.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">rustc 1.0.0 -O: movq, incq, movq</text>
  <text x="86.0" y="164.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">поток 1</text>
  <line x1="100" y1="160" x2="140" y2="160" class="f-plain"/>
  <line x1="390" y1="160" x2="560" y2="160" class="f-plain"/>
  <text x="86.0" y="208.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">поток 2</text>
  <line x1="100" y1="204" x2="210" y2="204" class="f-plain"/>
  <line x1="460" y1="204" x2="560" y2="204" class="f-plain"/>
  <rect x="140.0" y="152.0" width="10.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <rect x="150.0" y="152.0" width="230.0" height="18.0" style="fill:var(--muted);opacity:0.22;stroke:none"/>
  <rect x="380.0" y="152.0" width="10.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="265.0" y="165.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1 000 000 × incq %rax</text>
  <rect x="210.0" y="196.0" width="10.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <rect x="220.0" y="196.0" width="230.0" height="18.0" style="fill:var(--muted);opacity:0.22;stroke:none"/>
  <rect x="450.0" y="196.0" width="10.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="335.0" y="209.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1 000 000 × incq %rax</text>
  <text x="145.0" y="146.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">чтение 0</text>
  <text x="385.0" y="146.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">запись 1 000 000</text>
  <text x="215.0" y="190.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">чтение 0</text>
  <text x="455.0" y="228.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">запись 1 000 000</text>
  <text x="568.0" y="188.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">counter =</text>
  <text x="568.0" y="204.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1 000 000</text>
</svg>
<figcaption>Два компилятора на одном и том же цикле. У gcc окно шириной в одну команду, у rustc 1.0.0 оно длиной во весь цикл.</figcaption>
</figure>

Ещё я думал, что хуже 1 000 000 быть не может, столько даёт один поток. Один запуск на C и один на Java закончились меньшим числом. Одной запоздавшей записи для этого мало, нужны 2. Первый поток записывает старое значение поверх почти всей работы второго. Второй берёт это маленькое число для своего последнего прибавления, ждёт конца первого и пишет результат последним. Другого пути я не вижу, но сами эти запуски не трассировал.

Список это то место, где сборщик мусора должен помогать. В C упали 40 запусков из 100 с -O0 и 34 с -O2. Java не упала ни разу, в 67 запусках вылетело исключение, в 14 размер был верным. Оставшиеся 19 напечатали неверный размер и ни на что не пожаловались. В Rust такой же push из 2 потоков отклоняется и через ссылку и через Arc.

На этом списке умер мой скрипт. В обычных запусках зависание он обрабатывал, я думал про взаимные блокировки, а в части с ThreadSanitizer стоял предел в 120 секунд, который никто не ловил. Список на C там завис и утащил скрипт за собой. Подсчёты уже лежали в файле, так что повторил я только эту часть.

## Что собирается и врёт

Третье, на что я хотел посмотреть, это программы, в которых гонки данных нет, а ответ всё равно неверный. Их 7 и rustc без предупреждений принимает все 7. Одна из них счётчик с `move`, остальные 6 в таблице. Зависшим я считал запуск, который не кончился за 3 секунды.

| программа | неверных запусков |
|---|---|
| чтение под блокировкой, запись под следующей | 50 из 50 |
| атомарное чтение, потом атомарная запись | 26 из 50 |
| проверка остатка, потом списание под другой блокировкой | 40 из 100, остаток -1 |
| 2 блокировки в разном порядке | 18 из 20 зависли |
| одна блокировка дважды | 5 из 5 зависли |
| без join | 100 из 100 напечатали 0 |

В C и Java первая строка такая же, 0 верных запусков из 50. ThreadSanitizer на программе на C молчит во всех 20 запусках. По определению гонки данных там нет. Если бы я остановился на счётчике, я бы написал, что Rust ловит потерянные обновления. Здесь он их не ловит.

Практический вывод для меня узкий, но полезный. Если в программе на Rust без `unsafe` неверное число, можно не искать память, которую трогают без блокировки, а сразу смотреть на порядок действий. Его я по-прежнему проверял бы глазами.

## Чего я не проверял

Программы крошечные и мои, поэтому 20 из 20 ничего не говорит о том, как часто проверка заимствований отклоняет правильный код в настоящем проекте. Число потерянных обновлений зависит от машины и от того, что ещё на ней работает, запоминать стоит только форму. Компилятор C был один, семейство процессоров одно, настройки Java я не трогал. Бём в 2011 году писал, как компиляторы ломают "безобидные" гонки, я посмотрел на 2 цикла. И я не искал дыр в самой стандартной библиотеке, вроде той, что описана в #24292.
