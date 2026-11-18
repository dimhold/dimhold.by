---
title: "Whisper не принял ни одного беларусского предложения за беларусское, а грузинский записал чужими алфавитами"
description: "Whisper на коммите от 25 сентября на одних и тех же 100 предложениях FLEURS на 7 языках, от английского до грузинского. В автоматическом режиме ни одна из 3 младших моделей не приняла за беларусское ни одно беларусское предложение. С указанным языком base всё равно пишет русской орфографией и ни разу не пишет ў, у small 78,1% неверных слов. Грузинский модели в основном узнают, но ни одна не написала ни одной грузинской буквы: вместо них латиница, армянские знаки или китайский. Русский и польский у small держатся, украинский тоже, если указать язык."
date: 2022-10-02
lang: ru
translationKey: whisper-rare-languages
tags: ["machine-learning", "text"]
---
Этот блог выходит на английском, русском и беларусском, поэтому, когда 21 сентября вышел Whisper, первым делом я искал в его списке из 99 языков беларусский. Он там есть, грузинский тоже. Потом я открыл рисунок 11 статьи, где для каждого языка указаны часы обучающего звука. Из 680 000 часов на размеченный беларусский приходится 2,4 часа, а на русский 9761. У грузинского 0,6, это почти самый низ рисунка. Есть ещё 133 часа беларусской речи, которую модель училась переводить на английский, но писать беларусский текст она училась на 2,4. Мне хотелось посмотреть, что эти часы дают в самом выводе, а не только в доле неверных слов.

## Тест

Google в мае выложил FLEURS. Это один набор предложений, прочитанных вслух на 102 языках, так что содержание одинаковое и меняется только язык. Я взял 7 языков, от английского с 438 218 часами до грузинского с 0,6. В тестовой части всех 7 есть 307 общих предложений. Я выбрал из них 100 с фиксированным зерном генератора, так что каждый язык читает одни и те же 100.

Whisper я взял на коммите `5d8d3e7` от 25 сентября, запускал на PyTorch 1.12.1 и вызывал из Python через `transcribe()`. Всё работало на виртуальной машине с 4 ядрами AMD EPYC 7713, без GPU. Текст проходит через нормализаторы, которые идут вместе с Whisper для его собственных оценок. tiny прошёл все 100 предложений. base и small медленнее, small тратит здесь 218 секунд на минуту английского звука. Им достались только первые 50 и первые 30.

Первый прогон я запустил с настройками `transcribe()` по умолчанию, не прочитав, что они делают. Если результат выглядит плохо, `transcribe()` декодирует то же окно в 30 секунд ещё раз с большей случайностью, до 6 попыток. На первые 2 литовских предложения tiny потратил 40 и 89 секунд, а для base и small это означало дни. Я остановил прогон и перешёл на простое жадное декодирование. К тому времени tiny с настройками по умолчанию прошёл 400 предложений на первых 4 языках, этого хватило для сравнения. С повторами английский вышел хуже, 22,4% неверных слов против 17,0% и почти вся разница приходится на 1 предложение. При жадном декодировании модель ослышалась в последних словах и закончила за 5 секунд. Повторы потратили 22 секунды и закончили то же предложение так: `Week 2-2-3-3-3-4-6-5-6-6`. Потом считали считать ещё 200 символов.

В статье не сказано, каким декодированием получена таблица по всем языкам. Но английский столбец в ней такой же, как в таблице с пометкой "лучевой поиск". Мои числа с жадным декодированием почти везде выше. Для английского в статье есть и числа жадного декодирования, там у tiny 13,7% против моих 17,0% на 100 предложениях. До украинского порядок языков такой же, как в статье. На рисунке первые 30 предложений, те, что прошли все 3 модели.

<figure class="fig">
<svg viewBox="0 0 640 408" role="img" aria-label="Горизонтальные столбики доли неверных слов у Whisper tiny, base и small на одних и тех же 30 предложениях FLEURS на 7 языках, по убыванию часов размеченного звука в обучении. английский, 438 218 ч: tiny 16,9%, base 12,6%, small 8,7%. русский, 9761 ч: tiny 42,3%, base 30,1%, small 15,7%. польский, 4278 ч: tiny 56,8%, base 32,0%, small 17,6%. украинский, 697 ч: tiny 62,3%, base 46,8%, small 21,3%. литовский, 67 ч: tiny 101,3%, base 94,0%, small 71,5%. беларусский, 2,4 ч: tiny 137,2%, base 95,6%, small 78,1%. грузинский, 0,6 ч: tiny 175,7%, base 191,9%, small 113,3%. Столбики обрезаны на 120%.">
<text x="12" y="18" class="f-label f-muted">Неверные слова, %, одни и те же 30 предложений на каждом языке</text>
<text x="12" y="34" class="f-label f-muted">после названия часы размеченного звука в обучении</text>
<rect x="200" y="40" width="10" height="9" class="f-muted"/>
<text x="216" y="48" class="f-label f-ink">tiny</text>
<rect x="290" y="40" width="10" height="9" class="f-ink"/>
<text x="306" y="48" class="f-label f-ink">base</text>
<rect x="380" y="40" width="10" height="9" class="f-accent"/>
<text x="396" y="48" class="f-label f-ink">small</text>
<line x1="483.33333333333337" y1="52" x2="483.33333333333337" y2="370" class="f-line"/>
<text x="483.33333333333337" y="384" class="f-label f-muted" text-anchor="middle">100%</text>
<text x="12" y="74" class="f-label f-ink">английский</text>
<text x="12" y="87" class="f-label f-muted">438 218 ч</text>
<rect x="200" y="56" width="47.9" height="9" class="f-muted"/>
<text x="253.9" y="64" class="f-label f-ink">16,9%</text>
<rect x="200" y="68" width="35.7" height="9" class="f-ink"/>
<text x="241.7" y="76" class="f-label f-ink">12,6%</text>
<rect x="200" y="80" width="24.6" height="9" class="f-accent"/>
<text x="230.7" y="88" class="f-label f-ink">8,7%</text>
<text x="12" y="120" class="f-label f-ink">русский</text>
<text x="12" y="133" class="f-label f-muted">9761 ч</text>
<rect x="200" y="102" width="119.8" height="9" class="f-muted"/>
<text x="325.9" y="110" class="f-label f-ink">42,3%</text>
<rect x="200" y="114" width="85.3" height="9" class="f-ink"/>
<text x="291.3" y="122" class="f-label f-ink">30,1%</text>
<rect x="200" y="126" width="44.5" height="9" class="f-accent"/>
<text x="250.5" y="134" class="f-label f-ink">15,7%</text>
<text x="12" y="166" class="f-label f-ink">польский</text>
<text x="12" y="179" class="f-label f-muted">4278 ч</text>
<rect x="200" y="148" width="160.9" height="9" class="f-muted"/>
<text x="366.9" y="156" class="f-label f-ink">56,8%</text>
<rect x="200" y="160" width="90.7" height="9" class="f-ink"/>
<text x="296.7" y="168" class="f-label f-ink">32,0%</text>
<rect x="200" y="172" width="49.9" height="9" class="f-accent"/>
<text x="255.9" y="180" class="f-label f-ink">17,6%</text>
<text x="12" y="212" class="f-label f-ink">украинский</text>
<text x="12" y="225" class="f-label f-muted">697 ч</text>
<rect x="200" y="194" width="176.5" height="9" class="f-muted"/>
<text x="382.5" y="202" class="f-label f-ink">62,3%</text>
<rect x="200" y="206" width="132.6" height="9" class="f-ink"/>
<text x="338.6" y="214" class="f-label f-ink">46,8%</text>
<rect x="200" y="218" width="60.4" height="9" class="f-accent"/>
<text x="266.4" y="226" class="f-label f-ink">21,3%</text>
<text x="12" y="258" class="f-label f-ink">литовский</text>
<text x="12" y="271" class="f-label f-muted">67 ч</text>
<rect x="200" y="240" width="287.0" height="9" class="f-muted"/>
<text x="493.0" y="248" class="f-label f-ink">101,3%</text>
<rect x="200" y="252" width="266.3" height="9" class="f-ink"/>
<text x="472.3" y="260" class="f-label f-ink">94,0%</text>
<rect x="200" y="264" width="202.6" height="9" class="f-accent"/>
<text x="408.6" y="272" class="f-label f-ink">71,5%</text>
<text x="12" y="304" class="f-label f-ink">беларусский</text>
<text x="12" y="317" class="f-label f-muted">2,4 ч</text>
<rect x="200" y="286" width="340.0" height="9" class="f-muted"/>
<text x="546.0" y="294" class="f-label f-ink">&gt; 137,2%</text>
<rect x="200" y="298" width="270.9" height="9" class="f-ink"/>
<text x="476.9" y="306" class="f-label f-ink">95,6%</text>
<rect x="200" y="310" width="221.3" height="9" class="f-accent"/>
<text x="427.3" y="318" class="f-label f-ink">78,1%</text>
<text x="12" y="350" class="f-label f-ink">грузинский</text>
<text x="12" y="363" class="f-label f-muted">0,6 ч</text>
<rect x="200" y="332" width="340.0" height="9" class="f-muted"/>
<text x="546.0" y="340" class="f-label f-ink">&gt; 175,7%</text>
<rect x="200" y="344" width="340.0" height="9" class="f-ink"/>
<text x="546.0" y="352" class="f-label f-ink">&gt; 191,9%</text>
<rect x="200" y="356" width="321.0" height="9" class="f-accent"/>
<text x="527.0" y="364" class="f-label f-ink">113,3%</text>
</svg>
<figcaption>До украинского каждый шаг вверх по размеру модели помогает. Ниже 100 часов у tiny и base 94% и хуже, у small 71,5% и 78,1%, а грузинский у всех 3 выше 100% из-за циклов.</figcaption>
</figure>

## Где справляется

На этих 30 предложениях у small 15,7% неверных слов на русском и 17,6% на польском. Ошибка по символам на русском 4,7%, так что большинство неверных слов близки к правильным.

С украинским small справляется. Младшим моделям язык важно указывать. В автоматическом режиме tiny принял за русский 21 украинское предложение из 100, а base 9 из 50. Тогда модель просто пишет по-русски: `Начальник полиции` там, где диктор сказал "Начальник поліції". С `language="uk"` у tiny 59,7% неверных слов, без него 72,1%. README советует указывать язык для речи не на английском и для украинского так и стоит делать.

## Беларусский

Перед прогоном я записал, что больше 30% беларусских предложений будут приняты за русские. Я не ожидал, что ни одна из 3 моделей не примет за беларусское ни одного. Наибольшая вероятность, которую Whisper хоть раз дал беларусскому, 7,7%, у base. tiny и base определяли русский или украинский примерно 2 к 1, а small каждый раз определял русский.

<figure class="fig">
<svg viewBox="0 0 640 202" role="img" aria-label="Полосы клеток, по одной на беларусское предложение FLEURS, цвет по языку, который определил Whisper. tiny, 100 предложений: русский 66, украинский 32, польский 2. Наибольшая вероятность для беларусского 3,6%. base, 50 предложений: русский 32, украинский 16, польский 2. Наибольшая вероятность для беларусского 7,7%. small, 30 предложений: русский 30. Наибольшая вероятность для беларусского 4,1%.">
<text x="12" y="18" class="f-label f-muted">Какой язык Whisper выбрал для беларусских предложений, по клетке на предложение</text>
<rect x="12" y="30" width="10" height="10" class="f-ink"/>
<text x="28" y="39" class="f-label f-ink">русский</text>
<rect x="142" y="30" width="10" height="10" class="f-muted"/>
<text x="158" y="39" class="f-label f-ink">украинский</text>
<rect x="272" y="30" width="10" height="10" class="f-box"/>
<text x="288" y="39" class="f-label f-ink">польский</text>
<rect x="402" y="30" width="10" height="10" class="f-accent"/>
<text x="418" y="39" class="f-label f-ink">беларусский</text>
<text x="12" y="72" class="f-label f-ink">tiny</text>
<rect x="60" y="62" width="9" height="12" class="f-ink"/>
<rect x="71" y="62" width="9" height="12" class="f-ink"/>
<rect x="82" y="62" width="9" height="12" class="f-ink"/>
<rect x="93" y="62" width="9" height="12" class="f-ink"/>
<rect x="104" y="62" width="9" height="12" class="f-ink"/>
<rect x="115" y="62" width="9" height="12" class="f-muted"/>
<rect x="126" y="62" width="9" height="12" class="f-muted"/>
<rect x="137" y="62" width="9" height="12" class="f-muted"/>
<rect x="148" y="62" width="9" height="12" class="f-ink"/>
<rect x="159" y="62" width="9" height="12" class="f-ink"/>
<rect x="170" y="62" width="9" height="12" class="f-muted"/>
<rect x="181" y="62" width="9" height="12" class="f-ink"/>
<rect x="192" y="62" width="9" height="12" class="f-ink"/>
<rect x="203" y="62" width="9" height="12" class="f-ink"/>
<rect x="214" y="62" width="9" height="12" class="f-ink"/>
<rect x="225" y="62" width="9" height="12" class="f-ink"/>
<rect x="236" y="62" width="9" height="12" class="f-box"/>
<rect x="247" y="62" width="9" height="12" class="f-muted"/>
<rect x="258" y="62" width="9" height="12" class="f-muted"/>
<rect x="269" y="62" width="9" height="12" class="f-ink"/>
<rect x="280" y="62" width="9" height="12" class="f-ink"/>
<rect x="291" y="62" width="9" height="12" class="f-muted"/>
<rect x="302" y="62" width="9" height="12" class="f-muted"/>
<rect x="313" y="62" width="9" height="12" class="f-ink"/>
<rect x="324" y="62" width="9" height="12" class="f-ink"/>
<rect x="335" y="62" width="9" height="12" class="f-muted"/>
<rect x="346" y="62" width="9" height="12" class="f-ink"/>
<rect x="357" y="62" width="9" height="12" class="f-ink"/>
<rect x="368" y="62" width="9" height="12" class="f-muted"/>
<rect x="379" y="62" width="9" height="12" class="f-ink"/>
<rect x="390" y="62" width="9" height="12" class="f-ink"/>
<rect x="401" y="62" width="9" height="12" class="f-ink"/>
<rect x="412" y="62" width="9" height="12" class="f-muted"/>
<rect x="423" y="62" width="9" height="12" class="f-muted"/>
<rect x="434" y="62" width="9" height="12" class="f-ink"/>
<rect x="445" y="62" width="9" height="12" class="f-ink"/>
<rect x="456" y="62" width="9" height="12" class="f-ink"/>
<rect x="467" y="62" width="9" height="12" class="f-ink"/>
<rect x="478" y="62" width="9" height="12" class="f-muted"/>
<rect x="489" y="62" width="9" height="12" class="f-ink"/>
<rect x="500" y="62" width="9" height="12" class="f-ink"/>
<rect x="511" y="62" width="9" height="12" class="f-ink"/>
<rect x="522" y="62" width="9" height="12" class="f-ink"/>
<rect x="533" y="62" width="9" height="12" class="f-ink"/>
<rect x="544" y="62" width="9" height="12" class="f-ink"/>
<rect x="555" y="62" width="9" height="12" class="f-ink"/>
<rect x="566" y="62" width="9" height="12" class="f-ink"/>
<rect x="577" y="62" width="9" height="12" class="f-ink"/>
<rect x="588" y="62" width="9" height="12" class="f-muted"/>
<rect x="599" y="62" width="9" height="12" class="f-muted"/>
<rect x="60" y="76" width="9" height="12" class="f-ink"/>
<rect x="71" y="76" width="9" height="12" class="f-ink"/>
<rect x="82" y="76" width="9" height="12" class="f-ink"/>
<rect x="93" y="76" width="9" height="12" class="f-muted"/>
<rect x="104" y="76" width="9" height="12" class="f-ink"/>
<rect x="115" y="76" width="9" height="12" class="f-ink"/>
<rect x="126" y="76" width="9" height="12" class="f-ink"/>
<rect x="137" y="76" width="9" height="12" class="f-ink"/>
<rect x="148" y="76" width="9" height="12" class="f-muted"/>
<rect x="159" y="76" width="9" height="12" class="f-muted"/>
<rect x="170" y="76" width="9" height="12" class="f-ink"/>
<rect x="181" y="76" width="9" height="12" class="f-ink"/>
<rect x="192" y="76" width="9" height="12" class="f-ink"/>
<rect x="203" y="76" width="9" height="12" class="f-muted"/>
<rect x="214" y="76" width="9" height="12" class="f-ink"/>
<rect x="225" y="76" width="9" height="12" class="f-ink"/>
<rect x="236" y="76" width="9" height="12" class="f-muted"/>
<rect x="247" y="76" width="9" height="12" class="f-ink"/>
<rect x="258" y="76" width="9" height="12" class="f-muted"/>
<rect x="269" y="76" width="9" height="12" class="f-muted"/>
<rect x="280" y="76" width="9" height="12" class="f-ink"/>
<rect x="291" y="76" width="9" height="12" class="f-ink"/>
<rect x="302" y="76" width="9" height="12" class="f-ink"/>
<rect x="313" y="76" width="9" height="12" class="f-muted"/>
<rect x="324" y="76" width="9" height="12" class="f-muted"/>
<rect x="335" y="76" width="9" height="12" class="f-ink"/>
<rect x="346" y="76" width="9" height="12" class="f-ink"/>
<rect x="357" y="76" width="9" height="12" class="f-ink"/>
<rect x="368" y="76" width="9" height="12" class="f-muted"/>
<rect x="379" y="76" width="9" height="12" class="f-ink"/>
<rect x="390" y="76" width="9" height="12" class="f-ink"/>
<rect x="401" y="76" width="9" height="12" class="f-ink"/>
<rect x="412" y="76" width="9" height="12" class="f-ink"/>
<rect x="423" y="76" width="9" height="12" class="f-ink"/>
<rect x="434" y="76" width="9" height="12" class="f-box"/>
<rect x="445" y="76" width="9" height="12" class="f-ink"/>
<rect x="456" y="76" width="9" height="12" class="f-ink"/>
<rect x="467" y="76" width="9" height="12" class="f-muted"/>
<rect x="478" y="76" width="9" height="12" class="f-ink"/>
<rect x="489" y="76" width="9" height="12" class="f-muted"/>
<rect x="500" y="76" width="9" height="12" class="f-ink"/>
<rect x="511" y="76" width="9" height="12" class="f-ink"/>
<rect x="522" y="76" width="9" height="12" class="f-muted"/>
<rect x="533" y="76" width="9" height="12" class="f-ink"/>
<rect x="544" y="76" width="9" height="12" class="f-muted"/>
<rect x="555" y="76" width="9" height="12" class="f-muted"/>
<rect x="566" y="76" width="9" height="12" class="f-muted"/>
<rect x="577" y="76" width="9" height="12" class="f-muted"/>
<rect x="588" y="76" width="9" height="12" class="f-ink"/>
<rect x="599" y="76" width="9" height="12" class="f-ink"/>
<text x="60" y="100" class="f-label f-muted">максимум для беларусского: 3,6%</text>
<text x="12" y="130" class="f-label f-ink">base</text>
<rect x="60" y="120" width="9" height="12" class="f-ink"/>
<rect x="71" y="120" width="9" height="12" class="f-ink"/>
<rect x="82" y="120" width="9" height="12" class="f-ink"/>
<rect x="93" y="120" width="9" height="12" class="f-ink"/>
<rect x="104" y="120" width="9" height="12" class="f-muted"/>
<rect x="115" y="120" width="9" height="12" class="f-ink"/>
<rect x="126" y="120" width="9" height="12" class="f-ink"/>
<rect x="137" y="120" width="9" height="12" class="f-box"/>
<rect x="148" y="120" width="9" height="12" class="f-muted"/>
<rect x="159" y="120" width="9" height="12" class="f-muted"/>
<rect x="170" y="120" width="9" height="12" class="f-ink"/>
<rect x="181" y="120" width="9" height="12" class="f-ink"/>
<rect x="192" y="120" width="9" height="12" class="f-ink"/>
<rect x="203" y="120" width="9" height="12" class="f-ink"/>
<rect x="214" y="120" width="9" height="12" class="f-muted"/>
<rect x="225" y="120" width="9" height="12" class="f-ink"/>
<rect x="236" y="120" width="9" height="12" class="f-box"/>
<rect x="247" y="120" width="9" height="12" class="f-muted"/>
<rect x="258" y="120" width="9" height="12" class="f-ink"/>
<rect x="269" y="120" width="9" height="12" class="f-ink"/>
<rect x="280" y="120" width="9" height="12" class="f-ink"/>
<rect x="291" y="120" width="9" height="12" class="f-muted"/>
<rect x="302" y="120" width="9" height="12" class="f-ink"/>
<rect x="313" y="120" width="9" height="12" class="f-ink"/>
<rect x="324" y="120" width="9" height="12" class="f-ink"/>
<rect x="335" y="120" width="9" height="12" class="f-muted"/>
<rect x="346" y="120" width="9" height="12" class="f-ink"/>
<rect x="357" y="120" width="9" height="12" class="f-muted"/>
<rect x="368" y="120" width="9" height="12" class="f-muted"/>
<rect x="379" y="120" width="9" height="12" class="f-ink"/>
<rect x="390" y="120" width="9" height="12" class="f-ink"/>
<rect x="401" y="120" width="9" height="12" class="f-ink"/>
<rect x="412" y="120" width="9" height="12" class="f-ink"/>
<rect x="423" y="120" width="9" height="12" class="f-ink"/>
<rect x="434" y="120" width="9" height="12" class="f-muted"/>
<rect x="445" y="120" width="9" height="12" class="f-ink"/>
<rect x="456" y="120" width="9" height="12" class="f-ink"/>
<rect x="467" y="120" width="9" height="12" class="f-ink"/>
<rect x="478" y="120" width="9" height="12" class="f-ink"/>
<rect x="489" y="120" width="9" height="12" class="f-ink"/>
<rect x="500" y="120" width="9" height="12" class="f-muted"/>
<rect x="511" y="120" width="9" height="12" class="f-muted"/>
<rect x="522" y="120" width="9" height="12" class="f-muted"/>
<rect x="533" y="120" width="9" height="12" class="f-ink"/>
<rect x="544" y="120" width="9" height="12" class="f-muted"/>
<rect x="555" y="120" width="9" height="12" class="f-ink"/>
<rect x="566" y="120" width="9" height="12" class="f-ink"/>
<rect x="577" y="120" width="9" height="12" class="f-ink"/>
<rect x="588" y="120" width="9" height="12" class="f-muted"/>
<rect x="599" y="120" width="9" height="12" class="f-muted"/>
<text x="60" y="144" class="f-label f-muted">максимум для беларусского: 7,7%</text>
<text x="12" y="174" class="f-label f-ink">small</text>
<rect x="60" y="164" width="9" height="12" class="f-ink"/>
<rect x="71" y="164" width="9" height="12" class="f-ink"/>
<rect x="82" y="164" width="9" height="12" class="f-ink"/>
<rect x="93" y="164" width="9" height="12" class="f-ink"/>
<rect x="104" y="164" width="9" height="12" class="f-ink"/>
<rect x="115" y="164" width="9" height="12" class="f-ink"/>
<rect x="126" y="164" width="9" height="12" class="f-ink"/>
<rect x="137" y="164" width="9" height="12" class="f-ink"/>
<rect x="148" y="164" width="9" height="12" class="f-ink"/>
<rect x="159" y="164" width="9" height="12" class="f-ink"/>
<rect x="170" y="164" width="9" height="12" class="f-ink"/>
<rect x="181" y="164" width="9" height="12" class="f-ink"/>
<rect x="192" y="164" width="9" height="12" class="f-ink"/>
<rect x="203" y="164" width="9" height="12" class="f-ink"/>
<rect x="214" y="164" width="9" height="12" class="f-ink"/>
<rect x="225" y="164" width="9" height="12" class="f-ink"/>
<rect x="236" y="164" width="9" height="12" class="f-ink"/>
<rect x="247" y="164" width="9" height="12" class="f-ink"/>
<rect x="258" y="164" width="9" height="12" class="f-ink"/>
<rect x="269" y="164" width="9" height="12" class="f-ink"/>
<rect x="280" y="164" width="9" height="12" class="f-ink"/>
<rect x="291" y="164" width="9" height="12" class="f-ink"/>
<rect x="302" y="164" width="9" height="12" class="f-ink"/>
<rect x="313" y="164" width="9" height="12" class="f-ink"/>
<rect x="324" y="164" width="9" height="12" class="f-ink"/>
<rect x="335" y="164" width="9" height="12" class="f-ink"/>
<rect x="346" y="164" width="9" height="12" class="f-ink"/>
<rect x="357" y="164" width="9" height="12" class="f-ink"/>
<rect x="368" y="164" width="9" height="12" class="f-ink"/>
<rect x="379" y="164" width="9" height="12" class="f-ink"/>
<text x="60" y="188" class="f-label f-muted">максимум для беларусского: 4,1%</text>
</svg>
<figcaption>Ни одно беларусское предложение не определено как беларусское.</figcaption>
</figure>

Тогда я указал `language="be"`. С указанным языком 2 младшие модели меняют отдельные слова, но оставляют русскую орфографию. В выводе base 49 предложений из 50 содержат и, щ или ъ, буквы, которых в беларусском нет. Такая буква есть в 36% всех слов. Буква ў есть в 44 эталонных предложениях из 50, а base не написал её ни разу.

<figure class="fig">
<svg viewBox="0 0 640 288" role="img" aria-label="Одно предложение 3 раза. Беларусский эталон: У большасці выпадкаў сплавы — гэта сумесь дзвюх ці некалькіх металаў. Майце на ўвазе, што перыядычная табліца змяшчае вялікую колькасць элементаў. Whisper base с заданным беларусским языком: Больше стивыпатков, сплавы, это сумесь двух тенекальки металл. Метя на увазе, что пераядычная таблица замещая великую колькость элементу. Whisper base в автоматическом режиме, выбравший русский: В большей стивыпадках с плавы это сумесь двух тенекальки металлов. Матя на увазе, что пероядочная таблица замещая великую колькость элементу. ў есть в 44 эталонных предложениях из 50. В выводе base с language=&quot;be&quot;: 0.">
<text x="12" y="18" class="f-label f-muted">1 предложение FLEURS, Whisper base</text>
<text x="12" y="44" class="f-label f-ink">беларусский эталон</text>
<text x="24" y="62" class="f-mono f-ink">У большасці выпадкаў сплавы — гэта сумесь дзвюх ці некалькіх металаў.</text>
<text x="24" y="80" class="f-mono f-ink">Майце на ўвазе, што перыядычная табліца змяшчае вялікую колькасць</text>
<text x="24" y="98" class="f-mono f-ink">элементаў.</text>
<text x="12" y="126" class="f-label f-accent">base, language=&quot;be&quot;</text>
<text x="24" y="144" class="f-mono f-ink">Больше стивыпатков, сплавы, это сумесь двух тенекальки металл. Метя на</text>
<text x="24" y="162" class="f-mono f-ink">увазе, что пераядычная таблица замещая великую колькость элементу.</text>
<text x="12" y="190" class="f-label f-accent">base, автоматически (выбрал русский)</text>
<text x="24" y="208" class="f-mono f-ink">В большей стивыпадках с плавы это сумесь двух тенекальки металлов.</text>
<text x="24" y="226" class="f-mono f-ink">Матя на увазе, что пероядочная таблица замещая великую колькость</text>
<text x="24" y="244" class="f-mono f-ink">элементу.</text>
<text x="12" y="276" class="f-label f-muted">ў есть в 44 эталонных предложениях из 50. В выводе base с language=&quot;be&quot;: 0.</text>
</svg>
<figcaption>С заданным языком меняются отдельные слова, но орфография остаётся русской: у вместо ў, а и вместо і.</figcaption>
</figure>

small первым пишет хоть какие-то беларусские буквы. С указанным языком он пишет ў в 11 предложениях из 30, а в эталоне она есть в 26. Русская буква только в 9,5% его слов. Неверных слов становится 78,1% вместо 92,5% в автоматическом режиме. В статье у small 75,1%, так что это примерно то, что и должно быть. Но это всё равно смесь. В 28 предложениях из 30 где-то есть русская буква, в 8 есть украинское слово, вроде `існує` посреди беларусского предложения. Ошибка по символам 23,4%, это почти каждый четвёртый символ. Для меня это значит, что такой текст проще набрать заново, чем исправлять.

## Грузинский

tiny определил грузинский только в 44 предложениях из 100. base определил в 46 из 50, то есть чаще, чем литовский (82%). small определил во всех 30. Ни одна из 3 моделей не написала ни одной грузинской буквы ни в одном предложении.

base пишет что-то вроде латинской транслитерации, `Policisinspektorist Chandrashek` вместо "პოლიციის ინსპექტორის ჩანდრა შეკხარ". small, который каждое предложение определил как грузинское, пишет армянским письмом в 28 предложениях из 30. В 18 из них армянские буквы, обычно `ԱՅՆՆՆՆ`, где одна и та же буква повторяется до конца вывода. В остальных 10 только армянская точка `։`, снова и снова. tiny пишет по-китайски в 33 предложениях из 100. Одна из таких строк `小朋友们记得点赞`, примерно "дети, не забудьте лайкнуть", так китайские видеоблогеры говорят в конце ролика. Могу только догадываться, но это похоже на кусок чьих-то субтитров из обучающих данных.

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="Грузинский эталон: პოლიციის ინსპექტორის ჩანდრა შეკხარ სოლანკის თქმით, დანაშაულში ბრალ... Whisper base, определивший грузинский, пишет латиницей: Policisinspektorist Chandrashek, Kharsolankistkmitta, Naša Olši, B... Whisper tiny на другом грузинском предложении пишет по-китайски: 小朋友们记得点赞,收点赞,收点赞... Грузинские буквы в выводе Whisper: tiny 0 из 100, base 0 из 50, small 0 из 30. Китайский у tiny: 33 из 100.">
<text x="12" y="18" class="f-label f-muted">1 предложение FLEURS на грузинском</text>
<text x="12" y="44" class="f-label f-ink">грузинский эталон</text>
<text x="24" y="62" class="f-mono f-ink">პოლიციის ინსპექტორის ჩანდრა შეკხარ სოლანკის თქმით, დანაშაულში ბრალ...</text>
<text x="12" y="90" class="f-label f-accent">base, выбрал грузинский</text>
<text x="24" y="108" class="f-mono f-ink">Policisinspektorist Chandrashek, Kharsolankistkmitta, Naša Olši, B...</text>
<text x="12" y="136" class="f-label f-accent">tiny, другое предложение</text>
<text x="24" y="154" class="f-mono f-ink">小朋友们记得点赞,收点赞,收点赞...</text>
<text x="12" y="186" class="f-label f-muted">Грузинские буквы в выводе Whisper: tiny 0 из 100, base 0 из 50, small 0 из 30.</text>
<text x="12" y="204" class="f-label f-muted">Китайский у tiny: 33 из 100.</text>
</svg>
<figcaption>base определил грузинский и записал его латиницей.</figcaption>
</figure>

Доля неверных слов на грузинском больше 100%, у tiny на всех 100 предложениях это 228%. Циклы добавляют слова, которых нет в эталоне. Так что на это число я бы особо не смотрел, большая его часть это циклы, а остальное неверные буквы.

## Чего я не проверял

medium и large не запускались, на этом процессоре они не укладываются по времени. В статье у large на беларусском 56,6%, так что даже там до русского далеко. Лучевой поиск тоже не запускался. Консольная утилита использует его по умолчанию, так что у неё числа, вероятно, будут немного ниже моих. FLEURS это чистая речь, прочитанная вслух, на реальных записях, скорее всего, хуже. От 30 до 100 предложений это маленькая выборка и на других предложениях числа у small могут сдвинуться на несколько пунктов. Каждая конфигурация запускалась один раз, но жадное декодирование каждый раз даёт один и тот же результат: я заново декодировал 4 зациклившихся предложения и получил тот же текст байт в байт. Дообучение на беларусском я не пробовал.

Пока я бы отдавал Whisper беларусскую запись только с `language="be"` и не меньше чем на модели small. И даже тогда читал бы каждую строку. С грузинским я бы не начинал, в статье у него 100,5% даже на large.
