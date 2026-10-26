---
title: "Stable Diffusion просит 10 ГБ видеопамяти, а веса занимают из них 4"
description: "README Stable Diffusion просит GPU минимум на 10 ГБ, а веса во float32 занимают 4,26 ГБ. На CPU с PyTorch 1.12.1 я померил, куда уходит остальное: один слой внимания на 512x512 строит 2 ГиБ матриц оценок, цикл по головам сводит это к 387 МиБ с тем же выходом бит в бит, а команда txt2img по умолчанию на бумаге набирает около 10 ГиБ."
date: 2022-08-27
lang: ru
translationKey: stable-diffusion-memory
tags: ["machine-learning", "performance"]
---
В понедельник CompVis выложили веса Stable Diffusion. В их README сказано, что у модели "860M UNet and 123M text encoder" и что она "runs on a GPU with at least 10GB VRAM". Я перемножил в уме. Примерно миллиард чисел по 4 байта это 4 ГБ. Остальное из 10 я считал запасом для CUDA и привычкой округлять вверх.

Это и была вся моя модель видеопамяти: веса плюс немного сверху. Я её ни разу не проверял, потому что всё, что я запускал раньше, помещалось куда угодно. На машине, где я ставлю эти опыты, видеокарты нет вообще. Там 4 ядра AMD EPYC и чуть меньше 5 ГиБ, которые я могу отдать одному процессу. Это оказалось удобно: процесс, который просит слишком много, сразу убивают, а не дают ему тормозить. Всё ниже считалось на PyTorch 1.12.1 на CPU в float32.

## Считаю веса

В файлах `CompVis/stable-diffusion-v1-4` на один только UNet приходится 859,5 миллиона чисел. Вместе с текстовым энкодером и VAE набирается 1,07 миллиарда. VAE это часть, которая превращает результат в пиксели. Всё вместе занимает 4,26 ГБ в float32 и 2,13 ГБ в половинной точности. Веса я оценил верно. Только объясняли они меньше половины от 10.

Один UNet во float32 весит 3,2 ГиБ. Когда я его загрузил, память процесса поднялась до 3,76 ГиБ вместе с файловым кешем. Пока чистых чисел у меня не было, я долго разбирался, почему процесс убивают без всякой видимой причины. Потом выяснилось, что у моей пользовательской сессии свой потолок в 5 ГиБ и всё остальное, что у меня открыто, считается в него же.

## Куда уходит остальное

Ответ лежит в `ldm/modules/attention.py`. UNet смотрит на картинку через слои внимания и первый из них работает на 1/8 её размера. На 512x512 это 64 на 64, то есть 4096 позиций. Каждая позиция сравнивается с каждой, получается матрица 4096 на 4096 чисел. Голов 8, а сэмплер гонит промпт и пустой промпт вместе, так что таких матриц 16. Код считает их все одним `einsum`, а потом `softmax` делает второй тензор того же размера.

<figure class="fig">
<svg viewBox="0 0 680 260" role="img" aria-label="Один слой внимания на 512x512, промпт и пустой промпт, 8 голов. все головы разом: 16 + 16 матриц по 64 МиБ = 2 ГиБ, замер сверх базы +2241 МиБ. по одной голове: 1 + 1 матрица по 64 МиБ = 128 МиБ, замер сверх базы +387 МиБ.">
  <text x="10" y="18" class="f-label f-muted">Один слой внимания на 512x512, промпт и пустой промпт, 8 голов</text>
  <text x="20" y="50" class="f-mono f-ink" style="font-size:13px">все головы разом</text>
  <text x="20" y="74" class="f-label f-muted">оценки</text>
  <rect x="20" y="82" width="26" height="26" class="f-box"/>
  <rect x="50" y="82" width="26" height="26" class="f-box"/>
  <rect x="80" y="82" width="26" height="26" class="f-box"/>
  <rect x="110" y="82" width="26" height="26" class="f-box"/>
  <rect x="20" y="112" width="26" height="26" class="f-box"/>
  <rect x="50" y="112" width="26" height="26" class="f-box"/>
  <rect x="80" y="112" width="26" height="26" class="f-box"/>
  <rect x="110" y="112" width="26" height="26" class="f-box"/>
  <rect x="20" y="142" width="26" height="26" class="f-box"/>
  <rect x="50" y="142" width="26" height="26" class="f-box"/>
  <rect x="80" y="142" width="26" height="26" class="f-box"/>
  <rect x="110" y="142" width="26" height="26" class="f-box"/>
  <rect x="20" y="172" width="26" height="26" class="f-box"/>
  <rect x="50" y="172" width="26" height="26" class="f-box"/>
  <rect x="80" y="172" width="26" height="26" class="f-box"/>
  <rect x="110" y="172" width="26" height="26" class="f-box"/>
  <text x="170" y="74" class="f-label f-muted">после softmax</text>
  <rect x="170" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="200" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="230" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="260" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="170" y="112" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="200" y="112" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="230" y="112" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="260" y="112" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="170" y="142" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="200" y="142" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="230" y="142" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="260" y="142" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="170" y="172" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="200" y="172" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="230" y="172" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="260" y="172" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <text x="20" y="218" class="f-label f-ink">16 + 16 матриц по 64 МиБ = 2 ГиБ</text>
  <text x="20" y="240" class="f-mono f-ink" style="font-size:13px">замер сверх базы: +2241 МиБ</text>
  <line x1="340" y1="40" x2="340" y2="250" class="f-line f-muted" opacity="0.4"/>
  <text x="370" y="50" class="f-mono f-ink" style="font-size:13px">по одной голове</text>
  <text x="370" y="74" class="f-label f-muted">оценки</text>
  <rect x="370" y="82" width="26" height="26" class="f-box"/>
  <text x="520" y="74" class="f-label f-muted">после softmax</text>
  <rect x="520" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <text x="370" y="140" class="f-label f-muted">4096 x 4096, 64 МиБ</text>
  <text x="370" y="218" class="f-label f-ink">1 + 1 матрица по 64 МиБ = 128 МиБ</text>
  <text x="370" y="240" class="f-mono f-ink" style="font-size:13px">замер сверх базы: +387 МиБ</text>
</svg>
<figcaption>Каждый квадрат это одна матрица 4096 на 4096 чисел float32, 64 МиБ. Код CompVis строит все 16 разом и softmax добавляет ещё 16. Цикл по головам держит 2 за раз и даёт тот же выход бит в бит.</figcaption>
</figure>

16 матриц по 64 МиБ дают 1 ГиБ во float32, а вместе с копией после softmax 2 ГиБ, то есть 2048 МиБ. Я вынул этот блок из UNet и запустил отдельно, с настоящими весами. Память выросла на 2241 МиБ сверх базы, так что 2 тензора объясняют 91% роста. Остальное приходится на другие тензоры блока. Потом я переписал ту же математику циклом по головам, по одной матрице за раз. Вышло 387 МиБ, повторный прогон дал 405. Выходы совпали бит в бит.

Я ждал, что цикл обойдётся дороже по времени. За 3 прогона каждого варианта он занял от 2,04 до 2,16 секунды, а все головы разом от 1,85 до 2,19. На этом CPU разница тонет в шуме. На карте может быть иначе, но на любой карте, где не хватает памяти, я бы на такой размен пошёл.

Матрица растёт с квадратом числа позиций. Вот этого я не чувствовал, пока не увидел. На 640x640 одному слою нужно 2,4 ГиБ, на 768x768 уже 5,1 ГиБ, причём ещё без копии после softmax. Со всеми головами разом оба прогона убило на лимите 4 ГиБ. По одной голове они заняли 795 МиБ и 1390 МиБ.

<figure class="fig">
<svg viewBox="0 0 680 290" role="img" aria-label="Память сверх базы на первом блоке внимания, float32, лимит 4 ГиБ. 512x512: все головы разом +2241 МиБ. по одной голове +387 МиБ. 640x640: все головы разом убит на лимите 4 ГиБ, одни оценки 2,4 ГиБ. по одной голове +795 МиБ. 768x768: все головы разом убит на лимите 4 ГиБ, одни оценки 5,1 ГиБ. по одной голове +1390 МиБ.">
  <text x="10" y="18" class="f-label f-muted">Память сверх базы на первом блоке внимания, float32, лимит 4 ГиБ</text>
  <text x="108" y="70" text-anchor="end" class="f-mono f-ink" style="font-size:13px">512x512</text>
  <rect x="120" y="46" width="264.8" height="18" class="f-box f-accent"/>
  <text x="390.8" y="59" class="f-label f-ink">все головы разом +2241 МиБ</text>
  <rect x="120" y="70" width="45.7" height="18" class="f-box"/>
  <text x="171.7" y="83" class="f-label f-ink">по одной голове +387 МиБ</text>
  <text x="108" y="142" text-anchor="end" class="f-mono f-ink" style="font-size:13px">640x640</text>
  <rect x="120" y="118" width="484.1" height="18" class="f-box f-plain" style="stroke-dasharray:4 3"/>
  <text x="128" y="131" class="f-label f-ink">все головы разом: убит на лимите 4 ГиБ</text>
  <text x="596.1" y="131" text-anchor="end" class="f-label f-muted">одни оценки 2,4 ГиБ</text>
  <rect x="120" y="142" width="94.0" height="18" class="f-box"/>
  <text x="220.0" y="155" class="f-label f-ink">по одной голове +795 МиБ</text>
  <text x="108" y="214" text-anchor="end" class="f-mono f-ink" style="font-size:13px">768x768</text>
  <rect x="120" y="190" width="484.1" height="18" class="f-box f-plain" style="stroke-dasharray:4 3"/>
  <text x="128" y="203" class="f-label f-ink">все головы разом: убит на лимите 4 ГиБ</text>
  <text x="596.1" y="203" text-anchor="end" class="f-label f-muted">одни оценки 5,1 ГиБ</text>
  <rect x="120" y="214" width="164.3" height="18" class="f-box"/>
  <text x="290.3" y="227" class="f-label f-ink">по одной голове +1390 МиБ</text>
  <line x1="604.1" y1="40" x2="604.1" y2="246" class="f-line f-muted" style="stroke-dasharray:2 3"/>
  <line x1="120" y1="252" x2="640" y2="252" class="f-line f-muted"/>
  <line x1="120.0" y1="248" x2="120.0" y2="252" class="f-line f-muted"/><text x="120.0" y="266" text-anchor="middle" class="f-label f-muted">0</text>
  <line x1="238.2" y1="248" x2="238.2" y2="252" class="f-line f-muted"/><text x="238.2" y="266" text-anchor="middle" class="f-label f-muted">1000</text>
  <line x1="356.4" y1="248" x2="356.4" y2="252" class="f-line f-muted"/><text x="356.4" y="266" text-anchor="middle" class="f-label f-muted">2000</text>
  <line x1="474.5" y1="248" x2="474.5" y2="252" class="f-line f-muted"/><text x="474.5" y="266" text-anchor="middle" class="f-label f-muted">3000</text>
  <line x1="592.7" y1="248" x2="592.7" y2="252" class="f-line f-muted"/><text x="592.7" y="266" text-anchor="middle" class="f-label f-muted">4000</text>
  <text x="640" y="282" text-anchor="end" class="f-label f-muted">МиБ</text>
</svg>
<figcaption>3 прогона на столбец, 4 ядра CPU, PyTorch 1.12.1. Все прогоны со всеми головами разом выше 512x512 убиты на лимите 4 ГиБ. Серым подписан размер матрицы оценок для этого размера, без копии после softmax.</figcaption>
</figure>

## Команда по умолчанию

`scripts/txt2img.py` по умолчанию делает 3 картинки за раз, а сэмплер удваивает это ради пустого промпта, так что UNet видит батч 6. Веса он держит во float32 и работает под `autocast`. Запросы и ключи выходят из линейных слоёв в половинной точности, значит и оценки тоже. `softmax` стоит в списке операций, которые autocast возвращает во float32. На один слой при 512x512 у меня выходит 1,5 ГиБ оценок в половинной точности и 3 ГиБ после softmax. Первый тензор код держит живым, пока работает со вторым. Следующий `einsum` идёт через `bmm`, который autocast переводит в половинную точность, так что получается ещё одна копия на 1,5 ГиБ. Вместе 6 ГиБ на один слой, рядом с 3,97 ГиБ весов.

Выходит около 10 ГиБ. С README это сходится неожиданно хорошо. На карте я этого не запускал, так что это моё прочтение кода, а ошибиться оно может в обе стороны. Autocast к тому же может держать половинные копии весов, которые он уже привёл, а сколько берёт контекст CUDA, я не знаю. Поэтому большую часть из 10 ГБ я отношу на батч 6 под autocast в команде по умолчанию, а меньшую на саму модель.

## Одна картинка целиком

В конце я сделал одну картинку, чтобы убедиться, что части работают вместе. Промпт был "a photograph of an astronaut riding a horse", сэмплер PLMS делал 50 шагов, внимание считалось по одной голове. Как и в коде CompVis, промпт и пустой промпт шли через UNet одним батчем из 2. Каждая из 3 частей работала отдельным процессом, так что в памяти вместе они не были никогда. Процесс UNet дошёл до 3,76 ГиБ. Уже загрузка дала 3,70, так что 51 проход сэмплера добавил сверху всего 64 МиБ. Остальные 2 процесса держались ниже 1,7 ГиБ.

На 4 ядрах всё вместе заняло 16 минут, обычный шаг шёл 17,4 секунды. Астронавт на месте, лошадь тоже. Сколько та же работа идёт на карте, сказать не могу: своего числа у меня нет.

На бумаге нижняя граница для 512x512 теперь сильно ниже 10 ГБ. Это около 2 ГиБ весов в половинной точности и около 0,1 ГиБ оценок на одну голову, если считать все копии, которые делает autocast. Но пока я не увижу это на настоящей карте, верить не стану.

## Чего я не проверял

- Ничего здесь не запускалось на GPU. Ни контекст CUDA, ни скорость на карте я не мерил.
- 10 ГиБ для команды по умолчанию взяты из кода и документированных правил autocast, а не из прогона.
- Все времена здесь сняты за 3 прогона или меньше на машине, где шла и другая работа.
- Все головы разом я мерил только на первом блоке внимания. Во всём UNet я гонял внимание только по одной голове. Этот прогон шёл на коде UNet из diffusers, а не на моём цикле.
- У VAE есть своё внимание на 64 на 64, отдельно я его не смотрел.
