---
title: "Адно і тое ж пытанне да opus 5 дало 21 розны адказ за 64 выклікі. Я пайшоў шукаць, дзе пачынаецца розніца"
description: "Я спісваў кожны розны адказ на тэмпературу і ні разу гэтага не праверыў. На CPU без выбаркі Qwen2.5 0.5B у float32 давала тыя ж токены пры паўторах, патоках і батчах. У bfloat16 батч з 8 змяніў тэкст у 4 промптах з 8, адзін раз на першым токене, дзе ў Sure і Certainly быў дакладна аднолькавы лагіт. opus 5 праз CLI даў 21 розны лік на адно арыфметычнае пытанне за 64 выклікі."
date: 2026-09-28
lang: be
translationKey: llm-determinism
tags: ["llm", "numbers", "reliability"]
---
20 жніўня я зафіксаваў у файле 6 задач і пачаў задаваць `claude-opus-5` адны і тыя ж пытанні праз Claude Code CLI. Кожны адказ правярае грэйдар. Мне патрэбна была кропка адліку для пастоў "мадэль на гэтым тыдні зрабілі дурнейшай", але спачатку файл паказаў розніцу ўнутры аднаго заходу. Адна з задач: 60 месяцаў росту MRR па складаных працэнтах, дзе тэмп мяняецца пасля 6-га месяца. Код лічыць 58937.5857. За 64 выклікі з 20 жніўня па 12 верасня мадэль вярнула 21 розны лік. На астатніх 5 задачах яна давала адзін адказ на задачу. 1 выклік упаў на ліміце запытаў.

Я заўсёды тлумачыў гэта сабе тэмпературай. У CLI яе не задаць, таму я ні разу не ставіў яе ў 0 і лічыў, што пры 0 адказ перастане мяняцца. Яшчэ я чытаў "Defeating Nondeterminism in LLM Inference" Хораса Хэ з Thinking Machines, верасень 2025. Там сказана, што нават пры тэмпературы 0 сервер аддае розны тэкст, бо яго вылічальныя ядры (kernels) не інварыянтныя адносна памеру батча. А батч залежыць ад чужога трафіку. У гэта я таксама паверыў і таксама не правяраў. Таму на гэты раз я ўзяў мадэль, у якой нічога не схавана. У ёй я стаў шукаць месца, дзе розніца пачынаецца.

## Выбарка выключаная, float32

Qwen2.5 0.5B Instruct, transformers 5.16.1 і torch 2.14.0 на 4 ядрах працэсара AMD EPYC, прагнае дэкадаванне, гэта значыць ніякай выбаркі. Qwen кладзе ў свой generation config штраф за паўтор 1.1 і я пакінуў яго ўключаным ва ўсіх прагонах. 8 промптаў з доўгімі адказамі, ад хэш-табліц да хатняга хлеба.

У float32 не зрушылася нічога. 5 паўтораў запар далі тыя ж лагіты біт у біт. 1, 2 і 4 патокі таксама далі тыя ж біты, чаго я не чакаў. Батч з 2, 4 ці 8 мяняў лагіты ва ўсіх 8 промптах, але толькі ў пятым знаку пасля коскі. Токены супалі на ўсіх 200 кроках, а ў другой серыі на ўсіх 400.

Прагнае дэкадаванне бярэ токен з найбольшай ацэнкай, значыць для развілкі зазор да другога токена мусіць быць меншы за шум. Самы малы зазор у 8 адказах даўжынёй да 400 токенаў быў 0.000122, на промпце пра суму. У батчы з 8 той жа крок даў 0.000109. Батч ні разу не зрушыў зазор больш чым на 0.00004.

## bfloat16

Я загрузіў тыя ж вагі ў bfloat16. Паўтор на батчы 1 зноў даў тыя ж токены, гэта значыць сама з сабой мадэль па-ранейшаму дэтэрмінаваная.

У bfloat16 8 бітаў дакладнасці і лагіт каля 17 захоўваецца з крокам 0.125. 2 токены могуць атрымаць дакладна аднолькавую ацэнку. У float32 такога не было ні разу за 2782 крокі, а ў bfloat16 2 верхнія токены зраўняліся 38 разоў за 2709 крокаў. Промпт пра хлеб пачаўся з нічыёй: у `Certainly` і `Sure` па 17.625, а ў float32 у іх было 17.693 і 17.598. Без батча прагон пачаўся з "Sure! Here's a simple guide". У батчы з 8 ён пачаўся з "Certainly! Making bread at home".

У простым прамым праходзе батч зрушваў лагіты першага кроку не больш чым на 0.000047 у float32 і на 0.29 у bfloat16. Праз `generate` у батчы з 8 іншым шляхам пайшлі 4 промпты з 8. float32 супраць bfloat16, абодва на батчы 1, разышліся ў 7 промптах з 8. Промпт пра суму просіць скласці лікі ад 1 да 250, якія дзеляцца на 3 ці 7, сума роўная 13482. Абодва прагоны замест сумы выдалі колькасць. Правільная колькасць, 107, атрымалася толькі ў bfloat16, а float32 памыліўся на кратных 21 і напісаў 106.

<figure class="fig">
<svg viewBox="0 0 640 310" role="img" aria-label="Сетка з 8 промптаў на 6 умоў для Qwen2.5 0.5B з прагным дэкадаваннем. Знак роўнасці азначае, што токены супалі з эталонным прагонам, лік гэта токен, на якім яны ўпершыню разышліся. У float32 роўныя ўсе клеткі: паўторы, 1, 2 і 4 патокі, батчы 2, 4 і 8 на 200 токенах і батч 8 на 400 токенах. У bfloat16 паўтор роўны ўсюды. Батч 8 у bfloat16 разыходзіцца ў 4 промптах: URL у браўзеры на токене 47, апавяданне пра маяк на токене 121, складанне float на токене 134, хлеб на токене 0. float32 супраць bfloat16 разыходзіцца ў 7 промптах з 8.">
  <text x="12" y="16" class="f-label f-muted">той жа промпт, выбарка выключаная: дзе токены разыходзяцца</text>
  <text x="226" y="38" text-anchor="middle" class="f-label f-muted">float32</text>
  <text x="226" y="51" text-anchor="middle" class="f-label f-muted">паўтор</text>
  <text x="226" y="64" text-anchor="middle" class="f-label f-muted">патокі</text>
  <text x="298" y="38" text-anchor="middle" class="f-label f-muted">float32</text>
  <text x="298" y="51" text-anchor="middle" class="f-label f-muted">батч</text>
  <text x="298" y="64" text-anchor="middle" class="f-label f-muted">2, 4, 8</text>
  <text x="370" y="38" text-anchor="middle" class="f-label f-muted">float32</text>
  <text x="370" y="51" text-anchor="middle" class="f-label f-muted">батч 8</text>
  <text x="442" y="38" text-anchor="middle" class="f-label f-accent">bfloat16</text>
  <text x="442" y="51" text-anchor="middle" class="f-label f-muted">паўтор</text>
  <text x="514" y="38" text-anchor="middle" class="f-label f-accent">bfloat16</text>
  <text x="514" y="51" text-anchor="middle" class="f-label f-muted">батч 8</text>
  <text x="586" y="38" text-anchor="middle" class="f-label f-muted">float32</text>
  <text x="586" y="51" text-anchor="middle" class="f-label f-muted">супраць</text>
  <text x="586" y="64" text-anchor="middle" class="f-label f-accent">bfloat16</text>
  <text x="12" y="91" class="f-mono f-ink">хэш-табліца</text>
  <rect x="194" y="76" width="64" height="20" class="f-plain"/>
  <text x="226" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="76" width="64" height="20" class="f-plain"/>
  <text x="298" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="76" width="64" height="20" class="f-plain"/>
  <text x="370" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="76" width="64" height="20" class="f-plain"/>
  <text x="442" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="76" width="64" height="20" class="f-plain"/>
  <text x="514" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="554" y="76" width="64" height="20" class="f-box"/>
  <text x="586" y="91" text-anchor="middle" class="f-mono f-ink">84</text>
  <text x="12" y="117" class="f-mono f-ink">URL у браўзеры</text>
  <rect x="194" y="102" width="64" height="20" class="f-plain"/>
  <text x="226" y="117" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="102" width="64" height="20" class="f-plain"/>
  <text x="298" y="117" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="102" width="64" height="20" class="f-plain"/>
  <text x="370" y="117" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="102" width="64" height="20" class="f-plain"/>
  <text x="442" y="117" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="102" width="64" height="20" class="f-box"/>
  <text x="514" y="117" text-anchor="middle" class="f-mono f-ink">47</text>
  <rect x="554" y="102" width="64" height="20" class="f-box"/>
  <text x="586" y="117" text-anchor="middle" class="f-mono f-ink">11</text>
  <text x="12" y="143" class="f-mono f-ink">калі скончацца грошы</text>
  <rect x="194" y="128" width="64" height="20" class="f-plain"/>
  <text x="226" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="128" width="64" height="20" class="f-plain"/>
  <text x="298" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="128" width="64" height="20" class="f-plain"/>
  <text x="370" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="128" width="64" height="20" class="f-plain"/>
  <text x="442" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="128" width="64" height="20" class="f-plain"/>
  <text x="514" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="554" y="128" width="64" height="20" class="f-plain"/>
  <text x="586" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <text x="12" y="169" class="f-mono f-ink">апавяданне пра маяк</text>
  <rect x="194" y="154" width="64" height="20" class="f-plain"/>
  <text x="226" y="169" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="154" width="64" height="20" class="f-plain"/>
  <text x="298" y="169" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="154" width="64" height="20" class="f-plain"/>
  <text x="370" y="169" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="154" width="64" height="20" class="f-plain"/>
  <text x="442" y="169" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="154" width="64" height="20" class="f-box"/>
  <text x="514" y="169" text-anchor="middle" class="f-mono f-ink">121</text>
  <rect x="554" y="154" width="64" height="20" class="f-box"/>
  <text x="586" y="169" text-anchor="middle" class="f-mono f-ink">121</text>
  <text x="12" y="195" class="f-mono f-ink">PostgreSQL ці SQLite</text>
  <rect x="194" y="180" width="64" height="20" class="f-plain"/>
  <text x="226" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="180" width="64" height="20" class="f-plain"/>
  <text x="298" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="180" width="64" height="20" class="f-plain"/>
  <text x="370" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="180" width="64" height="20" class="f-plain"/>
  <text x="442" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="180" width="64" height="20" class="f-plain"/>
  <text x="514" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="554" y="180" width="64" height="20" class="f-box"/>
  <text x="586" y="195" text-anchor="middle" class="f-mono f-ink">22</text>
  <text x="12" y="221" class="f-mono f-ink">сума, 3 ці 7</text>
  <rect x="194" y="206" width="64" height="20" class="f-plain"/>
  <text x="226" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="206" width="64" height="20" class="f-plain"/>
  <text x="298" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="206" width="64" height="20" class="f-plain"/>
  <text x="370" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="206" width="64" height="20" class="f-plain"/>
  <text x="442" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="206" width="64" height="20" class="f-plain"/>
  <text x="514" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="554" y="206" width="64" height="20" class="f-box"/>
  <text x="586" y="221" text-anchor="middle" class="f-mono f-ink">219</text>
  <text x="12" y="247" class="f-mono f-ink">складанне float</text>
  <rect x="194" y="232" width="64" height="20" class="f-plain"/>
  <text x="226" y="247" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="232" width="64" height="20" class="f-plain"/>
  <text x="298" y="247" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="232" width="64" height="20" class="f-plain"/>
  <text x="370" y="247" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="232" width="64" height="20" class="f-plain"/>
  <text x="442" y="247" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="232" width="64" height="20" class="f-box"/>
  <text x="514" y="247" text-anchor="middle" class="f-mono f-ink">134</text>
  <rect x="554" y="232" width="64" height="20" class="f-box"/>
  <text x="586" y="247" text-anchor="middle" class="f-mono f-ink">144</text>
  <text x="12" y="273" class="f-mono f-ink">хлеб</text>
  <rect x="194" y="258" width="64" height="20" class="f-plain"/>
  <text x="226" y="273" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="258" width="64" height="20" class="f-plain"/>
  <text x="298" y="273" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="258" width="64" height="20" class="f-plain"/>
  <text x="370" y="273" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="258" width="64" height="20" class="f-plain"/>
  <text x="442" y="273" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="258" width="64" height="20" class="f-box"/>
  <text x="514" y="273" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="554" y="258" width="64" height="20" class="f-box"/>
  <text x="586" y="273" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="190" y="290" width="18" height="12" class="f-plain"/>
  <text x="214" y="300" class="f-label f-muted">токены супалі</text>
  <rect x="370" y="290" width="18" height="12" class="f-box"/>
  <text x="394" y="300" class="f-label f-muted">разыходзяцца з гэтага токена</text>
</svg>
<figcaption>У слупках 1 і 2 генеруецца 200 новых токенаў, у астатніх 400. Нумары токенаў пачынаюцца з 0. Батч зрушваў лагіты першага кроку ў абодвух фарматах: не больш чым на 0.000047 у float32 і на 0.29 у bfloat16. Іншы тэкст з гэтага атрымаўся толькі ў bfloat16.</figcaption>
</figure>

Тут я захрас. 2 з 4 развілак у батчы здарыліся там, дзе зазор паміж 2 верхнімі токенамі быў 1.375, далёка ад любой нічыёй. Я не разумеў, як шум у 0.29 можа такое перавярнуць. Адказ ляжаў у маім жа скрыпце. Зазоры я браў з сырых лагітаў, а дэкодар выбірае пасля штрафу за паўтор. У float32 токен, першы па сырых лагітах, не супадаў з выбраным у 396 кроках з 2782. Я прагнаў серыю нанова, цяпер з зазорам пасля штрафу. Токены выйшлі тыя ж ва ўсіх 32 прагонах. На гэтых 2 кроках зазор пасля штрафу быў 0.09 без батча, а ў батчы 0.034 і 0.023. Астатнія 2 развілкі былі дакладнымі нічыімі.

## Назад да opus

Потым я 20 разоў папрасіў `claude-opus-5` растлумачыць калізіі ў хэш-табліцы прыкладна ў 150 словах. CLI 2.1.283, thinking выключаны, без інструментаў, пусты канфіг MCP, просты сістэмны промпт і тэчка без аніводнага `CLAUDE.md` вышэй па дрэве. Я атрымаў 20 розных тэкстаў, усе пачынаюцца з "A hash table" і кажуць пра метад ланцужкоў і адкрытую адрасацыю. У 132 парах з 190 агульны пачатак абодвух тэкстаў не даўжэйшы за 11 слоў.

Пасля лакальных прагонаў я чытаю 21 адказ на арыфметыку як групы, а не як шум. Тыя выклікі ішлі праз CLI ад 2.1.237 да 2.1.269 з уключаным thinking. Грэйдар дапускае адносную памылку да 1e-6, гэта каля 6 цэнтаў. У допуск трапілі 46 адказаў з 64. 31 з іх супадае з правільным значэннем да цэнта: 16 акруглілі да 58937.59, 15 адкінулі хвост да 58937.58. З 18 па-за допускам 6 ляжаць каля 58928.2, а 7 прамахваюцца менш чым на 20 цэнтаў.

<figure class="fig">
<svg viewBox="0 0 640 375" role="img" aria-label="2 кропкавыя дыяграмы 64 адказаў opus 5 на адно і тое ж пытанне пра MRR са складанымі працэнтамі, адна кропка на выклік, зафарбаваныя прайшлі грэйдар. Зверху ўвесь раскід ад 58905 да 58940: большасць адказаў стаіць на 58937, другая група з 6 на 58928, адзінкавыя адказы на 58907, 58931 і 58934. Знізу акно ад 58937.1 да 58937.75 па цэнтах: правільнае значэнне 58937.5857, грэйдар прымае каля 6 цэнтаў у абодва бакі, 16 адказаў роўныя 58937.59 і 15 роўныя 58937.58. Прайшлі 46 з 64.">
  <text x="12" y="16" class="f-label f-muted">opus 5, тое самае пытанне пра MRR, 64 выклікі</text>
  <text x="12" y="40" class="f-label f-muted">усе адказы</text>
  <rect x="75.0" y="116.0" width="10" height="2.0" class="f-plain"/>
  <text x="80.0" y="111.0" text-anchor="middle" class="f-mono f-ink">1</text>
  <rect x="411.0" y="111.6" width="10" height="6.4" class="f-plain"/>
  <text x="416.0" y="106.6" text-anchor="middle" class="f-mono f-ink">6</text>
  <rect x="459.0" y="116.0" width="10" height="2.0" class="f-plain"/>
  <text x="464.0" y="111.0" text-anchor="middle" class="f-mono f-ink">1</text>
  <rect x="507.0" y="115.9" width="10" height="2.1" class="f-plain"/>
  <text x="512.0" y="110.9" text-anchor="middle" class="f-mono f-ink">2</text>
  <rect x="555.0" y="60.0" width="10" height="58.0" class="f-plain"/>
  <rect x="555.0" y="68.6" width="10" height="49.4" class="f-box"/>
  <text x="560.0" y="55.0" text-anchor="middle" class="f-mono f-ink">54</text>
  <line x1="40" y1="120" x2="600" y2="120" class="f-line"/>
  <line x1="40" y1="120" x2="40" y2="125" class="f-line"/>
  <text x="40" y="138" text-anchor="middle" class="f-mono f-muted">58905</text>
  <line x1="120" y1="120" x2="120" y2="125" class="f-line"/>
  <text x="120" y="138" text-anchor="middle" class="f-mono f-muted">58910</text>
  <line x1="200" y1="120" x2="200" y2="125" class="f-line"/>
  <text x="200" y="138" text-anchor="middle" class="f-mono f-muted">58915</text>
  <line x1="280" y1="120" x2="280" y2="125" class="f-line"/>
  <text x="280" y="138" text-anchor="middle" class="f-mono f-muted">58920</text>
  <line x1="360" y1="120" x2="360" y2="125" class="f-line"/>
  <text x="360" y="138" text-anchor="middle" class="f-mono f-muted">58925</text>
  <line x1="440" y1="120" x2="440" y2="125" class="f-line"/>
  <text x="440" y="138" text-anchor="middle" class="f-mono f-muted">58930</text>
  <line x1="520" y1="120" x2="520" y2="125" class="f-line"/>
  <text x="520" y="138" text-anchor="middle" class="f-mono f-muted">58935</text>
  <line x1="600" y1="120" x2="600" y2="125" class="f-line"/>
  <text x="600" y="138" text-anchor="middle" class="f-mono f-muted">58940</text>
  <text x="12" y="168" class="f-label f-muted">група каля правільнага значэння, па цэнтах</text>
  <text x="458.5" y="186" text-anchor="middle" class="f-label f-ink">правільнае значэнне 58937.5857</text>
  <rect x="407.7" y="194" width="101.6" height="151" class="f-plain" stroke-dasharray="3 2"/>
  <text x="515.3" y="206" class="f-label f-muted">допуск грэйдара</text>
  <line x1="458.5" y1="194" x2="458.5" y2="345" class="f-line"/>
  <circle cx="100.3" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="298.5" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="315.7" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="341.5" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="367.4" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="384.6" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="384.6" cy="331.6" r="3.6" class="f-plain"/>
  <circle cx="436.3" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="436.3" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="436.3" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="444.9" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="316.0" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="308.2" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="300.4" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="292.6" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="284.8" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="277.0" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="269.2" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="261.4" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="253.6" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="245.8" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="238.0" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="230.2" r="3.6" class="f-box"/>
  <text x="446.5" y="234.0" text-anchor="end" class="f-mono f-ink">15</text>
  <circle cx="462.2" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="316.0" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="308.2" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="300.4" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="292.6" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="284.8" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="277.0" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="269.2" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="261.4" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="253.6" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="245.8" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="238.0" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="230.2" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="222.4" r="3.6" class="f-box"/>
  <text x="462.2" y="215.2" text-anchor="middle" class="f-mono f-ink">16</text>
  <circle cx="470.8" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="316.0" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="308.2" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="300.4" r="3.6" class="f-box"/>
  <text x="470.8" y="293.2" text-anchor="middle" class="f-mono f-ink">6</text>
  <circle cx="479.4" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="479.4" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="479.4" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="479.4" cy="316.0" r="3.6" class="f-box"/>
  <text x="479.4" y="308.8" text-anchor="middle" class="f-mono f-ink">4</text>
  <circle cx="488.0" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="565.5" cy="339.4" r="3.6" class="f-plain"/>
  <line x1="40" y1="345" x2="600" y2="345" class="f-line"/>
  <line x1="126.15384615239958" y1="345" x2="126.15384615239958" y2="350" class="f-line"/>
  <text x="126.15384615239958" y="363" text-anchor="middle" class="f-mono f-muted">58937.2</text>
  <line x1="212.30769231106765" y1="345" x2="212.30769231106765" y2="350" class="f-line"/>
  <text x="212.30769231106765" y="363" text-anchor="middle" class="f-mono f-muted">58937.3</text>
  <line x1="298.4615384634672" y1="345" x2="298.4615384634672" y2="350" class="f-line"/>
  <text x="298.4615384634672" y="363" text-anchor="middle" class="f-mono f-muted">58937.4</text>
  <line x1="384.6153846158668" y1="345" x2="384.6153846158668" y2="350" class="f-line"/>
  <text x="384.6153846158668" y="363" text-anchor="middle" class="f-mono f-muted">58937.5</text>
  <line x1="470.76923076826637" y1="345" x2="470.76923076826637" y2="350" class="f-line"/>
  <text x="470.76923076826637" y="363" text-anchor="middle" class="f-mono f-muted">58937.6</text>
  <line x1="556.923076920666" y1="345" x2="556.923076920666" y2="350" class="f-line"/>
  <text x="556.923076920666" y="363" text-anchor="middle" class="f-mono f-muted">58937.7</text>
</svg>
<figcaption>Зафарбаваныя кропкі прайшлі грэйдар, адносная памылка да 1e-6. З 20 жніўня па 12 верасня 2026 года, 64 выклікі, 21 розны лік.</figcaption>
</figure>

Разабраць мадэль у сэрвісе так, як я разабраў маленькую, я не магу. CLI бярэ тую выбарку, якую наладзіў сэрвіс, таму выбарка і батчынг трапляюць у адзін лік разам з усім астатнім, што адбываецца на серверы. Лакальныя прагоны паказваюць толькі тое, чаго хапае, каб тэкст змяніўся пры выключанай выбарцы: нічыя ў bfloat16 ці суседзі па батчы. Пра арыфметыку ў мяне здагадка: мадэль лічыць яе ў доўгім схаваным разважанні, ад 691 да 6632 выходных токенаў на выклік. Калі адзін крок рана пойдзе інакш, ён пацягнуў бы за сабой усё астатняе. Адказы кладуцца групамі і гэта са здагадкай сыходзіцца, але я яе не правяраў.

Для маіх уласных інструментаў вывад сціплы. Грэйдар і так параўноўвае лікі з допускам. Допуск я пакідаю. Крытык, які ацэньвае мае чарнавікі, шуміць гэтак жа. На адным чарнавіку ён 30 разоў з 30 вынес адзін і той жа адмоўны вердыкт. Пры гэтым ён назваў 160 розных заўваг і 114 з іх прагучалі толькі аднойчы.

## Чаго я не правяраў

- GPU. Усе лакальныя прагоны ішлі на CPU, а вылічальныя ядры, пра якія піша Thinking Machines, напісаныя для GPU. Юань з суаўтарамі (arXiv 2506.09501) мералі, як уплываюць bf16 супраць fp32 і памер батча, на GPU з мадэлямі на 7B. Мой вынік з bfloat16 гэта той жа эфект дакладнасці на значна меншай мадэлі.
- Мадэлі праз API на вялікай колькасці выклікаў. Атыл з суаўтарамі (arXiv 2408.04667) мералі гэты раскід на 5 мадэлях.
- Тэмпература 0 у мадэлі ў сэрвісе. У CLI такой налады няма.
- Чаму батч у прамым праходзе захоўвае нічыю ў промпце пра хлеб на 17.625, а батч з 8 праз `generate` разбівае яе на 0.125. Самаму доўгаму промпту падзінг не патрэбны і паводзіць ён сябе гэтак жа. Пры прамым праходзе батчам ён супадае біт у біт, а праз `generate` разыходзіцца ў пятым знаку.
- Якое вылічэнне дае 58928.2. Гэты лік вярнуўся 6 разоў, так што гэта, хутчэй за ўсё, устойлівы няправільны шлях, але крок я не знайшоў.
