---
title: "Haiku 4.5 знайшла ключ 243 разы з 245 у промптах да 96 тысяч токенаў. На ключ, якога не было, яна вярнула значэнне 12 разоў з 20."
description: "Графік з Lost in the Middle быў у мяне ў галаве, але на мадэлі, якой я карыстаюся кожны дзень, я яго ні разу не правяраў. На пошуку значэння па ключы haiku 4.5 знайшла ключ 243 разы з 245 на 11 глыбінях у промптах да 96 тысяч токенаў, без правалу ў сярэдзіне. Дэградацыя знайшлася ў іншым месцы: на пытанне пра ключ, якога ў аб'екце няма, пасля 2000 пар яна пачала вяртаць значэнні замест NOT FOUND, а на 6000 парах вярнула значэнне 12 разоў з 20."
date: 2026-09-21
lang: be
translationKey: context-position
tags: ["llm", "reliability"]
---
Файл, які мой агент чытае першым у кожнай сесіі, я завёў 11 жніўня. Цяпер у ім 934 радкі і за плячыма 83 каміты. Большасць з іх гэта мая папраўка, ператвораная ў правіла з датай і ўстаўленая туды, дзе здалося дарэчы. Калі агент прапусціў адно з гэтых правіл, першым я западозрыў месца, дзе яно ляжыць у файле. У галаве ў мяне быў графік з Lost in the Middle. Дакладнасць высокая на абодвух краях акна і правісае ў сярэдзіне. Я лічыў гэтую крывую ўласцівасцю моўных мадэляў наогул, але ні разу не праверыў яе на мадэлі, якую выклікаю кожны дзень.

Таму я ўзяў задачу з гэтага артыкула і прагнаў яе сам.

## Стэнд

Liu і сааўтары (arXiv 2307.03172, TACL 2024) прыдумалі сінтэтычную задачу, якая мне падабаецца тым, што ёй зусім не патрэбныя разважанні. JSON-аб'ект з выпадковых пар ключа і значэння і пытанне пра адзін ключ. Форму я пакінуў, а ідэнтыфікатары скараціў да 8 шаснаццатковых знакаў, каб 200 пар змяшчаліся ў кантэкст мадэлі, якая круціцца на працэсары. Унутры аднаго памеру і аднаго зерня аб'ект адзін і той жа на ўсіх 11 глыбінях. Перамяшчаецца толькі спытаны ключ, ад першага радка да апошняга. Таму ўплыў глыбіні не змешваецца з уплывам іншага аб'екта.

Пасля аб'екта і ключа кожны выклік атрымлівае адну і тую ж інструкцыю:

```
Answer with the value only, 8 hex characters, nothing else. If the key is not in the object, answer NOT FOUND.
```

Галоўны тут другі сказ. У асобнай серыі пытаюцца пра ключ, якога ў аб'екце няма наогул. Там адзіны правільны адказ NOT FOUND. Без яўнага дазволу адмовіцца мадэль, якая ніколі не кажа, што не ведае, проста выконвала б маю інструкцыю.

Малыя мадэлі гэта Qwen2.5 0.5B Instruct у float32 і 1.5B Instruct у bfloat16, прагнае дэкадаванне, transformers 5.16.1 і torch 2.14.0 на 4 ядрах працэсара. Мадэль, якой я карыстаюся насамрэч, гэта `claude-haiku-4-5`. Я выклікаў яе праз Claude Code CLI без рэжыму разважанняў, без інструментаў і з пустым канфігам MCP. Над папкай не было ніводнага `CLAUDE.md`, бо CLI моўчкі падхоплівае гэты файл. Haiku дайшла да 6000 пар, гэта каля 96 тысяч токенаў промпту і прыкладна палова яе акна.

Гэта да мяне мералі шмат разоў. Needle in a haystack Камрадта і RULER (arXiv 2404.06654) высвятляюць, у якім месцы акна мадэль памыляецца. Zhang з сааўтарамі (arXiv 2605.23170) разбіраюць, з чаго складаюцца няправільныя адказы. NoLiMa (arXiv 2502.05167) паказала, што даслоўнае супастаўленне накшталт майго трымаецца на значна большай даўжыні, чым задачы, дзе патрэбны хоць адзін крок вываду. У справаздачы Context Rot ад Chroma, ліпень 2025, адзначана, што Claude Sonnet 4 і Opus 4 схільныя ўстрымлівацца ад адказу, калі не ўпэўненыя. Сам я хацеў праверыць 2 рэчы: наколькі далёка ад мэты трапляе промах і ці трымаецца адмова.

## Крывая, якую я чакаў

<figure class="fig">
<svg viewBox="0 0 640 390" role="img" aria-label="Цеплавая карта долі правільных адказаў: радок на мадэль і памер аб'екта, слупок на глыбіню ад першага радка да апошняга. У qwen2.5 0.5b нізка паўсюль і вышэй за ўсё ў апошнім слупку: 62.5 працэнта на апошнім радку супраць 28.1 на першым. У qwen2.5 1.5b 90 з 99, промахі раскіданыя. У haiku 4.5 100 ва ўсіх клетках, акрамя 2 клетак на 6000 пар.">
  <text x="12" y="16" class="f-label f-muted">доля правільных адказаў па тым, дзе ў аб'екце ляжыць ключ</text>
  <text x="150.0" y="38" text-anchor="middle" class="f-label f-muted">першы радок</text>
  <text x="378.0" y="38" text-anchor="middle" class="f-label f-muted">сярэдзіна</text>
  <text x="606.0" y="38" text-anchor="middle" class="f-label f-muted">апошні</text>
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
<figcaption>Працэнт правільных у кожнай клетцы. У qwen 8 зерняў на клетку для 0.5b і 3 для 1.5b, у haiku 3 зерні на 500 і 2000 парах і 8 на 4000 і 6000. Аб'ект на ўсіх глыбінях аднаго радка адзін і той жа, пераязджае толькі спытаны ключ. 6000 пар гэта 95706 токенаў промпту.</figcaption>
</figure>

Мадэль на 0.5B ламаецца ўжо на самым малым памеры: на 25 парах, 565 токенах, яна адказвае правільна толькі 45 разоў з 88. Але крывая не мае формы літары U. Калі скласці 4 памеры, апошні радок яна знаходзіць у 62.5 працэнта выпадкаў і ўсе астатнія глыбіні ніжэй, без правалу ў сярэдзіне. Мадэль на 1.5B адказвае правільна 90 разоў з 99. Яе промахі раскіданыя недзе паміж 30 і 80 працэнтамі глыбіні і пры 3 зернях на клетку формай я гэта назваць не магу.

Haiku адказала правільна 243 разы з 245 і 3 з гэтых выклікаў былі першай пробай на 100 парах. Абодва промахі на 6000 парах, адзін у сярэдзіне і адзін на 90 працэнтах. Ва ўсіх астатніх клетках на ўсіх памерах стаіць 100. Але першае, што мяне там здзівіла, было іншае. Канверт адказу паказвае 3 уваходныя токены для гэтых промптаў і нейкі час я думаў, што аб'ект да мадэлі не даходзіць наогул. Насамрэч увесь аб'ём улічваецца ў `cache_creation_input_tokens`.

## Куды трапляе промах

<figure class="fig">
<svg viewBox="0 0 640 290" role="img" aria-label="2 графікі для qwen2.5 0.5b. Зверху: 253 няправільных адказаў па відах, 140 іншае значэнне з аб'екта, 71 сам ключ, 24 NOT FOUND, 16 значэнне, якога ў аб'екце няма, 2 без значэння. Знізу: для 140 адказаў з іншым значэннем з аб'екта, на колькі радкоў ад мэты ляжала гэтае значэнне, супраць пункціру для роўнамернага выбару сярод астатніх радкоў. На 1 радок ніжэй за мэту: 16 супраць чаканых 2.5. На 1 радок вышэй: 7 супраць 2.5. 2 крайнія слупкі збіраюць усё, што на 6 радкоў і далей, і намаляваныя ў сваім маштабе.">
  <text x="12" y="16" class="f-label f-muted">0.5b: што прыходзіла замест правільнага значэння</text>
  <text x="44" y="43" text-anchor="end" class="f-mono f-ink">140</text>
  <rect x="52" y="32" width="300.0" height="13" class="f-box"/>
  <text x="360.0" y="43" class="f-label f-muted">іншае значэнне з аб'екта</text>
  <text x="44" y="63" text-anchor="end" class="f-mono f-ink">71</text>
  <rect x="52" y="52" width="152.1" height="13" class="f-box"/>
  <text x="212.1" y="63" class="f-label f-muted">сам ключ</text>
  <text x="44" y="83" text-anchor="end" class="f-mono f-ink">24</text>
  <rect x="52" y="72" width="51.4" height="13" class="f-box"/>
  <text x="111.4" y="83" class="f-label f-muted">NOT FOUND</text>
  <text x="44" y="103" text-anchor="end" class="f-mono f-ink">16</text>
  <rect x="52" y="92" width="34.3" height="13" class="f-box"/>
  <text x="94.3" y="103" class="f-label f-muted">значэнне, якога ў аб'екце няма</text>
  <text x="44" y="123" text-anchor="end" class="f-mono f-ink">2</text>
  <rect x="52" y="112" width="4.3" height="13" class="f-box"/>
  <text x="64.3" y="123" class="f-label f-muted">без значэння</text>
  <text x="12" y="152" class="f-label f-muted">іншае значэнне з аб'екта: на колькі радкоў ад мэты</text>
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
  <text x="84" y="280" class="f-label f-muted">назірана</text>
  <line x1="240" y1="276" x2="258" y2="276" class="f-line" stroke-dasharray="3 2"/>
  <text x="264" y="280" class="f-label f-muted">роўнамерны выбар сярод астатніх радкоў</text>
</svg>
<figcaption>Мінус вышэй па аб'екце, плюс ніжэй. У межах 1 радка ад мэты: 23 з 140, 16.4 працэнта, пры роўнамерным выбары было б 3.5. Медыяна адлегласці 7 радкоў супраць 36. У крайніх слупкоў свой маштаб.</figcaption>
</figure>

Мадэль на 0.5B дала 253 няправільныя адказы і 227 з іх выглядаюць сапраўды як правільны: 8 шаснаццатковых знакаў і нічога больш. Толькі 24 разы яна адказала NOT FOUND на ключ, які ў аб'екце быў. 71 раз замест значэння прыйшоў ключ, у 65 выпадках нейкі іншы ключ з аб'екта. 140 разоў прыйшло іншае значэнне з таго ж аб'екта і я паглядзеў, наколькі далёка ад мэты яно ляжыць. Пры роўнамерным выбары сярод астатніх радкоў 3.5 працэнта такіх значэнняў прыйшлі б з радка, непасрэдна суседняга з мэтай. Выйшла 16.4 працэнта і часцей за любы іншы радок мадэль брала той, што стаіць адразу пасля мэты. Медыяна адлегласці 7 радкоў супраць 36 пры роўнамерным выбары. Гэта значыць, няправільныя значэнні ў яе прыходзяць у асноўным з радкоў побач з патрэбным, але не з яго самога. Промахаў у haiku ўсяго 2, гэтага замала, каб нешта сказаць.

## Ключ, якога не было

<figure class="fig">
<svg viewBox="0 0 640 404" role="img" aria-label="Слупкі долі адказаў NOT FOUND, калі спытанага ключа няма, па мадэлі і памеры аб'екта, з даўжынёй промпту ў токенах. У qwen2.5 0.5b ад 0 да 20 працэнтаў. qwen2.5 1.5b адказвае NOT FOUND кожны раз да 100 пар. haiku 4.5 адказвае NOT FOUND кожны раз да 2000 пар, далей 16/20 на 3000, 15/20 на 4000 і 8/20 на 6000 пар. Кантрольны радок, 1000 пар з прозай перад імі, 82360 токенаў, дае 10/10.">
  <text x="12" y="16" class="f-label f-muted">ключа ў аб'екце няма, адказ NOT FOUND дазволены</text>
  <text x="140" y="34" class="f-label f-muted">токенаў</text>
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
<figcaption>Апошні радок haiku гэта кантроль: 1000 пар і перад імі проза без адзінага шаснаццатковага слова, усяго 82360 токенаў, даўжэй за промпт на 4000 пар з яго 63950. Усе адмовы на месцы.</figcaption>
</figure>

А вось тут haiku паводзіць сябе інакш. Да 2000 пар, каля 32 тысяч токенаў, яна адказала NOT FOUND 40 разоў з 40. Далей доля падае з ростам памеру, да 8 з 20 на 6000 парах. Астатнія 12 адказаў на 6000 былі па 8 шаснаццатковых знакаў: 8 значэнняў з аб'екта і 4, якіх у ім няма нідзе. Код, які выклікаў мадэль, ніяк не можа ўбачыць, што гэта здагадка.

Некаторыя адказы парушылі "value only" і дадалі тэкст. Гэты з серыі на 3000 пар:

```
Looking through the provided JSON object, I can find:

"7c98d2eb": "69e27874"

69e27874
```

Ключа `7c98d2eb` у гэтым аб'екце няма. `69e27874` гэта значэнне з яго апошняга радка. Мадэль працытавала радок, якога не існуе, складзены са спытанага мной ключа і значэння з канца промпту. У серыях на 3000 і 4000 пар такіх адказаў з тэкстам вакол было 17. 13 з іх заканчваліся словамі NOT FOUND і 4 працытавалі радок, якога няма. Астатнія няправільныя адказы ў гэтых серыях былі голым шаснаццатковым значэннем.

У сетцы даўжыня і колькасць ключоў растуць разам, так што прычынай можа быць любое з двух. Кантроль гэта 1000 пар, перад якімі стаіць проза без адзінага шаснаццатковага слова, усяго каля 82 тысяч токенаў. Гэта даўжэй за промпт на 4000 пар, дзе з 20 адмоў ужо зніклі 5. NOT FOUND прыйшоў 10 разоў з 10, а з ключом, які ў аб'екце ёсць, адказ быў правільным 5 разоў з 5. Значыць, на гэтай задачы адна толькі даўжыня адмову не зламала, прынамсі калі даўжыня стаіць перад дадзенымі. Больш падазроная тут колькасць падобных ключоў. Кантроль маленькі, усяго 15 выклікаў. Малыя мадэлі тут не дапамагаюць ні ў які бок. 0.5B адказала NOT FOUND 8 разоў з 80 на аб'ектах ад 25 да 200 пар, а 1.5B 24 разы з 24 да 100 пар.

## Чаго я не правяраў

Задача адна, прычым на даслоўны пошук. Правіла з майго файла, якое агент прапусціў, гэта пытанне выканання інструкцыі. NoLiMa дае добрую падставу думаць, што выкананне інструкцый ламаецца раней за пошук шаснаццатковага радка, так што гэта не даказвае, што з файлам усё ў парадку. Замер толькі прыбірае самае простае тлумачэнне. Haiku налічвае ў файле каля 25 тысяч токенаў, менш за 32 тысячы, на якіх яна адмаўлялася кожны раз, калі ключа не было. Але ў сапраўднай сесіі файл ляжыць унутры значна большага кантэксту побач з сістэмным промптам і перапіскай.

З мадэляў праз API тут толькі haiku і далей за 96 тысяч токенаў я не заходзіў. У радках на 500 і 2000 пар толькі 3 зерні на глыбіню, у радках на 4000 і 6000 іх 8. 2 мадэлі Qwen ішлі з рознай разраднасцю і ці ўплывае гэта, я не правяраў.

З гэтага я выношу адно: праверку ў кодзе. Значэнне, якое вярнулася з вялікай табліцы, трэба зноў знайсці ў гэтай табліцы, па тым ключы, пра які пыталіся. Праверкі, што такое значэнне там наогул ёсць, мала: выдуманы радок вышэй яе прайшоў бы. Выклікі haiku, на якіх трымаюцца гэтыя лікі, каштавалі прыкладна 45 даляраў.
