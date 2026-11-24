---
title: "Адна дакладнасць і 72 розныя адказы ў 10 прагонах DistilBERT на RTE"
description: "Я данавучыў DistilBERT на RTE 10 разоў са змаўчаннямі run_glue.py з transformers 2.2.2, мяняючы толькі сід. Дакладнасць на dev раскідана ад 56,7% да 63,2%, 2 прагоны з аднолькавымі 57,4% разыходзяцца на 72 парах з 277, а параўнанне 2 налад па 1 прагоне выбірае не тую 1 раз з 3. Той жа сід на іншай колькасці патокаў даў 59,9% замест 57,4%."
date: 2019-12-21
lang: be
translationKey: single-run-rte
tags: ["machine-learning", "statistics"]
---
У артыкуле Дэўліна з калегамі пра BERT ёсць фраза, якую я чытаў шмат разоў і ні разу не прыняў на свой рахунак. Аўтары пішуць, што данавучанне вялікага BERT "часам было нестабільным на маленькіх датасэтах". Таму яны рабілі некалькі выпадковых перазапускаў і пакідалі лепшую мадэль па dev. Паміж перазапускамі мяняліся перамешванне даных і ініцыялізацыя слоя класіфікатара.

Я чытаў гэта як праблему вельмі вялікай мадэлі. Калі я нешта данавучаю, я запускаю `run_glue.py` адзін раз з сідам па змаўчанні `--seed 42`, адкрываю `eval_results.txt` і бяру лік. Потым у кастрычніку выйшаў артыкул Санха з калегамі пра DistilBERT. Пад яго табліцай GLUE напісана, што вынікі BERT і DistilBERT гэта "медыяны 5 прагонаў з рознымі сідамі". Выходзіць, 2 групы аўтараў аднаму прагону не давяраюць, а я давяраю. Я вырашыў паглядзець, наколькі хлусіць 1 прагон на маленькай задачы, на маёй уласнай машыне.

## Як мераў

Мадэль DistilBERT base uncased. Задача RTE з GLUE: 2490 пар сказаў для навучання і 277 у dev, метка "entailment" або "not entailment". Цыкл навучання я скапіяваў з `run_glue.py` у transformers 2.2.2 з яго змаўчаннямі: хуткасць навучання 5e-5, батч 8, 3 эпохі, даўжыня паслядоўнасці да 128, без warmup. Python 3.7, PyTorch 1.3.1, толькі CPU. У `run_glue.py` 1 сід задае ўсё выпадковае адразу: новую галаву класіфікатара, парадак батчаў і маскі dropout. Мой цыкл яшчэ лічыць дакладнасць на dev пасля кожнай эпохі і абразае падбіўку ў кожным батчы. Таму выпадковыя лікі ён бярэ ў іншым парадку, чым `run_glue.py`. Мой сід 42 не роўны іх сіду 42.

На 4 ядрах AMD EPYC першая ацэнка выйшла 100 хвілін на прагон. Я не адразу знайшоў, што MKL унутры PyTorch 1.3.1 ідзе на працэсарах AMD павольным шляхам. З `MKL_DEBUG_CPU_TYPE=5` хуткасць простага множання матрыц вырасла з 67 да 202 GFLOPS. Гэта быў 1 замер на занятай машыне. На вольнай 3 паўторы далі каля 90 супраць 330. Пасля гэтага прагон займаў ад 43 да 52 хвілін. Каб зэканоміць час, я запускаў па 2 прагоны адразу. 3 прагоны былі забітыя, хутчэй за ўсё праз памяць: 2 прагоны прыкладна па 2,5 ГБ не змяшчаліся побач з усім астатнім на машыне. Серыю давялося скараціць з задуманых 16 сідаў да 10. Яна заняла ўсю ноч. Сіды 1, 2, 3 і 5 ішлі парамі па 2 патокі на кожны, астатнія па адным на 4 патоках.

## Што даюць 10 сідаў

<figure class="fig">
<svg viewBox="0 0 680 244" role="img" aria-label="Дакладнасць на dev 10 прагонаў данавучання DistilBERT на RTE, якія адрозніваюцца толькі сідам, пасля кожнай з 3 эпох. пасля эпохі 1: 47,3, 47,3, 52,0, 52,7, 53,1, 53,4, 53,4, 55,2, 56,0, 58,1; пасля эпохі 2: 56,0, 57,4, 57,4, 58,5, 58,8, 58,8, 59,6, 59,9, 59,9, 61,0; пасля эпохі 3: 56,7, 57,4, 57,4, 59,2, 59,9, 60,6, 60,6, 60,6, 61,0, 63,2. Калі заўсёды адказваць класам большасці, выходзіць 52,7%. У артыкуле DistilBERT стаіць 62,9% як медыяна 5 прагонаў.">
  <line x1="130.0" y1="26" x2="130.0" y2="200" class="f-plain"/>
  <text x="130.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">45</text>
  <line x1="262.5" y1="26" x2="262.5" y2="200" class="f-plain"/>
  <text x="262.5" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="395.0" y1="26" x2="395.0" y2="200" class="f-plain"/>
  <text x="395.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">55</text>
  <line x1="527.5" y1="26" x2="527.5" y2="200" class="f-plain"/>
  <text x="527.5" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="660.0" y1="26" x2="660.0" y2="200" class="f-plain"/>
  <text x="660.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">65</text>
  <text x="395" y="234" text-anchor="middle" class="f-label f-muted" style="font-size:11px">дакладнасць на dev, %</text>
  <line x1="334.3" y1="24" x2="334.3" y2="200" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="334.3" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">клас большасці 52,7</text>
  <line x1="604.3" y1="24" x2="604.3" y2="200" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="608.3" y="18.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">артыкул, медыяна 5: 62,9</text>
  <text x="118" y="50" text-anchor="end" class="f-label f-muted" style="font-size:12px">пасля эпохі 1</text>
  <circle cx="315.2" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="343.9" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="353.4" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="353.4" cy="44.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="190.7" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="334.3" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="190.7" cy="44.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="401.1" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="420.4" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="477.7" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <text x="184.7" y="68.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">47,3</text>
  <text x="483.7" y="68.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">58,1</text>
  <text x="118" y="112" text-anchor="end" class="f-label f-muted" style="font-size:12px">пасля эпохі 2</text>
  <circle cx="458.6" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="420.4" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="487.2" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="525.6" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="516.1" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="554.3" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="458.6" cy="106.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="496.8" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="525.6" cy="106.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="496.8" cy="106.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <text x="414.4" y="130.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">56,0</text>
  <text x="560.3" y="130.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">61,0</text>
  <text x="118" y="174" text-anchor="end" class="f-label f-muted" style="font-size:12px">пасля эпохі 3</text>
  <circle cx="458.6" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="439.5" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="554.3" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="611.8" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="525.6" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="506.6" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="458.6" cy="168.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="544.7" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="544.7" cy="168.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="544.7" cy="176.0" r="4" class="f-accent" style="stroke:none;"/>
  <text x="433.5" y="192.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">56,7</text>
  <text x="617.8" y="192.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">63,2</text>
</svg>
<figcaption>10 сідаў, налады run_glue.py з transformers 2.2.2 па змаўчанні, 277 пар у dev. Кожная кропка гэта 1 прагон. Пасля першай эпохі 2 прагоны адказваюць &quot;not entailment&quot; на кожную пару.</figcaption>
</figure>

Пасля 3 эпох дакладнасць на dev ляжыць ад 56,7% да 63,2%. Гэта 157 правільных пар супраць 175. Медыяна 60,3%, стандартнае адхіленне 2,0 пункта. Толькі 5 з 10 прагонаў трапілі ў межы 1 пункта ад медыяны. Калі б мой звычайны адзіночны прагон лёг як сід 2, я б запісаў 56,7% і паверыў, што DistilBERT на RTE дае 57.

Калі ўзяць лепшы з 10 па dev і запісаць яго лік, выйдзе 63,2%, на 2,9 пункта вышэй за медыяну. Аўтары BERT публікавалі вынік на тэставай выбарцы з сервера GLUE, так што ў іх такі выбар сумленны. Я гляджу толькі на dev. У мяне прыкметная частка гэтых 2,9 пункта ўзялася б з самога выбару.

Я чакаў, што хоць адзін прагон выродзіцца ў 1 клас. У артыкуле пра STILTs з лістапада 2018 года вялікі BERT перазапускалі па 20 разоў на кожнай маленькай задачы GLUE, RTE у тым ліку. Некаторыя з гэтых прагонаў сканчаліся амаль на ўзроўні выпадковага ўгадвання. Пасля 3 эпох у мяне такога не здарылася. Доля адказаў "entailment" ва ўсіх 10 прагонах засталася паміж 54,5% і 65,7%. Але на апошніх 100 кроках першай эпохі сярэдні лос на навучанні ў кожнага прагону быў яшчэ каля 0,69. Гэта ln 2, лос мадэлі, якая адказвае 50 на 50. 2 прагоны з 10 у гэты момант адказалі "not entailment" на ўсе 277 пар і атрымалі 47,3%. Сід 2 пайшоў у адваротны бок, "entailment" на 276 з 277. Каб я спыніўся тады, я б убачыў нешта падобнае на выраджэнне з артыкула.

## Адзін лік, розныя мадэлі

Сіды 1 і 7 скончылі абодва на 57,4%, па 159 правільных пар. Я думаў, што 2 прагоны з аднолькавай дакладнасцю гэта прыкладна адна і тая ж мадэль. Яны разыходзяцца на 72 парах з 277. Сіды 8, 9 і 10 усе атрымалі 60,65%. Любыя 2 з іх разыходзяцца на 58 або 62 парах.

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="277 пар dev у выглядзе сеткі. Пар, дзе ўсе 10 прагонаў адказваюць правільна: 83. Дзе ўсе 10 памыляюцца: 35. Залежаць ад сіда: 159. Сіды 1 і 7 абодва даюць 57,4%, пары, дзе іх адказы разыходзяцца, пазначаныя кропкай, іх 72.">
  <rect x="74" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="93" y="14" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="112" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="120" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="131" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="169" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="226" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="245" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="264" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="283" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="321" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="329" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="340" y="14" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="359" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="14" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="397" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="435" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="473" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="481" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="492" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="500" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="511" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="549" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="557" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="568" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="587" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="74" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="93" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="112" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="131" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="188" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="245" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="264" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="283" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="340" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="359" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="424" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="435" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="454" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="473" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="492" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="511" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="549" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="587" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="74" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="93" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="112" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="131" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="150" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="188" y="52" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="207" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="215" cy="60" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="226" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="245" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="264" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="283" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="52" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="321" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="329" cy="60" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="340" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="359" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="397" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="435" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="454" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="473" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="481" cy="60" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="492" y="52" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="511" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="549" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="587" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="595" cy="60" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="74" y="71" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="93" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="120" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="131" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="169" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="177" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="188" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="207" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="245" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="264" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="272" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="283" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="71" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="340" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="348" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="359" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="378" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="397" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="435" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="473" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="492" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="500" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="511" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="549" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="587" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="74" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="93" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="131" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="207" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="234" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="245" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="253" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="264" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="283" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="302" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="340" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="359" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="397" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="416" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="424" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="435" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="462" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="473" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="492" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="511" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="519" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="530" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="549" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="557" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="568" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="587" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="74" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="93" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="112" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="131" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="158" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="169" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="234" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="245" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="264" y="109" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="283" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="321" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="340" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="348" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="359" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="416" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="424" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="435" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="473" y="109" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="492" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="511" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="530" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="549" y="109" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="568" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="576" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="587" y="109" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="74" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="93" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="112" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="131" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="150" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="226" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="245" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="264" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="272" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="283" y="128" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="302" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="321" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="340" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="359" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="367" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="378" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="435" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="443" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="454" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="462" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="473" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="481" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="492" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="511" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="549" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="576" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="587" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="74" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="82" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="93" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="131" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="150" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="188" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="226" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="245" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="264" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="283" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="340" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="359" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="378" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="147" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="416" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="435" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="454" y="147" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="473" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="492" y="147" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="511" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="549" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="147" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="587" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="595" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="74" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="93" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="120" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="131" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="158" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="169" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="177" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="188" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="207" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="245" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="253" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="264" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="272" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="283" y="166" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="302" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="321" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="340" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="348" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="359" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="367" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="378" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="416" y="166" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="435" y="166" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="454" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="473" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="492" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="500" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="511" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="530" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="549" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="568" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="576" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="587" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="74" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="93" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="185" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="131" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="150" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="207" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="215" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="226" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="245" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="264" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="283" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="302" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="340" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="359" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="367" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="378" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="397" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="435" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="185" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="473" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="492" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="500" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="511" y="185" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="530" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="74" y="212" width="12" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="92" y="222" class="f-label f-muted" style="font-size:11px">правільна ва ўсіх 10: 83</text>
  <rect x="344" y="212" width="12" height="12" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="362" y="222" class="f-label f-muted" style="font-size:11px">залежыць ад сіда: 159</text>
  <rect x="74" y="232" width="12" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="92" y="242" class="f-label f-muted" style="font-size:11px">памылка ва ўсіх 10: 35</text>
  <circle cx="350" cy="238" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <text x="362" y="242" class="f-label f-muted" style="font-size:11px">сіды 1 і 7 разыходзяцца: 72</text>
</svg>
<figcaption>Кожны квадрат гэта 1 пара з dev RTE, у парадку файла. Кропка пазначае пару, на якой сід 1 і сід 7 адказваюць па-рознаму, хоць у абодвух прагонаў 57,4%.</figcaption>
</figure>

На 83 пары ўсе 10 прагонаў адказваюць правільна, на 35 усе 10 памыляюцца. Астатнія 159 пар, больш за палову dev, залежаць ад сіда.

## Параўнаць 2 налады па 1 прагоне на кожную

Пасля прагону я звычайна пытаюся адно: "ці лепшая мая змена?". Каб змена нічога не каштавала, я параўнаў спыненне пасля 2-й эпохі з поўнымі 3 эпохамі. Па медыянах трэцяя эпоха дадае 1,4 пункта. Унутры аднаго сіда яна дапамагла ў 7 прагонах, пашкодзіла ў 1 і нічога не змяніла ў 2.

Але параўноўваць свой прагон з чужым значыць параўноўваць розныя сіды. Тое самае са старым прагонам супраць новага пасля праўкі кода: зменены код бярэ выпадковыя лікі па-іншаму нават з сідам 42. Сярод 90 пар розных сідаў прагон з 3 эпохамі наперадзе ў 55, ззаду ў 30 і нароўні ў 5. Атрымліваецца, 1 прагон супраць 1 прагону паказвае няправільны кірунак 1 раз з 3 пры розніцы медыян у 1,4 пункта. Я прымаў рашэнні і пры меншай розніцы.

Яшчэ я праверыў, ці хапае аднаго сіда, каб паўтарыць прагон. Сід 6 я прагнаў другі раз з тымі ж наладамі. Усе адказы пасля кожнай эпохі супалі, сярэдні лос таксама. Потым я яшчэ раз прагнаў сід 1 на 4 патоках, а не на 2, як у першы раз. Галава класіфікатара стартавала з тых жа вагаў, лос пасля 1-й эпохі супаў да чацвёртага знака, але 1 адказ на dev ужо адрозніваўся. Пасля 3 эпох гэты прагон атрымаў 59,9% замест 57,4% і адказаў інакш на 27 пар. Першы прагон сіда 1 да таго ж ішоў побач з суседнім прагонам. Якое з 2 адрозненняў спрацавала, я не раздзяляў. На маёй машыне сід паўтарае прагон толькі пры тых жа ўмовах. Іншую машыну я не спрабаваў.

Ёсць 1 крыніца шуму, якую новыя сіды не прыбіраюць. На 277 парах 1 пара гэта 0,36 пункта. Бінаміяльная стандартная памылка пры 60% каля 2,9 пункта, больш за стандартнае адхіленне паміж маімі сідамі. Нават медыяна многіх прагонаў на іншай выбарцы з 277 пар магла б зрушыцца на некалькі пунктаў.

## Чаго я не правяраў

Толькі 1 задача і 1 набор гіперпараметраў. У табліцы DistilBERT для RTE стаіць 62,9 як медыяна 5 прагонаў. Любыя 5 з маіх 10 прагонаў даюць медыяну ад 57,4 да 60,65. Хуткасць навучання і памер батча для данавучання ў артыкуле не пазначаныя. Мой лік ніжэйшы. Чаму, я не ведаю. Сід галавы класіфікатара і парадак батчаў я не раздзяляў. Абодва мяняліся разам, як у `run_glue.py`. Усё ішло на CPU. GPU дадае зверху ўласны недэтэрмінізм. І 10 прагонаў усё яшчэ маленькая выбарка для рэдкага хваста накшталт поўнага выраджэння.

Пакуль я змяніў 1 звычку. Калі лік пасля данавучання ідзе ў рашэнне, за ім стаяць не менш за 5 сідаў. Побач з медыянай я пішу найменшае і найбольшае значэнне.
