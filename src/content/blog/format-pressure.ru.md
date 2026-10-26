---
title: "Я добавил \"none of the above\" и модель отказывалась так же часто, но на трети вопросов её решение поменялось"
description: "UnifiedQA T5 large отвечает на 300 вопросов SQuAD 2.0, на которые в абзаце нет ответа, в 4 форматах. Список без выхода отказывается 11 раз и 177 раз выбирает приманку. С \"none of the above\" отказов 134 против 133 в свободном тексте, но 103 вопроса из 300 переходят между отказом и выдуманным ответом."
date: 2022-04-16
lang: ru
translationKey: format-pressure
tags: ["llm", "machine-learning", "reliability"]
---
Когда модель обязана выбрать ответ из готового списка, она не может сказать, что не знает. Так обычно объясняют, почему жёсткий формат ответа заставляет модель выдумывать. Я с этим соглашался, особо не задумываясь. Обычное лекарство это ещё один вариант, "none of the above". Для меня вопрос на этом был закрыт. Сколько честности этот вариант возвращает, я ни разу не мерил, поэтому померил.

## Стенд

Для честного сравнения нужна модель, которая умеет отказываться в своём собственном формате. Подходит UnifiedQA от AI2: это T5, обученная на многих наборах вопросов и ответов в разных форматах, среди них SQuAD 2.0. В SQuAD 2.0 есть вопросы, на которые абзац не отвечает. На них модель обучена писать `no answer>`. Скобка стоит только с одной стороны, потому что в словаре T5 нет `<`.

Я взял UnifiedQA T5 large, около 740 млн параметров. Из валидационной части (dev) SQuAD 2.0 выбрал 300 вопросов с ответом и 300 без ответа, с seed 2022. Каждый вопрос уходит в модель 4 раза с одним и тем же абзацем:

1. свободно: вопрос и абзац, формат, в котором модель видела SQuAD при обучении;
2. список из 3 вариантов без выхода, то есть без варианта для отказа;
3. те же 3 варианта плюс "(d) none of the above";
4. те же 3 варианта плюс "(d) no answer>", тот же текст, который модель пишет, когда отказывается.

Варианты взяты из разметки SQuAD. У вопроса с ответом это правильный ответ и 2 ответа на другие вопросы к тому же абзацу. У вопроса без ответа SQuAD 2.0 хранит правдоподобный ответ (plausible answer), кусок абзаца, похожий на ответ. Он встаёт на место правильного, так что в каждом списке к вопросу без ответа лежит приманка.

Всё считалось на 4 ядрах процессора виртуальной машины: Python 3.9, torch 1.11, transformers 4.18, жадное декодирование, около 3 секунд на вопрос. Веса занимают 3 ГБ во float32, а transformers 4.18 держит в памяти весь файл рядом с моделью. Вместе это больше, чем позволяет мой лимит в 5 ГиБ. Поэтому я разрезал веса на 16 частей и собираю модель из конфига.

До прогона я записал, чего жду. Свободный формат отказывается больше чем на половине вопросов без ответа. Список с "none of the above" даст меньше половины отказов свободного формата.

## Без выхода

Список без выхода сделал то, что я ждал. На 300 вопросах без ответа модель 177 раз выбрала приманку и 112 раз что-то другое. 11 раз она написала `no answer>`, хотя такого варианта в списке не было. Эти 11 мне нравятся больше всего. Модель сломала мой формат, чтобы сказать правду.

## С выходом

Свободный формат отказался 133 раза из 300. Это 44%. Моё первое ожидание уже не сбылось. Даже в формате, на котором её учили, модель выдумывает ответ больше чем на половине вопросов, где должна отказаться. 101 такой ответ близок к приманке.

Список с "none of the above" отказался 134 раза, на один больше свободного формата. Именно этот исход я записал заранее как тот, что опровергнет мою идею. Значит, с выходом список отказывается так же часто, как свободный текст. 177 приманок дал список без выхода.

С "no answer>" в варианте (d) модель отказалась 152 раза. Это больше, чем с "none of the above". На парных ответах разница держится (McNemar, p = 0,013). Против свободного формата это 152 к 133 при p = 0,059. Результатом я бы это не назвал.

<figure class="fig">
<svg viewBox="0 0 640 186" role="img" aria-label="Составные полосы, в каждой 300 вопросов без ответа. свободно: отказ 133, приманка 101, другой ответ 66. список без выхода: отказ 11, приманка 177, другой ответ 112. + none of the above: отказ 134, приманка 120, другой ответ 46. + no answer&gt;: отказ 152, приманка 113, другой ответ 35.">
  <text x="12" y="18" class="f-label f-muted">300 вопросов без ответа, UnifiedQA T5 large</text>
  <rect x="12" y="31" width="12" height="10" class="f-plain" stroke-width="1"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:11px">отказ</text>
  <rect x="172" y="31" width="12" height="10" class="f-accent"/>
  <text x="190" y="40" class="f-mono f-ink" style="font-size:11px">приманка</text>
  <rect x="352" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="370" y="40" class="f-mono f-ink" style="font-size:11px">другой ответ</text>
  <text x="12" y="77" class="f-mono f-ink" style="font-size:11px">свободно</text>
  <rect x="190" y="66" width="146" height="14" class="f-plain"/>
  <rect x="336" y="66" width="111" height="14" class="f-accent"/>
  <rect x="447" y="66" width="73" height="14" class="f-muted" fill-opacity="0.55"/>
  <text x="530" y="77" class="f-mono f-ink" style="font-size:11px">133/101/66</text>
  <text x="12" y="107" class="f-mono f-ink" style="font-size:11px">список без выхода</text>
  <rect x="190" y="96" width="12" height="14" class="f-plain"/>
  <rect x="202" y="96" width="195" height="14" class="f-accent"/>
  <rect x="397" y="96" width="123" height="14" class="f-muted" fill-opacity="0.55"/>
  <text x="530" y="107" class="f-mono f-ink" style="font-size:11px">11/177/112</text>
  <text x="12" y="137" class="f-mono f-ink" style="font-size:11px">+ none of the above</text>
  <rect x="190" y="126" width="147" height="14" class="f-plain"/>
  <rect x="337" y="126" width="132" height="14" class="f-accent"/>
  <rect x="469" y="126" width="51" height="14" class="f-muted" fill-opacity="0.55"/>
  <text x="530" y="137" class="f-mono f-ink" style="font-size:11px">134/120/46</text>
  <text x="12" y="167" class="f-mono f-ink" style="font-size:11px">+ no answer&gt;</text>
  <rect x="190" y="156" width="167" height="14" class="f-plain"/>
  <rect x="357" y="156" width="124" height="14" class="f-accent"/>
  <rect x="481" y="156" width="39" height="14" class="f-muted" fill-opacity="0.55"/>
  <text x="530" y="167" class="f-mono f-ink" style="font-size:11px">152/113/35</text>
</svg>
<figcaption>Без выхода модель отказывается 11 раз, написав строку, которой в списке нет. С выходом она отказывается примерно так же часто, как в свободном формате.</figcaption>
</figure>

## Что прячут итоги

Потом я сравнил ответы вопрос за вопросом и равные итоги рассыпались. Свободный формат и список с "none of the above" оба отказываются на 82 вопросах и оба выдумывают ответ на 115. На 51 вопросе отказывается только свободный формат, на 52 только список. Выходит, 103 вопроса из 300 переходят из отказа в выдуманный ответ или обратно. Итоги равны только потому, что 51 уходит в одну сторону, а 52 в другую.

Вот 2 примера из прогона. "In what country does the Danube empty?" Абзац про Рейн, который впадает в Северное море в Нидерландах. Дунай там упомянут только как более длинная река. Свободный формат отвечает `no answer>`, все 3 списка отвечают "the netherlands". "When did the Archduke Sigismund of Austria die?" В абзаце сказано, что он продал Эльзас Бургундии в 1469 году. Свободный формат и список без выхода отвечают "1469", оба списка с выходом отказываются.

<figure class="fig">
<svg viewBox="0 0 640 252" role="img" aria-label="Вопрос 1, в какую страну впадает Дунай, абзац про Рейн: свободный формат отказывается, список без выхода отвечает the netherlands, список с none of the above отвечает the netherlands, список с no answer&gt; отвечает the netherlands. Вопрос 2, когда умер эрцгерцог Сигизмунд Австрийский, в абзаце сказано, что он продал Эльзас в 1469: свободный формат отвечает 1469, список без выхода отвечает 1469, список с none of the above отказывается, список с no answer&gt; отказывается.">
  <text x="12" y="18" class="f-label f-muted">2 вопроса, на которые в абзаце нет ответа, 4 формата ответа</text>
  <text x="12" y="44" class="f-mono f-muted" style="font-size:11px">свободно</text>
  <text x="168" y="44" class="f-mono f-muted" style="font-size:11px">список без выхода</text>
  <text x="324" y="44" class="f-mono f-muted" style="font-size:11px">+ none of the above</text>
  <text x="480" y="44" class="f-mono f-muted" style="font-size:11px">+ no answer&gt;</text>
  <text x="12" y="74" class="f-mono f-ink" style="font-size:12px">In what country does the Danube empty?</text>
  <text x="12" y="90" class="f-mono f-muted" style="font-size:10px">абзац про Рейн</text>
  <rect x="12" y="100" width="148" height="26" rx="3" class="f-plain"/>
  <text x="18" y="117" class="f-mono f-ink" style="font-size:11px">no answer&gt;</text>
  <rect x="168" y="100" width="148" height="26" rx="3" class="f-box"/>
  <text x="174" y="117" class="f-mono f-accent" style="font-size:11px">the netherlands</text>
  <rect x="324" y="100" width="148" height="26" rx="3" class="f-box"/>
  <text x="330" y="117" class="f-mono f-accent" style="font-size:11px">the netherlands</text>
  <rect x="480" y="100" width="148" height="26" rx="3" class="f-box"/>
  <text x="486" y="117" class="f-mono f-accent" style="font-size:11px">the netherlands</text>
  <text x="12" y="166" class="f-mono f-ink" style="font-size:12px">When did the Archduke Sigismund of Austria die?</text>
  <text x="12" y="182" class="f-mono f-muted" style="font-size:10px">в абзаце: продал Эльзас в 1469</text>
  <rect x="12" y="192" width="148" height="26" rx="3" class="f-box"/>
  <text x="18" y="209" class="f-mono f-accent" style="font-size:11px">1469</text>
  <rect x="168" y="192" width="148" height="26" rx="3" class="f-box"/>
  <text x="174" y="209" class="f-mono f-accent" style="font-size:11px">1469</text>
  <rect x="324" y="192" width="148" height="26" rx="3" class="f-plain"/>
  <text x="330" y="209" class="f-mono f-ink" style="font-size:11px">none of the above</text>
  <rect x="480" y="192" width="148" height="26" rx="3" class="f-plain"/>
  <text x="486" y="209" class="f-mono f-ink" style="font-size:11px">no answer&gt;</text>
  <rect x="12" y="232" width="12" height="10" class="f-plain"/>
  <text x="30" y="241" class="f-mono f-ink" style="font-size:10px">отказ</text>
  <rect x="120" y="232" width="12" height="10" class="f-box"/>
  <text x="138" y="241" class="f-mono f-ink" style="font-size:10px">выдуманный ответ</text>
</svg>
<figcaption>Модель та же, абзац тот же. Свободный формат отказывается на вопросе про Дунай и отвечает 1469 на второй. Оба списка с выходом поступают наоборот.</figcaption>
</figure>

Я не был уверен, говорит ли число 103 что-то о формате или только показывает, как жадное декодирование скачет при любой правке входа. Поэтому я сравнил 2 списка с выходом, которые отличаются одной фразой в варианте (d). Они расходятся на 48 вопросах. Это не чистая мера шума, потому что эти 2 списка ещё и отказываются с разной частотой. А переход от свободного текста к списку это правка крупнее одной фразы. И всё же 103 против 48 говорит мне, что формат двигает больше, чем шум.

<figure class="fig">
<svg viewBox="0 0 640 198" role="img" aria-label="2 полосы по 300 вопросов без ответа. Свободный формат против списка с none of the above: оба отказались 82, оба ответили 115, отказ только у свободного 51, только у списка 52, расходятся 103. Список с none of the above против списка с no answer&gt;: оба отказались 119, оба ответили 133, отказ только у первого 15, только у второго 33, расходятся 48.">
  <text x="12" y="18" class="f-label f-muted">те же 300 вопросов, по каждому вопросу</text>
  <rect x="12" y="31" width="12" height="10" class="f-plain"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:10px">оба отказались</text>
  <rect x="212" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="230" y="40" class="f-mono f-ink" style="font-size:10px">оба ответили</text>
  <rect x="12" y="47" width="12" height="10" class="f-accent"/>
  <text x="30" y="56" class="f-mono f-ink" style="font-size:10px">отказ только у первого</text>
  <rect x="212" y="47" width="12" height="10" class="f-accent" fill-opacity="0.6"/>
  <text x="230" y="56" class="f-mono f-ink" style="font-size:10px">отказ только у второго</text>
  <text x="12" y="84" class="f-mono f-ink" style="font-size:11px">свободно против + none of the above</text>
  <rect x="12" y="90" width="131" height="16" class="f-plain"/>
  <text x="16" y="102" class="f-mono f-ink" style="font-size:10px">82</text>
  <rect x="143" y="90" width="184" height="16" class="f-muted" fill-opacity="0.55"/>
  <text x="147" y="102" class="f-mono f-ink" style="font-size:10px">115</text>
  <rect x="327" y="90" width="82" height="16" class="f-accent"/>
  <text x="331" y="102" class="f-mono f-ink" style="font-size:10px">51</text>
  <rect x="409" y="90" width="83" height="16" class="f-accent" fill-opacity="0.6"/>
  <text x="413" y="102" class="f-mono f-ink" style="font-size:10px">52</text>
  <text x="500" y="102" class="f-mono f-accent" style="font-size:11px">расходятся 103</text>
  <text x="12" y="142" class="f-mono f-ink" style="font-size:11px">+ none of the above против + no answer&gt;</text>
  <rect x="12" y="148" width="190" height="16" class="f-plain"/>
  <text x="16" y="160" class="f-mono f-ink" style="font-size:10px">119</text>
  <rect x="202" y="148" width="213" height="16" class="f-muted" fill-opacity="0.55"/>
  <text x="206" y="160" class="f-mono f-ink" style="font-size:10px">133</text>
  <rect x="415" y="148" width="24" height="16" class="f-accent"/>
  <text x="419" y="160" class="f-mono f-ink" style="font-size:10px">15</text>
  <rect x="439" y="148" width="53" height="16" class="f-accent" fill-opacity="0.6"/>
  <text x="443" y="160" class="f-mono f-ink" style="font-size:10px">33</text>
  <text x="500" y="160" class="f-mono f-accent" style="font-size:11px">расходятся 48</text>
</svg>
<figcaption>Смена формата двигает 103 вопроса, смена одной фразы в варианте (d) двигает 48.</figcaption>
</figure>

## Чего стоит выход

На 300 вопросах с ответом свободный формат прав 281 раз, список без выхода 282. С выходом модель права 273 раза при "none of the above" и 275 при "no answer>". С "none of the above" модель отказалась на 13 вопросах, на которые свободный формат ответил. Обратное случилось один раз.

По всем 600 вопросам 23 ответа в списке без выхода не совпали ни с одним вариантом, а в каждом списке с выходом таких по 15. В основном это правильный вариант или приманка без куска. Либо их обрезал мой лимит в 24 выходных токена, либо в словаре не нашлось символа вроде `ł`. Я считаю их ответами. На отказы они не влияют и немного занижают число верных в каждом списке.

## Что я из этого вынес

Если считать только итоги, "none of the above" вернул здесь всю честность. Но доля отказов, измеренная в одном формате, мало что говорит мне о другом. Если я проверю выборку ответов в одном формате, а в работу выпущу другой, треть вопросов без ответа может повести себя иначе. Моя проверка этого не увидит.

Здесь "no answer>" сработал лучше, чем "none of the above". Почему, я могу только гадать. Он похож на собственный отказ модели, но модель выучила его из `<no answer>`, а эта строка режется на токены иначе, чем мой вариант. Какую формулировку брать, я бы проверял на своих данных.

## Чего я не проверял

- Одна модель. UnifiedQA училась отказываться на SQuAD 2.0, так что ей есть чем отказаться. Модель без такого обучения, например GPT-3, я не вызывал.
- Один порядок вариантов на вопрос. Перемешать варианты это тоже правка входа. Сколько вопросов она сдвинет, я не знаю.
- В каждом списке к вопросу без ответа была приманка. Без правдоподобного ответа среди вариантов отказаться может быть легче.
- Жадное декодирование и один полный прогон. Повтор 8 вопросов во всех 4 форматах дал те же 32 ответа, так что неопределённость сидит в выборе 300 вопросов.
- Лимит входа в 512 токенов. От 6 до 12 вопросов в каждом формате получили абзац с обрезанным концом.
- Вопросы, которые разметчики писали так, чтобы казалось, что ответ в абзаце есть. Живые пользователи спрашивают иначе.
