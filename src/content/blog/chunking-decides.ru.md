---
title: "Я заменил вторую половину чанка, а вектор не изменился ни на бит"
description: "MiniLM L6 v2 читает 256 токенов и про остальное молчит. На 1409 вопросах SQuAD я померил, что из этого выходит для размера чанка, перекрытия и сплиттера на 4000 символов по умолчанию, у которого в векторы попадает 35,1% текста."
date: 2023-08-06
lang: ru
translationKey: chunking-decides
tags: ["llm", "machine-learning", "numbers"]
---

SHA-256 вектора начинается с `8b5453f091`. Это вектор чанка про Super Bowl 50, в нём 3478 символов. Первую половину я оставил, а вместо второй поставил вторую половину чанка про Объединённую методистскую церковь. На стыке теперь написано `2½ sacks,he Methodists", being methodical`. Посчитал вектор заново. SHA-256 начинается с `8b5453f091`.

Ничего не сломалось. Модель `all-MiniLM-L6-v2` читает 256 токенов, а подмена начинается после 347-го. Предупреждения не было, в индекс ложится обычная строка, поиск по ней работает.

Про предел я знал. Но размер чанка всегда брал из примера, в символах, проверял несколько запросов глазами и шёл дальше. Сколько моего текста на самом деле попало в векторы, я ни разу не считал.

## Одна модель, 3 предела

Нынешняя ревизия модели на Hugging Face лежит там с ноября 2022 года. Её `tokenizer.json` режет на 128 токенах. В `sentence_bert_config.json` написано 256, а в `config.json` и `tokenizer_config.json` стоит 512. Карточка модели говорит, что всё длиннее 256 обрезается и что при обучении длина была ограничена 128.

`sentence-transformers` 2.2.2 берёт 256 и передаёт токенизатору `truncation='longest_first'`, предупреждений в этом файле нет вообще. Chroma 0.4.5 скачивает архив с тем же `tokenizer.json` и уже в коде ставит 256. Если загрузить этот файл самому, получится 128.

С другой стороны стоит сплиттер. LangChain 0.0.250 по умолчанию делает чанки до 4000 символов с перекрытием 200. Про модель это число ничего не знает.

<figure class="fig">
<svg viewBox="0 0 680 214" role="img" aria-label="Чанк из 729 токенов, вторая половина которого после токена 347 заменена. При пределе 128 и 256 токенов хеш вектора прежний: dc3316731f и 8b5453f091. При пределе 512 он меняется с 127b2a3216 на ef6685435c.">
  <text x="80.0" y="18.0" text-anchor="start" class="f-label f-muted">первая половина</text>
  <text x="450.0" y="18.0" text-anchor="end" class="f-label f-muted">вторая, заменена</text>
  <text x="560.0" y="18.0" text-anchor="middle" class="f-label f-muted">хеш до / после</text>
  <text x="68.0" y="51.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">128</text>
  <rect x="80" y="34" width="370" height="24" class="f-box"/>
  <rect x="80.0" y="34.0" width="64.0" height="24.0" style="fill:var(--accent);stroke:none;opacity:0.75"/>
  <text x="560.0" y="44.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">dc3316731f</text>
  <text x="560.0" y="60.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">dc3316731f</text>
  <text x="68.0" y="99.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">256</text>
  <rect x="80" y="82" width="370" height="24" class="f-box"/>
  <rect x="80.0" y="82.0" width="128.9" height="24.0" style="fill:var(--accent);stroke:none;opacity:0.75"/>
  <text x="560.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">8b5453f091</text>
  <text x="560.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">8b5453f091</text>
  <text x="68.0" y="147.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">512</text>
  <rect x="80" y="130" width="370" height="24" class="f-box"/>
  <rect x="80.0" y="130.0" width="258.8" height="24.0" style="fill:var(--accent);stroke:none;opacity:0.75"/>
  <text x="560.0" y="140.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">127b2a3216</text>
  <text x="560.0" y="156.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">ef6685435c</text>
  <line x1="256.1" y1="26" x2="256.1" y2="166" class="f-line" style="stroke-dasharray:4 3"/>
  <text x="80.0" y="184.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">0</text>
  <text x="256.1" y="184.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">347</text>
  <text x="450.0" y="184.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">729</text>
  <text x="80.0" y="204.0" text-anchor="start" class="f-label f-muted">номер токена в чанке</text>
</svg>
<figcaption>Один чанк сплиттера с настройками по умолчанию, 729 токенов. Закрашено то, что модель читает при каждом пределе. При 512 косинус между двумя векторами 0,907.</figcaption>
</figure>

## Как мерил

Я взял 8 статей из SQuAD 1.1 dev и склеил их абзацы обратно в целые документы, всего 69 384 токена. С каждой статьи не больше 200 вопросов, потому что у одного Super Bowl 50 их 810 и он решил бы всё за остальных. Осталось 1409 вопросов. Модель это ONNX-файл из архива Chroma, onnxruntime 1.15.1 и tokenizers 0.13.3 на Python 3.11, усреднение по токенам и косинус сразу по чанкам всех 8 статей. Вопрос считается найденным, если эталонный ответ целиком лежит внутри одного из выданных чанков. Сравниваю по смещению, а не по совпадению строки.

Первой пятёрки здесь мало. 5 чанков по 64 токена это 320 токенов, а 5 чанков по 1016 уже 5080. Поэтому вторая мера с бюджетом: беру чанки по порядку, пока они помещаются в 2032 токена промпта. После июльской статьи Лю и соавторов "Lost in the Middle" слать больше текста просто потому, что он влезает, мне не хочется.

Размеры 64, 127, 254 и так далее, потому что 2 места из 256 занимают служебные токены. Ожидания я записал до прогона.

## Где виноват размер, а где обрезка

<figure class="fig">
<svg viewBox="0 0 680 310" role="img" aria-label="Доля найденных ответов по размеру чанка, в скобках доля прочитанных токенов, сначала первые 5 чанков, потом бюджет 2032 токена. 64 (100,0%): 74,3 / 90,7; 127 (100,0%): 79,8 / 92,2; 254 (100,0%): 82,5 / 89,3; 508 (50,8%): 72,5 / 68,3; 508 (100,0%): 83,1 / 80,3; 1016 (26,2%): 71,8 / 47,8.">
  <line x1="50" y1="220.0" x2="670" y2="220.0" class="f-plain"/>
  <text x="42.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50" y1="173.5" x2="670" y2="173.5" class="f-plain"/>
  <text x="42.0" y="177.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="50" y1="127.0" x2="670" y2="127.0" class="f-plain"/>
  <text x="42.0" y="131.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="50" y1="80.5" x2="670" y2="80.5" class="f-plain"/>
  <text x="42.0" y="84.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75</text>
  <line x1="50" y1="34.0" x2="670" y2="34.0" class="f-plain"/>
  <text x="42.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <rect x="62.0" y="81.8" width="37.7" height="138.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="103.7" y="51.3" width="37.7" height="168.7" style="fill:var(--accent);stroke:none"/>
  <text x="80.8" y="76.8" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">74,3</text>
  <text x="122.5" y="46.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">90,7</text>
  <text x="101.7" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">64</text>
  <text x="101.7" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
  <rect x="165.3" y="71.6" width="37.7" height="148.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="207.0" y="48.5" width="37.7" height="171.5" style="fill:var(--accent);stroke:none"/>
  <text x="184.2" y="66.6" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">79,8</text>
  <text x="225.8" y="43.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">92,2</text>
  <text x="205.0" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">127</text>
  <text x="205.0" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
  <rect x="268.7" y="66.6" width="37.7" height="153.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="310.3" y="53.9" width="37.7" height="166.1" style="fill:var(--accent);stroke:none"/>
  <text x="287.5" y="61.6" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">82,5</text>
  <text x="329.2" y="48.9" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">89,3</text>
  <text x="308.3" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">254</text>
  <text x="308.3" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
  <rect x="372.0" y="85.2" width="37.7" height="134.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="413.7" y="93.0" width="37.7" height="127.0" style="fill:var(--accent);stroke:none"/>
  <text x="390.8" y="80.2" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">72,5</text>
  <text x="432.5" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">68,3</text>
  <text x="411.7" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">508</text>
  <text x="411.7" y="254.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">50,8%</text>
  <rect x="475.3" y="65.4" width="37.7" height="154.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="517.0" y="70.6" width="37.7" height="149.4" style="fill:var(--accent);stroke:none"/>
  <text x="494.2" y="60.4" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">83,1</text>
  <text x="535.8" y="65.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">80,3</text>
  <text x="515.0" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">508</text>
  <text x="515.0" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
  <rect x="578.7" y="86.5" width="37.7" height="133.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="620.3" y="131.1" width="37.7" height="88.9" style="fill:var(--accent);stroke:none"/>
  <text x="597.5" y="81.5" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">71,8</text>
  <text x="639.2" y="126.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">47,8</text>
  <text x="618.3" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">1016</text>
  <text x="618.3" y="254.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">26,2%</text>
  <text x="50.0" y="16.0" text-anchor="start" class="f-label f-muted">найдено, % из 1409 вопросов</text>
  <text x="50.0" y="276.0" text-anchor="start" class="f-label f-muted">снизу: размер чанка в токенах, доля прочитанных токенов</text>
  <rect x="50.0" y="288.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="68.0" y="298.0" text-anchor="start" class="f-label f-muted">первые 5 чанков</text>
  <rect x="270.0" y="288.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="288.0" y="298.0" text-anchor="start" class="f-label f-muted">чанки на 2032 токена</text>
</svg>
<figcaption>Чанки по 508 токенов показаны дважды: обрезанные на 256 и прочитанные целиком при пределе 512.</figcaption>
</figure>

От 64 до 254 токенов результат в бюджете почти ровный: 90,7%, 92,2% и 89,3%. На 508 он падает до 68,3%, на 1016 до 47,8%. Обычно это объясняют тем, что у большого чанка размытый вектор. Но предел можно поднять до 512 и дать модели дочитать те же чанки по 508 до конца. Тогда выходит 80,3%. То есть из 21 пункта, потерянного между 254 и 508, 12 возвращаются, стоит прочитать текст целиком. В остальных 9 смешаны размер чанка и вход вчетверо длиннее того, на котором модель училась. Разделить их я не могу.

Я ждал, что при равном бюджете выиграют самые мелкие чанки. Не выиграли. 64 токена на 1,5 пункта хуже 127, интервал от -3,3 до 0,4, в лучшем случае ничья. В первой пятёрке они проигрывают 5,5 пункта. При 64 токенах граница чанка разрезала 49 ответов, при 254 только 12.

С перекрытием тоже вышло не так, как я думал. Чанки по 254 с перекрытием 127 поднимают первое место с 50,7% до 60,8%. Это много. Первая пятёрка прибавляет 3,8 пункта. А в бюджете прибавка 1,3 пункта, интервал от -0,2 до 2,8, при вдвое большем индексе.

## Почему я бы этого не заметил

В первой пятёрке обрезанные чанки по 508 находят 72,5%. Чанки по 64, которые прочитаны полностью, находят 74,3%. По этим двум числам я бы ничего не заподозрил.

Поэтому разделил вопросы по месту ответа. Если ответ в прочитанной части, первая пятёрка находит его в 92,5% случаев, а если в хвосте, то в 51,9%. Для текста, которого модель не видела, это много. Прочитанная часть чанка про то же самое, думаю, она его и вытягивает. Но отчасти дело в маленьком корпусе. В статье в среднем 17,5 таких чанков. Поиск, который угадал бы только статью и взял из неё 5 случайных, ответил бы на 32,0% тех же вопросов про хвост.

Выходит, что примерно для половины вопросов про невидимый текст нужный чанк всё равно находится. Несколько запросов, проверенных глазами, прошли бы.

<figure class="fig">
<svg viewBox="0 0 680 264" role="img" aria-label="Доля найденных в первых 5 для ответов в начале и в хвосте чанка. Размер и предел, начало / хвост. 508, 256: 92,5 / 51,9; 508, 512: 87,8 / 78,9; 4000, 256: 96,0 / 55,4; 4000, 512: 92,9 / 73,9.">
  <line x1="130.0" y1="36" x2="130.0" y2="214" class="f-plain"/>
  <text x="130.0" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="300.0" y1="36" x2="300.0" y2="214" class="f-plain"/>
  <text x="300.0" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="470.0" y1="36" x2="470.0" y2="214" class="f-plain"/>
  <text x="470.0" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="640.0" y1="36" x2="640.0" y2="214" class="f-plain"/>
  <text x="640.0" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="110.0" y="66.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">508, 256</text>
  <line x1="231.1" y1="62" x2="576.3" y2="62" class="f-line"/>
  <circle cx="231.1" cy="62" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="576.3" cy="62" r="6" style="fill:var(--muted);stroke:none"/>
  <text x="231.1" y="51.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">51,9</text>
  <text x="576.3" y="51.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">92,5</text>
  <text x="110.0" y="110.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">508, 512</text>
  <line x1="460.7" y1="106" x2="536.3" y2="106" class="f-line"/>
  <circle cx="460.7" cy="106" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="536.3" cy="106" r="6" style="fill:var(--muted);stroke:none"/>
  <text x="460.7" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">78,9</text>
  <text x="536.3" y="95.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">87,8</text>
  <text x="110.0" y="154.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">4000, 256</text>
  <line x1="260.9" y1="150" x2="606.0" y2="150" class="f-line"/>
  <circle cx="260.9" cy="150" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="606.0" cy="150" r="6" style="fill:var(--muted);stroke:none"/>
  <text x="260.9" y="139.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">55,4</text>
  <text x="606.0" y="139.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">96,0</text>
  <text x="110.0" y="198.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">4000, 512</text>
  <line x1="418.2" y1="194" x2="579.7" y2="194" class="f-line"/>
  <circle cx="418.2" cy="194" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="579.7" cy="194" r="6" style="fill:var(--muted);stroke:none"/>
  <text x="418.2" y="183.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">73,9</text>
  <text x="579.7" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">92,9</text>
  <text x="14.0" y="18.0" text-anchor="start" class="f-label f-muted">чанк, предел</text>
  <circle cx="136" cy="14" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="148.0" y="18.0" text-anchor="start" class="f-label f-muted">ответ в хвосте</text>
  <circle cx="356" cy="14" r="5" style="fill:var(--muted);stroke:none"/>
  <text x="368.0" y="18.0" text-anchor="start" class="f-label f-muted">ответ в начале</text>
  <text x="640.0" y="254.0" text-anchor="end" class="f-label f-muted">найдено в первых 5, %</text>
</svg>
<figcaption>Хвост во всех 4 строках это всё после первых 254 токенов. 508 в токенах, 4000 в символах. При 512 чанки по 508 прочитаны целиком, а чанки по 4000 всё равно только на 70,1%.</figcaption>
</figure>

Если те же чанки прочитать целиком, те же 2 группы дают 87,8% и 78,9%. Разрыв сжимается с 40,6 пункта до 8,9. Ответы в начале стали находиться чуть хуже, думаю, потому что один вектор теперь описывает вдвое больше текста.

## Сплиттер по умолчанию

Рекурсивный сплиттер LangChain с разными аргументами и той же моделью.

| чанки | предел | прочитано токенов | первые 5 | в 2032 токенах |
|---|---|---|---|---|
| 4000 / 200, по умолчанию | 128 | 17,4% | 63,1% | 42,5% |
| 4000 / 200, по умолчанию | 256 | 35,1% | 69,2% | 50,5% |
| 4000 / 200, по умолчанию | 512 | 70,1% | 80,3% | 62,7% |
| 1000 / 200 | 256 | 100,0% | 88,5% | 95,2% |
| абзацы как есть | 256 | 96,5% | 89,4% | 95,5% |

С настройками по умолчанию получилось 96 чанков и все 96 длиннее предела. У 66% вопросов ответ лежит в тексте, который не попал ни в один вектор. Тот же сплиттер с `chunk_size=1000` выигрывает в бюджете 44,7 пункта, по отдельным статьям от 39,0 до 52,7. Обрезка объясняет только часть. Если поднять предел до 512, настройки по умолчанию отыгрывают 12,2 пункта, хотя 30% токенов и там не прочитаны. Остальное, думаю, в основном сам бюджет: в него входит в среднем 2,2 таких чанка против 12,8 маленьких.

Верху этой таблицы я не очень верю. Вопросы SQuAD придуманы по этим самым абзацам, а сплиттер на 1000 символов тоже старается резать по пустой строке между ними.

К тому же 1000 символов я проверил только на английском, там за предел вышли 2 чанка из 489. Для русского посчитал токены в XQuAD, это одни и те же 240 абзацев на двух языках. 1000 символов по-английски это 205 токенов, а по-русски 822, так что в 254 токена помещается 314 русских символов. Словарь у модели английский и для русского её брать не надо. У многоязычной `paraphrase-multilingual-MiniLM-L12-v2` предел ещё ниже, `max_seq_length` там 128, но её токены я не считал.

## Что я теперь делаю

```python
tok.no_truncation()
n = [len(tok.encode(c).ids) for c in chunks]
print(max(n), sum(x > 256 for x in n), "из", len(n))
```

3 строки перед построением индекса. На сплиттере по умолчанию последняя напечатает `872 96 из 96`, вместе с двумя служебными токенами.

## Чего я не проверял

Одна модель, один seed, 8 статей. Корпус маленький, на настоящем проценты были бы ниже. Интервалы получены бутстрэпом по вопросам, но вопросы одной статьи не совсем независимы, так что на деле интервалы, скорее всего, шире. Мои ровные чанки режут где придётся, даже посреди слова. Не пробовал ни BM25, ни реранкер, ни настоящий ответ LLM. В вопросах SQuAD много слов из самого абзаца, живые люди спрашивают менее аккуратно. Способы нарезки хорошо описаны в июньской статье на сайте Pinecone. В DPR в 2020 году просто брали куски по 100 слов. В черновике у меня стояло, что они помещаются под любой из 3 пределов. Потом я порезал так те же 8 статей и посчитал: в среднем 132 токена вместе со служебными, 287 кусков из 528 длиннее 128, длиннее 256 ни одного.
