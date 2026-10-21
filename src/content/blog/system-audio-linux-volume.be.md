---
title: "У Linux запісаць дынамікі можна бясплатна, пакуль не кранеш гучнасць"
description: "У README earshot напісана, што сістэмны гук на Linux працуе адразу, а ў macOS API для запісу няма ўвогуле. Пра macOS гэта няправільна пачынаючы з macOS 13, а віртуальная прылада на Windows і macOS патрэбна праз ffmpeg. На Linux monitor на 100% вяртае гук біт у біт, але на PulseAudio да яго даходзяць паўзунок выхаду і mute, а на PipeWire паўзунок праграмы. З паўзунком выхаду PulseAudio на 60% earshot не нарэзвае з 10 вымаўленых фраз ніводнага фрагмента."
date: 2026-10-19
lang: be
translationKey: system-audio-linux-volume
tags: ["linux", "debugging"]
---
earshot, мой лакальны транскрыбатар, стаў публічным у жніўні. У яго README ёсць табліца пра запіс гуку, яе пісаў я. Мікрафон працуе на ўсіх 3 сістэмах. Пра сістэмны гук, гэта значыць пра тое, што граюць дынамікі, у табліцы напісана "works out of the box" для Linux. Для Windows патрэбны Stereo Mix або VB-CABLE, а для "macOS 12 and later" патрэбны BlackHole. Пад табліцай я напісаў, што macOS увогуле не дае звычайнаму працэсу API для запісу сістэмнага гуку.

Гэты радок я напісаў па памяці. Памяць з тых гадоў, калі ўсе ставілі Soundflower, каб запісаць гук на Маку. Ці праўда гэта дагэтуль, я не правяраў. Радок пра Linux я таксама не ставіў пад сумнеў, бо на маёй машыне ўсё проста працавала. У кастрычніку я прайшоўся па абодвух радках.

## Што насамрэч даюць аперацыйныя сістэмы

Машыны з Windows або з Макам для гэтага ў мяне няма, таму гэтая частка паводле дакументацыі і зыходнікаў.

У Windows запіс з выхаду ёсць у WASAPI з часоў Vista. Адкрываеш паток запісу на прыладзе прайгравання са сцягам `AUDCLNT_STREAMFLAGS_LOOPBACK`. Яшчэ ёсць process loopback, ён запісвае гук адной праграмы і яе даччыных працэсаў. Мінімальнай версіяй Microsoft называе Windows 10 зборкі 20348. Ніводзін кліенцкі выпуск Windows 10 да гэтай зборкі не дайшоў, гэта зборка Windows Server 2022, так што на справе гаворка пра Windows 11 або гэты сервер. У macOS гук з'явіўся ў ScreenCaptureKit з macOS 13. З macOS 14.2 у Core Audio ёсць яшчэ `AudioHardwareCreateProcessTap`, адвод з выхаду аднаго працэсу або ўсіх адразу. Так што мая фраза пра macOS няправільная для ўсіх версій пачынаючы з 13.

earshot усё роўна патрэбна віртуальная прылада з-за ffmpeg. Сам earshot ніякую аўдыяпрыладу не адкрывае, ён запускае ffmpeg, чытае з яго stdout PCM 16 кГц мона і пакідае платформу на ffmpeg. 11 кастрычніка я паглядзеў спіс `libavdevice` у галіне master у ffmpeg. Для гуку ў Windows там ёсць `dshow`, а ўваходу WASAPI няма. На macOS ва ўваходзе `avfoundation` няма кода ScreenCaptureKit, таму з крыніц гуку ён бачыць толькі прылады запісу.

<figure class="fig">
<svg viewBox="0 0 640 218" role="img" aria-label="Табліца. Linux: PulseAudio і PipeWire даюць крыніцу monitor, ffmpeg чытае яе праз -f pulse, earshot больш нічога не трэба. Windows: WASAPI loopback з часоў Vista і запіс асобнага працэсу з Windows 10 зборкі 20348, але ў ffmpeg ёсць толькі dshow і няма ўваходу WASAPI, таму earshot патрэбны Stereo Mix або VB-CABLE. macOS: гук у ScreenCaptureKit з macOS 13 і process tap з 14.2, але ўваход avfoundation у ffmpeg бачыць толькі прылады запісу, таму earshot патрэбны BlackHole.">
  <text x="10" y="16" class="f-label f-muted">запіс таго, што граюць дынамікі, кастрычнік 2026</text>
  <text x="110" y="48" class="f-label f-muted">што дае АС, з якой версіі</text>
  <text x="322" y="48" class="f-label f-muted">што чытае ffmpeg</text>
  <text x="500" y="48" class="f-label f-muted">што трэба earshot</text>
  <line x1="10" y1="60" x2="630" y2="60" class="f-plain"/>
  <text x="10" y="89" class="f-mono f-ink">Linux</text>
  <text x="110" y="81" class="f-mono f-ink">крыніца monitor</text>
  <text x="110" y="97" class="f-label f-muted">PulseAudio, PipeWire</text>
  <text x="322" y="81" class="f-mono f-ink">-f pulse</text>
  <text x="322" y="97" class="f-label f-muted">чытае monitor</text>
  <text x="500" y="89" class="f-mono f-ink">нічога</text>
  <line x1="10" y1="110" x2="630" y2="110" class="f-plain"/>
  <text x="10" y="139" class="f-mono f-ink">Windows</text>
  <text x="110" y="131" class="f-mono f-ink">WASAPI loopback, Vista</text>
  <text x="110" y="147" class="f-label f-muted">process loopback, 20348</text>
  <text x="322" y="131" class="f-mono f-ink">-f dshow</text>
  <text x="322" y="147" class="f-label f-muted">уваходу WASAPI няма</text>
  <rect x="494" y="116" width="136" height="38" rx="3" class="f-box"/>
  <text x="500" y="131" class="f-mono f-ink">Stereo Mix</text>
  <text x="500" y="147" class="f-label f-muted">або VB-CABLE</text>
  <line x1="10" y1="160" x2="630" y2="160" class="f-plain"/>
  <text x="10" y="189" class="f-mono f-ink">macOS</text>
  <text x="110" y="181" class="f-mono f-ink">ScreenCaptureKit, 13</text>
  <text x="110" y="197" class="f-label f-muted">process tap, 14.2</text>
  <text x="322" y="181" class="f-mono f-ink">-f avfoundation</text>
  <text x="322" y="197" class="f-label f-muted">толькі прылады запісу</text>
  <rect x="494" y="166" width="136" height="38" rx="3" class="f-box"/>
  <text x="500" y="189" class="f-mono f-ink">BlackHole</text>
  <line x1="10" y1="210" x2="630" y2="210" class="f-plain"/>
</svg>
<figcaption>Слупкі пра АС паводле дакументацыі Microsoft і Apple, слупок ffmpeg паводле libavdevice у галіне master на 11 кастрычніка 2026. Прагнаны толькі радок Linux.</figcaption>
</figure>

## Linux, з замерам

Радок пра Linux я мог памераць. Нода, на якой я працую, гэта сервер без гукавой карты. Таму я распакаваў PulseAudio 16.1 і PipeWire 1.0.5 з WirePlumber 0.4.17 з пакетаў Ubuntu 24.04 у лакальную папку і стварыў віртуальныя выхады. Абодва серверы я ганяў адными і тымі ж `pacat` і `pactl`, так што кліенцкі бок аднолькавы. Тэставы гук гэта 3 секунды шуму з фіксаваным зернем плюс тон 1 кГц, 48 кГц стэрэа. Кожны запіс я выраўноўваю па арыгінале і параўноўваю адлік за адлікам.

Пры гучнасці 100% monitor вяртае гук біт у біт. Гэта 144 000 кадраў са 144 000, на абодвух серверах і ў кожным прагоне канчатковага стэнда.

Потым я пасунуў паўзунок на PulseAudio. На выхадзе з гучнасцю 50% запіс роўны арыгіналу, памножанаму на 0,125, з дакладнасцю да акруглення апошняга біта. Гэта 0,5 у кубе, крывая гучнасці PulseAudio. Выключаны гук на выхадзе дае чыстыя нулі. Гучнасць адной праграмы на 50% падчас прайгравання таксама дае 0,125. Значыць, на PulseAudio monitor чытае гук пасля ўсіх гэтых рэгулятараў.

І сервер гэта запамінае. Пасля таго як я сцішыў адну праграму, яе наступны паток зноў пачаўся з 0,125. Сервер захоўвае гэтую гучнасць на дыску па ролі патоку, а калі ролі няма, то па ідэнтыфікатары або назве праграмы. Для earshot гэта значыць, што старая налада праграмы дзейнічае і на яе наступны званок.

Я ледзь не напісаў, што PipeWire паводзіць сябе гэтак жа. На маіх першых выхадах так і было. Потым праверка па зыходніках паказала прычыну. Гэтыя выхады я ствараў праз слой сумяшчальнасці PipeWire з PulseAudio. Гэты слой уключае ім `monitor.channel-volumes`. У самога PipeWire па змаўчанні гэтая налада выключаная. WirePlumber 0.4.17 пакідае яе выключанай для сапраўдных гукавых карт. Тады я зрабіў яшчэ адзін выхад наўпрост у PipeWire, з наладай па змаўчанні. На ім выхад на 50% даў запіс біт у біт, выключаны гук таксама. Гучнасць праграмы па-ранейшаму давала 0,125 і па-ранейшаму запаміналася.

<figure class="fig">
<svg viewBox="0 0 640 222" role="img" aria-label="Ланцужок: праграма, гучнасць праграмы, мікшар, гучнасць выхаду і mute, дынамікі. Monitor PulseAudio адгаліноўваецца пасля гучнасці выхаду і mute: выхад на 50% дае 0,125 ад зыходнага, mute дае нулі. Monitor PipeWire з наладай па змаўчанні адгаліноўваецца да іх: гучнасць выхаду і mute запіс не мяняюць. Гучнасць праграмы 50% дае 0,125 на абодвух, і наступны паток той жа праграмы зноў пачынаецца з 0,125.">
  <text x="10" y="16" class="f-label f-muted">адкуль чытае monitor, PulseAudio 16.1 і PipeWire 1.0.5</text>
  <rect x="10" y="30" width="100" height="34" rx="3" class="f-plain"/>
  <text x="60" y="51" text-anchor="middle" class="f-label f-ink">праграма</text>
  <line x1="111" y1="47" x2="122" y2="47" class="f-line"/>
  <path d="M124 47 l-5 -3 v6 z" class="f-muted"/>
  <rect x="125" y="30" width="108" height="34" rx="3" class="f-box"/>
  <text x="179" y="51" text-anchor="middle" class="f-label f-ink">гучнасць прагр.</text>
  <line x1="234" y1="47" x2="245" y2="47" class="f-line"/>
  <path d="M247 47 l-5 -3 v6 z" class="f-muted"/>
  <rect x="248" y="30" width="84" height="34" rx="3" class="f-plain"/>
  <text x="290" y="51" text-anchor="middle" class="f-label f-ink">мікшар</text>
  <line x1="333" y1="47" x2="344" y2="47" class="f-line"/>
  <path d="M346 47 l-5 -3 v6 z" class="f-muted"/>
  <rect x="347" y="30" width="150" height="34" rx="3" class="f-box"/>
  <text x="422" y="51" text-anchor="middle" class="f-label f-ink">гучнасць, mute</text>
  <line x1="498" y1="47" x2="509" y2="47" class="f-line"/>
  <path d="M511 47 l-5 -3 v6 z" class="f-muted"/>
  <rect x="512" y="30" width="100" height="34" rx="3" class="f-plain"/>
  <text x="562" y="51" text-anchor="middle" class="f-label f-ink">дынамікі</text>
  <text x="179" y="80" text-anchor="middle" class="f-label f-muted">праграма на 50%: ×0,125 на абодвух</text>
  <text x="179" y="94" text-anchor="middle" class="f-label f-muted">запамінаецца для новага патоку</text>
  <line x1="339.5" y1="47" x2="339.5" y2="165" class="f-line" style="stroke:var(--accent)" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M339.5 167 l-4 -7 h8 z" style="fill:var(--accent)"/>
  <rect x="214.5" y="168" width="250" height="44" rx="3" class="f-box"/>
  <text x="339.5" y="186" text-anchor="middle" class="f-mono f-ink">monitor PipeWire, па зм.</text>
  <text x="339.5" y="202" text-anchor="middle" class="f-label f-muted">выхад і mute: не ўплываюць</text>
  <line x1="504.5" y1="47" x2="504.5" y2="103" class="f-line" style="stroke:var(--accent)" stroke-width="2"/>
  <path d="M504.5 105 l-4 -7 h8 z" style="fill:var(--accent)"/>
  <rect x="379.5" y="106" width="250" height="44" rx="3" class="f-box"/>
  <text x="504.5" y="124" text-anchor="middle" class="f-mono f-ink">monitor PulseAudio</text>
  <text x="504.5" y="140" text-anchor="middle" class="f-label f-muted">выхад 50%: ×0,125, mute: нулі</text>
</svg>
<figcaption>Па 3 прагоны на кожным выхадзе. На 100% любы запіс супадае біт у біт. У выхаду PipeWire налада monitor па змаўчанні, тая, што WirePlumber 0.4.17 пакідае сапраўдным гукавым картам.</figcaption>
</figure>

Пераключэнне выхаду на абодвух працуе нармальна. Я пачаў запіс з `@DEFAULT_MONITOR@`, пераключыў выхад па змаўчанні на іншы і граў туды. Абодва серверы перавялі запіс на новы monitor. Запіс зноў супаў біт у біт.

## Дзе пачынае балець

earshot адпраўляе ў мадэль не любы гук. Ён рэжа паток на кадры па 20 мс. Кадр лічыцца маўленнем, калі яго RMS не меншы за 600 па шкале 16 біт. Фрагмент застаецца, толькі калі ў ім набралася хаця б 300 мс такіх кадраў. Гэтыя значэнні па змаўчанні выбіраў я сам і ні разу не думаў пра іх разам з паўзунком гучнасці.

Таму я прайграў запіс маўлення на рознай гучнасці. Запісваў ffmpeg 6.1.1 з тымі ж аргументамі, якія earshot збірае на Linux, толькі ў файл, а не ў stdout. Потым аддаў вынік сегментару earshot на каміце `15da817` з наладамі па змаўчанні. Запіс гэта 10 гарвардскіх фраз з Open Speech Repository, для прайгравання я ператварыў яго ў стэрэа. На 100% пік каля -12 dBFS, а ў самага гучнага кадра ў 20 мс RMS ад 3500 да 3650, у залежнасці ад прагону.

<figure class="fig">
<svg viewBox="0 0 640 162" role="img" aria-label="PulseAudio, паўзунок выхаду: 100% 10, 90% 10, 80% 10, 70% 8, 60% 0, 50% 0, 40% 0, 30% 0. PipeWire, паўзунок выхаду: 100% 10, 90% 10, 80% 10, 70% 10, 60% 10, 50% 10, 40% 10, 30% 10. PipeWire, паўзунок прагр.: 100% 10, 90% 10, 80% 10, 70% 9, 60% 0, 50% 0, 40% 0, 30% 0.">
  <text x="10" y="16" class="f-label f-muted">колькі фрагментаў earshot нарэзаў з 10 фраз</text>
  <text x="226.9" y="42" text-anchor="middle" class="f-label f-muted">100%</text>
  <text x="280.6" y="42" text-anchor="middle" class="f-label f-muted">90%</text>
  <text x="334.4" y="42" text-anchor="middle" class="f-label f-muted">80%</text>
  <text x="388.1" y="42" text-anchor="middle" class="f-label f-muted">70%</text>
  <text x="441.9" y="42" text-anchor="middle" class="f-label f-muted">60%</text>
  <text x="495.6" y="42" text-anchor="middle" class="f-label f-muted">50%</text>
  <text x="549.4" y="42" text-anchor="middle" class="f-label f-muted">40%</text>
  <text x="603.1" y="42" text-anchor="middle" class="f-label f-muted">30%</text>
  <text x="190" y="73" text-anchor="end" class="f-label f-ink">PulseAudio, паўзунок выхаду</text>
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
  <text x="190" y="107" text-anchor="end" class="f-label f-ink">PipeWire, паўзунок выхаду</text>
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
  <text x="190" y="141" text-anchor="end" class="f-label f-ink">PipeWire, паўзунок прагр.</text>
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
<figcaption>10 гарвардскіх фраз з Open Speech Repository, запісаных з monitor праз ffmpeg з аргументамі earshot і разрэзаных яго сегментарам з наладамі па змаўчанні: маўленне гэта RMS ад 600, фрагменту трэба 300 мс такога маўлення.</figcaption>
</figure>

На PulseAudio з паўзунком выхаду earshot нарэзвае з 10 фраз 10 фрагментаў да 80% уключна. На 70% нарэзвае 8. З 60% і ніжэй ніводнага. На 60% самыя гучныя кадры ўсё яшчэ праходзяць парог 600, бо 3650, памножанае на 0,216, гэта каля 790, але такіх кадраў ва ўсім запісе ўсяго 18. Ніводзін фрагмент не набірае з іх 300 мс. На PipeWire паўзунок выхаду нічога не мяняе. earshot нарэзвае ўсе 10 фрагментаў нават на 30%. Паўзунок праграмы вяртае там той жа абрыў: 9 фрагментаў на 70%, ніводнага з 60% і ніжэй. Розніцу 8 супраць 9 на 70% я спісваю на акругленне і межы кадраў і далей не правяраў. Ні ў адным з гэтых прагонаў нічога не падае, ffmpeg і сегментар працуюць далей, а расшыфроўка застаецца пустой.

Мяне нейкі час падманваў і ўласны стэнд. У першых прагонах запіс пачынаўся за 1 секунду да прайгравання і спыняўся праз 1 секунду пасля. Некаторыя запісы гублялі да секунды ў пачатку або кавалак у канцы. З запасам у 3 секунды з кожнага боку гэта больш не паўтаралася. Канцы губляліся таму, што `pipewire-pulse` аддае запісу даныя буйнымі кавалкамі. Чаму прападаў пачатак, я не ведаю і не капаў.

## Што мяняецца для earshot

У README радок пра Linux не павінен казаць толькі "works out of the box". Працуе, але што менавіта запісваецца, залежыць ад гучнасці. На PulseAudio паўзунок выхаду і выключэнне гуку вырашаюць, ці пачуе earshot маўленне ўвогуле. На PipeWire гэта вырашае толькі гучнасць праграмы. У абодвух выпадках пустая расшыфроўка прыходзіць без аніякай памылкі. Радок пра macOS проста няправільны. Яго трэба прыбраць з README і з `docs/audio-capture.md` таксама.

Для Windows і macOS сумленнае рашэнне гэта ўласны шлях запісу побач з ffmpeg. Гэта значыць WASAPI loopback з аднаго боку і process tap з другога. Гэта больш кода, чым ёсць у earshot цяпер. Я яго не напісаў.

## Што я не правяраў

Нічога з гэтага не запускалася ні на Windows, ні на macOS. Я не ведаю, ці бачыць WASAPI loopback або process tap гук да сістэмнай гучнасці ці пасля.

Усе выхады былі віртуальнымі. PulseAudio можа прымяняць частку гучнасці ў жалезе гукавой карты. Паводле зыходнікаў гэтая частка ідзе пасля monitor, а выключэнне гуку заўсёды робіцца праграмна. Значыць, на ноўтбуку з PulseAudio абрыў можа апынуцца ніжэй па паўзунку, а выключаны гук усё роўна павінен даваць цішыню. Гэта я прачытаў у кодзе, запусціць не мог. Мой выхад у PipeWire толькі паўтарае наладу па змаўчанні для сапраўднай карты. Сапраўднай картай ён ад гэтага не становіцца.

Сам абрыў адносіцца толькі да гэтага запісу. Цішэйшы званок зрушвае яго ўверх па паўзунку, гучнейшы ўніз. Парог 600 да таго ж мяняецца сцягам `--threshold`.
