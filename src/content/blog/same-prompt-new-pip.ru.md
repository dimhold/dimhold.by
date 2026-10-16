---
title: "С январским и декабрьским venv GPT-2 выдал одни и те же 20 000 токенов. Логиты за это время поменялись"
description: "Я заново собрал январский venv 2022 года (torch 1.10.1, transformers 4.15.0) рядом с декабрьским (torch 1.13.1, transformers 4.25.1) и прогнал GPT-2 на тех же промптах. Жадный цикл, generate() и выборка с seed дали тот же текст, 200 из 200 начал на 20 000 шагах. Логиты сдвинулись до 0,000107 и весь сдвиг сидит в одной ступеньке между torch 1.11.0 и 1.12.1: новая свёртка AVX2 в reduce_all поменяла порядок, в котором softmax складывает 8 полос."
date: 2022-12-19
lang: ru
translationKey: same-prompt-new-pip
tags: ["llm", "numbers", "reliability"]
---
Выборка выключена или seed зафиксирован, значит на тот же промпт придёт тот же ответ. Так я к этому относился весь год и ни разу не проверял. Когда локальная генерация не совпадала с тем, что я сохранил раньше, я говорил себе "выборка" и запускал ещё раз, не спрашивая, не поменялось ли окружение модели. А окружение у меня меняется раз в несколько недель, потому что я делаю `pip install -U` каждый раз, когда в новом релизе transformers есть нужная мне правка. Одного конкретного сломанного вывода, который заставил бы меня полезть внутрь, не было. Просто кончался год и мне хотелось понять, что сделал с выводом год таких обновлений.

Январские выводы я не сохранил, поэтому собрал январский venv заново из того, что было актуально тогда. Это torch 1.10.1 от 15 декабря 2021 года и transformers 4.15.0 от 22 декабря 2021 года. Декабрьский venv собран на transformers 4.25.1 и torch 1.13.1, вышедшем в прошлый четверг. Оба работают на Python 3.9, только на CPU, во float32, на 4 vCPU виртуальной машины с AMD EPYC 7713. Модель GPT-2 small на 124 млн параметров, веса во всех прогонах грузятся из одного и того же файла `pytorch_model.bin`.

## Текст не сдвинулся

Я взял 8 промптов, от "The capital of France is" до "Q: What is 17 times 23?", по 60 новых токенов на каждый. Каждый промпт я прогнал в трёх режимах: жадным декодированием в своём цикле с argmax, жадным через `generate()` и с выборкой (top_k 50, `torch.manual_seed(1234)` перед каждым промптом). Я ждал, что первой сломается выборка: она зависит от всего распределения, а не только от того, какой токен на первом месте.

Ничего не сломалось. Январь и декабрь дали одни и те же токены на всех 8 промптах во всех режимах, включая выборку. На арифметический вопрос GPT-2 отвечает " 17 times 23." и задаёт вопрос заново, по кругу, в обоих venv.

Логиты при этом поменялись. Повторный запуск в том же venv дал те же биты. Декабрь расходится с январём в 6 промптах из 8, на первом шаге не больше чем на 0,000107.

Тогда я стал менять по одному пакету. transformers с 4.15.0 на 4.25.1 при том же torch не поменял ни одного бита. Код внимания GPT-2 за это время в нём менялся, значение маски и деление на масштаб, но ни одна из этих правок здесь бит не сдвинула. torch 1.11.0 даёт ровно те же биты, что 1.10.1, а 1.12.1 ровно те же, что 1.13.1. Версию 1.12.0 я не пробовал, так что вся разница за год возникла где-то между 1.11.0 и 1.12.1.

<figure class="fig">
<svg viewBox="0 0 640 294" role="img" aria-label="Таблица условий в сравнении с январским venv. Повторный запуск оставляет все 8 промптов побитно такими же, torch 1.11.0 тоже. Начиная с torch 1.12.1 расходятся 6 промптов из 8, максимум на 0,000107. Универсальные ядра меняют все 8. Сгенерированный текст один и тот же во всех строках, совпали все 24 из 24.">
  <text x="12" y="18" class="f-label f-muted">против январского venv: torch 1.10.1, transformers 4.15.0</text>
  <text x="12" y="40" class="f-label f-muted">условие</text>
  <text x="296" y="40" class="f-label f-muted">логиты, 8 промптов</text>
  <text x="452" y="40" class="f-label f-muted">макс. сдвиг</text>
  <text x="566" y="40" class="f-label f-muted">текст</text>
  <text x="12" y="63" class="f-mono f-ink" style="font-size:11px">январь, ещё раз</text>
  <rect x="296" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="314" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="332" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="350" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="368" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="386" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="404" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="422" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <text x="452" y="63" class="f-mono f-muted" style="font-size:12px">0</text>
  <text x="566" y="63" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <text x="12" y="89" class="f-mono f-ink" style="font-size:11px">январь, 1 поток</text>
  <rect x="296" y="78" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="314" y="78" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="332" y="78" width="14" height="14" rx="2" class="f-box"/>
  <rect x="350" y="78" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="368" y="78" width="14" height="14" rx="2" class="f-box"/>
  <rect x="386" y="78" width="14" height="14" rx="2" class="f-box"/>
  <rect x="404" y="78" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="422" y="78" width="14" height="14" rx="2" class="f-plain"/>
  <text x="452" y="89" class="f-mono f-accent" style="font-size:12px">0,000023</text>
  <text x="566" y="89" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <text x="12" y="115" class="f-mono f-ink" style="font-size:11px">январь, универсальные ядра</text>
  <rect x="296" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="314" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="332" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="350" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="368" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="386" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="404" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="422" y="104" width="14" height="14" rx="2" class="f-box"/>
  <text x="452" y="115" class="f-mono f-accent" style="font-size:12px">0,000061</text>
  <text x="566" y="115" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <line x1="12" y1="124" x2="628" y2="124" class="f-plain"/>
  <text x="12" y="141" class="f-mono f-ink" style="font-size:11px">torch 1.11.0</text>
  <rect x="296" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="314" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="332" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="350" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="368" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="386" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="404" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="422" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <text x="452" y="141" class="f-mono f-muted" style="font-size:12px">0</text>
  <text x="566" y="141" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <text x="12" y="167" class="f-mono f-ink" style="font-size:11px">torch 1.12.1</text>
  <rect x="296" y="156" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="314" y="156" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="332" y="156" width="14" height="14" rx="2" class="f-box"/>
  <rect x="350" y="156" width="14" height="14" rx="2" class="f-box"/>
  <rect x="368" y="156" width="14" height="14" rx="2" class="f-box"/>
  <rect x="386" y="156" width="14" height="14" rx="2" class="f-box"/>
  <rect x="404" y="156" width="14" height="14" rx="2" class="f-box"/>
  <rect x="422" y="156" width="14" height="14" rx="2" class="f-box"/>
  <text x="452" y="167" class="f-mono f-accent" style="font-size:12px">0,000107</text>
  <text x="566" y="167" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <text x="12" y="193" class="f-mono f-ink" style="font-size:11px">torch 1.13.1, transformers с 4.15 по 4.22</text>
  <rect x="296" y="182" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="314" y="182" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="332" y="182" width="14" height="14" rx="2" class="f-box"/>
  <rect x="350" y="182" width="14" height="14" rx="2" class="f-box"/>
  <rect x="368" y="182" width="14" height="14" rx="2" class="f-box"/>
  <rect x="386" y="182" width="14" height="14" rx="2" class="f-box"/>
  <rect x="404" y="182" width="14" height="14" rx="2" class="f-box"/>
  <rect x="422" y="182" width="14" height="14" rx="2" class="f-box"/>
  <text x="452" y="193" class="f-mono f-accent" style="font-size:12px">0,000107</text>
  <text x="566" y="193" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <line x1="12" y1="202" x2="628" y2="202" class="f-plain"/>
  <text x="12" y="219" class="f-mono f-ink" style="font-size:11px">декабрь: 1.13.1 и 4.25.1</text>
  <rect x="296" y="208" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="314" y="208" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="332" y="208" width="14" height="14" rx="2" class="f-box"/>
  <rect x="350" y="208" width="14" height="14" rx="2" class="f-box"/>
  <rect x="368" y="208" width="14" height="14" rx="2" class="f-box"/>
  <rect x="386" y="208" width="14" height="14" rx="2" class="f-box"/>
  <rect x="404" y="208" width="14" height="14" rx="2" class="f-box"/>
  <rect x="422" y="208" width="14" height="14" rx="2" class="f-box"/>
  <text x="452" y="219" class="f-mono f-accent" style="font-size:12px">0,000107</text>
  <text x="566" y="219" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <text x="12" y="245" class="f-mono f-ink" style="font-size:11px">декабрь, универсальные ядра</text>
  <rect x="296" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="314" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="332" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="350" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="368" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="386" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="404" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="422" y="234" width="14" height="14" rx="2" class="f-box"/>
  <text x="452" y="245" class="f-mono f-accent" style="font-size:12px">0,000061</text>
  <text x="566" y="245" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <rect x="300" y="268" width="14" height="14" rx="2" class="f-plain"/><text x="320" y="279" class="f-label f-muted">биты те же</text>
  <rect x="420" y="268" width="14" height="14" rx="2" class="f-box"/><text x="440" y="279" class="f-label f-muted">биты другие</text>
</svg>
<figcaption>Логиты первого шага, сравнение по битам. Текст сравнивается для 8 промптов в 3 режимах (свой жадный цикл, generate, выборка с seed).</figcaption>
</figure>

## Где ступенька

2 промпта сохранили свои биты даже после этой ступеньки и я не понимал почему. Сначала я потратил время на MKL. С `MKL_VERBOSE=1` torch показывает вызовы `SGEMM` из MKL 2020.0, то есть умножение матриц MKL действительно считает. Но с `MKL_ENABLE_INSTRUCTIONS=SSE4_2` не поменялось вообще ничего, ни одного бита ни в одном venv. Почему, я так и не знаю.

Потом я попробовал `ATEN_CPU_CAPABILITY=default`. С ним torch берёт свои универсальные ядра вместо ядер AVX2, как на старом процессоре. Логиты сдвинулись максимум на 0,000122 против обычного декабрьского прогона. Январь и декабрь стали побитно одинаковыми. Значит, изменение сидело в одном из ядер AVX2.

Я выгрузил выход каждого слоя на промпте с самым большим расхождением. Это арифметический вопрос, в нём 11 токенов. Эмбеддинги и первый LayerNorm совпадают. Первое расхождение, 0,0000019, появляется на выходе внимания в блоке 0 и к последнему блоку дорастает до 0,00032. Потом я прогнал каждую операцию отдельно на фиксированном случайном входе. Отличается только softmax.

У 2 промптов, сохранивших биты, 5 и 7 токенов. У всех остальных 8 и больше. Я прогнал softmax на строках всех длин от 1 до 64. Длины с 1 по 7 дают одни и те же биты в обеих версиях. Начиная с 8 у каждой длины есть расходящиеся строки, кроме 23. Думаю, это случайность.

8 чисел float это один регистр AVX2. Остальное видно в диффе `aten/src/ATen/cpu/vec/functional_base.h` между 2 тегами. Softmax суммирует экспоненты через `reduce_all`, а тот держит 8 частичных сумм в полосах регистра и в конце сводит их в одно число. В 1.11.0 эта свёртка идёт полоса за полосой: к полосе 0 прибавляется полоса 1, потом полоса 2 и так до полосы 7. В 1.12.1 для AVX2 добавили более быструю свёртку:

```cpp
// 128-bit shuffle
Vec v1 = _mm256_permute2f128_ps(v, v, 0x1);
v = vec_fun(v, v1);
// 64-bit shuffle
v1 = _mm256_shuffle_ps(v, v, 0x4E);
v = vec_fun(v, v1);
// 32-bit shuffle
v1 = _mm256_shuffle_ps(v, v, 0xB1);
v = vec_fun(v, v1);
```

Она складывает полосы через 4, потом через 2, потом соседние. Числа те же, порядок сложения другой, а во float от этого может поменяться последний бит. Строки короче одного регистра до нового кода не доходят. В универсальных ядрах его нет вовсе. Нет его и в сборках компилятором MSVC: новая свёртка закрыта проверкой на GCC, так что на Windows этой ступеньки, скорее всего, нет.

<figure class="fig">
<svg viewBox="0 0 640 284" role="img" aria-label="Два способа свести 8 полос регистра AVX2 в одну сумму. torch 1.11.0 прибавляет их по очереди, torch 1.12.1 складывает полосы через 4, потом через 2, потом соседние. Ниже softmax на строках длиной от 1 до 64: длины с 1 по 7 дают одни и те же биты в обеих версиях, с 8 различаются все, кроме 23.">
  <text x="12" y="18" class="f-label f-muted">torch 1.11.0: полоса за полосой</text>
  <rect x="16" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="29" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a0</text>
  <rect x="50" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="63" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a1</text>
  <rect x="84" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="97" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a2</text>
  <rect x="118" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="131" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a3</text>
  <rect x="152" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="165" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a4</text>
  <rect x="186" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="199" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a5</text>
  <rect x="220" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="233" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a6</text>
  <rect x="254" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="267" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a7</text>
  <line x1="29" y1="52" x2="63" y2="63" class="f-line"/>
  <line x1="63" y1="52" x2="63" y2="63" class="f-line"/>
  <circle cx="63" cy="70" r="7" class="f-plain"/><text x="63" y="74" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="63" y1="77" x2="97" y2="81" class="f-line"/>
  <line x1="97" y1="52" x2="97" y2="81" class="f-line"/>
  <circle cx="97" cy="88" r="7" class="f-plain"/><text x="97" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="97" y1="95" x2="131" y2="99" class="f-line"/>
  <line x1="131" y1="52" x2="131" y2="99" class="f-line"/>
  <circle cx="131" cy="106" r="7" class="f-plain"/><text x="131" y="110" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="131" y1="113" x2="165" y2="117" class="f-line"/>
  <line x1="165" y1="52" x2="165" y2="117" class="f-line"/>
  <circle cx="165" cy="124" r="7" class="f-plain"/><text x="165" y="128" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="165" y1="131" x2="199" y2="135" class="f-line"/>
  <line x1="199" y1="52" x2="199" y2="135" class="f-line"/>
  <circle cx="199" cy="142" r="7" class="f-plain"/><text x="199" y="146" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="199" y1="149" x2="233" y2="153" class="f-line"/>
  <line x1="233" y1="52" x2="233" y2="153" class="f-line"/>
  <circle cx="233" cy="160" r="7" class="f-plain"/><text x="233" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="233" y1="167" x2="267" y2="171" class="f-line"/>
  <line x1="267" y1="52" x2="267" y2="171" class="f-line"/>
  <circle cx="267" cy="178" r="7" class="f-plain"/><text x="267" y="182" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <text x="336" y="18" class="f-label f-muted">1.12.1 с AVX2: через 4, 2, 1</text>
  <rect x="336" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="349" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a0</text>
  <rect x="370" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="383" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a1</text>
  <rect x="404" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="417" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a2</text>
  <rect x="438" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="451" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a3</text>
  <rect x="472" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="485" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a4</text>
  <rect x="506" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="519" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a5</text>
  <rect x="540" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="553" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a6</text>
  <rect x="574" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="587" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a7</text>
  <line x1="349" y1="52" x2="408" y2="81" class="f-line"/>
  <line x1="485" y1="52" x2="408" y2="81" class="f-line"/>
  <circle cx="408" cy="88" r="7" class="f-plain"/><text x="408" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="383" y1="52" x2="448" y2="81" class="f-line"/>
  <line x1="519" y1="52" x2="448" y2="81" class="f-line"/>
  <circle cx="448" cy="88" r="7" class="f-plain"/><text x="448" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="417" y1="52" x2="488" y2="81" class="f-line"/>
  <line x1="553" y1="52" x2="488" y2="81" class="f-line"/>
  <circle cx="488" cy="88" r="7" class="f-plain"/><text x="488" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="451" y1="52" x2="528" y2="81" class="f-line"/>
  <line x1="587" y1="52" x2="528" y2="81" class="f-line"/>
  <circle cx="528" cy="88" r="7" class="f-plain"/><text x="528" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="408" y1="95" x2="448" y2="115" class="f-line"/>
  <line x1="488" y1="95" x2="448" y2="115" class="f-line"/>
  <circle cx="448" cy="122" r="7" class="f-plain"/><text x="448" y="126" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="448" y1="95" x2="488" y2="115" class="f-line"/>
  <line x1="528" y1="95" x2="488" y2="115" class="f-line"/>
  <circle cx="488" cy="122" r="7" class="f-plain"/><text x="488" y="126" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="448" y1="129" x2="468" y2="149" class="f-line"/>
  <line x1="488" y1="129" x2="468" y2="149" class="f-line"/>
  <circle cx="468" cy="156" r="7" class="f-plain"/><text x="468" y="160" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <text x="12" y="214" class="f-label f-muted">softmax по строкам длиной от 1 до 64, 1.11.0 против 1.12.1</text>
  <rect x="12.0" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <text x="16.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1</text>
  <rect x="21.6" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <rect x="31.2" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <rect x="40.8" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <rect x="50.4" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <rect x="60.0" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <rect x="69.6" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <rect x="79.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <text x="83.2" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">8</text>
  <rect x="88.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="98.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="108.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="117.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="127.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="136.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="146.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="156.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="165.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="175.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="184.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="194.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="204.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="213.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="223.2" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <text x="227.2" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">23</text>
  <rect x="232.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="242.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="252.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="261.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="271.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="280.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="290.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="300.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="309.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="319.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="328.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="338.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="348.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="357.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="367.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="376.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="386.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="396.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="405.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="415.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="424.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="434.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="444.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="453.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="463.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="472.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="482.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="492.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="501.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="511.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="520.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="530.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="540.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="549.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="559.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="568.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="578.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="588.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="597.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="607.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="616.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <text x="620.8" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">64</text>
  <rect x="12" y="262" width="8" height="12" rx="1" class="f-plain"/><text x="26" y="272" class="f-label f-muted">те же</text>
  <rect x="120" y="262" width="8" height="12" rx="1" class="f-box"/><text x="134" y="272" class="f-label f-muted">другие</text>
</svg>
<figcaption>Те же 8 чисел, другой порядок сложения. Строки короче одного регистра до новой свёртки не доходят.</figcaption>
</figure>

## Почему токены выжили

Сдвиг на 0,0001 важен, только если логиты первого и второго токена отличаются меньше чем на него. На 8 промптах про это ничего не скажешь, поэтому я взял 200 начал предложений из "Алисы в Стране чудес" и сгенерировал жадно по 100 токенов на каждое, 20 000 шагов на прогон.

Прогонов было 6, но наборов зазоров среди них только 3. Повторный декабрьский прогон и прогон на 1 потоке совпадают до бита. Оба прогона на универсальных ядрах тоже совпадают, а январь это третий набор. Все 200 продолжений оказались одинаковыми во всех 6 прогонах.

Наименьший зазор между первым и вторым токеном был 0,000366, на шаге 14 предложения, которое начинается с "So she set to work". Он совпал до последнего бита во всех прогонах. Ни одно условие не сдвинуло ни один зазор больше чем на 0,000172, так что у самого узкого шага был примерно двойной запас.

<figure class="fig">
<svg viewBox="0 0 640 256" role="img" aria-label="Гистограмма зазора между первым и вторым токеном на 20 000 жадных шагах GPT-2. Медиана 4,02. У самого узкого шага зазор 0,000366. Ни одно условие не изменило зазор больше чем на 0,000172, поэтому ни один шаг в этот сдвиг не попадает.">
  <text x="12" y="18" class="f-label f-muted">зазор между первым и вторым токеном, 20 000 жадных шагов</text>
  <rect x="60.0" y="84" width="21.9" height="130" class="f-box" style="opacity:0.5"/>
  <rect x="107.7" y="203.7" width="21.3" height="10.3" class="f-muted"/>
  <rect x="131.0" y="187.4" width="21.3" height="26.6" class="f-muted"/>
  <rect x="154.3" y="193.4" width="21.3" height="20.6" class="f-muted"/>
  <rect x="177.7" y="185.1" width="21.3" height="28.9" class="f-muted"/>
  <rect x="201.0" y="179.8" width="21.3" height="34.2" class="f-muted"/>
  <rect x="224.3" y="171.1" width="21.3" height="42.9" class="f-muted"/>
  <rect x="247.7" y="162.5" width="21.3" height="51.5" class="f-muted"/>
  <rect x="271.0" y="150.5" width="21.3" height="63.5" class="f-muted"/>
  <rect x="294.3" y="143.0" width="21.3" height="71.0" class="f-muted"/>
  <rect x="317.7" y="137.7" width="21.3" height="76.3" class="f-muted"/>
  <rect x="341.0" y="127.2" width="21.3" height="86.8" class="f-muted"/>
  <rect x="364.3" y="120.7" width="21.3" height="93.3" class="f-muted"/>
  <rect x="387.7" y="113.1" width="21.3" height="100.9" class="f-muted"/>
  <rect x="411.0" y="106.3" width="21.3" height="107.7" class="f-muted"/>
  <rect x="434.3" y="101.9" width="21.3" height="112.1" class="f-muted"/>
  <rect x="457.7" y="97.0" width="21.3" height="117.0" class="f-muted"/>
  <rect x="481.0" y="86.7" width="21.3" height="127.3" class="f-muted"/>
  <rect x="504.3" y="84.0" width="21.3" height="130.0" class="f-muted"/>
  <rect x="527.7" y="133.9" width="21.3" height="80.1" class="f-muted"/>
  <line x1="60" y1="214" x2="620" y2="214" class="f-line"/>
  <line x1="60.0" y1="214" x2="60.0" y2="218" class="f-line"/>
  <text x="60.0" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0,0001</text>
  <line x1="153.3" y1="214" x2="153.3" y2="218" class="f-line"/>
  <text x="153.3" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0,001</text>
  <line x1="246.7" y1="214" x2="246.7" y2="218" class="f-line"/>
  <text x="246.7" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0,01</text>
  <line x1="340.0" y1="214" x2="340.0" y2="218" class="f-line"/>
  <text x="340.0" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0,1</text>
  <line x1="433.3" y1="214" x2="433.3" y2="218" class="f-line"/>
  <text x="433.3" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1</text>
  <line x1="526.7" y1="214" x2="526.7" y2="218" class="f-line"/>
  <text x="526.7" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10</text>
  <line x1="620.0" y1="214" x2="620.0" y2="218" class="f-line"/>
  <text x="620.0" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">100</text>
  <text x="620" y="246" text-anchor="end" class="f-label f-muted">зазор, логарифмическая шкала</text>
  <text x="54" y="207.7" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1</text>
  <text x="54" y="182.4" text-anchor="end" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="54" y="149.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">100</text>
  <text x="54" y="115.4" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1000</text>
  <text x="54" y="78" text-anchor="end" class="f-label f-muted">шагов</text>
  <line x1="81.9" y1="46" x2="81.9" y2="214" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="85.9" y="42" class="f-mono f-accent" style="font-size:11px">наибольший сдвиг 0,000172</text>
  <line x1="112.6" y1="64" x2="112.6" y2="214" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="116.6" y="60" class="f-mono f-ink" style="font-size:11px">самый узкий шаг 0,000366</text>
  <line x1="489.7" y1="46" x2="489.7" y2="214" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="493.7" y="42" class="f-mono f-ink" style="font-size:11px">медиана 4,02</text>
</svg>
<figcaption>200 начал предложений из &quot;Алисы в Стране чудес&quot;, по 100 токенов, декабрьский venv. Зазор любого шага больше удвоенного наибольшего сдвига.</figcaption>
</figure>

Жадная GPT-2 быстро зацикливается и в цикле она очень уверена в себе. Медианный зазор на первых 10 шагах равен 0,70, а на последних 10 уже 6,27. У модели, которая сомневается чаще, шагов около нуля было бы больше. Тогда и у тех же 0,0001 было бы больше шансов перевернуть выбор токена.

1 поток вместо 4 тоже сдвинул логиты первого шага, не больше чем на 0,0000229 в обоих venv. Ни одного токена он не поменял. Почему, я не разбирался.

## Чего я не проверял

- GPU и float16, где порядок сложения зависит от других ядер, которые я не читал.
- Батчинг на сервере, с которым имеют дело пользователи облачных API. У меня батч 1 и машина ничем больше не занята.
- Другой реальный процессор. У AVX-512 в том же файле своя свёртка. Старый процессор я только изобразил переменной окружения.
- Сам коммит. Я читал дифф между тегами v1.11.0 и v1.12.1, а не сам pull request.
- Модели побольше и выводы подлиннее. 20 000 шагов зацикленной модели на 124 млн параметров это не страница текста от модели покрупнее.

На этой машине я могу перестать списывать изменившийся вывод на выборку, по крайней мере с GPT-2. Но у самого узкого шага запас был всего двойной и за модель, которая зацикливается реже, я бы этого не обещал.
