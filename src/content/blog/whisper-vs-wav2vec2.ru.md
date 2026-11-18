---
title: "Whisper проиграл wav2vec2 на LibriSpeech и выиграл на совещании, но 4 фразы чуть это не спрятали"
description: "4 модели, 3 вида звука, по 200 фраз. На LibriSpeech wav2vec2 впереди Whisper tiny.en и base.en, на речах в парламенте и на совещаниях впереди Whisper. На совещании это прятали 4 петли жадного декодирования base.en, пока я не включил откат по температуре."
date: 2022-09-24
lang: ru
translationKey: whisper-vs-wav2vec2
tags: ["machine-learning", "statistics"]
---
Whisper вышел в среду. До сих пор для распознавания английской речи открытой моделью я брал wav2vec2 с Hugging Face. В карточке `facebook/wav2vec2-base-960h` указано 3,4% ошибочных слов на чистой тестовой части LibriSpeech, в карточке большой `lv60-self` 1,9. Для меня это число и было качеством модели. На звуке не из LibriSpeech я его ни разу не проверял.

Таблица 8 статьи про Whisper показывает, что маленькие модели Whisper хуже wav2vec2 на LibriSpeech и лучше wav2vec2 base почти на всём остальном. Каждая статья пишет о себе что-то подобное, поэтому я прогнал 4 модели на 3 видах звука и посчитал.

## Стенд

Whisper на коммите `8cf36f3` от 23 сентября, torch 1.12.1 на CPU в fp32. Я взял `tiny.en` и `base.en` с `temperature=0`, то есть жадное декодирование, как в таблице 8 статьи. wav2vec2 base и large lv60 идут через transformers 4.22.1 и в каждом кадре берут самую вероятную букву, без языковой модели. Считал на 4 виртуальных ядрах AMD EPYC 7713.

Из каждого набора я взял 200 случайных фраз:

1. LibriSpeech, чистая тестовая часть, аудиокниги. wav2vec2 дообучали на обучающей части этого же корпуса.
2. VoxPopuli на английском, выступления в Европейском парламенте.
3. AMI, записи совещаний на микрофоны гарнитур, фразы от 3 слов. Я взял только первый файл тестовой части на Hugging Face, поэтому это 3 совещания и 4 говорящих.

Ошибки считал как WER через jiwer 2.5.1.

## Первое число было 99%

Первый прогон `tiny.en` на LibriSpeech дал 99,31% ошибочных слов. Эталон записан заглавными буквами без пунктуации. Поэтому `SUNDAY AUGUST SIXTEENTH` сравнивалось с `Sunday, August 16th.` и как строки не совпали 3 слова из 3. Похоже на сломанную модель, но это только заглавные буквы и запятые.

После перевода в нижний регистр и удаления пунктуации вышло 6,02%. В статье WER считают после собственного английского нормализатора, который ещё пишет числа цифрами и выбрасывает `um` и `uh`. После него `16th` совпадает с `sixteenth` и результат 5,60%, как в таблице 8. Я применял его ко всем 4 моделям.

## На LibriSpeech карточка права

| модель | мои 200 фраз | статья, жадное декодирование |
|---|---|---|
| wav2vec2 large lv60 | 1,52 | 1,8 |
| wav2vec2 base | 2,83 | 3,3 |
| Whisper base.en | 3,43 | 4,2 |
| Whisper tiny.en | 5,60 | 5,6 |

По общему WER обе wav2vec2 впереди. Между `base.en` и wav2vec2 base разница 0,6 пункта. Бутстрэп по фразам (2000 повторов) даёт 95% доверительный интервал от −0,22 до 1,37, так что на 200 фразах эти 2 модели я не различаю. `tiny.en` явно хуже обеих.

<figure class="fig">
<svg viewBox="0 0 680 206" role="img" aria-label="Доля ошибочных слов у 4 моделей на 3 наборах, по 200 фраз. Чистый LibriSpeech: wav2vec2 large lv60 1,52%, wav2vec2 base 2,83%, Whisper base.en 3,43%, Whisper tiny.en 5,60%. VoxPopuli на английском: wav2vec2 large lv60 13,05%, wav2vec2 base 20,86%, Whisper base.en 10,51%, Whisper tiny.en 11,67%. Совещания AMI, гарнитуры: wav2vec2 large lv60 37,69%, wav2vec2 base 47,08%, Whisper base.en 49,93%, Whisper tiny.en 35,14%. На LibriSpeech обе wav2vec2 впереди обеих Whisper. На VoxPopuli впереди обе Whisper. На совещаниях лучшая Whisper tiny.en, худшая Whisper base.en, без 4 зациклившихся фраз у base.en 22,61.">
  <text x="8" y="58" class="f-mono f-ink" style="font-size:11px">wav2vec2 large lv60</text>
  <text x="8" y="92" class="f-mono f-ink" style="font-size:11px">wav2vec2 base</text>
  <text x="8" y="126" class="f-mono f-accent" style="font-size:11px">Whisper base.en</text>
  <text x="8" y="160" class="f-mono f-accent" style="font-size:11px">Whisper tiny.en</text>
  <text x="150" y="24" class="f-label f-ink">LibriSpeech чистый</text>
  <line x1="150" x2="150" y1="36" y2="176" class="f-plain"/>
  <rect x="150" y="44" width="31.5" height="20" rx="2" class="f-muted"/>
  <text x="186.5" y="59" class="f-mono f-ink" style="font-size:11px">1,52</text>
  <rect x="150" y="78" width="58.6" height="20" rx="2" class="f-muted"/>
  <text x="213.6" y="93" class="f-mono f-ink" style="font-size:11px">2,83</text>
  <rect x="150" y="112" width="71.1" height="20" rx="2" class="f-accent"/>
  <text x="226.1" y="127" class="f-mono f-ink" style="font-size:11px">3,43</text>
  <rect x="150" y="146" width="116.0" height="20" rx="2" class="f-accent"/>
  <text x="271.0" y="161" class="f-mono f-ink" style="font-size:11px">5,60</text>
  <text x="330" y="24" class="f-label f-ink">VoxPopuli</text>
  <line x1="330" x2="330" y1="36" y2="176" class="f-plain"/>
  <rect x="330" y="44" width="72.6" height="20" rx="2" class="f-muted"/>
  <text x="407.6" y="59" class="f-mono f-ink" style="font-size:11px">13,05</text>
  <rect x="330" y="78" width="116.0" height="20" rx="2" class="f-muted"/>
  <text x="451.0" y="93" class="f-mono f-ink" style="font-size:11px">20,86</text>
  <rect x="330" y="112" width="58.4" height="20" rx="2" class="f-accent"/>
  <text x="393.4" y="127" class="f-mono f-ink" style="font-size:11px">10,51</text>
  <rect x="330" y="146" width="64.9" height="20" rx="2" class="f-accent"/>
  <text x="399.9" y="161" class="f-mono f-ink" style="font-size:11px">11,67</text>
  <text x="510" y="24" class="f-label f-ink">совещания AMI</text>
  <line x1="510" x2="510" y1="36" y2="176" class="f-plain"/>
  <rect x="510" y="44" width="87.6" height="20" rx="2" class="f-muted"/>
  <text x="602.6" y="59" class="f-mono f-ink" style="font-size:11px">37,69</text>
  <rect x="510" y="78" width="109.4" height="20" rx="2" class="f-muted"/>
  <text x="624.4" y="93" class="f-mono f-ink" style="font-size:11px">47,08</text>
  <rect x="510" y="112" width="116.0" height="20" rx="2" class="f-accent"/>
  <text x="631.0" y="127" class="f-mono f-ink" style="font-size:11px">49,93</text>
  <rect x="510" y="146" width="81.6" height="20" rx="2" class="f-accent"/>
  <text x="596.6" y="161" class="f-mono f-ink" style="font-size:11px">35,14</text>
  <line x1="562.5" x2="562.5" y1="109" y2="135" style="stroke:var(--ink);stroke-width:2"/>
  <text x="676" y="198" text-anchor="end" class="f-mono f-ink" style="font-size:11px">без 4 зациклившихся фраз у base.en 22,61</text>
  <line x1="562.5" x2="562.5" y1="135" y2="184" style="stroke:var(--ink);stroke-width:1"/>
</svg>
<figcaption>Ошибочных слов, %, после английского нормализатора Whisper. Серые это wav2vec2, дообученные на LibriSpeech, цветные это Whisper. Масштаб столбиков у каждого набора свой.</figcaption>
</figure>

## На VoxPopuli порядок обратный

На речах в парламенте у wav2vec2 base 20,86% ошибок, у large 13,05, у `tiny.en` 11,67 и у `base.en` 10,51, близко к статье. `base.en` был лучше wav2vec2 base на 153 фразах и хуже на 9. Даже `tiny.en`, самый маленький Whisper, 39 миллионов параметров, обошёл wav2vec2 large на 1,4 пункта, интервал от −2,46 до −0,34.

## Совещание, где я чуть не поверил общему числу

После первых 36 фраз совещания у `base.en` было 17,68%. Когда досчитались все 200, стало 49,93, худший результат из 4 моделей: `tiny.en` 35,14, wav2vec2 large 37,69, wav2vec2 base 47,08.

По отдельным фразам `base.en` был лучше wav2vec2 base на 159 и хуже на 22. Общий итог определили 4 фразы, на них приходится 564 из 1016 ошибок `base.en`:

- `oh that's true`, 0,98 секунды звука, превратилось в `Thank you.`, повторённое 29 раз;
- `yeah yeah or one that yeah or one that`, 2,62 секунды, превратилось в `yeah`, повторённое 112 раз;
- `mine is serious chaos`, 10,15 секунды, превратилось в `I'm screaming.`, повторённое 56 раз;
- `but yeah it depends I mean I I really wanna put the summary in somewhere you know` записано почти верно, дальше идёт `I'm going to do` и после него `a little bit of`, повторённое 54 раза.

У `tiny.en` такая фраза одна. Говорящий сказал `D. and A.` за 0,41 секунды, а модель 24 раза подряд выдала `See you in the next video.`

Без своих 4 фраз `base.en` ошибается в 22,61% слов, а wav2vec2 large на тех же 196 фразах в 37,32. В статье 20,5 и 30,8 на всей тестовой части AMI.

У Whisper есть защита как раз от этого и я сам её выключил. Если текст окна сжимается zlib больше чем в 2,4 раза, окно считается зациклившимся. Если средняя логарифмическая вероятность его токенов ниже −1, модель считается неуверенной в окне. В обоих случаях окно декодируется заново при более высокой температуре. С `temperature=0` подниматься некуда.

Поэтому я прогнал совещание ещё раз с настройками `transcribe()` по умолчанию. 4 петли `base.en` пропали. `oh that's true` вернулось пустой строкой, а `mine is serious chaos` превратилось в более длинный текст, которого нет в эталоне: `Oh, they're all there. It's really on the other side of the car. I've got a phone in my iPhone. The mind is serious chaos.` Всего у `base.en` 24,96% ошибок, он лучше wav2vec2 large на 128 фразах и хуже на 29.

Но откат не бесплатный. На тех же 4 ядрах на медианную фразу уходило 3,5 секунды счёта, а на каждую из 8 самых медленных от 49 до 123 секунд. Самой медленной оказалась `she never said that`. Жадное декодирование записало её верно, но со средней логарифмической вероятностью −1,01, чуть за порогом. Поэтому её декодировали заново и получили `But I don't have to look at further through this content.`

`tiny.en` с настройками по умолчанию дал 32,83%. Фраза про следующее видео пропала, но теперь `D. and A.` превратилось в `Do you know what you're saying?`. Та же `she never said that` вышла как `She's never said bad.`, повторённое 4 раза. Эта петля осталась даже на последней температуре.

Оставшиеся ошибки у этих моделей разные. wav2vec2 пишет буквы, которые услышал. Whisper почти всегда пишет настоящее слово, пусть и неверное.

<figure class="fig">
<svg viewBox="0 0 680 206" role="img" aria-label="2 фразы из совещаний AMI. Эталон: IT DOES DOES AN N. X. T. SEARCH FOR THE STRING I DON'T KNOW TRANSCRIPT OR TEXT OR WHATEVER. wav2vec2 large: IT DOS DOES AN ANNEX SEARCH FOR THE STRING IDE NOTE TRANSCRIPT OR TEXT OR WHATEE. Whisper base.en: It does does an NXT search for the string, I don't know, transcript or text or whatever. Эталон: JUST SORT BANG ON IT. wav2vec2 large: SER BANGONT ASY. Whisper base.en: just for bang on it.">
  <text x="8" y="20" class="f-label f-muted">эталон</text>
  <text x="140" y="20" class="f-mono f-muted" style="font-size:11px">IT DOES DOES AN N. X. T. SEARCH FOR THE STRING I DON'T KNOW</text>
  <text x="140" y="36" class="f-mono f-muted" style="font-size:11px">TRANSCRIPT OR TEXT OR WHATEVER</text>
  <text x="8" y="56" class="f-label f-muted">wav2vec2 large</text>
  <text x="140" y="56" class="f-mono f-ink" style="font-size:11px">IT DOS DOES AN ANNEX SEARCH FOR THE STRING IDE NOTE TRANSCRIPT</text>
  <text x="140" y="72" class="f-mono f-ink" style="font-size:11px">OR TEXT OR WHATEE</text>
  <text x="8" y="92" class="f-label f-muted">Whisper base.en</text>
  <text x="140" y="92" class="f-mono f-accent" style="font-size:11px">It does does an NXT search for the string, I don't know,</text>
  <text x="140" y="108" class="f-mono f-accent" style="font-size:11px">transcript or text or whatever.</text>
  <text x="8" y="142" class="f-label f-muted">эталон</text>
  <text x="140" y="142" class="f-mono f-muted" style="font-size:11px">JUST SORT BANG ON IT</text>
  <text x="8" y="162" class="f-label f-muted">wav2vec2 large</text>
  <text x="140" y="162" class="f-mono f-ink" style="font-size:11px">SER BANGONT ASY</text>
  <text x="8" y="182" class="f-label f-muted">Whisper base.en</text>
  <text x="140" y="182" class="f-mono f-accent" style="font-size:11px">just for bang on it.</text>
</svg>
<figcaption>AMI, микрофон гарнитуры. Эталон заглавными, как в корпусе, ответы моделей как есть.</figcaption>
</figure>

На совещании 9,60% слов в выводе wav2vec2 base нет в словаре LibriSpeech на 200 тысяч слов. У wav2vec2 large таких 5,85%, у `tiny.en` 0,77%, столько же, сколько в самом эталоне. Неверное слово, похожее на настоящее, при чтении заметить труднее. И всё равно я лучше буду править `the summary in somewhere`, чем `THE SUMMARYNE SOME WHAR` от wav2vec2 base.

## Шум

Как на рисунке 5 статьи, я взял первые 100 своих фраз LibriSpeech. Добавил белый шум с отношением сигнал/шум 10 дБ и 0 дБ. При 0 дБ у шума та же средняя мощность, что у записи с учётом пауз.

При 10 дБ лучшая всё ещё wav2vec2 large, 4,74 против 8,81 у `base.en`. Интервал этой разницы от 2,48 до 5,89 пункта. wav2vec2 base падает до 19,49, хуже `tiny.en`, у которого 14,76. При 0 дБ впереди обе Whisper: `base.en` 36,12, `tiny.en` 52,15, wav2vec2 large 63,16 и wav2vec2 base 90,75. На 6 фразах из 100 wav2vec2 base не вернул вообще ничего.

<figure class="fig">
<svg viewBox="0 0 680 262" role="img" aria-label="Доля ошибочных слов на тех же 100 фразах LibriSpeech с белым шумом. Без шума, отношение сигнал/шум 10 дБ и 0 дБ. wav2vec2 large lv60 1,65%, 4,74%, 63,16%; wav2vec2 base 3,36%, 19,49%, 90,75%; Whisper base.en 3,25%, 8,81%, 36,12%; Whisper tiny.en 6,00%, 14,76%, 52,15%.">
  <line x1="70" x2="460" y1="230.0" y2="230.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="234.0" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="70" x2="460" y1="180.0" y2="180.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="184.0" text-anchor="end" class="f-label f-muted">25%</text>
  <line x1="70" x2="460" y1="130.0" y2="130.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="134.0" text-anchor="end" class="f-label f-muted">50%</text>
  <line x1="70" x2="460" y1="80.0" y2="80.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="84.0" text-anchor="end" class="f-label f-muted">75%</text>
  <line x1="70" x2="460" y1="30.0" y2="30.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="34.0" text-anchor="end" class="f-label f-muted">100%</text>
  <text x="90" y="250" text-anchor="middle" class="f-label f-ink">без шума</text>
  <text x="270" y="250" text-anchor="middle" class="f-label f-ink">10 дБ</text>
  <text x="450" y="250" text-anchor="middle" class="f-label f-ink">0 дБ</text>
  <polyline points="90.0,226.7 270.0,220.5 450.0,103.7" style="fill:none;stroke:var(--muted);stroke-width:2"/>
  <circle cx="90.0" cy="226.7" r="3.5" class="f-muted"/>
  <circle cx="270.0" cy="220.5" r="3.5" class="f-muted"/>
  <circle cx="450.0" cy="103.7" r="3.5" class="f-muted"/>
  <text x="464" y="107.7" class="f-mono f-ink" style="font-size:11px">wav2vec2 large lv60 63,16</text>
  <polyline points="90.0,223.3 270.0,191.0 450.0,48.5" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4"/>
  <circle cx="90.0" cy="223.3" r="3.5" class="f-muted"/>
  <circle cx="270.0" cy="191.0" r="3.5" class="f-muted"/>
  <circle cx="450.0" cy="48.5" r="3.5" class="f-muted"/>
  <text x="464" y="52.5" class="f-mono f-ink" style="font-size:11px">wav2vec2 base 90,75</text>
  <polyline points="90.0,223.5 270.0,212.4 450.0,157.8" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <circle cx="90.0" cy="223.5" r="3.5" class="f-accent"/>
  <circle cx="270.0" cy="212.4" r="3.5" class="f-accent"/>
  <circle cx="450.0" cy="157.8" r="3.5" class="f-accent"/>
  <text x="464" y="161.8" class="f-mono f-accent" style="font-size:11px">Whisper base.en 36,12</text>
  <polyline points="90.0,218.0 270.0,200.5 450.0,125.7" style="fill:none;stroke:var(--accent);stroke-width:2;stroke-dasharray:5 4"/>
  <circle cx="90.0" cy="218.0" r="3.5" class="f-accent"/>
  <circle cx="270.0" cy="200.5" r="3.5" class="f-accent"/>
  <circle cx="450.0" cy="125.7" r="3.5" class="f-accent"/>
  <text x="464" y="129.7" class="f-mono f-accent" style="font-size:11px">Whisper tiny.en 52,15</text>
</svg>
<figcaption>Те же 100 фраз чистого LibriSpeech, белый шум 10 дБ и 0 дБ.</figcaption>
</figure>

## Чего я не проверял

- Модели крупнее, beam search и настройки командной строки, где по умолчанию ширина луча 5.
- Шум в пабе и музыку. Шум здесь белый и добавлен мной.
- AMI здесь это 3 совещания и 4 говорящих. Каждое число выше получено одним прогоном на 200 фразах.
- Честен ли нормализатор Whisper по отношению к wav2vec2. Он написан для вывода Whisper.

Для своих записей я начну с `base.en` и оставлю откат по температуре включённым, но короткие и тихие куски после него буду перечитывать.
