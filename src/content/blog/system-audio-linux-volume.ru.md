---
title: "В Linux записать динамики можно бесплатно, пока не тронешь громкость"
description: "В README earshot написано, что системный звук на Linux работает сразу, а у macOS API для записи нет вообще. Про macOS это неверно начиная с macOS 13, а виртуальное устройство на Windows и macOS нужно из-за ffmpeg. На Linux monitor на 100% отдаёт звук бит в бит, но на PulseAudio до него доходят ползунок выхода и mute, а на PipeWire ползунок приложения. С ползунком выхода PulseAudio на 60% earshot не нарезает из 10 произнесённых фраз ни одного фрагмента."
date: 2026-10-19
lang: ru
translationKey: system-audio-linux-volume
tags: ["linux", "debugging"]
---
earshot, мой локальный транскрибатор, стал публичным в августе. В его README есть таблица про запись звука, её писал я. Микрофон работает на всех 3 системах. Про системный звук, то есть про то, что играют динамики, в таблице написано "works out of the box" для Linux. Windows нужен Stereo Mix или VB-CABLE, а для "macOS 12 and later" нужен BlackHole. Под таблицей я написал, что macOS вообще не даёт обычному процессу API для записи системного звука.

Эту строку я написал по памяти. Память из тех лет, когда все ставили Soundflower, чтобы записать звук на Маке. Правда ли это до сих пор, я не проверял. Строку про Linux я тоже не ставил под сомнение, потому что на моей машине всё просто работало. В октябре я прошёлся по обеим строкам.

## Что на самом деле дают операционные системы

Машины с Windows или с Маком для этого у меня нет, так что эта часть по документации и исходникам.

В Windows запись с выхода есть в WASAPI со времён Vista. Открываешь поток записи на устройстве воспроизведения с флагом `AUDCLNT_STREAMFLAGS_LOOPBACK`. Ещё есть process loopback, он записывает звук одного приложения и его дочерних процессов. Минимальной версией Microsoft указывает Windows 10 сборки 20348. Ни один клиентский выпуск Windows 10 до этой сборки не дошёл, это сборка Windows Server 2022, так что на деле речь о Windows 11 или этом сервере. В macOS звук появился в ScreenCaptureKit с macOS 13. С macOS 14.2 в Core Audio есть ещё `AudioHardwareCreateProcessTap`, отвод с выхода одного процесса или всех сразу. Так что моя фраза про macOS неверна для всех версий начиная с 13.

Виртуальное устройство earshot всё равно нужно из-за ffmpeg. Сам earshot никакое аудиоустройство не открывает, он запускает ffmpeg, читает из его stdout PCM 16 кГц моно и оставляет платформу на ffmpeg. 11 октября я посмотрел список `libavdevice` в ветке master у ffmpeg. Для звука в Windows там есть `dshow`, а входа WASAPI нет. На macOS во входе `avfoundation` нет кода ScreenCaptureKit, поэтому из источников звука он видит только устройства записи.

<figure class="fig">
<svg viewBox="0 0 640 218" role="img" aria-label="Таблица. Linux: PulseAudio и PipeWire дают источник monitor, ffmpeg читает его через -f pulse, earshot ничего больше не нужно. Windows: WASAPI loopback со времён Vista и захват отдельного процесса с Windows 10 сборки 20348, но у ffmpeg есть только dshow и нет входа WASAPI, поэтому earshot нужен Stereo Mix или VB-CABLE. macOS: звук в ScreenCaptureKit с macOS 13 и process tap с 14.2, но вход avfoundation в ffmpeg видит только устройства записи, поэтому earshot нужен BlackHole.">
  <text x="10" y="16" class="f-label f-muted">запись того, что играют динамики, октябрь 2026</text>
  <text x="110" y="48" class="f-label f-muted">что даёт ОС, с какой версии</text>
  <text x="322" y="48" class="f-label f-muted">что читает ffmpeg</text>
  <text x="500" y="48" class="f-label f-muted">что нужно earshot</text>
  <line x1="10" y1="60" x2="630" y2="60" class="f-plain"/>
  <text x="10" y="89" class="f-mono f-ink">Linux</text>
  <text x="110" y="81" class="f-mono f-ink">источник monitor</text>
  <text x="110" y="97" class="f-label f-muted">PulseAudio, PipeWire</text>
  <text x="322" y="81" class="f-mono f-ink">-f pulse</text>
  <text x="322" y="97" class="f-label f-muted">читает monitor</text>
  <text x="500" y="89" class="f-mono f-ink">ничего</text>
  <line x1="10" y1="110" x2="630" y2="110" class="f-plain"/>
  <text x="10" y="139" class="f-mono f-ink">Windows</text>
  <text x="110" y="131" class="f-mono f-ink">WASAPI loopback, Vista</text>
  <text x="110" y="147" class="f-label f-muted">process loopback, 20348</text>
  <text x="322" y="131" class="f-mono f-ink">-f dshow</text>
  <text x="322" y="147" class="f-label f-muted">входа WASAPI нет</text>
  <rect x="494" y="116" width="136" height="38" rx="3" class="f-box"/>
  <text x="500" y="131" class="f-mono f-ink">Stereo Mix</text>
  <text x="500" y="147" class="f-label f-muted">или VB-CABLE</text>
  <line x1="10" y1="160" x2="630" y2="160" class="f-plain"/>
  <text x="10" y="189" class="f-mono f-ink">macOS</text>
  <text x="110" y="181" class="f-mono f-ink">ScreenCaptureKit, 13</text>
  <text x="110" y="197" class="f-label f-muted">process tap, 14.2</text>
  <text x="322" y="181" class="f-mono f-ink">-f avfoundation</text>
  <text x="322" y="197" class="f-label f-muted">только устройства записи</text>
  <rect x="494" y="166" width="136" height="38" rx="3" class="f-box"/>
  <text x="500" y="189" class="f-mono f-ink">BlackHole</text>
  <line x1="10" y1="210" x2="630" y2="210" class="f-plain"/>
</svg>
<figcaption>Столбцы про ОС по документации Microsoft и Apple, столбец ffmpeg по libavdevice в ветке master на 11 октября 2026. Прогнана только строка Linux.</figcaption>
</figure>

## Linux, с замером

Строку про Linux я мог померить. Нода, на которой я работаю, это сервер без звуковой карты. Поэтому я распаковал PulseAudio 16.1 и PipeWire 1.0.5 с WirePlumber 0.4.17 из пакетов Ubuntu 24.04 в локальную папку и создал виртуальные выходы. Оба сервера я гонял одними и теми же `pacat` и `pactl`, так что клиентская сторона одинаковая. Тестовый звук это 3 секунды шума с фиксированным зерном плюс тон 1 кГц, 48 кГц стерео. Каждую запись я выравниваю по оригиналу и сравниваю отсчёт за отсчётом.

На громкости 100% monitor отдаёт звук бит в бит. Это 144 000 кадров из 144 000, на обоих серверах и в каждом прогоне окончательного стенда.

Потом я подвинул ползунок на PulseAudio. На выходе с громкостью 50% запись равна оригиналу, умноженному на 0,125, с точностью до округления последнего бита. Это 0,5 в кубе, кривая громкости PulseAudio. Выключенный звук на выходе даёт чистые нули. Громкость одного приложения на 50% во время воспроизведения тоже даёт 0,125. Значит, на PulseAudio monitor читает звук после всех этих регуляторов.

И сервер это запоминает. После того как я убавил одно приложение, его следующий поток снова начался с 0,125. Сервер хранит эту громкость на диске по роли потока, а если роли нет, то по идентификатору или имени приложения. Для earshot это значит, что старая настройка приложения действует и на его следующий созвон.

Я чуть не написал, что PipeWire ведёт себя так же. На моих первых выходах так и было. Потом проверка по исходникам показала причину. Эти выходы я создавал через слой совместимости PipeWire с PulseAudio. Этот слой включает им `monitor.channel-volumes`. У самого PipeWire по умолчанию эта настройка выключена. WirePlumber 0.4.17 оставляет её выключенной для настоящих звуковых карт. Тогда я сделал ещё один выход прямо в PipeWire, с настройкой по умолчанию. На нём выход на 50% дал запись бит в бит, выключенный звук тоже. Громкость приложения по-прежнему давала 0,125 и по-прежнему запоминалась.

<figure class="fig">
<svg viewBox="0 0 640 222" role="img" aria-label="Цепочка: приложение, громкость приложения, микшер, громкость выхода и mute, динамики. Monitor PulseAudio ответвляется после громкости выхода и mute: выход на 50% даёт 0,125 от исходного, mute даёт нули. Monitor PipeWire с настройкой по умолчанию ответвляется до них: громкость выхода и mute запись не меняют. Громкость приложения 50% даёт 0,125 на обоих, и следующий поток того же приложения снова начинается с 0,125.">
  <text x="10" y="16" class="f-label f-muted">откуда читает monitor, PulseAudio 16.1 и PipeWire 1.0.5</text>
  <rect x="10" y="30" width="100" height="34" rx="3" class="f-plain"/>
  <text x="60" y="51" text-anchor="middle" class="f-label f-ink">приложение</text>
  <line x1="111" y1="47" x2="122" y2="47" class="f-line"/>
  <path d="M124 47 l-5 -3 v6 z" class="f-muted"/>
  <rect x="125" y="30" width="108" height="34" rx="3" class="f-box"/>
  <text x="179" y="51" text-anchor="middle" class="f-label f-ink">громкость прил.</text>
  <line x1="234" y1="47" x2="245" y2="47" class="f-line"/>
  <path d="M247 47 l-5 -3 v6 z" class="f-muted"/>
  <rect x="248" y="30" width="84" height="34" rx="3" class="f-plain"/>
  <text x="290" y="51" text-anchor="middle" class="f-label f-ink">микшер</text>
  <line x1="333" y1="47" x2="344" y2="47" class="f-line"/>
  <path d="M346 47 l-5 -3 v6 z" class="f-muted"/>
  <rect x="347" y="30" width="150" height="34" rx="3" class="f-box"/>
  <text x="422" y="51" text-anchor="middle" class="f-label f-ink">громкость, mute</text>
  <line x1="498" y1="47" x2="509" y2="47" class="f-line"/>
  <path d="M511 47 l-5 -3 v6 z" class="f-muted"/>
  <rect x="512" y="30" width="100" height="34" rx="3" class="f-plain"/>
  <text x="562" y="51" text-anchor="middle" class="f-label f-ink">динамики</text>
  <text x="179" y="80" text-anchor="middle" class="f-label f-muted">приложение на 50%: ×0,125 на обоих</text>
  <text x="179" y="94" text-anchor="middle" class="f-label f-muted">запоминается для нового потока</text>
  <line x1="339.5" y1="47" x2="339.5" y2="165" class="f-line" style="stroke:var(--accent)" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M339.5 167 l-4 -7 h8 z" style="fill:var(--accent)"/>
  <rect x="214.5" y="168" width="250" height="44" rx="3" class="f-box"/>
  <text x="339.5" y="186" text-anchor="middle" class="f-mono f-ink">monitor PipeWire, по умолч.</text>
  <text x="339.5" y="202" text-anchor="middle" class="f-label f-muted">выход и mute: не влияют</text>
  <line x1="504.5" y1="47" x2="504.5" y2="103" class="f-line" style="stroke:var(--accent)" stroke-width="2"/>
  <path d="M504.5 105 l-4 -7 h8 z" style="fill:var(--accent)"/>
  <rect x="379.5" y="106" width="250" height="44" rx="3" class="f-box"/>
  <text x="504.5" y="124" text-anchor="middle" class="f-mono f-ink">monitor PulseAudio</text>
  <text x="504.5" y="140" text-anchor="middle" class="f-label f-muted">выход 50%: ×0,125, mute: нули</text>
</svg>
<figcaption>По 3 прогона на каждом выходе. На 100% любая запись совпадает бит в бит. У выхода PipeWire настройка monitor по умолчанию, та, что WirePlumber 0.4.17 оставляет настоящим звуковым картам.</figcaption>
</figure>

Переключение выхода на обоих работает нормально. Я начал запись с `@DEFAULT_MONITOR@`, переключил выход по умолчанию на другой и играл туда. Оба сервера перевели запись на новый monitor. Запись снова совпала бит в бит.

## Где начинает болеть

earshot отправляет в модель не любой звук. Он режет поток на кадры по 20 мс. Кадр считается речью, если его RMS не меньше 600 по шкале 16 бит. Фрагмент остаётся, только если в нём набралось хотя бы 300 мс таких кадров. Эти значения по умолчанию выбирал я сам и ни разу не думал о них вместе с ползунком громкости.

Поэтому я проиграл запись речи на разной громкости. Записывал ffmpeg 6.1.1 с теми же аргументами, которые earshot собирает на Linux, только в файл, а не в stdout. Потом отдал результат сегментеру earshot на коммите `15da817` с настройками по умолчанию. Запись это 10 гарвардских фраз из Open Speech Repository, для воспроизведения я перевёл её в стерео. На 100% пик около -12 dBFS, а у самого громкого кадра в 20 мс RMS от 3500 до 3650, в зависимости от прогона.

<figure class="fig">
<svg viewBox="0 0 640 162" role="img" aria-label="PulseAudio, ползунок выхода: 100% 10, 90% 10, 80% 10, 70% 8, 60% 0, 50% 0, 40% 0, 30% 0. PipeWire, ползунок выхода: 100% 10, 90% 10, 80% 10, 70% 10, 60% 10, 50% 10, 40% 10, 30% 10. PipeWire, ползунок прил.: 100% 10, 90% 10, 80% 10, 70% 9, 60% 0, 50% 0, 40% 0, 30% 0.">
  <text x="10" y="16" class="f-label f-muted">сколько фрагментов earshot нарезал из 10 фраз</text>
  <text x="226.9" y="42" text-anchor="middle" class="f-label f-muted">100%</text>
  <text x="280.6" y="42" text-anchor="middle" class="f-label f-muted">90%</text>
  <text x="334.4" y="42" text-anchor="middle" class="f-label f-muted">80%</text>
  <text x="388.1" y="42" text-anchor="middle" class="f-label f-muted">70%</text>
  <text x="441.9" y="42" text-anchor="middle" class="f-label f-muted">60%</text>
  <text x="495.6" y="42" text-anchor="middle" class="f-label f-muted">50%</text>
  <text x="549.4" y="42" text-anchor="middle" class="f-label f-muted">40%</text>
  <text x="603.1" y="42" text-anchor="middle" class="f-label f-muted">30%</text>
  <text x="190" y="73" text-anchor="end" class="f-label f-ink">PulseAudio, ползунок выхода</text>
  <rect x="203.0" y="55" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="226.9" y="74" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="256.8" y="55" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="280.6" y="74" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="310.5" y="55" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="334.4" y="74" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="364.3" y="55" width="47.8" height="28" rx="3" class="f-box" opacity="0.55"/>
  <text x="388.1" y="74" text-anchor="middle" class="f-mono f-ink">8</text>
  <rect x="418.0" y="55" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="441.9" y="74" text-anchor="middle" class="f-mono f-muted">0</text>
  <rect x="471.8" y="55" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="495.6" y="74" text-anchor="middle" class="f-mono f-muted">0</text>
  <rect x="525.5" y="55" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="549.4" y="74" text-anchor="middle" class="f-mono f-muted">0</text>
  <rect x="579.3" y="55" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="603.1" y="74" text-anchor="middle" class="f-mono f-muted">0</text>
  <text x="190" y="107" text-anchor="end" class="f-label f-ink">PipeWire, ползунок выхода</text>
  <rect x="203.0" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="226.9" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="256.8" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="280.6" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="310.5" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="334.4" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="364.3" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="388.1" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="418.0" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="441.9" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="471.8" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="495.6" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="525.5" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="549.4" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="579.3" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="603.1" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <text x="190" y="141" text-anchor="end" class="f-label f-ink">PipeWire, ползунок прил.</text>
  <rect x="203.0" y="123" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="226.9" y="142" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="256.8" y="123" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="280.6" y="142" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="310.5" y="123" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="334.4" y="142" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="364.3" y="123" width="47.8" height="28" rx="3" class="f-box" opacity="0.55"/>
  <text x="388.1" y="142" text-anchor="middle" class="f-mono f-ink">9</text>
  <rect x="418.0" y="123" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="441.9" y="142" text-anchor="middle" class="f-mono f-muted">0</text>
  <rect x="471.8" y="123" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="495.6" y="142" text-anchor="middle" class="f-mono f-muted">0</text>
  <rect x="525.5" y="123" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="549.4" y="142" text-anchor="middle" class="f-mono f-muted">0</text>
  <rect x="579.3" y="123" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="603.1" y="142" text-anchor="middle" class="f-mono f-muted">0</text>
</svg>
<figcaption>10 гарвардских фраз из Open Speech Repository, записанных с monitor с аргументами ffmpeg из earshot и разрезанных его сегментером с настройками по умолчанию: речь это RMS от 600, фрагменту нужно 300 мс такой речи.</figcaption>
</figure>

На PulseAudio с ползунком выхода earshot нарезает из 10 фраз 10 фрагментов до 80% включительно. На 70% нарезает 8. С 60% и ниже ни одного. На 60% самые громкие кадры всё ещё проходят порог 600, ведь 3650 на 0,216 это около 790, но таких кадров во всей записи всего 18. Ни один фрагмент не набирает из них 300 мс. На PipeWire ползунок выхода ничего не меняет. earshot нарезает все 10 фрагментов даже на 30%. Ползунок приложения возвращает там тот же обрыв: 9 фрагментов на 70%, ни одного с 60% и ниже. Разницу 8 против 9 на 70% я списываю на округление и границы кадров и дальше не проверял. Ни в одном из этих прогонов ничего не падает, ffmpeg и сегментер продолжают работать, а расшифровка остаётся пустой.

Меня какое-то время обманывал и собственный стенд. В первых прогонах запись начиналась за 1 секунду до воспроизведения и останавливалась через 1 секунду после. Некоторые записи теряли до секунды в начале или кусок в конце. С запасом в 3 секунды с каждой стороны это больше не повторялось. Концы терялись потому, что `pipewire-pulse` отдаёт записи данные крупными кусками. Почему пропадало начало, я не знаю и не копал.

## Что меняется для earshot

В README строка про Linux не должна говорить только "works out of the box". Работает, но что именно пишется, зависит от громкости. На PulseAudio ползунок выхода и выключение звука решают, услышит ли earshot речь вообще. На PipeWire это решает только громкость приложения. В обоих случаях пустая расшифровка приходит без всякой ошибки. Строка про macOS просто неверна. Её надо убрать из README и из `docs/audio-capture.md` тоже.

Для Windows и macOS честное решение это собственный путь записи рядом с ffmpeg. То есть WASAPI loopback с одной стороны и process tap с другой. Это больше кода, чем есть в earshot сейчас. Я его не написал.

## Что я не проверял

Ничего из этого не запускалось ни на Windows, ни на macOS. Я не знаю, видит ли WASAPI loopback или process tap звук до системной громкости или после.

Все выходы были виртуальными. PulseAudio может применять часть громкости в железе звуковой карты. По исходникам эта часть идёт после monitor, а выключение звука всегда делается программно. Значит, на ноутбуке с PulseAudio обрыв может оказаться ниже по ползунку, а выключенный звук всё равно должен давать тишину. Это я прочитал в коде, запустить не мог. Мой выход в PipeWire только повторяет настройку по умолчанию для настоящей карты. Настоящей картой он от этого не становится.

Сам обрыв относится только к этой записи. Более тихий созвон сдвигает его вверх по ползунку, более громкий вниз. Порог 600 к тому же меняется флагом `--threshold`.
