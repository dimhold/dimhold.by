---
title: "Студзеньскі і снежаньскі venv далі GPT-2 тыя ж 20 000 токенаў. Лагіты паміж імі змяніліся"
description: "Я нанова сабраў студзеньскі venv 2022 года (torch 1.10.1, transformers 4.15.0) побач са снежаньскім (torch 1.13.1, transformers 4.25.1) і прагнаў GPT-2 на тых жа промптах. Прагны цыкл, generate() і выбарка з seed далі той жа тэкст, 200 з 200 пачаткаў на 20 000 кроках. Лагіты зрушыліся да 0,000107 і ўвесь зрух сядзіць у адной прыступцы паміж torch 1.11.0 і 1.12.1: новая згортка AVX2 у reduce_all змяніла парадак, у якім softmax складае 8 палос."
date: 2022-12-19
lang: be
translationKey: same-prompt-new-pip
tags: ["llm", "numbers", "reliability"]
---
Выбарка выключаная або seed зафіксаваны, значыць на той жа промпт прыйдзе той жа адказ. Так я да гэтага ставіўся ўвесь год і ні разу не правяраў. Калі лакальная генерацыя не супадала з тым, што я захаваў раней, я казаў сабе "выбарка" і запускаў яшчэ раз, не пытаючыся, ці не змянілася асяроддзе мадэлі. А асяроддзе ў мяне мяняецца раз на некалькі тыдняў, бо я раблю `pip install -U` кожны раз, калі ў новым рэлізе transformers ёсць патрэбная мне праўка. Аднаго канкрэтнага зламанага вываду, які прымусіў бы мяне палезці ўнутр, не было. Проста канчаўся год і мне хацелася зразумець, што зрабіў з вывадам год такіх абнаўленняў.

Студзеньскія вывады я не захаваў, таму сабраў студзеньскі venv нанова з версій, што былі свежымі тады. Гэта torch 1.10.1 ад 15 снежня 2021 года і transformers 4.15.0 ад 22 снежня 2021 года. У снежаньскім venv стаяць torch 1.13.1 з мінулага чацвярга і transformers 4.25.1. Абодва працуюць на Python 3.9, толькі на CPU, у float32, на 4 vCPU віртуальнай машыны з AMD EPYC 7713. Вагі ўзятыя з GPT-2 small на 124 млн параметраў, адзін і той жа файл `pytorch_model.bin` ва ўсіх прагонах.

## Тэкст не зрушыўся

Я ўзяў 8 промптаў, ад "The capital of France is" да "Q: What is 17 times 23?", па 60 новых токенаў на кожны. Кожны промпт я прагнаў у трох рэжымах: прагна ў сваім цыкле з argmax, прагна праз `generate()` і з выбаркай (top_k 50, `torch.manual_seed(1234)` перад кожным промптам). Я чакаў, што першай зламаецца выбарка: яна залежыць ад усяго размеркавання, а не толькі ад таго, які токен на першым месцы.

Нічога не зламалася. Студзень і снежань далі тыя ж токены на ўсіх 8 промптах ва ўсіх рэжымах, уключна з выбаркай. На арыфметычнае пытанне GPT-2 адказвае " 17 times 23." і задае пытанне зноў, па крузе, у абодвух venv.

Лагіты пры гэтым змяніліся. Паўторны запуск у тым жа venv даў тыя ж біты. Снежань разыходзіцца са студзенем у 6 промптах з 8, на першым кроку не больш чым на 0,000107.

Тады я стаў мяняць па адным пакеце. transformers з 4.15.0 на 4.25.1 пры тым жа torch не змяніў ніводнага біта. Код увагі GPT-2 за гэты час у ім мяняўся, значэнне маскі і дзяленне на маштаб, але ніводная з гэтых правак тут біты не зрушыла. torch 1.11.0 дае роўна тыя ж біты, што 1.10.1, а 1.12.1 роўна тыя ж, што 1.13.1. Версію 1.12.0 я не спрабаваў, так што ўся розніца за год хаваецца недзе паміж 1.11.0 і 1.12.1.

<figure class="fig">
<svg viewBox="0 0 640 294" role="img" aria-label="Табліца ўмоў у параўнанні са студзеньскім venv. Паўторны запуск пакідае ўсе 8 промптаў пабітна такімі ж, torch 1.11.0 таксама. Пачынаючы з torch 1.12.1 разыходзяцца 6 промптаў з 8, максімум на 0,000107. Універсальныя ядры мяняюць усе 8. Згенераваны тэкст адзін і той жа ва ўсіх радках, супалі ўсе 24 з 24.">
  <text x="12" y="18" class="f-label f-muted">супраць студзеньскага venv: torch 1.10.1, transformers 4.15.0</text>
  <text x="12" y="40" class="f-label f-muted">умова</text>
  <text x="296" y="40" class="f-label f-muted">лагіты, 8 промптаў</text>
  <text x="452" y="40" class="f-label f-muted">макс. зрух</text>
  <text x="566" y="40" class="f-label f-muted">тэкст</text>
  <text x="12" y="63" class="f-mono f-ink" style="font-size:11px">студзень, яшчэ раз</text>
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
  <text x="12" y="89" class="f-mono f-ink" style="font-size:11px">студзень, 1 паток</text>
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
  <text x="12" y="115" class="f-mono f-ink" style="font-size:11px">студзень, універсальныя ядры</text>
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
  <text x="12" y="193" class="f-mono f-ink" style="font-size:11px">torch 1.13.1, transformers з 4.15 па 4.22</text>
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
  <text x="12" y="219" class="f-mono f-ink" style="font-size:11px">снежань: 1.13.1 і 4.25.1</text>
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
  <text x="12" y="245" class="f-mono f-ink" style="font-size:11px">снежань, універсальныя ядры</text>
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
  <rect x="300" y="268" width="14" height="14" rx="2" class="f-plain"/><text x="320" y="279" class="f-label f-muted">біты тыя ж</text>
  <rect x="420" y="268" width="14" height="14" rx="2" class="f-box"/><text x="440" y="279" class="f-label f-muted">біты іншыя</text>
</svg>
<figcaption>Лагіты першага кроку, параўнанне па бітах. Тэкст параўноўваецца для 8 промптаў у 3 рэжымах (свой прагны цыкл, generate, выбарка з seed).</figcaption>
</figure>

## Дзе прыступка

2 промпты захавалі свае біты нават пасля гэтай прыступкі і я не разумеў чаму. Спачатку я патраціў час на MKL. З `MKL_VERBOSE=1` torch паказвае выклікі `SGEMM` з MKL 2020.0, гэта значыць матрыцы сапраўды перамнажае MKL. Але з `MKL_ENABLE_INSTRUCTIONS=SSE4_2` не змянілася наогул нічога, ніводнага біта ні ў адным venv. Чаму, я дагэтуль не ведаю.

Потым я паспрабаваў `ATEN_CPU_CAPABILITY=default`. З ім torch бярэ свае ўніверсальныя ядры замест ядраў AVX2, як на старым працэсары. Лагіты зрушыліся максімум на 0,000122 супраць звычайнага снежаньскага прагону. Студзень і снежань сталі пабітна аднолькавымі. Значыць, змена сядзела ў адным з ядраў AVX2.

Я выгрузіў выхад кожнага слоя на промпце з найбольшым разыходжаннем. Гэта арыфметычнае пытанне, у ім 11 токенаў. Эмбедынгі і першы LayerNorm супадаюць. Першае разыходжанне, 0,0000019, з'яўляецца на выхадзе ўвагі ў блоку 0 і да апошняга блока дарастае да 0,00032. Потым я прагнаў кожную аперацыю асобна на фіксаваным выпадковым уваходзе. Адрозніваецца толькі softmax.

У 2 промптаў, якія захавалі біты, 5 і 7 токенаў. Ва ўсіх астатніх 8 і больш. Я прагнаў softmax на радках усіх даўжынь ад 1 да 64. Даўжыні з 1 па 7 даюць тыя ж біты ў абедзвюх версіях. Пачынаючы з 8 у кожнай даўжыні ёсць радкі, якія разыходзяцца, акрамя 23. Думаю, гэта выпадковасць.

8 лікаў float гэта адзін рэгістр AVX2. Астатняе відаць у дыфе `aten/src/ATen/cpu/vec/functional_base.h` паміж 2 тэгамі. Softmax сумуе экспаненты праз `reduce_all`, а той трымае 8 частковых сум у палосах рэгістра і напрыканцы зводзіць іх у адзін лік. У 1.11.0 гэтая згортка ідзе паласа за паласой: да паласы 0 дадаецца паласа 1, потым паласа 2 і так да паласы 7. У 1.12.1 для AVX2 дадалі хутчэйшую згортку:

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

Яна складае палосы праз 4, потым праз 2, потым суседнія. Лікі тыя ж, парадак складання іншы, а ў float ад гэтага можа змяніцца апошні біт. Радкі, карацейшыя за адзін рэгістр, да новага кода не даходзяць. Ва ўніверсальных ядрах яго няма зусім. Няма яго і ў зборках кампілятарам MSVC: новая згортка закрытая праверкай на GCC, так што на Windows гэтай прыступкі, хутчэй за ўсё, няма.

<figure class="fig">
<svg viewBox="0 0 640 284" role="img" aria-label="Два спосабы звесці 8 палос рэгістра AVX2 у адну суму. torch 1.11.0 дадае іх па чарзе, torch 1.12.1 складае палосы праз 4, потым праз 2, потым суседнія. Ніжэй softmax на радках даўжынёй ад 1 да 64: даўжыні з 1 па 7 даюць тыя ж біты ў абедзвюх версіях, з 8 адрозніваюцца ўсе, акрамя 23.">
  <text x="12" y="18" class="f-label f-muted">torch 1.11.0: паласа за паласой</text>
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
  <text x="336" y="18" class="f-label f-muted">1.12.1 з AVX2: праз 4, 2, 1</text>
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
  <text x="12" y="214" class="f-label f-muted">softmax па радках даўжынёй ад 1 да 64, 1.11.0 супраць 1.12.1</text>
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
  <rect x="12" y="262" width="8" height="12" rx="1" class="f-plain"/><text x="26" y="272" class="f-label f-muted">тыя ж</text>
  <rect x="120" y="262" width="8" height="12" rx="1" class="f-box"/><text x="134" y="272" class="f-label f-muted">іншыя</text>
</svg>
<figcaption>Тыя ж 8 лікаў, іншы парадак складання. Радкі, карацейшыя за адзін рэгістр, да новай згорткі не даходзяць.</figcaption>
</figure>

## Чаму токены выжылі

Зрух на 0,0001 мае значэнне толькі тады, калі зазор паміж першым і другім токенам меншы за яго. На 8 промптах пра гэта нічога не скажаш, таму я ўзяў 200 пачаткаў сказаў з "Алісы ў Краіне цудаў" і згенераваў прагна па 100 токенаў на кожны, 20 000 крокаў на прагон.

Прагонаў было 6, але розных набораў зазораў сярод іх толькі 3. Паўторны снежаньскі прагон і прагон на 1 патоку супадаюць да біта. Абодва прагоны на ўніверсальных ядрах таксама супадаюць, а студзень гэта трэці набор. Усе 200 працягаў аказаліся аднолькавымі ва ўсіх 6 прагонах.

Найменшы зазор паміж першым і другім токенам быў 0,000366, на кроку 14 сказа, які пачынаецца з "So she set to work". Ён супаў да апошняга біта ва ўсіх прагонах. Ніводная ўмова не зрушыла ніводны зазор больш чым на 0,000172, так што ў самага цеснага кроку быў прыкладна двайны запас.

<figure class="fig">
<svg viewBox="0 0 640 256" role="img" aria-label="Гістаграма зазору паміж першым і другім токенам на 20 000 прагных кроках GPT-2. Медыяна 4,02. У самага цеснага кроку зазор 0,000366. Ніводная ўмова не змяніла зазор больш чым на 0,000172, таму ніводзін крок у гэты зрух не трапляе.">
  <text x="12" y="18" class="f-label f-muted">зазор паміж першым і другім токенам, 20 000 прагных крокаў</text>
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
  <text x="620" y="246" text-anchor="end" class="f-label f-muted">зазор, лагарыфмічная шкала</text>
  <text x="54" y="207.7" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1</text>
  <text x="54" y="182.4" text-anchor="end" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="54" y="149.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">100</text>
  <text x="54" y="115.4" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1000</text>
  <text x="54" y="78" text-anchor="end" class="f-label f-muted">крокаў</text>
  <line x1="81.9" y1="46" x2="81.9" y2="214" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="85.9" y="42" class="f-mono f-accent" style="font-size:11px">найбольшы зрух 0,000172</text>
  <line x1="112.6" y1="64" x2="112.6" y2="214" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="116.6" y="60" class="f-mono f-ink" style="font-size:11px">самы цесны крок 0,000366</text>
  <line x1="489.7" y1="46" x2="489.7" y2="214" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="493.7" y="42" class="f-mono f-ink" style="font-size:11px">медыяна 4,02</text>
</svg>
<figcaption>200 пачаткаў сказаў з &quot;Алісы ў Краіне цудаў&quot;, па 100 токенаў, снежаньскі venv. Зазор любога кроку большы за падвоены найбольшы зрух.</figcaption>
</figure>

Прагная GPT-2 хутка зацыкліваецца і ў цыкле яна вельмі ўпэўненая ў сабе. Медыянны зазор на першых 10 кроках роўны 0,70, а на апошніх 10 ужо 6,27. У мадэлі, якая вагаецца часцей, крокаў каля нуля было б больш. Тады і той жа зрух на 0,0001 меў бы больш шанцаў перавярнуць выбар токена.

1 паток замест 4 таксама зрушыў лагіты першага кроку, не больш чым на 0,0000229 у абодвух venv. Ніводнага токена ён не змяніў. Чаму, я не разбіраўся.

## Чаго я не правяраў

- GPU і float16, дзе парадак складання залежыць ад іншых ядраў, якія я не чытаў.
- Батчынг на серверы, з якім маюць справу карыстальнікі воблачных API. У мяне батч 1 і машына нічым больш не занятая.
- Іншы сапраўдны працэсар. У AVX-512 у тым жа файле свая згортка. Стары працэсар я толькі імітаваў зменнай асяроддзя.
- Сам каміт. Я чытаў дыф паміж тэгамі v1.11.0 і v1.12.1, а не сам pull request.
- Большыя мадэлі і даўжэйшыя вывады. 20 000 крокаў зацыкленай мадэлі на 124 млн параметраў гэта не старонка тэксту ад большай мадэлі.

На гэтай машыне я магу перастаць спісваць змененыя вывады на выбарку, прынамсі з GPT-2. Але ў самага цеснага кроку запас быў толькі двайны і для мадэлі, якая зацыкліваецца радзей, я б гэтага не абяцаў.
