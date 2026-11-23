---
title: "Самый дешёвый язык на T5 тот, который он не умеет читать"
description: "Те же 5010 пар XNLI test на 15 языках на токенизаторах января 2020 года. GPT-2 берёт за тайский в 7,99 раза больше, чем за английский. T5 делает тайский в 3 раза дешевле английского, потому что теряет 95% текста в <unk>. На mBERT флаг --max_seq_length=128 из README режет каждую четвёртую тайскую пару и ни одной английской."
date: 2020-01-15
lang: ru
translationKey: token-tax-xnli
tags: ["llm", "machine-learning", "text"]
---
В README многоязычного BERT есть команда для обучения на XNLI, тестовом наборе на 15 языках. Один из флагов там `--max_seq_length=128`, это же значение стоит по умолчанию в `run_classifier.py`. Я всегда читал "128 токенов" как "длинное предложение" на любом языке. Токен у меня в голове это слово, плюс-минус суффикс. Сколько это 128 по-тайски или по-гречески, я ни разу не считал.

Поэтому я посчитал на 4 токенизаторах, которые смог достать в январе, чтобы понять, чья это проблема: BERT или языка.

## Как мерил

В тестовой части XNLI 5010 пар, в каждой посылка и гипотеза. Обе части сначала были английскими: посылки взяты из готовых текстов, гипотезы написали краудворкеры. Профессиональные переводчики перевели их на 14 других языков, так что меняется только язык. Налогом я дальше называю число токенов языка, делённое на число токенов английского на том же токенизаторе. Считается по всем 5010 парам, без служебных токенов.

Токенизаторы:

- GPT-2, BPE на уровне байтов со словарём на 50257 токенов, с февраля прошлого года;
- T5, словарь SentencePiece на 32000 кусков плюс 100 служебных, с октября. В статье сказано, что словарь обучали в основном на английском, с добавкой немецкого, французского и румынского;
- многоязычный BERT, cased, словарь WordPiece на 119547 токенов для 104 языков;
- XLM-R, словарь SentencePiece на 250002 токена для 100 языков, вышел в ноябре.

Считал я кодом Hugging Face. Потом сверил каждое число на всех 15 языках с оригинальным кодом. Для T5 и XLM-R это их файлы моделей sentencepiece, для mBERT это `tokenization.py` из репозитория Google. У mBERT первая сверка не сошлась, к этому я вернусь ниже.

До подсчёта я записал, чего жду. На GPT-2 русский должен стоить от 4 до 6 раз дороже английского. Для тайского и хинди я записал 8 и больше, потому что их буквы занимают 3 байта в UTF-8. mBERT от 1,1 до 1,8, XLM-R от 1,0 до 1,4. T5 должен выбрасывать всё, что не латиница, в `<unk>`.

## GPT-2

На GPT-2 английские пары занимают 171534 токена. Русский в 5,26 раза больше, греческий в 5,77, хинди в 6,86, тайский в 7,99. 3 западноевропейских языка держатся между 1,77 и 2,00. Китайский всего 2,81. Каждый иероглиф стоит около 2 токенов, но на те же пары иероглифов уходит примерно в 3 раза меньше, чем английских букв.

Английская пара в среднем 34 токена, тайская 273. У GPT-2 окно в 1024 токена, поэтому в него влезает около 30 английских пар и 3 тайские. "We had a great talk." по-английски это 6 токенов, а его тайский перевод 50.

<figure class="fig">
<svg viewBox="0 0 680 236" role="img" aria-label="Фраза &quot;We had a great talk.&quot; по-английски и по-тайски, разрезанная на токены. GPT-2, английский: 6 токенов. GPT-2, тайский: 50 токенов. T5, английский: 7 токенов. T5, тайский: 2 токена. mBERT, английский: 6 токенов. mBERT, тайский: 21 токен. XLM-R, английский: 6 токенов. XLM-R, тайский: 7 токенов.">
  <text x="10" y="33" class="f-mono f-ink" style="font-size:12px">GPT-2</text>
  <text x="142.0" y="33.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">английский</text>
  <rect x="150.0" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="160.1" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="170.2" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="180.3" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="190.4" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="200.5" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <text x="216.6" y="33.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="142.0" y="55.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">тайский</text>
  <rect x="150.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="160.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="170.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="180.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="190.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="200.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="210.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="220.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="230.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="240.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="251.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="261.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="271.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="281.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="291.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="301.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="311.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="321.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="331.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="341.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="352.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="362.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="372.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="382.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="392.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="402.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="412.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="422.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="432.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="442.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="453.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="463.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="473.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="483.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="493.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="503.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="513.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="523.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="533.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="543.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="554.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="564.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="574.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="584.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="594.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="604.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="614.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="624.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="634.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="644.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <text x="661.0" y="55.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">50</text>
  <text x="10" y="87" class="f-mono f-ink" style="font-size:12px">T5</text>
  <text x="142.0" y="87.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">английский</text>
  <rect x="150.0" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="160.1" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="170.2" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="180.3" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="190.4" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="200.5" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="210.6" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <text x="226.7" y="87.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">7</text>
  <text x="142.0" y="109.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">тайский</text>
  <rect x="150.0" y="99" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="160.1" y="99" width="60" height="13" rx="1.5" class="f-accent" style="stroke:none"/>
  <text x="190.1" y="109" text-anchor="middle" class="f-mono" style="font-size:10px;fill:var(--surface)">&lt;unk&gt;</text>
  <text x="241.4" y="109.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2</text>
  <text x="10" y="141" class="f-mono f-ink" style="font-size:12px">mBERT</text>
  <text x="142.0" y="141.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">английский</text>
  <rect x="150.0" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="160.1" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="170.2" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="180.3" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="190.4" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="200.5" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <text x="216.6" y="141.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="142.0" y="163.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">тайский</text>
  <rect x="150.0" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="160.1" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="170.2" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="180.3" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="190.4" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="200.5" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="210.6" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="220.7" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="230.8" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="240.9" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="251.0" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="261.1" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="271.2" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="281.3" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="291.4" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="301.5" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="311.6" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="321.7" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="331.8" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="341.9" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="352.0" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <text x="368.1" y="163.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">21</text>
  <text x="10" y="195" class="f-mono f-ink" style="font-size:12px">XLM-R</text>
  <text x="142.0" y="195.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">английский</text>
  <rect x="150.0" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="160.1" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="170.2" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="180.3" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="190.4" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="200.5" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <text x="216.6" y="195.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="142.0" y="217.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">тайский</text>
  <rect x="150.0" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="160.1" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="170.2" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="180.3" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="190.4" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="200.5" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="210.6" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <text x="226.7" y="217.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">7</text>
</svg>
<figcaption>Одна и та же гипотеза XNLI по-английски и в тайском переводе. Каждая клетка это один токен. На T5 от тайского предложения остаются метка пробела и один &lt;unk&gt;.</figcaption>
</figure>

## T5 и дешёвый тайский

Потом T5 выдал мне тайский в 0,31 от английского и китайский в 0,27. Я ведь сам записал, что T5 теряет всё, что не латиница. И всё равно на секунду увидел в этом числе скидку.

Тайская фраза про разговор на T5 занимает 2 токена: метку пробела и один `<unk>`. Подряд идущие неизвестные символы становятся одним `<unk>`, поэтому тайское предложение без пробелов схлопывается почти в ничто. Я посчитал символы, которые попадают внутрь `<unk>`. В тайском это 95,4% символов, в арабском 96,5%, в хинди 93,5%, в греческом 93,2%, в китайском 87,0%.

С русским запутаннее. На T5 он стоит в 3,24 раза дороже английского и при этом 21,8% его букв всё равно пропадают. В словаре 80 кусков с кириллицей, например "ре" или "ра". Наверное, они пришли из кириллических обрывков в английских данных для обучения. Но п, ы, я и ь там нет. Так что за русский модель платит больше, чем за английский, но при этом не видит пятой части букв. Испанский теряет 0,9% символов. Это удивило меня больше. В T5 нет "í", поэтому "aquí" доходит до модели как "aqu" и дырка.

Если бы я ранжировал только по налогу, T5 показал бы тайский и китайский своими лучшими языками. Поэтому на рисунке отмечено, где большая часть текста ушла в `<unk>`.

<figure class="fig">
<svg viewBox="0 0 680 382" role="img" aria-label="Во сколько раз токенов в языке больше, чем в английском, тестовая часть XNLI, 5010 пар, логарифмическая шкала. английский: GPT-2 1,00, T5 1,00, mBERT 1,00, XLM-R 1,00. испанский: GPT-2 1,77, T5 1,96, mBERT 1,14, XLM-R 1,07. французский: GPT-2 1,86, T5 1,52, mBERT 1,28, XLM-R 1,25. суахили: GPT-2 1,93, T5 2,40, mBERT 1,39, XLM-R 1,07. немецкий: GPT-2 2,00, T5 1,27, mBERT 1,19, XLM-R 1,11. турецкий: GPT-2 2,24, T5 2,44, mBERT 1,31, XLM-R 0,99. китайский: GPT-2 2,81, T5 0,27 &lt;unk&gt;, mBERT 1,26, XLM-R 0,86. арабский: GPT-2 3,99, T5 1,32 &lt;unk&gt;, mBERT 1,38, XLM-R 1,08. вьетнамский: GPT-2 4,31, T5 3,50, mBERT 1,24, XLM-R 1,15. болгарский: GPT-2 5,20, T5 3,17, mBERT 1,50, XLM-R 1,13. русский: GPT-2 5,26, T5 3,24, mBERT 1,38, XLM-R 1,11. урду: GPT-2 5,65, T5 1,82 &lt;unk&gt;, mBERT 1,56, XLM-R 1,16. греческий: GPT-2 5,77, T5 1,58 &lt;unk&gt;, mBERT 2,00, XLM-R 1,31. хинди: GPT-2 6,86, T5 1,74 &lt;unk&gt;, mBERT 1,67, XLM-R 1,20. тайский: GPT-2 7,99, T5 0,31 &lt;unk&gt;, mBERT 2,67, XLM-R 0,99.">
  <line x1="150.8" y1="16" x2="150.8" y2="318" class="f-plain" />
  <text x="150.8" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,25</text>
  <line x1="246.5" y1="16" x2="246.5" y2="318" class="f-plain" />
  <text x="246.5" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,5</text>
  <line x1="342.2" y1="16" x2="342.2" y2="318" class="f-plain" style="stroke:var(--muted)"/>
  <text x="342.2" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="437.8" y1="16" x2="437.8" y2="318" class="f-plain" />
  <text x="437.8" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="533.5" y1="16" x2="533.5" y2="318" class="f-plain" />
  <text x="533.5" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="629.2" y1="16" x2="629.2" y2="318" class="f-plain" />
  <text x="629.2" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <text x="110.0" y="28.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">английский</text>
  <circle cx="342.2" cy="24" r="4" style="fill:var(--muted)"/>
  <circle cx="342.2" cy="24" r="4" class="f-accent"/>
  <rect x="338.2" y="20" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="342.2" cy="24" r="4" class="f-ink"/>
  <text x="110.0" y="48.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">испанский</text>
  <circle cx="360.2" cy="44" r="4" style="fill:var(--muted)"/>
  <circle cx="351.8" cy="44" r="4" class="f-accent"/>
  <rect x="431.1" y="40" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="420.8" cy="44" r="4" class="f-ink"/>
  <text x="110.0" y="68.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">французский</text>
  <circle cx="376.6" cy="64" r="4" style="fill:var(--muted)"/>
  <circle cx="372.6" cy="64" r="4" class="f-accent"/>
  <rect x="395.8" y="60" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="427.8" cy="64" r="4" class="f-ink"/>
  <text x="110.0" y="88.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">суахили</text>
  <circle cx="388.0" cy="84" r="4" style="fill:var(--muted)"/>
  <circle cx="351.4" cy="84" r="4" class="f-accent"/>
  <rect x="459.0" y="80" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="433.2" cy="84" r="4" class="f-ink"/>
  <text x="110.0" y="108.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">немецкий</text>
  <circle cx="365.8" cy="104" r="4" style="fill:var(--muted)"/>
  <circle cx="355.9" cy="104" r="4" class="f-accent"/>
  <rect x="371.1" y="100" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="438.0" cy="104" r="4" class="f-ink"/>
  <text x="110.0" y="128.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">турецкий</text>
  <circle cx="379.3" cy="124" r="4" style="fill:var(--muted)"/>
  <circle cx="341.0" cy="124" r="4" class="f-accent"/>
  <rect x="461.1" y="120" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="453.3" cy="124" r="4" class="f-ink"/>
  <text x="110.0" y="148.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">китайский</text>
  <circle cx="373.7" cy="144" r="4" style="fill:var(--muted)"/>
  <circle cx="321.8" cy="144" r="4" class="f-accent"/>
  <rect x="159.2" y="140" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M159.2,140l8,8M167.2,140l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="484.6" cy="144" r="4" class="f-ink"/>
  <text x="110.0" y="168.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">арабский</text>
  <circle cx="386.5" cy="164" r="4" style="fill:var(--muted)"/>
  <circle cx="352.1" cy="164" r="4" class="f-accent"/>
  <rect x="376.9" y="160" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M376.9,160l8,8M384.9,160l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="533.0" cy="164" r="4" class="f-ink"/>
  <text x="110.0" y="188.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">вьетнамский</text>
  <circle cx="372.1" cy="184" r="4" style="fill:var(--muted)"/>
  <circle cx="361.9" cy="184" r="4" class="f-accent"/>
  <rect x="511.0" y="180" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="543.8" cy="184" r="4" class="f-ink"/>
  <text x="110.0" y="208.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">болгарский</text>
  <circle cx="398.2" cy="204" r="4" style="fill:var(--muted)"/>
  <circle cx="358.6" cy="204" r="4" class="f-accent"/>
  <rect x="497.4" y="200" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="569.8" cy="204" r="4" class="f-ink"/>
  <text x="110.0" y="228.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">русский</text>
  <circle cx="386.4" cy="224" r="4" style="fill:var(--muted)"/>
  <circle cx="356.3" cy="224" r="4" class="f-accent"/>
  <rect x="500.3" y="220" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="571.2" cy="224" r="4" class="f-ink"/>
  <text x="110.0" y="248.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">урду</text>
  <circle cx="403.2" cy="244" r="4" style="fill:var(--muted)"/>
  <circle cx="362.9" cy="244" r="4" class="f-accent"/>
  <rect x="421.1" y="240" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M421.1,240l8,8M429.1,240l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="581.2" cy="244" r="4" class="f-ink"/>
  <text x="110.0" y="268.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">греческий</text>
  <circle cx="437.6" cy="264" r="4" style="fill:var(--muted)"/>
  <circle cx="379.7" cy="264" r="4" class="f-accent"/>
  <rect x="401.2" y="260" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M401.2,260l8,8M409.2,260l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="584.2" cy="264" r="4" class="f-ink"/>
  <text x="110.0" y="288.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">хинди</text>
  <circle cx="412.8" cy="284" r="4" style="fill:var(--muted)"/>
  <circle cx="367.0" cy="284" r="4" class="f-accent"/>
  <rect x="415.0" y="280" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M415.0,280l8,8M423.0,280l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="608.0" cy="284" r="4" class="f-ink"/>
  <text x="110.0" y="308.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">тайский</text>
  <circle cx="477.6" cy="304" r="4" style="fill:var(--muted)"/>
  <circle cx="340.2" cy="304" r="4" class="f-accent"/>
  <rect x="175.4" y="300" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M175.4,300l8,8M183.4,300l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="629.0" cy="304" r="4" class="f-ink"/>
  <text x="390" y="350" text-anchor="middle" class="f-label f-muted" style="font-size:10px">во сколько раз больше английского, логарифмическая шкала</text>
  <circle cx="24" cy="368" r="4" class="f-ink"/>
  <text x="34.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">GPT-2</text>
  <rect x="120" y="364" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="134.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">T5</text>
  <rect x="200" y="364" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/><path d="M200,364l8,8M208,364l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <text x="214.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">T5, в основном &lt;unk&gt;</text>
  <circle cx="439" cy="368" r="4" style="fill:var(--muted)"/>
  <text x="449.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">mBERT</text>
  <circle cx="539" cy="368" r="4" class="f-accent"/>
  <text x="549.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">XLM-R</text>
</svg>
<figcaption>Число токенов языка, делённое на число токенов английского на том же токенизаторе, 5010 пар XNLI test. Перечёркнутый квадрат T5 значит, что больше половины символов ушло в &lt;unk&gt;.</figcaption>
</figure>

## mBERT и 128

mBERT у большинства языков попал в ожидаемый диапазон: испанский 1,14, русский 1,38, хинди 1,67. Греческий 2,00, тайский 2,67.

С `[CLS]` и 2 `[SEP]` ни одна английская пара не выходит за 128 токенов, самая длинная занимает 92. В тайском за 128 выходят 1222 пары из 5010. Это 24,4%. В таких парах `_truncate_seq_pair` отрезает токены от более длинного предложения, пока пара не влезет. Всего 6,5% токенов тайского текста до модели не доходят. У греческого таких пар 213, у хинди 24, у урду 7, у русского 1. Для тайского флаг оставляет текст целым в 3 парах из 4.

Мои первые числа для тайского были другими. Порт Hugging Face дал 2,47 и 7,7% тайских символов в `[UNK]`. Я чуть не записал это как факт про mBERT. В тайском нет пробелов между словами, а базовый токенизатор BERT режет по пробелам и пунктуации. Поэтому тайское "слово" здесь часто это длинный кусок предложения. Порт помечает любое слово длиннее 100 символов как `[UNK]`. В `tokenization.py` у Google стоит 200, до ноября 2018 года там тоже было 100. С пределом 200 доля `[UNK]` в тайском падает до 0,23%. Подсчёт при этом совпадает с кодом Google построчно. В порте по умолчанию до сих пор 100, в том числе в версии 2.3.0 из декабря. Кто токенизирует тайский через него, теряет эти куски без всякой ошибки. И число у него выходит дешевле, чем по коду самого Google.

<figure class="fig">
<svg viewBox="0 0 680 358" role="img" aria-label="Пары XNLI test длиннее 128 токенов mBERT вместе с [CLS] и 2 [SEP], из 5010. тайский 1222, тайский, порт, предел 100: 939, греческий 213, хинди 24, урду 7, болгарский 1, суахили 1, арабский 1, русский 1, французский 1, турецкий 0, китайский 0, вьетнамский 0, немецкий 0, испанский 0, английский 0.">
  <line x1="160.0" y1="12" x2="160.0" y2="300" class="f-plain"/>
  <text x="160.0" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="313.3" y1="12" x2="313.3" y2="300" class="f-plain"/>
  <text x="313.3" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="466.7" y1="12" x2="466.7" y2="300" class="f-plain"/>
  <text x="466.7" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="620.0" y1="12" x2="620.0" y2="300" class="f-plain"/>
  <text x="620.0" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <text x="150.0" y="30.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">тайский</text>
  <rect x="160" y="22" width="374.0" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="540.0" y="31.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1222</text>
  <text x="150.0" y="48.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">порт, предел 100</text>
  <rect x="160" y="40" width="287.4" height="11" style="fill:var(--muted);stroke:none;opacity:0.5"/>
  <text x="453.4" y="49.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">939</text>
  <text x="150.0" y="66.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">греческий</text>
  <rect x="160" y="58" width="65.2" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="231.2" y="67.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">213</text>
  <text x="150.0" y="84.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">хинди</text>
  <rect x="160" y="76" width="7.3" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="173.3" y="85.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">24</text>
  <text x="150.0" y="102.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">урду</text>
  <rect x="160" y="94" width="2.1" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="168.1" y="103.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="150.0" y="120.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">болгарский</text>
  <rect x="160" y="112" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="121.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="138.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">суахили</text>
  <rect x="160" y="130" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="139.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="156.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">арабский</text>
  <rect x="160" y="148" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="157.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="174.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">русский</text>
  <rect x="160" y="166" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="175.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="192.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">французский</text>
  <rect x="160" y="184" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="193.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="210.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">турецкий</text>
  <rect x="160" y="202" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="211.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="228.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">китайский</text>
  <rect x="160" y="220" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="229.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="246.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">вьетнамский</text>
  <rect x="160" y="238" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="247.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="264.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">немецкий</text>
  <rect x="160" y="256" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="265.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="282.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">испанский</text>
  <rect x="160" y="274" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="283.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="300.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">английский</text>
  <rect x="160" y="292" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="301.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="390" y="348" text-anchor="middle" class="f-label f-muted" style="font-size:10px">пары длиннее 128 токенов, % от 5010</text>
</svg>
<figcaption>mBERT cased. Тёмные полосы: предел длины слова 200 символов, как в tokenization.py от Google. Светлая полоса у тайского: предел длины 100, как в порте Hugging Face, где длинные тайские слова становятся одним [UNK].</figcaption>
</figure>

## XLM-R

XLM-R ровный. Всё лежит между 0,86 и 1,31 от английского. Турецкий и тайский 0,99. Ниже всех китайский, 0,86, то есть он дешевле английского. За 128 выходят только 1 французская и 1 греческая пара. В `<unk>` не попадает ничего, кроме 16 китайских токенов. Тайская фраза про разговор занимает 7 токенов, на 1 больше английской.

Из 4 токенизаторов только у него каждый язык держится в пределах трети от английского. Платить за это приходится словарём, который в 5 раз больше, чем у GPT-2. Вместе с ним растёт матрица эмбеддингов. Во что это обходится, я не мерил.

## Хинди латиницей

Ещё одна вещь сдвинула мои числа. Она сидит в самих данных XNLI. Часть строк хинди в тестовом наборе написана латиницей, например "Wo thoda deri se aaya". У 319 пар хинди и 517 пар урду хотя бы одна строка без деванагари или арабского письма. Без них налог хинди на GPT-2 растёт с 6,86 до 7,05, урду с 5,65 до 5,85. Числа выше посчитаны по полному набору.

## Чего я не проверял

- Я считал только число токенов и обрезку, а не точность. Становится ли mBERT хуже на XNLI из-за обрезанных тайских пар, я не мерил.
- XNLI это короткие предложения, переведённые с английского. Длинные тексты, изначально написанные на этом языке, могут токенизироваться иначе.
- T5, обученный на большем числе языков, я не проверял, потому что такого не опубликовано.
- Доля `<unk>` считается по символам, а не по смыслу. Русское слово без 2 букв модель, может быть, всё равно угадает. Как часто, я не проверял.
