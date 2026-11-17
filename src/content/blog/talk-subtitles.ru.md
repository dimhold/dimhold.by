---
title: "Мои субтитры 2013 года к докладу Рича Хикки остановились на 5-й минуте. Whisper base на моём процессоре сделал бы весь доклад за 9 часов"
description: "В 2013 году я порезал 153-минутный доклад Рича Хикки на куски по 5 секунд для распознавания речи Google и правил субтитры руками. Они остановились на 5-й минуте и 37,3% слов в них расходятся с более поздней отредактированной расшифровкой. На 10 докладах TED локальный путь, доступный до Whisper, то есть Vosk с пунктуацией, ошибается в 8,02% слов и тратит 17,9 секунды на минуту звука. Whisper tiny.en и base.en на 3 докладах дают 3,91% и 3,27%, но на 4 ядрах процессора base.en тратит 211 с на минуту."
date: 2022-10-09
lang: ru
translationKey: talk-subtitles
tags: ["machine-learning", "text", "performance"]
---
10 мая 2013 года я завёл репозиторий, чтобы перевести на русский доклад Рича Хикки Clojure Concurrency. Первый шаг в README это английские субтитры в WebVTT и в этой строке до сих пор стоит 5%. 21 сентября OpenAI выпустила Whisper. Через 5 дней его командная строка научилась писать файлы SRT. Поэтому я вернулся в тот репозиторий посмотреть, сколько мне стоила работа 2013 года и сколько та же работа стоит сейчас.

## Что я делал в 2013 году

Репозиторий хранит весь процесс. Там есть страница с видео и кнопкой "Freeze time", которая пишет `video.currentTime` в лог. С её помощью я ловил, где фраза начинается и где кончается. 19 мая я закоммитил 1219 файлов JSON с ответами распознавания речи Google, по одному на каждый пятисекундный кусок доклада в FLAC. Самый первый ответ: "hi welcome a thank you for waiting um my name is Ricky and I'm here to talk about".

153 минуты дают 1838 таких кусков и для 619 из них файла нет. Закономерность я заметил только сейчас. 592 недостающих куска это третий кусок пятнадцатисекундного блока, с 10-й по 15-ю секунду. Похоже на ошибку в моём собственном скрипте нарезки, но этого скрипта у меня больше нет, так что проверить не могу. Из файлов, которые есть, в 19 написано NO_MATCH, а 1 это страница HTML с "Internal Server Error".

<figure class="fig">
<svg viewBox="0 0 640 162" role="img" aria-label="Полоса из 50 клеток на первые 4 минуты 10 секунд доклада, по клетке на пятисекундный кусок. С ответом: 31. С ошибкой: 1. Без файла: 18. Пуста почти каждая третья клетка. Во всём докладе у 619 из 1838 кусков нет файла. 592 из них это третий кусок пятнадцатисекундного блока.">
  <text x="12" y="18" class="f-label f-muted">Первые 4 минуты 10 секунд, клетка на каждый пятисекундный кусок, отправленный в Google</text>
  <rect x="12" y="28" width="10" height="10" class="f-accent"/>
  <text x="28" y="37" class="f-label f-ink">ответ</text>
  <rect x="150" y="28" width="10" height="10" class="f-ink"/>
  <text x="166" y="37" class="f-label f-ink">ошибка или NO_MATCH</text>
  <rect x="340" y="28" width="10" height="10" class="f-box"/>
  <text x="356" y="37" class="f-label f-ink">нет файла</text>
  <rect x="40" y="56" width="9" height="28" class="f-accent"/>
  <rect x="51" y="56" width="9" height="28" class="f-box"/>
  <rect x="62" y="56" width="9" height="28" class="f-box"/>
  <rect x="73" y="56" width="9" height="28" class="f-accent"/>
  <rect x="84" y="56" width="9" height="28" class="f-accent"/>
  <rect x="95" y="56" width="9" height="28" class="f-box"/>
  <rect x="106" y="56" width="9" height="28" class="f-accent"/>
  <rect x="117" y="56" width="9" height="28" class="f-ink"/>
  <rect x="128" y="56" width="9" height="28" class="f-box"/>
  <rect x="139" y="56" width="9" height="28" class="f-accent"/>
  <rect x="150" y="56" width="9" height="28" class="f-accent"/>
  <rect x="161" y="56" width="9" height="28" class="f-box"/>
  <rect x="172" y="56" width="9" height="28" class="f-accent"/>
  <rect x="183" y="56" width="9" height="28" class="f-accent"/>
  <rect x="194" y="56" width="9" height="28" class="f-box"/>
  <rect x="205" y="56" width="9" height="28" class="f-accent"/>
  <rect x="216" y="56" width="9" height="28" class="f-accent"/>
  <rect x="227" y="56" width="9" height="28" class="f-box"/>
  <rect x="238" y="56" width="9" height="28" class="f-accent"/>
  <rect x="249" y="56" width="9" height="28" class="f-accent"/>
  <rect x="260" y="56" width="9" height="28" class="f-box"/>
  <rect x="271" y="56" width="9" height="28" class="f-accent"/>
  <rect x="282" y="56" width="9" height="28" class="f-accent"/>
  <rect x="293" y="56" width="9" height="28" class="f-box"/>
  <rect x="304" y="56" width="9" height="28" class="f-accent"/>
  <rect x="315" y="56" width="9" height="28" class="f-accent"/>
  <rect x="326" y="56" width="9" height="28" class="f-box"/>
  <rect x="337" y="56" width="9" height="28" class="f-accent"/>
  <rect x="348" y="56" width="9" height="28" class="f-accent"/>
  <rect x="359" y="56" width="9" height="28" class="f-box"/>
  <rect x="370" y="56" width="9" height="28" class="f-accent"/>
  <rect x="381" y="56" width="9" height="28" class="f-accent"/>
  <rect x="392" y="56" width="9" height="28" class="f-box"/>
  <rect x="403" y="56" width="9" height="28" class="f-accent"/>
  <rect x="414" y="56" width="9" height="28" class="f-accent"/>
  <rect x="425" y="56" width="9" height="28" class="f-box"/>
  <rect x="436" y="56" width="9" height="28" class="f-accent"/>
  <rect x="447" y="56" width="9" height="28" class="f-accent"/>
  <rect x="458" y="56" width="9" height="28" class="f-box"/>
  <rect x="469" y="56" width="9" height="28" class="f-accent"/>
  <rect x="480" y="56" width="9" height="28" class="f-box"/>
  <rect x="491" y="56" width="9" height="28" class="f-accent"/>
  <rect x="502" y="56" width="9" height="28" class="f-box"/>
  <rect x="513" y="56" width="9" height="28" class="f-accent"/>
  <rect x="524" y="56" width="9" height="28" class="f-box"/>
  <rect x="535" y="56" width="9" height="28" class="f-accent"/>
  <rect x="546" y="56" width="9" height="28" class="f-accent"/>
  <rect x="557" y="56" width="9" height="28" class="f-box"/>
  <rect x="568" y="56" width="9" height="28" class="f-accent"/>
  <rect x="579" y="56" width="9" height="28" class="f-accent"/>
  <text x="40" y="100" class="f-label f-muted">0:00</text>
  <text x="172" y="100" class="f-label f-muted">1:00</text>
  <text x="304" y="100" class="f-label f-muted">2:00</text>
  <text x="436" y="100" class="f-label f-muted">3:00</text>
  <text x="568" y="100" class="f-label f-muted">4:00</text>
  <text x="12" y="130" class="f-label f-ink">Весь доклад: у 619 из 1838 кусков нет файла</text>
  <text x="12" y="150" class="f-label f-ink">592 из них это кусок с 10-й по 15-ю секунду пятнадцатисекундного блока</text>
</svg>
<figcaption>Пропуски идут по моим пятнадцатисекундным блокам, поэтому я подозреваю свой скрипт нарезки.</figcaption>
</figure>

Реплики я правил руками, частью до ответов Google, частью после. Файл `concurrency.vtt` трогают 52 коммита между 10 мая и 9 октября 2013 года. Многие из них названы по единственной реплике, которую правят, например "Update 00:01:11.361 --> 00:01:13.097". Чистая часть кончается на 00:04:59. Дальше идут черновики без времени и один блок с временем около 60-й минуты, с вопросительными знаками там, где я не расслышал слово.

## Насколько хорошо я слышал

В 2019 году кто-то выложил отредактированную расшифровку этого доклада в репозиторий `talk-transcripts` на GitHub. Она почищена: "I am" вместо "I'm" и без "um", поэтому смысл она передаёт, но дословно речь не повторяет. Я взял часть до её метки `[Time 0:04:07]` и раскрыл сокращения во всех версиях. Потом всё прошло через английский нормализатор, которым Whisper считает свои же оценки.

Куски Google совпали в 213 словах из 593. 273 слов в тексте Google нет, большинство из них приходится на куски без файла. Мои реплики совпали в 390. С отредактированной расшифровкой мои реплики расходятся в 37,3% слов, а куски Google в 65,3%. Часть этого даёт редактура расшифровки и сколько именно, я сказать не могу. Я ни разу раньше не сверял свои реплики ни с чем и фраза на 0:24 показывает, откуда это число. В расшифровке стоит "is built into the language", я записал "sponsored to a language", а Google услышал "to Fort Worth". Это мой английский 2013 года и Google тут не виноват.

<figure class="fig">
<svg viewBox="0 0 640 298" role="img" aria-label="3 версии фразы на 0:24. Расшифровка 2019 года: So tonight's talk is going to be sort of a general overview of Clojure, and a specific look at some of the concurrency support that is built into the language. Моя реплика 2013 года: So, tonight, talks is gone a be so a general overview of clojure and specific look at some of the concurrency support that sponsored to a language. Google 2013 года по кускам: 0:20 programs in the way of soda, 0:25 нет файла, 0:30 cat some of the concurrency to Fort Worth, 0:35 ошибка сервера.">
  <text x="12" y="18" class="f-label f-muted">С 0:20 по 0:40 доклада</text>
  <text x="12" y="44" class="f-label f-ink">расшифровка, 2019</text>
  <text x="24" y="62" class="f-mono f-ink">So tonight's talk is going to be sort of a general overview of</text>
  <text x="24" y="80" class="f-mono f-ink">Clojure, and a specific look at some of the concurrency support</text>
  <text x="24" y="98" class="f-mono f-ink">that is built into the language.</text>
  <text x="12" y="126" class="f-label f-accent">моя реплика, 2013</text>
  <text x="24" y="144" class="f-mono f-ink">So, tonight, talks is gone a be so a general overview of</text>
  <text x="24" y="162" class="f-mono f-ink">clojure and specific look at some of the concurrency support</text>
  <text x="24" y="180" class="f-mono f-ink">that sponsored to a language.</text>
  <text x="12" y="208" class="f-label f-accent">Google, 2013</text>
  <text x="24" y="226" class="f-mono f-ink">0:20  programs in the way of soda</text>
  <text x="24" y="244" class="f-mono f-ink">0:25  [нет файла]</text>
  <text x="24" y="262" class="f-mono f-ink">0:30  cat some of the concurrency to Fort Worth</text>
  <text x="24" y="280" class="f-mono f-ink">0:35  [ошибка сервера]</text>
</svg>
<figcaption>Середина фразы приходится на кусок 0:25, у которого нет файла.</figcaption>
</figure>

## Локальный путь, доступный до Whisper

Для Whisper мне нужен эталон, который совпадает с речью слово в слово, а расшифровка Хикки отредактирована. Копии видео, на которую ссылается мой README, тоже больше нет. Она лежала на rhcloud.com, а этот хостинг закрылся в 2017 году. Поэтому сравнение идёт на тестовой части `TED-LIUM 3`, где расшифровки почти дословно совпадают с речью. В ней 11 докладов, один длится 6 секунд и я его выбросил, так что остаётся 10 докладов и 148 минут.

Для локального пути я собрал то, что было доступно до сентября. Это ffmpeg, затем Vosk 0.3.43 с моделью `en-us-0.22-lgraph` (128 МБ), затем `vosk-recasepunc-en-0.22` для заглавных букв и пунктуации. После этого идёт мой собственный нарезчик реплик. Он начинает новую реплику на паузе в 0,5 секунды или на конце предложения. Ещё он режет, когда текст превысил бы 84 знака (2 строки по 42) или 7 секунд. Склейка занимает около 70 строк на Python.

На всех 10 докладах этот путь ошибается в 8,02% слов. Авторы Vosk публикуют для этой модели на `TED-LIUM` 8,20% со своей нормализацией. Всему пути нужно 17,9 секунды на минуту звука на 1 ядре, пунктуация из них занимает 0,5 секунды. С карманной моделью `small-en-us-0.15` (40 МБ) хватает 4,5 секунды, но ошибок 10,27%. Реплики читаются, но мой нарезчик режет по длине. Первая реплика доклада Гэри Флейка обрывается посреди фразы: "If I can leave you with one big idea today, it's that the whole of the data in which".

## Whisper на 4 ядрах

Я взял Whisper на коммите от 9 октября с PyTorch 1.12.1. Он работал на виртуальной машине с 4 ядрами AMD EPYC 7713 без GPU. Настройки были fp32 и командная строка по умолчанию, то есть лучевой поиск шириной 5. Здесь он медленный. На докладе Гэри Флейка tiny.en тратит 83 секунды на минуту звука, а base.en 211. Доклад на 20 минут у base.en занимает больше часа. Поэтому tiny.en и base.en шли только на 3 самых коротких докладах, вместе 19 минут. small.en шёл только на докладе Гэри Флейка и на другой сборке PyTorch. tiny.en и base.en на обеих сборках записали байт в байт одинаковые файлы, поэтому того же я жду и от small.en.

<figure class="fig">
<svg viewBox="0 0 640 276" role="img" aria-label="Доля неверных слов горизонтальными полосами, для одного доклада ещё машинное время в секундах на минуту звука. 3 самых коротких доклада TED, 19 минут. Vosk small-en-us-0.15: неверных 9,24%. Vosk en-us-0.22-lgraph: неверных 7,84%. Vosk lgraph, куски по 5 с: неверных 12,20%. Whisper tiny.en: неверных 3,91%. Whisper base.en: неверных 3,27%. Только доклад Гэри Флейка, 6 минут. Vosk en-us-0.22-lgraph: неверных 8,00%, 19 с на минуту, 1 ядро. Whisper tiny.en: неверных 3,96%, 83 с на минуту, 4 ядра. Whisper base.en: неверных 2,99%, 211 с на минуту, 4 ядра. Whisper small.en: неверных 2,99%, 822 с на минуту, 4 ядра.">
  <text x="12" y="18" class="f-label f-muted">Неверные слова, %. Для доклада Гэри Флейка ещё машинное время, с на минуту звука</text>
  <text x="12" y="42" class="f-label f-ink">3 самых коротких доклада TED, 19 минут</text>
  <text x="12" y="71" class="f-label f-ink">Vosk small-en-us-0.15</text>
  <rect x="230" y="62" width="165.0" height="11" class="f-muted"/>
  <text x="401" y="72" class="f-label f-ink">9,24%</text>
  <text x="12" y="91" class="f-label f-ink">Vosk en-us-0.22-lgraph</text>
  <rect x="230" y="82" width="140.0" height="11" class="f-muted"/>
  <text x="376" y="92" class="f-label f-ink">7,84%</text>
  <text x="12" y="111" class="f-label f-ink">Vosk lgraph, куски по 5 с</text>
  <rect x="230" y="102" width="217.9" height="11" class="f-muted"/>
  <text x="453.85714285714283" y="112" class="f-label f-ink">12,20%</text>
  <text x="12" y="131" class="f-label f-ink">Whisper tiny.en</text>
  <rect x="230" y="122" width="69.8" height="11" class="f-accent"/>
  <text x="305.82142857142856" y="132" class="f-label f-ink">3,91%</text>
  <text x="12" y="151" class="f-label f-ink">Whisper base.en</text>
  <rect x="230" y="142" width="58.4" height="11" class="f-accent"/>
  <text x="294.3928571428571" y="152" class="f-label f-ink">3,27%</text>
  <text x="12" y="172" class="f-label f-ink">Только доклад Гэри Флейка, 6 минут</text>
  <text x="12" y="201" class="f-label f-ink">Vosk en-us-0.22-lgraph</text>
  <rect x="230" y="192" width="142.9" height="11" class="f-muted"/>
  <text x="378.8571428571429" y="202" class="f-label f-ink">8,00%</text>
  <text x="560" y="202" class="f-label f-muted" text-anchor="end">19 с/мин</text>
  <text x="628" y="202" class="f-label f-muted" text-anchor="end">1 ядро</text>
  <text x="12" y="221" class="f-label f-ink">Whisper tiny.en</text>
  <rect x="230" y="212" width="70.7" height="11" class="f-accent"/>
  <text x="306.7142857142857" y="222" class="f-label f-ink">3,96%</text>
  <text x="560" y="222" class="f-label f-muted" text-anchor="end">83 с/мин</text>
  <text x="628" y="222" class="f-label f-muted" text-anchor="end">4 ядра</text>
  <text x="12" y="241" class="f-label f-ink">Whisper base.en</text>
  <rect x="230" y="232" width="53.4" height="11" class="f-accent"/>
  <text x="289.39285714285717" y="242" class="f-label f-ink">2,99%</text>
  <text x="560" y="242" class="f-label f-muted" text-anchor="end">211 с/мин</text>
  <text x="628" y="242" class="f-label f-muted" text-anchor="end">4 ядра</text>
  <text x="12" y="261" class="f-label f-ink">Whisper small.en</text>
  <rect x="230" y="252" width="53.4" height="11" class="f-accent"/>
  <text x="289.39285714285717" y="262" class="f-label f-ink">2,99%</text>
  <text x="560" y="262" class="f-label f-muted" text-anchor="end">822 с/мин</text>
  <text x="628" y="262" class="f-label f-muted" text-anchor="end">4 ядра</text>
</svg>
<figcaption>Whisper ошибается более чем вдвое реже, чем Vosk. На докладе Гэри Флейка ему нужно от 4 до 44 раз больше времени, чем Vosk, на 4 ядрах против одного.</figcaption>
</figure>

Перед прогоном я записал, что tiny.en будет примерно на уровне Vosk. Это не так. На 3 докладах Vosk ошибается в 7,84% слов, а tiny.en в 3,91%. base.en ошибается в 3,27%. Для того, кто правит текст, это около 78 исправлений на 1000 слов после Vosk и около 33 после base.en. small.en на докладе Гэри Флейка ошибается в 2,99% слов, ровно столько же, сколько base.en на том же докладе. При этом он тратит 822 секунды на минуту звука.

Ещё я ждал, что сегменты Whisper будут слишком длинными для субтитров, потому что он работает окнами по 30 секунд. Это тоже не подтвердилось. Самый длинный сегмент base.en занимает 65 знаков и ни один не длиннее 84. Примерно половина длиннее 42 знаков и им нужен перенос строки. Whisper его не ставит, но и мой нарезчик его не ставит.

Последним прогоном была моя схема 2013 года на более новом распознавателе. Я дал Vosk те же 10 докладов кусками по 5 секунд и закрывал высказывание на каждой границе. Он ошибся в 12,49% слов против 8,02% на целых файлах. Значит, даже без пропавших кусков нарезка каждые 5 секунд стоит 4,5 пункта. На 3 коротких докладах это 12,20% против 7,84%.

Для одного доклада я бы взял Whisper и подождал. Для доклада Хикки, 153 минуты, base.en понадобилось бы около 9 часов на этих 4 ядрах.

## Что я не проверял

- Время реплик. Я не сравнивал, где начинается реплика и где начинается фраза, хотя в 2013 году ради этого сделал отдельную кнопку.
- GPU. На GPU скорость другая и я её не мерил.
- medium и large, на них здесь не хватило бы времени.
- Докладчиков с акцентом. Докладчики TED в основном говорят на чистом английском.
- Были ли тестовые доклады в обучающих данных Whisper. Доклады TED с расшифровками лежат по всему интернету, так что исключить это я не могу.
- Whisper на самом Хикки.
