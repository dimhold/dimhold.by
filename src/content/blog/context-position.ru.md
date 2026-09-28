---
title: "Haiku 4.5 нашла ключ 243 раза из 245 в промптах до 96 тысяч токенов. На ключ, которого не было, она вернула значение 12 раз из 20."
description: "График из Lost in the Middle был у меня в голове, но на модели, которой я пользуюсь каждый день, я его ни разу не проверял. На поиске значения по ключу haiku 4.5 нашла ключ 243 раза из 245 на 11 глубинах в промптах до 96 тысяч токенов, без провала в середине. Деградация нашлась в другом месте: на вопрос про ключ, которого в объекте нет, после 2000 пар она начала возвращать значения вместо NOT FOUND, а на 6000 парах вернула значение 12 раз из 20."
date: 2026-09-21
lang: ru
translationKey: context-position
tags: ["llm", "reliability"]
---
Файл, который мой агент читает первым в каждой сессии, я завёл 11 августа. Сейчас в нём 934 строки и он прошёл через 83 коммита. Большинство из них это моя поправка, превращённая в правило с датой и вставленная туда, где показалось уместно. Когда агент пропустил одно из этих правил, первым делом я заподозрил место, где оно лежит в файле. В голове у меня был график из Lost in the Middle. Точность высокая на обоих краях окна и проседает в середине. Я считал эту кривую свойством языковых моделей вообще, но ни разу не проверил её на модели, которую вызываю каждый день.

Поэтому я взял задачу из этой статьи и прогнал её сам.

## Стенд

Liu и соавторы (arXiv 2307.03172, TACL 2024) придумали синтетическую задачу, которая мне нравится тем, что она не требует никаких рассуждений. JSON-объект из случайных пар ключей и значений и вопрос про один ключ. Форму я оставил, а идентификаторы укоротил до 8 шестнадцатеричных знаков, чтобы 200 пар помещались в контекст модели, которая крутится на процессоре. Внутри одного размера и одного сида объект один и тот же на всех 11 глубинах. Двигается только ключ, о котором спрашивают, от первой строки до последней. Поэтому эффект глубины не смешивается с эффектом другого объекта.

После объекта и ключа каждый вызов получает одну и ту же инструкцию:

```
Answer with the value only, 8 hex characters, nothing else. If the key is not in the object, answer NOT FOUND.
```

Главное здесь второе предложение. Отдельная серия спрашивает про ключ, которого в объекте нет вообще. Там единственный верный ответ NOT FOUND. Без явного разрешения отказаться модель, которая никогда не говорит, что не знает, просто выполняла бы мою инструкцию.

Маленькие модели это Qwen2.5 0.5B Instruct в float32 и 1.5B Instruct в bfloat16, жадное декодирование, transformers 5.16.1 и torch 2.14.0 на 4 ядрах процессора. Модель, которой я пользуюсь на самом деле, это `claude-haiku-4-5`. Я вызывал её через Claude Code CLI без режима рассуждений, без инструментов и с пустым конфигом MCP. Над папкой не было ни одного `CLAUDE.md`, потому что CLI молча подхватывает этот файл. Haiku дошла до 6000 пар, это около 96 тысяч токенов промпта и примерно половина её окна.

Это мерили до меня и много раз. Needle in a haystack Камрадта и RULER (arXiv 2404.06654) выясняют, в каком месте окна модель ошибается. Zhang с соавторами (arXiv 2605.23170) разбирают, из чего сделаны неверные ответы. NoLiMa (arXiv 2502.05167) показала, что дословное совпадение вроде моего держится на гораздо большей длине, чем задачи, где нужен хоть один шаг вывода. В отчёте Context Rot от Chroma, июль 2025, отмечено, что Claude Sonnet 4 и Opus 4 склонны воздерживаться от ответа, когда не уверены. Сам я хотел проверить 2 вещи: насколько далеко от цели ложится промах и держится ли отказ.

## Кривая, которую я ждал

<figure class="fig">
<svg viewBox="0 0 640 390" role="img" aria-label="Тепловая карта доли верных ответов: строка на модель и размер объекта, столбец на глубину от первой строки до последней. У qwen2.5 0.5b низко везде и выше всего в последнем столбце: 62.5 процента на последней строке против 28.1 на первой. У qwen2.5 1.5b 90 из 99, промахи разбросаны. У haiku 4.5 100 во всех ячейках, кроме 2 ячеек на 6000 пар.">
  <text x="12" y="16" class="f-label f-muted">доля верных ответов по тому, где в объекте лежит ключ</text>
  <text x="150.0" y="38" text-anchor="middle" class="f-label f-muted">первая строка</text>
  <text x="378.0" y="38" text-anchor="middle" class="f-label f-muted">середина</text>
  <text x="606.0" y="38" text-anchor="middle" class="f-label f-muted">последняя</text>
  <text x="12" y="62" class="f-label f-accent">qwen2.5 0.5b</text>
  <text x="12" y="81" class="f-mono f-ink">25 пар</text>
  <rect x="128.7" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.65"/>
  <text x="150.0" y="81" text-anchor="middle" class="f-mono f-ink">63</text>
  <rect x="174.3" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.77"/>
  <text x="195.6" y="81" text-anchor="middle" class="f-mono f-ink">75</text>
  <rect x="219.9" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.65"/>
  <text x="241.2" y="81" text-anchor="middle" class="f-mono f-ink">63</text>
  <rect x="265.5" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.54"/>
  <text x="286.8" y="81" text-anchor="middle" class="f-mono f-ink">50</text>
  <rect x="311.1" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="332.4" y="81" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="356.7" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.54"/>
  <text x="378.0" y="81" text-anchor="middle" class="f-mono f-ink">50</text>
  <rect x="402.3" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.42"/>
  <text x="423.6" y="81" text-anchor="middle" class="f-mono f-ink">38</text>
  <rect x="447.9" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.65"/>
  <text x="469.2" y="81" text-anchor="middle" class="f-mono f-ink">63</text>
  <rect x="493.5" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="514.8" y="81" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="539.1" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.65"/>
  <text x="560.4" y="81" text-anchor="middle" class="f-mono f-ink">63</text>
  <rect x="584.7" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.54"/>
  <text x="606.0" y="81" text-anchor="middle" class="f-mono f-ink">50</text>
  <text x="12" y="107" class="f-mono f-ink">50 пар</text>
  <rect x="128.7" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="150.0" y="107" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="174.3" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.65"/>
  <text x="195.6" y="107" text-anchor="middle" class="f-mono f-ink">63</text>
  <rect x="219.9" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.42"/>
  <text x="241.2" y="107" text-anchor="middle" class="f-mono f-ink">38</text>
  <rect x="265.5" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="286.8" y="107" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="311.1" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.54"/>
  <text x="332.4" y="107" text-anchor="middle" class="f-mono f-ink">50</text>
  <rect x="356.7" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="378.0" y="107" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="402.3" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="423.6" y="107" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="447.9" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="469.2" y="107" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="493.5" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="514.8" y="107" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="539.1" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="560.4" y="107" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="584.7" y="92" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="107" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="133" class="f-mono f-ink">100 пар</text>
  <rect x="128.7" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="150.0" y="133" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="174.3" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="195.6" y="133" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="219.9" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="241.2" y="133" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="265.5" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="286.8" y="133" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="311.1" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="332.4" y="133" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="356.7" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="378.0" y="133" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="402.3" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="423.6" y="133" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="447.9" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.42"/>
  <text x="469.2" y="133" text-anchor="middle" class="f-mono f-ink">38</text>
  <rect x="493.5" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="514.8" y="133" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="539.1" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.42"/>
  <text x="560.4" y="133" text-anchor="middle" class="f-mono f-ink">38</text>
  <rect x="584.7" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.65"/>
  <text x="606.0" y="133" text-anchor="middle" class="f-mono f-ink">63</text>
  <text x="12" y="159" class="f-mono f-ink">200 пар</text>
  <rect x="128.7" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="150.0" y="159" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="174.3" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="195.6" y="159" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="219.9" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="241.2" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="265.5" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="286.8" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="311.1" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="332.4" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="356.7" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="378.0" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="402.3" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="423.6" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="447.9" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="469.2" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="493.5" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="514.8" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="539.1" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="560.4" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="584.7" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.42"/>
  <text x="606.0" y="159" text-anchor="middle" class="f-mono f-ink">38</text>
  <text x="12" y="182" class="f-label f-accent">qwen2.5 1.5b</text>
  <text x="12" y="201" class="f-mono f-ink">25 пар</text>
  <rect x="128.7" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="286.8" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="311.1" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="332.4" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="356.7" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="378.0" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="402.3" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="469.2" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="493.5" y="186" width="42.6" height="20" class="f-box" fill-opacity="0.39"/>
  <text x="514.8" y="201" text-anchor="middle" class="f-mono f-ink">33</text>
  <rect x="539.1" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="560.4" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="584.7" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="227" class="f-mono f-ink">50 пар</text>
  <rect x="128.7" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="212" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="286.8" y="227" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="311.1" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="332.4" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="356.7" y="212" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="378.0" y="227" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="402.3" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="469.2" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="493.5" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="514.8" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="539.1" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="560.4" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="584.7" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="253" class="f-mono f-ink">100 пар</text>
  <rect x="128.7" y="238" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="253" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="238" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="253" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="238" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="253" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="238" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="286.8" y="253" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="311.1" y="238" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="332.4" y="253" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="356.7" y="238" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="378.0" y="253" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="402.3" y="238" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="253" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="238" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="469.2" y="253" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="493.5" y="238" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="514.8" y="253" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="539.1" y="238" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="560.4" y="253" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="584.7" y="238" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="253" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="276" class="f-label f-accent">haiku 4.5</text>
  <text x="12" y="295" class="f-mono f-ink">500 пар</text>
  <rect x="128.7" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="286.8" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="311.1" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="332.4" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="356.7" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="378.0" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="402.3" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="469.2" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="493.5" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="514.8" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="539.1" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="560.4" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="584.7" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="321" class="f-mono f-ink">2000 пар</text>
  <rect x="128.7" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="286.8" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="311.1" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="332.4" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="356.7" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="378.0" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="402.3" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="469.2" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="493.5" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="514.8" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="539.1" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="560.4" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="584.7" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="347" class="f-mono f-ink">4000 пар</text>
  <rect x="128.7" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="286.8" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="311.1" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="332.4" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="356.7" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="378.0" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="402.3" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="469.2" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="493.5" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="514.8" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="539.1" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="560.4" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="584.7" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="373" class="f-mono f-ink">6000 пар</text>
  <rect x="128.7" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="286.8" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="311.1" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="332.4" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="356.7" y="358" width="42.6" height="20" class="f-box" fill-opacity="0.89"/>
  <text x="378.0" y="373" text-anchor="middle" class="f-mono f-ink">88</text>
  <rect x="402.3" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="469.2" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="493.5" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="514.8" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="539.1" y="358" width="42.6" height="20" class="f-box" fill-opacity="0.89"/>
  <text x="560.4" y="373" text-anchor="middle" class="f-mono f-ink">88</text>
  <rect x="584.7" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
</svg>
<figcaption>Процент верных в каждой ячейке. У qwen 8 сидов на ячейку для 0.5b и 3 для 1.5b, у haiku 3 сида на 500 и 2000 парах и 8 на 4000 и 6000. Объект на всех глубинах одной строки один и тот же, переезжает только спрошенный ключ. 6000 пар это 95706 токенов промпта.</figcaption>
</figure>

Модель на 0.5B ломается уже на самом маленьком размере: на 25 парах, 565 токенах, она отвечает верно только 45 раз из 88. Но кривая не U-образная. Если сложить 4 размера, последнюю строку она находит в 62.5 процента случаев и все остальные глубины ниже, без провала в середине. Модель на 1.5B отвечает верно 90 раз из 99. Её промахи разбросаны где-то между 30 и 80 процентами глубины и при 3 сидах на ячейку формой я это назвать не могу.

Haiku ответила верно 243 раза из 245 и 3 из этих вызовов были первой пробой на 100 парах. Оба промаха на 6000 парах, один в середине и один на 90 процентах. Во всех остальных ячейках на всех размерах стоит 100 процентов. А первым сюрпризом там оказалось совсем другое. Конверт ответа показывает 3 входных токена для этих промптов и какое-то время я думал, что объект до модели не доходит вовсе. На деле весь объём уходит в `cache_creation_input_tokens`.

## Куда ложится промах

<figure class="fig">
<svg viewBox="0 0 640 290" role="img" aria-label="2 графика для qwen2.5 0.5b. Сверху: 253 неверных ответов по видам, 140 другое значение из объекта, 71 сам ключ, 24 NOT FOUND, 16 значение, которого в объекте нет, 2 без значения. Снизу: для 140 ответов с другим значением из объекта, на сколько строк от цели лежало это значение, против пунктира для равномерного выбора среди остальных строк. На 1 строку ниже цели: 16 против ожидаемых 2.5. На 1 строку выше: 7 против 2.5. 2 крайних столбца собирают всё, что на 6 строк и дальше, и нарисованы в своём масштабе.">
  <text x="12" y="16" class="f-label f-muted">0.5b: что приходило вместо верного значения</text>
  <text x="44" y="43" text-anchor="end" class="f-mono f-ink">140</text>
  <rect x="52" y="32" width="300.0" height="13" class="f-box"/>
  <text x="360.0" y="43" class="f-label f-muted">другое значение из объекта</text>
  <text x="44" y="63" text-anchor="end" class="f-mono f-ink">71</text>
  <rect x="52" y="52" width="152.1" height="13" class="f-box"/>
  <text x="212.1" y="63" class="f-label f-muted">сам ключ</text>
  <text x="44" y="83" text-anchor="end" class="f-mono f-ink">24</text>
  <rect x="52" y="72" width="51.4" height="13" class="f-box"/>
  <text x="111.4" y="83" class="f-label f-muted">NOT FOUND</text>
  <text x="44" y="103" text-anchor="end" class="f-mono f-ink">16</text>
  <rect x="52" y="92" width="34.3" height="13" class="f-box"/>
  <text x="94.3" y="103" class="f-label f-muted">значение, которого в объекте нет</text>
  <text x="44" y="123" text-anchor="end" class="f-mono f-ink">2</text>
  <rect x="52" y="112" width="4.3" height="13" class="f-box"/>
  <text x="64.3" y="123" class="f-label f-muted">без значения</text>
  <text x="12" y="152" class="f-label f-muted">другое значение из объекта: на сколько строк от цели</text>
  <rect x="60" y="179.6" width="34" height="52.4" class="f-box"/>
  <line x1="58" y1="162.0" x2="96" y2="162.0" class="f-line" stroke-dasharray="3 2"/>
  <text x="77" y="246" text-anchor="middle" class="f-mono f-ink">47</text>
  <text x="77" y="260" text-anchor="middle" class="f-label f-muted">≤-6</text>
  <rect x="116" y="227.6" width="34" height="4.4" class="f-box"/>
  <line x1="114" y1="221.3" x2="152" y2="221.3" class="f-line" stroke-dasharray="3 2"/>
  <text x="133" y="246" text-anchor="middle" class="f-mono f-ink">1</text>
  <text x="133" y="260" text-anchor="middle" class="f-label f-muted">-5</text>
  <rect x="158" y="214.5" width="34" height="17.5" class="f-box"/>
  <line x1="156" y1="221.3" x2="194" y2="221.3" class="f-line" stroke-dasharray="3 2"/>
  <text x="175" y="246" text-anchor="middle" class="f-mono f-ink">4</text>
  <text x="175" y="260" text-anchor="middle" class="f-label f-muted">-4</text>
  <rect x="200" y="214.5" width="34" height="17.5" class="f-box"/>
  <line x1="198" y1="221.3" x2="236" y2="221.3" class="f-line" stroke-dasharray="3 2"/>
  <text x="217" y="246" text-anchor="middle" class="f-mono f-ink">4</text>
  <text x="217" y="260" text-anchor="middle" class="f-label f-muted">-3</text>
  <rect x="242" y="205.8" width="34" height="26.3" class="f-box"/>
  <line x1="240" y1="221.1" x2="278" y2="221.1" class="f-line" stroke-dasharray="3 2"/>
  <text x="259" y="246" text-anchor="middle" class="f-mono f-ink">6</text>
  <text x="259" y="260" text-anchor="middle" class="f-label f-muted">-2</text>
  <rect x="284" y="201.4" width="34" height="30.6" class="f-box"/>
  <line x1="282" y1="221.1" x2="320" y2="221.1" class="f-line" stroke-dasharray="3 2"/>
  <text x="301" y="246" text-anchor="middle" class="f-mono f-ink">7</text>
  <text x="301" y="260" text-anchor="middle" class="f-label f-muted">-1</text>
  <rect x="326" y="162.0" width="34" height="70.0" class="f-box"/>
  <line x1="324" y1="221.3" x2="362" y2="221.3" class="f-line" stroke-dasharray="3 2"/>
  <text x="343" y="246" text-anchor="middle" class="f-mono f-ink">16</text>
  <text x="343" y="260" text-anchor="middle" class="f-label f-muted">+1</text>
  <rect x="368" y="197.0" width="34" height="35.0" class="f-box"/>
  <line x1="366" y1="221.3" x2="404" y2="221.3" class="f-line" stroke-dasharray="3 2"/>
  <text x="385" y="246" text-anchor="middle" class="f-mono f-ink">8</text>
  <text x="385" y="260" text-anchor="middle" class="f-label f-muted">+2</text>
  <rect x="410" y="214.5" width="34" height="17.5" class="f-box"/>
  <line x1="408" y1="221.8" x2="446" y2="221.8" class="f-line" stroke-dasharray="3 2"/>
  <text x="427" y="246" text-anchor="middle" class="f-mono f-ink">4</text>
  <text x="427" y="260" text-anchor="middle" class="f-label f-muted">+3</text>
  <rect x="452" y="192.6" width="34" height="39.4" class="f-box"/>
  <line x1="450" y1="221.8" x2="488" y2="221.8" class="f-line" stroke-dasharray="3 2"/>
  <text x="469" y="246" text-anchor="middle" class="f-mono f-ink">9</text>
  <text x="469" y="260" text-anchor="middle" class="f-label f-muted">+4</text>
  <rect x="494" y="214.5" width="34" height="17.5" class="f-box"/>
  <line x1="492" y1="221.8" x2="530" y2="221.8" class="f-line" stroke-dasharray="3 2"/>
  <text x="511" y="246" text-anchor="middle" class="f-mono f-ink">4</text>
  <text x="511" y="260" text-anchor="middle" class="f-label f-muted">+5</text>
  <rect x="550" y="198.6" width="34" height="33.4" class="f-box"/>
  <line x1="548" y1="172.9" x2="586" y2="172.9" class="f-line" stroke-dasharray="3 2"/>
  <text x="567" y="246" text-anchor="middle" class="f-mono f-ink">30</text>
  <text x="567" y="260" text-anchor="middle" class="f-label f-muted">≥+6</text>
  <rect x="60" y="271" width="18" height="10" class="f-box"/>
  <text x="84" y="280" class="f-label f-muted">наблюдено</text>
  <line x1="240" y1="276" x2="258" y2="276" class="f-line" stroke-dasharray="3 2"/>
  <text x="264" y="280" class="f-label f-muted">равномерный выбор среди остальных строк</text>
</svg>
<figcaption>Минус выше по объекту, плюс ниже. В пределах 1 строки от цели: 23 из 140, 16.4 процента, при равномерном выборе было бы 3.5. Медиана расстояния 7 строк против 36. У крайних столбцов свой масштаб.</figcaption>
</figure>

Модель на 0.5B дала 253 неверных ответа и 227 из них выглядят точно как верный: 8 шестнадцатеричных знаков и ничего больше. Только 24 раза она ответила NOT FOUND на ключ, который в объекте был. 71 раз вместо значения пришёл ключ, в 65 случаях какой-то другой ключ из объекта. 140 раз пришло другое значение из того же объекта и я посмотрел, насколько далеко от цели оно лежит. При равномерном выборе среди остальных строк 3.5 процента таких значений пришлись бы на строку, соседнюю с целью. Вышло 16.4 процента и чаще любой другой строки модель брала ту, что стоит сразу после цели. Медиана расстояния 7 строк против 36 при равномерном выборе. То есть неверные значения у неё приходят в основном из строк рядом с нужной, но не из неё самой. Промахов у haiku всего 2, по ним ничего не скажешь.

## Ключ, которого не было

<figure class="fig">
<svg viewBox="0 0 640 404" role="img" aria-label="Столбцы доли ответов NOT FOUND, когда спрошенного ключа нет, по модели и размеру объекта, с длиной промпта в токенах. У qwen2.5 0.5b от 0 до 20 процентов. qwen2.5 1.5b отвечает NOT FOUND каждый раз до 100 пар. haiku 4.5 отвечает NOT FOUND каждый раз до 2000 пар, дальше 16/20 на 3000, 15/20 на 4000 и 8/20 на 6000 пар. Контрольная строка, 1000 пар с прозой перед ними, 82360 токенов, даёт 10/10.">
  <text x="12" y="16" class="f-label f-muted">ключа в объекте нет, ответ NOT FOUND разрешён</text>
  <text x="140" y="34" class="f-label f-muted">токенов</text>
  <text x="250" y="34" class="f-label f-muted">0</text>
  <text x="580" y="34" text-anchor="end" class="f-label f-muted">100%</text>
  <line x1="580" y1="40" x2="580" y2="398" class="f-plain"/>
  <text x="12" y="55" class="f-label f-accent">qwen2.5 0.5b</text>
  <text x="12" y="73" class="f-mono f-ink">25 пар</text>
  <text x="140" y="73" class="f-mono f-muted">565</text>
  <rect x="250" y="62" width="66.0" height="13" class="f-box"/>
  <text x="588.0" y="73" class="f-mono f-ink">4/20</text>
  <text x="12" y="93" class="f-mono f-ink">50 пар</text>
  <text x="140" y="93" class="f-mono f-muted">1050</text>
  <rect x="250" y="82" width="1.5" height="13" class="f-box"/>
  <text x="588.0" y="93" class="f-mono f-ink">0/20</text>
  <text x="12" y="113" class="f-mono f-ink">100 пар</text>
  <text x="140" y="113" class="f-mono f-muted">2006</text>
  <rect x="250" y="102" width="33.0" height="13" class="f-box"/>
  <text x="588.0" y="113" class="f-mono f-ink">2/20</text>
  <text x="12" y="133" class="f-mono f-ink">200 пар</text>
  <text x="140" y="133" class="f-mono f-muted">3944</text>
  <rect x="250" y="122" width="33.0" height="13" class="f-box"/>
  <text x="588.0" y="133" class="f-mono f-ink">2/20</text>
  <text x="12" y="153" class="f-label f-accent">qwen2.5 1.5b</text>
  <text x="12" y="171" class="f-mono f-ink">25 пар</text>
  <text x="140" y="171" class="f-mono f-muted">561</text>
  <rect x="250" y="160" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="171" class="f-mono f-ink">8/8</text>
  <text x="12" y="191" class="f-mono f-ink">50 пар</text>
  <text x="140" y="191" class="f-mono f-muted">1054</text>
  <rect x="250" y="180" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="191" class="f-mono f-ink">8/8</text>
  <text x="12" y="211" class="f-mono f-ink">100 пар</text>
  <text x="140" y="211" class="f-mono f-muted">2003</text>
  <rect x="250" y="200" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="211" class="f-mono f-ink">8/8</text>
  <text x="12" y="231" class="f-label f-accent">haiku 4.5</text>
  <text x="12" y="249" class="f-mono f-ink">100 пар</text>
  <text x="140" y="249" class="f-mono f-muted">1862</text>
  <rect x="250" y="238" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="249" class="f-mono f-ink">10/10</text>
  <text x="12" y="269" class="f-mono f-ink">500 пар</text>
  <text x="140" y="269" class="f-mono f-muted">8313</text>
  <rect x="250" y="258" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="269" class="f-mono f-ink">10/10</text>
  <text x="12" y="289" class="f-mono f-ink">1000 пар</text>
  <text x="140" y="289" class="f-mono f-muted">16152</text>
  <rect x="250" y="278" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="289" class="f-mono f-ink">10/10</text>
  <text x="12" y="309" class="f-mono f-ink">2000 пар</text>
  <text x="140" y="309" class="f-mono f-muted">32138</text>
  <rect x="250" y="298" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="309" class="f-mono f-ink">10/10</text>
  <text x="12" y="329" class="f-mono f-ink">3000 пар</text>
  <text x="140" y="329" class="f-mono f-muted">48067</text>
  <rect x="250" y="318" width="264.0" height="13" class="f-box"/>
  <text x="588.0" y="329" class="f-mono f-ink">16/20</text>
  <text x="12" y="349" class="f-mono f-ink">4000 пар</text>
  <text x="140" y="349" class="f-mono f-muted">63950</text>
  <rect x="250" y="338" width="247.5" height="13" class="f-box"/>
  <text x="588.0" y="349" class="f-mono f-ink">15/20</text>
  <text x="12" y="369" class="f-mono f-ink">6000 пар</text>
  <text x="140" y="369" class="f-mono f-muted">95706</text>
  <rect x="250" y="358" width="132.0" height="13" class="f-box"/>
  <text x="588.0" y="369" class="f-mono f-ink">8/20</text>
  <text x="12" y="389" class="f-mono f-accent">1000 + проза</text>
  <text x="140" y="389" class="f-mono f-muted">82360</text>
  <rect x="250" y="378" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="389" class="f-mono f-ink">10/10</text>
</svg>
<figcaption>Последняя строка haiku это контроль: 1000 пар и перед ними проза без единого шестнадцатеричного слова, всего 82360 токенов, длиннее промпта на 4000 пар с его 63950. Все отказы на месте.</figcaption>
</figure>

А вот здесь haiku ведёт себя иначе. До 2000 пар, около 32 тысяч токенов, она ответила NOT FOUND 40 раз из 40. Дальше доля падает с размером, до 8 из 20 на 6000 парах. Остальные 12 ответов на 6000 были по 8 шестнадцатеричных знаков: 8 значений из объекта и 4, которых в нём нет нигде. Вызывающий код никак не может увидеть, что это догадка.

Некоторые ответы нарушили "value only" и добавили текст. Вот ответ на 3000 парах:

```
Looking through the provided JSON object, I can find:

"7c98d2eb": "69e27874"

69e27874
```

Ключа `7c98d2eb` в этом объекте нет. `69e27874` это значение с его последней строки. Модель процитировала строку, которой не существует, собранную из спрошенного мной ключа и значения из конца промпта. В сериях на 3000 и 4000 пар таких ответов с текстом вокруг было 17. 13 из них закончились словами NOT FOUND и 4 процитировали строку, которой нет. Остальные неверные ответы в этих сериях были голым шестнадцатеричным значением.

В сетке длина и число ключей растут вместе, так что причиной может быть любое из двух. Контроль это 1000 пар, перед которыми стоит проза без единого шестнадцатеричного слова, всего около 82 тысяч токенов. Это длиннее промпта на 4000 пар, где из 20 отказов уже пропали 5. NOT FOUND пришёл 10 раз из 10, а с ключом, который в объекте есть, ответ был верным 5 раз из 5. Значит, на этой задаче одна только длина отказ не сломала, по крайней мере когда длина стоит перед данными. Главный подозреваемый скорее число похожих ключей. Контроль маленький, всего 15 вызовов. Маленькие модели здесь не помогают ни в какую сторону. 0.5B ответила NOT FOUND 8 раз из 80 на объектах от 25 до 200 пар, а 1.5B 24 раза из 24 до 100 пар.

## Чего я не проверял

Задача одна, причём на дословный поиск. Правило из моего файла, которое агент пропустил, это вопрос следования инструкции. NoLiMa даёт хороший повод думать, что следование инструкциям ломается раньше, чем поиск шестнадцатеричной строки, так что это не доказывает, что с файлом всё в порядке. Замер только убирает самое простое объяснение. Haiku насчитывает в файле около 25 тысяч токенов, меньше 32 тысяч, на которых она отказывалась каждый раз, когда ключа не было. Но в настоящей сессии файл лежит внутри гораздо большего контекста, рядом с системным промптом и перепиской.

Из моделей через API здесь только haiku и дальше 96 тысяч токенов я не заходил. В строках на 500 и 2000 пар только 3 сида на глубину, в строках на 4000 и 6000 их 8. 2 модели Qwen шли в разной разрядности и влияет ли это, я не проверял.

Из этого я вынес одну проверку в коде. Значение, которое вернулось из большой таблицы, надо заново найти в этой таблице, по тому ключу, про который спрашивали. Проверки, что такое значение там вообще есть, мало: выдуманная строка выше её бы прошла. Вызовы haiku, на которых стоят эти числа, обошлись примерно в 45 долларов.
