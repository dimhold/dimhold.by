---
title: "С рекомендованным порогом BPE режет белорусские слова мельче, чем словарь, который белорусского не видел"
description: "Я обучил один словарь BPE на английском, русском и щепотке белорусского из Tatoeba. Белорусское слово стоит в 1,4 раза больше кусков, чем русское, а если русского взять столько же, разница пропадает. С порогом 50 из README выходит хуже, чем со словарём без белорусского."
date: 2018-03-31
lang: ru
translationKey: tokens-break-meaning
tags: ["machine-learning", "text", "open-data"]
---

Я дал токенизатору Moses одно белорусское слово, "семья", с 3 разными апострофами:

```
$ printf "сям'я сям’я сямʼя\n" | perl tokenizer.perl -q -l be
WARNING: No known abbreviations for language 'be', attempting fall-back to English version...
сям &apos; я сям ’ я сямʼя
```

Апостроф в белорусском это часть написания слова, почти буква. С машинописным `'` и с типографским `’` получаются 3 токена. С U+02BC слово остаётся целым, потому что для Юникода этот знак и есть буква. В моей выборке его не набирает никто. Машинописный встретился 45 раз, типографский 47.

<figure class="fig">
<svg viewBox="0 0 680 178" role="img" aria-label="Белорусское слово семья, набранное с 3 апострофами. U+0027: токены Moses сям &amp;apos; я (3), куски ся м &amp;apos; я (4). U+2019: токены Moses сям ’ я (3), куски ся м ’ я (4). U+02BC: токены Moses сямʼя (1), куски ся м ʼ я (4).">
  <text x="14.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">ввод</text>
  <text x="200.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">после Moses, -l be</text>
  <text x="440.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">после общего BPE</text>
  <text x="14.0" y="49.5" text-anchor="start" class="f-mono f-ink" style="font-size:13px">сям'я</text>
  <text x="76.0" y="49.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">U+0027</text>
  <rect x="200.0" y="32" width="37.4" height="26" class="f-box"/>
  <text x="218.7" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">сям</text>
  <rect x="242.4" y="32" width="60.8" height="26" class="f-box"/>
  <text x="272.8" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">&amp;apos;</text>
  <rect x="308.2" y="32" width="21.8" height="26" class="f-box"/>
  <text x="319.1" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
  <rect x="440.0" y="32" width="29.6" height="26" class="f-box"/>
  <text x="454.8" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ся</text>
  <rect x="474.6" y="32" width="21.8" height="26" class="f-box"/>
  <text x="485.5" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">м</text>
  <rect x="501.4" y="32" width="60.8" height="26" class="f-box"/>
  <text x="531.8" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">&amp;apos;</text>
  <rect x="567.2" y="32" width="21.8" height="26" class="f-box"/>
  <text x="578.1" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
  <line x1="14" y1="71" x2="666" y2="71" class="f-plain"/>
  <text x="14.0" y="101.5" text-anchor="start" class="f-mono f-ink" style="font-size:13px">сям’я</text>
  <text x="76.0" y="101.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">U+2019</text>
  <rect x="200.0" y="84" width="37.4" height="26" class="f-box"/>
  <text x="218.7" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">сям</text>
  <rect x="242.4" y="84" width="21.8" height="26" class="f-box"/>
  <text x="253.3" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">’</text>
  <rect x="269.2" y="84" width="21.8" height="26" class="f-box"/>
  <text x="280.1" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
  <rect x="440.0" y="84" width="29.6" height="26" class="f-box"/>
  <text x="454.8" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ся</text>
  <rect x="474.6" y="84" width="21.8" height="26" class="f-box"/>
  <text x="485.5" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">м</text>
  <rect x="501.4" y="84" width="21.8" height="26" class="f-box"/>
  <text x="512.3" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">’</text>
  <rect x="528.2" y="84" width="21.8" height="26" class="f-box"/>
  <text x="539.1" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
  <line x1="14" y1="123" x2="666" y2="123" class="f-plain"/>
  <text x="14.0" y="153.5" text-anchor="start" class="f-mono f-ink" style="font-size:13px">сямʼя</text>
  <text x="76.0" y="153.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">U+02BC</text>
  <rect x="200.0" y="136" width="53.0" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="226.5" y="153.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">сямʼя</text>
  <rect x="440.0" y="136" width="29.6" height="26" class="f-box"/>
  <text x="454.8" y="153.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ся</text>
  <rect x="474.6" y="136" width="21.8" height="26" class="f-box"/>
  <text x="485.5" y="153.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">м</text>
  <rect x="501.4" y="136" width="21.8" height="26" class="f-box"/>
  <text x="512.3" y="153.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ʼ</text>
  <rect x="528.2" y="136" width="21.8" height="26" class="f-box"/>
  <text x="539.1" y="153.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
</svg>
<figcaption>Одно слово, 3 апострофа. Через токенизатор целым проходит только U+02BC. Общий BPE его всё равно режет.</figcaption>
</figure>

Я много раз прогонял текст через токенизатор и BPE одной командой, а в результат заглядывал с английской стороны. Там всё выглядит прилично. Что происходит с маленьким языком, когда у него общий словарь с 2 большими, я не проверял ни разу. А советуют обычно именно общий.

BPE в машинный перевод принесли Сеннрич с соавторами (2016). Джонсон с коллегами из Google (2017) обучают один словарь wordpiece сразу на много языков. Деление по частоте уже сравнивали с делением по морфологии: Атаман с соавторами на турецком, Хук с соавторами на немецком, обе работы 2017 года. Мне хотелось увидеть числа для белорусского.

## Что я взял

Tatoeba, только предложения, которые последний раз правили до 31 марта 2018 года. Белорусских таких 3671. Из них 400, у которых есть и русский и английский перевод, стали тестом. Остальные 3270 ушли в обучение (ещё одно повторяло тестовое) вместе с 60 000 русских и 60 000 английских. На белорусский приходится 2,4% токенов. Весь текст в нижнем регистре.

Инструменты: `tokenizer.perl` из Moses и `subword-nmt` на коммите от 28 марта. Во всех словарях, кроме чисто белорусского, 10 000 слияний. Считаю я куски на слово, на одних и тех же 400 предложениях на 3 языках.

## Те же предложения, в 1,4 раза больше кусков

С общим словарём английское слово стоит 1,33 куска, русское 1,51, белорусское 2,12. До запуска я записал, что белорусский будет хуже русского хотя бы в 1,3 раза. Вышло 1,40, бутстреп по предложениям даёт от 1,37 до 1,43.

Русское `информации` это один кусок. Белорусское `інфармацыі` это `ін|фа|рма|цыі`.

Проще всего сказать, что язык такой. Поэтому я обрезал русский до тех же 3270 строк и обучил словарь заново. У русского стало 1,93, у белорусского 1,88. При равных данных отношение 0,97, так что на этом корпусе всё дело в объёме.

Потом я вернул русский целиком и повторил белорусские строки 18 раз, способ грубый. У белорусского стало 1,62, у русского 1,64, потому что те же 10 000 слияний теперь приходится делить на всех. Английский сдвинулся с 1,33 до 1,43. Чисто белорусский словарь на 4000 слияний даёт 1,70.

<figure class="fig">
<svg viewBox="0 0 680 246" role="img" aria-label="Кусков на белорусское слово на 400 тестовых предложениях с 6 словарями: общий, порог 50 3,28; совсем без белорусского 2,96; общий 2,12; русский до 3270 строк 1,88; только белорусский, 4000 1,70; белорусский x18 1,62. Вертикальная линия: русский с общим словарём, 1,51.">
  <text x="210.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">кусков на белорусское слово</text>
  <text x="200.0" y="43.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">общий, порог 50</text>
  <rect x="210" y="28" width="384.0" height="22" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="602.0" y="43.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">3,28</text>
  <text x="200.0" y="75.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">совсем без белорусского</text>
  <rect x="210" y="60" width="346.3" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="564.3" y="75.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">2,96</text>
  <text x="200.0" y="107.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">общий</text>
  <rect x="210" y="92" width="247.8" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="465.8" y="107.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">2,12</text>
  <text x="200.0" y="139.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">русский до 3270 строк</text>
  <rect x="210" y="124" width="220.0" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="438.0" y="139.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,88</text>
  <text x="200.0" y="171.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">только белорусский, 4000</text>
  <rect x="210" y="156" width="199.5" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="417.5" y="171.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,70</text>
  <text x="200.0" y="203.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">белорусский x18</text>
  <rect x="210" y="188" width="189.7" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="407.7" y="203.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,62</text>
  <line x1="387.2" y1="24" x2="387.2" y2="220" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
  <text x="387.2" y="234.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">русский, общий 1,51</text>
</svg>
<figcaption>Одни и те же 2323 белорусских слова с разными словарями. Цветом выделен рецепт из README.</figcaption>
</figure>

## Порог

README у `subword-nmt` предупреждает: с общим словарём слово может порезаться на куски, которые встречались только в другом языке. Там советуют построить словарь для каждого языка отдельно и применить BPE ещё раз с `--vocabulary-threshold 50`. Тут я ничего не ждал, просто добавил прогон, раз рецепт официальный.

Белорусский ушёл с 2,12 на 3,28 куска на слово. Для сравнения я взял словарь, обученный только на английском и русском, который не видел ни одной белорусской строки. У него 2,96. То есть по рецепту вышло в 1,11 раза хуже, чем совсем без белорусского (от 1,09 до 1,13). 53% кусков это одиночные буквы, вырезанные из более длинных слов. `інфармацыі` теперь выглядит так: `і|н|ф|а|р|ма|ц|ы|і`.

Объясняется это арифметикой. С общими слияниями в белорусском обучающем тексте 1774 разных куска, из них 50 раз и чаще встречаются только 186. Остальные разбираются обратно на части. С порогом 20 получается 2,60, с порогом 5 выходит 2,24. Русский и английский тоже теряют, до 2,06 и 1,67, для такого порога и 60 000 предложений мало. На корпус в 3270 строк совет не рассчитан, но в README стоит 50. Я бы его скопировал.

## Где ломается смысл

Число кусков мало что говорит о смысле, поэтому я взял Universal Dependencies 2.1, где у каждого слова есть словарная форма. Для существительных, глаголов и прилагательных от 5 букв я сравнил форму в тексте со словарной. Общее начало не короче 3 букв считаю основой, остальное окончанием. Дальше смотрю, попал ли хоть один разрез на конец основы. Русских и английских пар намного больше, из них взята случайная выборка того же размера.

Первая таблица выглядела нормально, а вот список примеров нет. Словарная форма слова "банковский" порезалась с одинокой `i` в конце. Это была латинская i. В белорусском корпусе 69 словарных форм, где латинская буква сидит внутри кириллического слова, в Tatoeba нашлось 28 таких слов. `краіну` с латинской i превращается в `кра|i|ну` вместо `краі|ну`. Я выкинул 85 пар с латиницей, осталось 1597. Числа сдвинулись меньше чем на процентный пункт.

Вторую ошибку я заметил, когда готовил рисунок ниже. У `справах` моё правило брало за основу целиком `справа`, вместе с гласной из окончания. Поэтому у славянских существительных и прилагательных я теперь сначала убираю словарное окончание. У глаголов и в английском осталось общее начало.

Из порезанных белорусских слов у 25,8% есть разрез на конце основы. Столько же разрезов в случайных местах дали бы 36,3%. У русского 19,7% против 26,2%, у английского 14,4% против 25,7%. У 59,8% порезанных белорусских слов на конце основы разреза нет, но есть на букву раньше, хотя при случайных разрезах таких было бы 25,6%. Последняя буква основы уходит в окончание. Среди самых частых последних кусков `най`, `ных`, `кі` и `нага`, то есть окончание с приклеенной согласной. С согласной начинаются 88% последних кусков.

По частям речи картина разная. У прилагательных разрез на месте в 6,3% слов, у существительных в 15,5%. А у глаголов в 70,1%, примерно вдвое чаще случайных разрезов (33,7%). Правда, основа глагола у меня это общее начало с инфинитивом, она часто кончается на гласную, дальше идёт `ў` или `ла`. Так что часть этих 70% получилась из самого правила.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="Семь форм белорусского слова справа, порезанных на куски. Общий словарь: спра|ва, спра|вы, с|прав|е, с|прав|у, спра|вай, спра|ў, спра|вах. Белорусские строки повторены 18 раз: справа, справы, справе, спра|ву, спра|вай, спра|ў, спра|ва|х. Основа занимает 5 букв, у формы спраў окончания нет.">
  <text x="130.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">общий</text>
  <text x="420.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">белорусский x18</text>
  <text x="14.0" y="47.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справа</text>
  <rect x="130.0" y="30" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="47.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="30" width="29.6" height="26" class="f-box"/>
  <text x="195.0" y="47.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ва</text>
  <path d="M191.0 65 L199.0 65 L195.0 58 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="30" width="60.8" height="26" class="f-box"/>
  <text x="450.4" y="47.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">справа</text>
  <path d="M462.0 65 L470.0 65 L466.0 58 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="89.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справы</text>
  <rect x="130.0" y="72" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="89.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="72" width="29.6" height="26" class="f-box"/>
  <text x="195.0" y="89.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">вы</text>
  <path d="M191.0 107 L199.0 107 L195.0 100 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="72" width="60.8" height="26" class="f-box"/>
  <text x="450.4" y="89.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">справы</text>
  <path d="M462.0 107 L470.0 107 L466.0 100 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="131.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справе</text>
  <rect x="130.0" y="114" width="21.8" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="140.9" y="131.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">с</text>
  <rect x="156.8" y="114" width="45.2" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="179.4" y="131.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">прав</text>
  <path d="M200.5 149 L208.5 149 L204.5 142 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="207.0" y="114" width="21.8" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="217.9" y="131.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">е</text>
  <rect x="420.0" y="114" width="60.8" height="26" class="f-box"/>
  <text x="450.4" y="131.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">справе</text>
  <path d="M462.0 149 L470.0 149 L466.0 142 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="173.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справу</text>
  <rect x="130.0" y="156" width="21.8" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="140.9" y="173.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">с</text>
  <rect x="156.8" y="156" width="45.2" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="179.4" y="173.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">прав</text>
  <path d="M200.5 191 L208.5 191 L204.5 184 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="207.0" y="156" width="21.8" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="217.9" y="173.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">у</text>
  <rect x="420.0" y="156" width="45.2" height="26" class="f-box"/>
  <text x="442.6" y="173.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="470.2" y="156" width="29.6" height="26" class="f-box"/>
  <text x="485.0" y="173.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ву</text>
  <path d="M481.0 191 L489.0 191 L485.0 184 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="215.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справай</text>
  <rect x="130.0" y="198" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="215.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="198" width="37.4" height="26" class="f-box"/>
  <text x="198.9" y="215.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">вай</text>
  <path d="M191.0 233 L199.0 233 L195.0 226 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="198" width="45.2" height="26" class="f-box"/>
  <text x="442.6" y="215.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="470.2" y="198" width="37.4" height="26" class="f-box"/>
  <text x="488.9" y="215.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">вай</text>
  <path d="M481.0 233 L489.0 233 L485.0 226 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="257.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">спраў</text>
  <rect x="130.0" y="240" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="257.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="240" width="21.8" height="26" class="f-box"/>
  <text x="191.1" y="257.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ў</text>
  <path d="M198.0 275 L206.0 275 L202.0 268 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="240" width="45.2" height="26" class="f-box"/>
  <text x="442.6" y="257.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="470.2" y="240" width="21.8" height="26" class="f-box"/>
  <text x="481.1" y="257.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ў</text>
  <path d="M488.0 275 L496.0 275 L492.0 268 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="299.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справах</text>
  <rect x="130.0" y="282" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="282" width="37.4" height="26" class="f-box"/>
  <text x="198.9" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">вах</text>
  <path d="M191.0 317 L199.0 317 L195.0 310 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="282" width="45.2" height="26" class="f-box"/>
  <text x="442.6" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="470.2" y="282" width="29.6" height="26" class="f-box"/>
  <text x="485.0" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ва</text>
  <path d="M481.0 317 L489.0 317 L485.0 310 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="504.8" y="282" width="21.8" height="26" class="f-box"/>
  <text x="515.7" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">х</text>
  <path d="M14 336 L22 336 L18 329 Z" style="fill:var(--ink);stroke:none"/>
  <text x="30.0" y="336.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">конец основы</text>
</svg>
<figcaption>Формы слова справа (дело). Треугольник стоит на конце основы. С общим словарём там порезаны только 2 формы из 7. У этих 2 нет общих кусков с остальными.</figcaption>
</figure>

Это хорошо видно на белорусском слове `справа` (дело). С общим словарём 5 его форм начинаются с `спра`, а 2 превращаются в `с|прав|е` и `с|прав|у`. Кусок `прав` вырос из русского текста. У этих 2 форм нет ни одного общего куска с остальными 5.

После повторения 3 формы стали целыми словами и между собой тоже не имеют общих кусков. По всей выборке общий кусок от 3 букв есть у 60,7% белорусских пар (форма и её словарная форма), после повторения у 57,3%. Разница 3,4 пункта, бутстреп даёт от 0,9 до 6,0.

Я ждал, что если кусков меньше, то и сами они лучше, но этого не видно. После повторения разрез на конце основы есть у 17,5% порезанных слов, случайные разрезы дали бы 28,0%. Отставание от случайных те же 10,5 пункта, что и раньше.

## Что я не проверял

Модель перевода я не обучал, поэтому сколько всё это стоит в BLEU, не знаю. Основа у меня всё равно грубая. Если согласная на её конце чередуется, она короче, чем у лингвиста. Предложения в Tatoeba короткие и простые. Как минимум 33 белорусские строки в обучении написаны в старой орфографии, с мягким знаком в `сьць`. Случайная выборка обучающих предложений была одна, тестовые 400 всё время одни и те же.
