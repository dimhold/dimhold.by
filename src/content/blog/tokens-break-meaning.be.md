---
title: "З рэкамендаваным парогам BPE рэжа беларускія словы драбней, чым слоўнік, які беларускай не бачыў"
description: "Я навучыў адзін слоўнік BPE на англійскай, рускай і дробцы беларускай з Tatoeba. Беларускае слова каштуе ў 1,4 раза больш кавалкаў, чым рускае, а калі рускай узяць столькі ж, розніца знікае. З парогам 50 з README выходзіць горш, чым са слоўнікам без беларускай."
date: 2018-03-31
lang: be
translationKey: tokens-break-meaning
tags: ["machine-learning", "text", "open-data"]
---

Я даў токенізатару Moses адно беларускае слова з 3 рознымі апострафамі:

```
$ printf "сям'я сям’я сямʼя\n" | perl tokenizer.perl -q -l be
WARNING: No known abbreviations for language 'be', attempting fall-back to English version...
сям &apos; я сям ’ я сямʼя
```

Апостраф у нас частка напісання слова, амаль як літара. З машынапісным `'` і з друкарскім `’` атрымліваюцца 3 токены. З U+02BC слова застаецца цэлым, бо для Юнікода гэты знак і ёсць літара. У маёй выбарцы яго не набірае ніхто. Машынапісны трапіўся 45 разоў, друкарскі 47.

<figure class="fig">
<svg viewBox="0 0 680 178" role="img" aria-label="Слова сям'я, набранае з 3 апострафамі. U+0027: токены Moses сям &amp;apos; я (3), кавалкі ся м &amp;apos; я (4). U+2019: токены Moses сям ’ я (3), кавалкі ся м ’ я (4). U+02BC: токены Moses сямʼя (1), кавалкі ся м ʼ я (4).">
  <text x="14.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">увод</text>
  <text x="200.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">пасля Moses, -l be</text>
  <text x="440.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">пасля агульнага BPE</text>
  <text x="14.0" y="49.5" text-anchor="start" class="f-mono f-ink" style="font-size:13px">сям'я</text>
  <text x="76.0" y="49.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">U+0027</text>
  <rect x="200.0" y="32" width="37.4" height="26" class="f-box"/>
  <text x="218.7" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">сям</text>
  <rect x="242.4" y="32" width="60.8" height="26" class="f-box"/>
  <text x="272.8" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">&amp;apos;</text>
  <rect x="308.2" y="32" width="21.8" height="26" class="f-box"/>
  <text x="319.1" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
  <rect x="440.0" y="32" width="29.6" height="26" class="f-box"/>
  <text x="454.8" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ся</text>
  <rect x="474.6" y="32" width="21.8" height="26" class="f-box"/>
  <text x="485.5" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">м</text>
  <rect x="501.4" y="32" width="60.8" height="26" class="f-box"/>
  <text x="531.8" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">&amp;apos;</text>
  <rect x="567.2" y="32" width="21.8" height="26" class="f-box"/>
  <text x="578.1" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
  <line x1="14" y1="71" x2="666" y2="71" class="f-plain"/>
  <text x="14.0" y="101.5" text-anchor="start" class="f-mono f-ink" style="font-size:13px">сям’я</text>
  <text x="76.0" y="101.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">U+2019</text>
  <rect x="200.0" y="84" width="37.4" height="26" class="f-box"/>
  <text x="218.7" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">сям</text>
  <rect x="242.4" y="84" width="21.8" height="26" class="f-box"/>
  <text x="253.3" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">’</text>
  <rect x="269.2" y="84" width="21.8" height="26" class="f-box"/>
  <text x="280.1" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
  <rect x="440.0" y="84" width="29.6" height="26" class="f-box"/>
  <text x="454.8" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ся</text>
  <rect x="474.6" y="84" width="21.8" height="26" class="f-box"/>
  <text x="485.5" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">м</text>
  <rect x="501.4" y="84" width="21.8" height="26" class="f-box"/>
  <text x="512.3" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">’</text>
  <rect x="528.2" y="84" width="21.8" height="26" class="f-box"/>
  <text x="539.1" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
  <line x1="14" y1="123" x2="666" y2="123" class="f-plain"/>
  <text x="14.0" y="153.5" text-anchor="start" class="f-mono f-ink" style="font-size:13px">сямʼя</text>
  <text x="76.0" y="153.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">U+02BC</text>
  <rect x="200.0" y="136" width="53.0" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="226.5" y="153.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">сямʼя</text>
  <rect x="440.0" y="136" width="29.6" height="26" class="f-box"/>
  <text x="454.8" y="153.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ся</text>
  <rect x="474.6" y="136" width="21.8" height="26" class="f-box"/>
  <text x="485.5" y="153.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">м</text>
  <rect x="501.4" y="136" width="21.8" height="26" class="f-box"/>
  <text x="512.3" y="153.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ʼ</text>
  <rect x="528.2" y="136" width="21.8" height="26" class="f-box"/>
  <text x="539.1" y="153.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
</svg>
<figcaption>Адно слова, 3 апострафы. Праз токенізатар цэлым праходзіць толькі U+02BC. Агульны BPE яго ўсё адно рэжа.</figcaption>
</figure>

Я шмат разоў прапускаў тэкст праз токенізатар і BPE адной камандай, а ў вынік зазіраў з англійскага боку. Там усё выглядае прыстойна. Што робіцца з малой мовай, калі ў яе агульны слоўнік з 2 вялікімі, я не правяраў ні разу. А раяць звычайна якраз агульны.

BPE ў машынны пераклад прынеслі Сенрых з сааўтарамі (2016). Джонсан з калегамі з Google (2017) навучаюць адзін слоўнік wordpiece адразу для многіх моў. Дзяленне паводле частаты ўжо параўноўвалі з дзяленнем паводле марфалогіі: Атаман з сааўтарамі на турэцкай, Хук з сааўтарамі на нямецкай, абедзве працы 2017 года. Мне хацелася ўбачыць, што выйдзе для беларускай.

## Што я ўзяў

Tatoeba, толькі сказы, якія апошні раз правілі да 31 сакавіка 2018 года. Беларускіх такіх 3671. З іх 400, у якіх ёсць і рускі і англійскі пераклад, сталі тэстам. Астатнія 3270 пайшлі ў навучанне (яшчэ адзін паўтараў тэставы) разам з 60 000 рускіх і 60 000 англійскіх. На беларускую прыпадае 2,4% токенаў. Увесь тэкст малымі літарамі.

Інструменты: `tokenizer.perl` з Moses і `subword-nmt` на каміце ад 28 сакавіка. Ва ўсіх слоўніках, акрамя чыста беларускага, 10 000 зліццяў. Я лічу кавалкі на слова, на адных і тых жа 400 сказах на 3 мовах.

## Тыя ж сказы, у 1,4 раза больш кавалкаў

З агульным слоўнікам англійскае слова каштуе 1,33 кавалка, рускае 1,51, беларускае 2,12. Да запуску я запісаў, што беларуская будзе горшая за рускую прынамсі ў 1,3 раза. Выйшла 1,40, бутстрэп па сказах дае ад 1,37 да 1,43.

Рускае `информации` гэта адзін кавалак. Беларускае `інфармацыі` гэта `ін|фа|рма|цыі`.

Прасцей за ўсё сказаць, што такая ўжо мова. Таму я абрэзаў рускую да тых жа 3270 радкоў і навучыў слоўнік нанова. У рускай стала 1,93, у беларускай 1,88. Калі даных пароўну, суадносіны 0,97, так што на гэтым корпусе ўся справа ў аб'ёме.

Потым я вярнуў рускую цалкам і паўтарыў беларускія радкі 18 разоў, спосаб грубы. У беларускай стала 1,62, у рускай 1,64, бо тыя ж 10 000 зліццяў цяпер даводзіцца дзяліць на ўсіх. Англійская пасунулася з 1,33 да 1,43. Чыста беларускі слоўнік на 4000 зліццяў дае 1,70.

<figure class="fig">
<svg viewBox="0 0 680 246" role="img" aria-label="Кавалкаў на беларускае слова на 400 тэставых сказах з 6 слоўнікамі: агульны, парог 50 3,28; зусім без беларускай 2,96; агульны 2,12; руская да 3270 радкоў 1,88; толькі беларуская, 4000 1,70; беларуская x18 1,62. Вертыкальная лінія: руская з агульным слоўнікам, 1,51.">
  <text x="210.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">кавалкаў на беларускае слова</text>
  <text x="200.0" y="43.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">агульны, парог 50</text>
  <rect x="210" y="28" width="384.0" height="22" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="602.0" y="43.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">3,28</text>
  <text x="200.0" y="75.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">зусім без беларускай</text>
  <rect x="210" y="60" width="346.3" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="564.3" y="75.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">2,96</text>
  <text x="200.0" y="107.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">агульны</text>
  <rect x="210" y="92" width="247.8" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="465.8" y="107.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">2,12</text>
  <text x="200.0" y="139.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">руская да 3270 радкоў</text>
  <rect x="210" y="124" width="220.0" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="438.0" y="139.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,88</text>
  <text x="200.0" y="171.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">толькі беларуская, 4000</text>
  <rect x="210" y="156" width="199.5" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="417.5" y="171.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,70</text>
  <text x="200.0" y="203.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">беларуская x18</text>
  <rect x="210" y="188" width="189.7" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="407.7" y="203.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,62</text>
  <line x1="387.2" y1="24" x2="387.2" y2="220" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
  <text x="387.2" y="234.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">руская, агульны 1,51</text>
</svg>
<figcaption>Адны і тыя ж 2323 беларускія словы з рознымі слоўнікамі. Колерам вылучаны рэцэпт з README.</figcaption>
</figure>

## Парог

README у `subword-nmt` папярэджвае: з агульным слоўнікам слова можа парэзацца на кавалкі, якія трапляліся толькі ў іншай мове. Там раяць пабудаваць слоўнік для кожнай мовы асобна і прымяніць BPE яшчэ раз з `--vocabulary-threshold 50`. Тут я нічога не чакаў, проста дадаў прагон, калі ўжо рэцэпт афіцыйны.

Беларуская падскочыла з 2,12 да 3,28 кавалка на слова. Для параўнання я ўзяў слоўнік, навучаны толькі на англійскай і рускай, які не бачыў ніводнага беларускага радка. У яго 2,96. Выходзіць, па рэцэпце ў 1,11 раза горш, чым зусім без беларускай (ад 1,09 да 1,13). 53% кавалкаў гэта адзіночныя літары, выразаныя з даўжэйшых слоў. `інфармацыі` цяпер выглядае так: `і|н|ф|а|р|ма|ц|ы|і`.

Тлумачыцца гэта арыфметыкай. З агульнымі зліццямі ў беларускім навучальным тэксце 1774 розныя кавалкі, з іх 50 разоў і часцей сустракаюцца толькі 186. Астатнія зноў разбіраюцца на часткі. З парогам 20 атрымліваецца 2,60, з парогам 5 выходзіць 2,24. Руская і англійская таксама губляюць, да 2,06 і 1,67, для такога парога і 60 000 сказаў мала. На корпус у 3270 радкоў парада не разлічаная, але ў README стаіць 50. Я б яго скапіраваў.

## Дзе ламаецца сэнс

Лік кавалкаў мала што гаворыць пра сэнс, таму я ўзяў Universal Dependencies 2.1, дзе ў кожнага слова ёсць пачатковая форма. Для назоўнікаў, дзеясловаў і прыметнікаў ад 5 літар я параўнаў форму ў тэксце з пачатковай. Агульны пачатак не карацейшы за 3 літары лічу асновай, астатняе канчаткам. Далей гляджу, ці трапіў хоць адзін разрэз на канец асновы. Рускіх і англійскіх пар нашмат больш, з іх узята выпадковая выбарка таго ж памеру.

Першая табліца выглядала нармальна, а вось спіс прыкладаў не. Пачатковая форма слова "банкаўскі" парэзалася з адзінокай `i` ў канцы. Гэта была лацінская i. У беларускім корпусе 69 пачатковых форм, дзе лацінская літара сядзіць усярэдзіне кірылічнага слова, у Tatoeba знайшлося 28 такіх слоў. `краіну` з лацінскай i робіцца `кра|i|ну` замест `краі|ну`. Я выкінуў 85 пар з лацініцай, засталося 1597. Вынікі зрушыліся менш чым на працэнтны пункт.

Другую памылку я заўважыў, калі рыхтаваў малюнак, што ніжэй. У `справах` маё правіла брала за аснову цалкам `справа`, разам з галоснай з канчатка. Таму ў славянскіх назоўнікаў і прыметнікаў я цяпер спачатку адкідаю канчатак пачатковай формы. У дзеясловаў і ў англійскай застаўся агульны пачатак.

Сярод парэзаных беларускіх слоў у 25,8% ёсць разрэз на канцы асновы. Столькі ж разрэзаў у выпадковых месцах далі б 36,3%. У рускай 19,7% супраць 26,2%, у англійскай 14,4% супраць 25,7%. У 59,8% парэзаных беларускіх слоў на канцы асновы разрэзу няма, але ёсць на літару раней, хоць пры выпадковых разрэзах такіх было б 25,6%. Апошняя літара асновы адыходзіць да канчатка. Сярод самых частых апошніх кавалкаў `най`, `ных`, `кі` і `нага`, гэта канчатак з прыклеенай зычнай. З зычнай пачынаюцца 88% апошніх кавалкаў.

Па часцінах мовы карціна розная. У прыметнікаў разрэз на сваім месцы ў 6,3% слоў, у назоўнікаў у 15,5%. А ў дзеясловаў у 70,1%, прыкладна ўдвая часцей за выпадковыя разрэзы (33,7%). Праўда, аснова дзеяслова ў мяне гэта агульны пачатак з інфінітывам, яна часта канчаецца на галосную, далей ідзе `ў` або `ла`. Так што частка гэтых 70% выйшла з самога правіла.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="Сем форм слова справа, парэзаных на кавалкі. Агульны слоўнік: спра|ва, спра|вы, с|прав|е, с|прав|у, спра|вай, спра|ў, спра|вах. Беларускія радкі паўтораныя 18 разоў: справа, справы, справе, спра|ву, спра|вай, спра|ў, спра|ва|х. Аснова займае 5 літар, у формы спраў канчатка няма.">
  <text x="130.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">агульны</text>
  <text x="420.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">беларуская x18</text>
  <text x="14.0" y="47.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справа</text>
  <rect x="130.0" y="30" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="47.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="30" width="29.6" height="26" class="f-box"/>
  <text x="195.0" y="47.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ва</text>
  <path d="M191.0 65 L199.0 65 L195.0 58 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="30" width="60.8" height="26" class="f-box"/>
  <text x="450.4" y="47.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">справа</text>
  <path d="M462.0 65 L470.0 65 L466.0 58 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="89.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справы</text>
  <rect x="130.0" y="72" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="89.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="72" width="29.6" height="26" class="f-box"/>
  <text x="195.0" y="89.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">вы</text>
  <path d="M191.0 107 L199.0 107 L195.0 100 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="72" width="60.8" height="26" class="f-box"/>
  <text x="450.4" y="89.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">справы</text>
  <path d="M462.0 107 L470.0 107 L466.0 100 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="131.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справе</text>
  <rect x="130.0" y="114" width="21.8" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="140.9" y="131.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">с</text>
  <rect x="156.8" y="114" width="45.2" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="179.4" y="131.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">прав</text>
  <path d="M200.5 149 L208.5 149 L204.5 142 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="207.0" y="114" width="21.8" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="217.9" y="131.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">е</text>
  <rect x="420.0" y="114" width="60.8" height="26" class="f-box"/>
  <text x="450.4" y="131.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">справе</text>
  <path d="M462.0 149 L470.0 149 L466.0 142 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="173.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справу</text>
  <rect x="130.0" y="156" width="21.8" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="140.9" y="173.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">с</text>
  <rect x="156.8" y="156" width="45.2" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="179.4" y="173.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">прав</text>
  <path d="M200.5 191 L208.5 191 L204.5 184 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="207.0" y="156" width="21.8" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="217.9" y="173.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">у</text>
  <rect x="420.0" y="156" width="45.2" height="26" class="f-box"/>
  <text x="442.6" y="173.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="470.2" y="156" width="29.6" height="26" class="f-box"/>
  <text x="485.0" y="173.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ву</text>
  <path d="M481.0 191 L489.0 191 L485.0 184 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="215.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справай</text>
  <rect x="130.0" y="198" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="215.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="198" width="37.4" height="26" class="f-box"/>
  <text x="198.9" y="215.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">вай</text>
  <path d="M191.0 233 L199.0 233 L195.0 226 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="198" width="45.2" height="26" class="f-box"/>
  <text x="442.6" y="215.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="470.2" y="198" width="37.4" height="26" class="f-box"/>
  <text x="488.9" y="215.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">вай</text>
  <path d="M481.0 233 L489.0 233 L485.0 226 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="257.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">спраў</text>
  <rect x="130.0" y="240" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="257.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="240" width="21.8" height="26" class="f-box"/>
  <text x="191.1" y="257.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ў</text>
  <path d="M198.0 275 L206.0 275 L202.0 268 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="240" width="45.2" height="26" class="f-box"/>
  <text x="442.6" y="257.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="470.2" y="240" width="21.8" height="26" class="f-box"/>
  <text x="481.1" y="257.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ў</text>
  <path d="M488.0 275 L496.0 275 L492.0 268 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="299.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справах</text>
  <rect x="130.0" y="282" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="282" width="37.4" height="26" class="f-box"/>
  <text x="198.9" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">вах</text>
  <path d="M191.0 317 L199.0 317 L195.0 310 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="282" width="45.2" height="26" class="f-box"/>
  <text x="442.6" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="470.2" y="282" width="29.6" height="26" class="f-box"/>
  <text x="485.0" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ва</text>
  <path d="M481.0 317 L489.0 317 L485.0 310 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="504.8" y="282" width="21.8" height="26" class="f-box"/>
  <text x="515.7" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">х</text>
  <path d="M14 336 L22 336 L18 329 Z" style="fill:var(--ink);stroke:none"/>
  <text x="30.0" y="336.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">канец асновы</text>
</svg>
<figcaption>Формы слова справа. Трохкутнік стаіць на канцы асновы. З агульным слоўнікам там парэзаныя толькі 2 формы з 7. У гэтых 2 няма агульных кавалкаў з астатнімі.</figcaption>
</figure>

Гэта добра відаць на слове `справа`. З агульным слоўнікам 5 яго форм пачынаюцца са `спра`, а 2 робяцца `с|прав|е` і `с|прав|у`. Кавалак `прав` вырас з рускага тэксту. У гэтых 2 форм няма ніводнага агульнага кавалка з астатнімі 5.

Пасля паўтарэння 3 формы сталі цэлымі словамі і паміж сабой таксама не маюць агульных кавалкаў. Па ўсёй выбарцы агульны кавалак ад 3 літар ёсць у 60,7% беларускіх пар (форма і яе пачатковая форма), пасля паўтарэння ў 57,3%. Розніца 3,4 пункта, бутстрэп дае ад 0,9 да 6,0.

Я чакаў, што калі кавалкаў менш, то і самі яны лепшыя, але гэтага не відаць. Пасля паўтарэння разрэз на канцы асновы ёсць у 17,5% парэзаных слоў, выпадковыя разрэзы далі б 28,0%. Адставанне ад выпадковых тыя ж 10,5 пункта, што і раней.

## Чаго я не правяраў

Мадэль перакладу я не навучаў, таму колькі ўсё гэта каштуе ў BLEU, не ведаю. Аснова ў мяне ўсё адно прыблізная. Калі зычная на яе канцы чаргуецца, яна карацейшая, чым у лінгвіста. Сказы ў Tatoeba кароткія і простыя. Прынамсі 33 беларускія радкі ў навучанні напісаны старым правапісам, з мяккім знакам у `сьць`. Выпадковая выбарка навучальных сказаў была адна, тэставыя 400 увесь час адны і тыя ж.
