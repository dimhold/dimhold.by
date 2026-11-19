---
title: "Самая большая модель, которую я смог загрузить в 4 ГБ, примерно равна самому дешёвому GPT-3"
description: "Пока у GPT-3 API лист ожидания, я проверил, что запускает моя машина, если дать модели 4 ГБ, на torch 1.10.0 и transformers 4.12.2. GPT-2 large не загрузился, пока я не поправил имена в его файле и настройку glibc. После этого он дал 47,6% на LAMBADA, примерно на уровне ada, самой дешёвой модели API."
date: 2021-10-30
lang: ru
translationKey: laptop-vs-cloud
tags: ["llm", "machine-learning", "performance"]
---
У OpenAI API до сих пор лист ожидания, поэтому GPT-3 для меня то, о чём я читаю, а не то, что я запускаю. Запустить я могу открытые веса, GPT-2 от OpenAI и модели `GPT-Neo` от EleutherAI. С июня есть ещё их GPT-J на 6 миллиардов параметров. Отсюда мой вопрос: сколько из этого реально тянет моя собственная машина.

Ответ у меня был готов и я его ни разу не проверял. Модель с N параметрами в fp32 занимает 4N байт. Значит, в 8 ГБ влезает всё до 1.5B, а процессор решает только то, сколько я буду ждать. Я посчитал параметры и на этом остановился.

## Стенд

У машины 4 ядра и 8 ГБ, GPU нет. Примерно половину памяти занимают другие службы. Поэтому каждый прогон идёт в cgroup с жёстким лимитом, `systemd-run --user --scope -p MemoryMax=4G -p MemorySwapMax=0`. Свопа процесс не получает, а когда выходит за 4096 МБ, его убивают. Версии этой недели: Python 3.9, torch 1.10.0 на CPU, transformers 4.12.2, который вышел вчера.

Для скорости я генерирую 64 токена жадным декодированием после промпта из 12 токенов. Делаю это 3 раза и беру медиану. Для качества беру LAMBADA, где модель должна угадать последнее слово отрывка. Считаю так же, как EleutherAI в своём `lm-evaluation-harness`. Ответ верный, только если самый вероятный токен правильный на каждой позиции слова. EleutherAI прогнали тот же harness через API на ada, babbage, curie и davinci и выложили числа в README GPT-J. Чтобы проверить, что я считаю то же самое, я прогнал Neo 125M на всех 5153 отрывках. Получилось 37,36% и перплексия 30,265, в README Neo стоит 37,36% и 30,266. Значит, мои числа можно ставить рядом с их числами для API.

Остальные модели я прогнал на 500 случайных отрывках, одних и тех же для всех. На них Neo 125M даёт 34,6%, то есть моя выборка на 2,8 пункта труднее полного набора.

## Что загрузилось

<figure class="fig">
<svg viewBox="0 0 680 302" role="img" aria-label="Память при загрузке каждой модели под жёстким лимитом 4096 МБ. GPT-2 small: файл весов 523 МБ, пик при загрузке 1358 МБ; Neo 125M: файл весов 502 МБ, пик при загрузке 1392 МБ; GPT-2 medium: файл весов 1450 МБ, пик при загрузке 3237 МБ; GPT-2 large (как с хаба, по умолчанию): файл весов 3097 МБ, убит; GPT-2 large (префикс + флаг + MALLOC_): файл весов 3097 МБ, пик при загрузке 3530 МБ; Neo 1.3B: файл весов 5067 МБ, убит.">
  <rect x="190" y="8" width="14" height="8" rx="1" class="f-box"/>
  <text x="210" y="16" text-anchor="start" class="f-muted" style="font-size:11px">файл весов</text>
  <rect x="340" y="8" width="14" height="8" rx="1" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="360" y="16" text-anchor="start" class="f-muted" style="font-size:11px">пик при загрузке</text>
  <text x="20" y="43" text-anchor="start" class="f-ink" style="font-size:12px">GPT-2 small</text>
  <rect x="190" y="32" width="99.6" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="295.58666666666664" y="49" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1358 МБ</text>
  <rect x="190" y="39" width="38.4" height="12" rx="1" class="f-box"/>
  <text x="20" y="81" text-anchor="start" class="f-ink" style="font-size:12px">Neo 125M</text>
  <rect x="190" y="70" width="102.1" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="298.08" y="87" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1392 МБ</text>
  <rect x="190" y="77" width="36.8" height="12" rx="1" class="f-box"/>
  <text x="20" y="119" text-anchor="start" class="f-ink" style="font-size:12px">GPT-2 medium</text>
  <rect x="190" y="108" width="237.4" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="433.38" y="125" text-anchor="start" class="f-mono f-ink" style="font-size:11px">3237 МБ</text>
  <rect x="190" y="115" width="106.3" height="12" rx="1" class="f-box"/>
  <text x="20" y="157" text-anchor="start" class="f-ink" style="font-size:12px">GPT-2 large</text>
  <text x="20" y="171" text-anchor="start" class="f-mono f-muted" style="font-size:9px">как с хаба, по умолчанию</text>
  <rect x="190" y="146" width="300.4" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.25"/>
  <text x="496.37333333333333" y="163" text-anchor="start" class="f-mono f-accent" style="font-size:11px">убит (137)</text>
  <rect x="190" y="153" width="227.1" height="12" rx="1" class="f-box"/>
  <text x="20" y="195" text-anchor="start" class="f-ink" style="font-size:12px">GPT-2 large</text>
  <text x="20" y="209" text-anchor="start" class="f-mono f-muted" style="font-size:9px">префикс + флаг + MALLOC_</text>
  <rect x="190" y="184" width="258.9" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="454.8666666666667" y="201" text-anchor="start" class="f-mono f-ink" style="font-size:11px">3530 МБ</text>
  <rect x="190" y="191" width="227.1" height="12" rx="1" class="f-box"/>
  <text x="20" y="233" text-anchor="start" class="f-ink" style="font-size:12px">Neo 1.3B</text>
  <rect x="190" y="222" width="300.4" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.25"/>
  <text x="567.58" y="239" text-anchor="start" class="f-mono f-accent" style="font-size:11px">убит (137)</text>
  <rect x="190" y="229" width="371.6" height="12" rx="1" class="f-box"/>
  <line x1="490.37333333333333" y1="26" x2="490.37333333333333" y2="262" class="f-line" style="stroke:var(--accent);stroke-dasharray:4 3"/>
  <text x="490.37333333333333" y="292" text-anchor="middle" class="f-accent f-mono" style="font-size:10px">лимит 4096 МБ</text>
  <line x1="190" y1="262" x2="630" y2="262" class="f-line"/>
  <line x1="190" y1="262" x2="190" y2="266" class="f-line"/>
  <text x="190" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">0</text>
  <line x1="263.3333333333333" y1="262" x2="263.3333333333333" y2="266" class="f-line"/>
  <text x="263.3333333333333" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">1000</text>
  <line x1="336.66666666666663" y1="262" x2="336.66666666666663" y2="266" class="f-line"/>
  <text x="336.66666666666663" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">2000</text>
  <line x1="410" y1="262" x2="410" y2="266" class="f-line"/>
  <text x="410" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">3000</text>
  <line x1="483.3333333333333" y1="262" x2="483.3333333333333" y2="266" class="f-line"/>
  <text x="483.3333333333333" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">4000</text>
  <line x1="556.6666666666667" y1="262" x2="556.6666666666667" y2="266" class="f-line"/>
  <text x="556.6666666666667" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">5000</text>
  <line x1="630" y1="262" x2="630" y2="266" class="f-line"/>
  <text x="630" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">6000</text>
</svg>
<figcaption>Пиковая память from_pretrained в transformers 4.12.2, torch 1.10.0, fp32, по одному прогону. Загрузчик по умолчанию держит в памяти одновременно файл и модель. GPT-2 large влезает только с тремя правками: префикс transformer. в именах файла, low_cpu_mem_usage=True и MALLOC_MMAP_THRESHOLD_=131072.</figcaption>
</figure>

GPT-2 small и Neo 125M загружаются примерно за 2 секунды и пишут около 30 токенов в секунду. GPT-2 medium на 355M параметров загружается за 5 секунд и пишет от 10 до 12 токенов в секунду, смотря по прогону. До этого места всё было так, как я ожидал.

Дальше GPT-2 large, 774M. Файл 3097 МБ, лимит 4096 МБ, по моей арифметике влезает. Процесс убили во время загрузки. Neo 1.3B с файлом 5067 МБ тоже убили, но там это было видно по арифметике заранее.

Чтобы понять почему, я записывал расход памяти при одной загрузке каждые 10 мс. Для GPT-2 medium `from_pretrained` сначала читает весь файл через `torch.load`, это 1450 МБ тензоров. Потом строит модель со своими 1450 МБ и копирует в неё веса. Пик был 3237 МБ, в 2,2 раза больше файла. При том же соотношении для GPT-2 large на несколько секунд понадобилось бы около 7 ГБ, это я не мерил. Моя арифметика ошиблась больше чем вдвое.

## Флаг, который ничего не загружает

Как раз на этот случай в transformers с версии 4.11 есть флаг `low_cpu_mem_usage=True`. В докстринге написано, что он старается занимать в памяти не больше, чем весит сама модель. Флаг помечен как экспериментальный. С ним GPT-2 large снова убили. GPT-2 small и medium загрузились и medium продолжил мой промпт про счёт на оплату вот так:

```
 that that that that that that that that that that that that that that that
```

Ни ошибки, ни предупреждения. На LAMBADA GPT-2 small с этим флагом угадал 0 отрывков из 100, без него 31 из 100 на тех же отрывках. Причина в именах весов. В файлах от OpenAI они записаны без префикса, `wte.weight`, `h.0.attn.c_attn.weight`. Обычный загрузчик это замечает и кладёт их в часть модели `transformer`. Новый путь ищет каждое имя в модели как есть, не находит там `wte` и молча его пропускает. В итоге модель работает на случайных весах, с которыми её создали. В файлах Neo префикс есть и с ними флаг работает.

Я один раз загрузил файл GPT-2 large, добавил к каждому имени префикс `transformer.` и сохранил заново. Загрузка этой копии с флагом всё равно вышла за 4096 МБ. Вот здесь я разбирался дольше всего. С флагом загрузчик читает файл 2 раза: сначала целиком, только чтобы взять имена, потом ради весов. Запись расхода памяти показала, что после удаления первого чтения системе вернулось только около 250 МБ из его 3100. Второе чтение легло поверх остального. Я поставил `MALLOC_MMAP_THRESHOLD_=131072`, эта переменная велит glibc выдавать каждому большому блоку своё отображение. По умолчанию glibc сама поднимает этот порог, когда освобождаются большие блоки, это описано в `man mallopt`. Что дело было именно в этом, я только предполагаю: вижу это лишь по RSS. С переменной пик был 3530 МБ, в 1,14 раза больше файла. GPT-2 large наконец загрузился за 15 секунд и пишет 6,1 токена в секунду.

## Меньше байт не помогло

Следующее, что стоит попробовать, это половинная точность, 2 байта на параметр. На этом процессоре torch 1.10 умеет считать в bfloat16, но GPT-2 small тогда пишет 1,5 токена в секунду вместо 30. float16 не работает вообще, первый же шаг падает с `"LayerNormKernelImpl" not implemented for 'Half'`. А с `low_cpu_mem_usage` тип, который я прошу, игнорируется, веса остаются float32, как в файле. Так что на этом процессоре я остаюсь на float32.

## Против облака

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="Точность на LAMBADA. GPT-2 small 29,2% (на моей машине, 500 отрывков); Neo 125M 34,6% (на моей машине, 500 отрывков); GPT-2 medium 43,2% (на моей машине, 500 отрывков); GPT-2 large 47,6% (на моей машине, 500 отрывков); ada 51,6%; babbage 62,4%; curie 69,3%; davinci 75%; Neo 1.3B 57,2% (не загрузилась).">
  <text x="40" y="18" text-anchor="start" class="f-label f-ink" style="font-size:11px">на моей машине, 500 отрывков</text>
  <text x="40" y="246" text-anchor="start" class="f-label f-ink" style="font-size:11px">API и Neo 1.3B, таблица EleutherAI, 5153 отрывка</text>
  <line x1="40" y1="120" x2="640" y2="120" class="f-line"/>
  <line x1="40.0" y1="117" x2="40.0" y2="123" class="f-line"/>
  <text x="40.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">20%</text>
  <line x1="140.0" y1="117" x2="140.0" y2="123" class="f-line"/>
  <text x="140.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">30%</text>
  <line x1="240.0" y1="117" x2="240.0" y2="123" class="f-line"/>
  <text x="240.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">40%</text>
  <line x1="340.0" y1="117" x2="340.0" y2="123" class="f-line"/>
  <text x="340.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">50%</text>
  <line x1="440.0" y1="117" x2="440.0" y2="123" class="f-line"/>
  <text x="440.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">60%</text>
  <line x1="540.0" y1="117" x2="540.0" y2="123" class="f-line"/>
  <text x="540.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">70%</text>
  <line x1="640.0" y1="117" x2="640.0" y2="123" class="f-line"/>
  <text x="640.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">80%</text>
  <line x1="132.0" y1="46" x2="132.0" y2="114" class="f-line" style="stroke-dasharray:2 2"/>
  <circle cx="132.0" cy="120" r="5" class="f-box"/>
  <text x="132.0" y="40" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">GPT-2 small 29,2%</text>
  <line x1="186.0" y1="72" x2="186.0" y2="114" class="f-line" style="stroke-dasharray:2 2"/>
  <circle cx="186.0" cy="120" r="5" class="f-box"/>
  <text x="186.0" y="66" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Neo 125M 34,6%</text>
  <line x1="272.0" y1="46" x2="272.0" y2="114" class="f-line" style="stroke-dasharray:2 2"/>
  <circle cx="272.0" cy="120" r="5" class="f-box"/>
  <text x="272.0" y="40" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">GPT-2 medium 43,2%</text>
  <line x1="316.0" y1="72" x2="316.0" y2="114" class="f-line" style="stroke-dasharray:2 2"/>
  <circle cx="316.0" cy="120" r="5" class="f-box"/>
  <text x="316.0" y="66" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">GPT-2 large 47,6%</text>
  <line x1="356.0" y1="142" x2="356.0" y2="156" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="351.0" y="115" width="10" height="10" class="f-box" style="fill:var(--accent)"/>
  <text x="356.0" y="168" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">ada 51,6%</text>
  <line x1="412.0" y1="142" x2="412.0" y2="182" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="407.0" y="115" width="10" height="10" class="f-plain" style="stroke:var(--muted)"/>
  <text x="412.0" y="194" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Neo 1.3B 57,2%</text>
  <text x="412.0" y="207" text-anchor="middle" class="f-muted" style="font-size:9px">не загрузилась</text>
  <line x1="464.0" y1="142" x2="464.0" y2="156" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="459.0" y="115" width="10" height="10" class="f-box" style="fill:var(--accent)"/>
  <text x="464.0" y="168" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">babbage 62,4%</text>
  <line x1="533.0" y1="142" x2="533.0" y2="182" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="528.0" y="115" width="10" height="10" class="f-box" style="fill:var(--accent)"/>
  <text x="533.0" y="194" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">curie 69,3%</text>
  <line x1="590.0" y1="142" x2="590.0" y2="156" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="585.0" y="115" width="10" height="10" class="f-box" style="fill:var(--accent)"/>
  <text x="590.0" y="168" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">davinci 75%</text>
</svg>
<figcaption>LAMBADA, последнее слово угадано целиком, счёт как в harness от EleutherAI. Мои числа посчитаны на 500 случайных отрывках, эта выборка на 2,8 пункта труднее полного набора. Числа API из README GPT-J (EleutherAI, сентябрь 2021), все 5153 отрывка.</figcaption>
</figure>

GPT-2 large, самая большая модель, которую я втиснул в 4 ГБ, набирает 47,6% на моих 500 отрывках. Если поправка на 2,8 пункта, на которые моя выборка труднее, верна и для этой модели, то это около 50%. В таблице EleutherAI у ada через API 51,6%, у davinci 75%, babbage и curie между ними. Neo 1.3B, которая не загрузилась, набирает там 57,2%. GPT-2 1.5B, который я даже не пробовал, набирает 51,21%.

Выходит, после 2 обходных путей лучшее, что запускает моя машина, примерно на уровне самой дешёвой модели API. Davinci выше примерно на 25 пунктов. 6 токенов в секунду это медленно, но работать с этим можно. Остановила меня память. Больше всего та, которую загрузчик берёт сверх самих весов.

## Что я не проверял

Квантизацию в int8. В torch есть `quantize_dynamic` для `nn.Linear`, но GPT-2 собран из своих модулей `Conv1D` и преобразуется только выходной слой. Для Neo это сработало бы, но я это не мерил. Не пробовал машину с 16 ГБ, GPT-J, GPU и ONNX. Задержку API я не могу измерить, пока у него лист ожидания. LAMBADA это 1 задача. 500 отрывков дают погрешность около 4 пунктов в обе стороны. Скорость это 1 прогон из 3 повторов на машине, где работают и другие службы. EleutherAI сами пишут под своей таблицей, что из-за различий в реализации числа "might not be directly comparable".
