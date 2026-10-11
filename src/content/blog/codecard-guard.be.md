---
title: "codecard адмаўляецца маляваць сніпет, які выдае кодавую базу. Усе 569 радкоў пакета Kotlin, якія я яму даў, ён прапусціў"
description: "codecard адмаўляецца маляваць картку, калі сніпет выдае кодавую базу. Я прагнаў яго гард па 9 публічных рэпазіторыях і 31 форме ўцечкі. Ён адмовіў 2,2% выпадковых вокнаў публічнага кода, часткова праз сцяжок рэгістра, які ператварае маршруты /users/ у шляхі зборкі. З 569 радкоў пакета Kotlin ён не злавіў ніводнага, бо правілу патрэбна кропка з коскай. Побач з gitleaks 8.30.1 ён злавіў 6 з 13 сакрэтаў і 10 з 18 формаў, якія выдаюць кодавую базу."
date: 2026-10-01
lang: be
translationKey: codecard-guard
tags: ["code-quality", "text"]
---
У жніўні я адкрыў [codecard](https://github.com/dimhold/codecard). Ён малюе сніпет кода або лога як картку для стужкі. Перш чым маляваць, ён чытае тэкст і адмаўляецца, калі тэкст выдае кодавую базу. Гэта радок пакета, імпарт вашага ўласнага кода, шлях зборкі з імем карыстальніка, унутраны хост або нешта падобнае на ўліковыя даныя. Адмова ў яго жорсткая: код вяртання 2 і ніякага файла. Я зрабіў так таму, што папярэджанне ў гадзіну ночы пракруцяць міма, а карцінка застанецца ў чужой стужцы.

У гарда 11 правілаў і 171 тэст і ўсе яны праходзяць. Але кожны выпадак у гэтых тэстах напісаны для гэтых тэстаў. Прыклад у README гэта файл на Java, які я прыдумаў так, каб у ім было роўна 5 уцечак. Гард ні разу не бачыў кода, які пісаў не я, таму я запусціў яго на чужым кодзе.

Я ўзяў codecard з GitHub на апошнім каміце, `f10a09e`, на Python 3.12. Побач паклаў 9 публічных рэпазіторыяў на іх апошнім каміце да 1 кастрычніка. Гэта 8 моў ад Java да Rust, сярод іх `spring-petclinic` і `vite`. З кожнага рэпазіторыя я ўзяў да 300 файлаў. З кожнага файла ўзяў 2 вокны па 15 радкоў: пачатак файла і адно выпадковае акно з астатняга. Другое акно прыкладна тое, што я капіюю, калі хачу паказаць функцыю.

## Як часта ён адмаўляе публічнаму коду

Усё ў гэтым корпусе ўжо апублікавана, таму кожная адмова тут гэта адмова коду, які не сакрэт. На выпадковых вокнах з сярэдзіны файла ён адмовіў у 17 выпадках з 790, гэта 2,2%. На пачатку файла ён адмовіў у 138 з 1200. 132 з іх гэта файлы C# у MediatR, дзе namespace стаіць у першых 15 радках. Паводле яго ж азначэння гард тут мае рацыю: namespace сапраўды называе кодавую базу. Гэтая база публічная і для такога выпадку ёсць `--guard off`.

Частка з 17 гэта шум. У express ён адмовіў тэсту з URL `/users/0-2`. Сярод іншых папак правіла шляхоў шукае `/Users/` на macOS і `/home/` на Linux. Але codecard кампілюе ўсе правілы па змаўчанні з `re.I`, таму маршрут у ніжнім рэгістры таксама падыходзіць. Па ўсіх файлах корпуса правіла шляхоў спрацоўвае на 107 радках і 23 з іх толькі праз гэты сцяжок. У okhttp ён адмовіў імпартам `org.robolectric` і `org.bouncycastle`. У правіла прыватных імпартаў ёсць белы спіс з 26 імёнаў груп, а любое іншае імя яно лічыць вашым уласным кодам.

2,2% гэта цана, якую я прыняў у жніўні, не ведаючы лічбы. Цяпер я яе ведаю. Адмова каштуе мне аднаго `--guard off`. Са сцяжком рэгістра іншая справа, яго трэба правіць.

## Радок, які ён абяцаў лавіць

Потым я прагнаў гард па радку аб'явы кожнага файла, без выбаркі і па адным радку. Java дала 106 злоўленых са 106, C# дала 133 са 133. Kotlin даў 0 з 569.

<figure class="fig">
<svg viewBox="0 0 640 214" role="img" aria-label="Правіла package-declaration у codecard заканчваецца кропкай з коскай. Пад ім два радкі: радок Java package com.acmebank.ledger.settlement з кропкай з коскай, злоўлены ў 106 са 106 файлаў Java, і той жа радок Kotlin без кропкі з коскай у канцы, злоўлены ў 0 з 569 файлаў Kotlin.">
  <text x="24" y="34" class="f-label f-muted">правіла:</text>
  <text x="110" y="34" textLength="218.4" lengthAdjust="spacingAndGlyphs" class="f-mono f-muted">^[ \t]*package\s+[\w.]+\s*</text>
  <text x="328.4" y="34" textLength="8.4" lengthAdjust="spacingAndGlyphs" class="f-mono f-accent">;</text>
  <text x="24" y="92" class="f-label f-ink">Java</text>
  <text x="110" y="92" textLength="319.2" lengthAdjust="spacingAndGlyphs" class="f-mono f-ink">package com.acmebank.ledger.settlement</text>
  <rect x="428.2" y="74" width="10.4" height="24" style="fill:var(--accent);fill-opacity:0.18;stroke:var(--accent);stroke-width:1"/>
  <text x="429.2" y="92" textLength="8.4" lengthAdjust="spacingAndGlyphs" class="f-mono f-accent">;</text>
  <text x="110" y="118" class="f-label f-muted">злоўлена ў 106 са 106 файлаў</text>
  <text x="24" y="170" class="f-label f-ink">Kotlin</text>
  <text x="110" y="170" textLength="319.2" lengthAdjust="spacingAndGlyphs" class="f-mono f-ink">package com.acmebank.ledger.settlement</text>
  <rect x="428.2" y="152" width="10.4" height="24" style="fill:none;stroke:var(--accent);stroke-width:1;stroke-dasharray:3 2"/>
  <text x="447.6" y="168" class="f-label f-accent">гэтага чакае правіла</text>
  <text x="110" y="196" class="f-label f-accent">злоўлена ў 0 з 569 файлаў</text>
</svg>
<figcaption>Радок пакета кожнага файла корпуса, правераны асобна. Правіла для namespace у C# дапускае радок без кропкі з коскай і злавіла 133 са 133.</figcaption>
</figure>

Правілу патрэбна кропка з коскай у канцы радка пакета, а Kotlin яе там не ставіць. Калі правіла спрацоўвае, яно друкуе прычыну "a Java or Kotlin package name is your company and product, spelled out", гэта значыць імя пакета Java або Kotlin гэта назва вашай кампаніі і прадукту, прапісаная поўнасцю. Гэтую фразу і рэгулярку я пісаў, гледзячы на файл Java. Тэсты да іх таксама на Java.

Гэта горш, чым адзін прапушчаны радок. Я ўзяў прыклад з уцечкамі з README і перапісаў яго на Kotlin. Гард усё роўна адмаўляе, з 4 знаходкамі: імпарт, ключ, хост і шлях. Пакета ў спісе няма. Калі я выпраўляю 4 рэчы, пра якія ён сказаў, картка малюецца з `package com.acmebank.ledger.settlement` у першым радку і кодам вяртання 0. Той жа файл з кропкай з коскай атрымлівае код 2. У гадзіну ночы спіс выглядае поўным, так што я б выправіў гэтыя 4 і апублікаваў.

## Побач са сканерам сакрэтаў

Потым я захацеў даведацца, што гард прапускае. Сапраўдныя ўцечкі я палічыць не магу, таму склаў спіс з 31 формы, якія трапляюць у картку пры ўстаўцы з рэдактара або з лога. Я прагнаў іх праз codecard і праз gitleaks 8.30.1, сканер, які я б паставіў на рэпазіторый. Сакрэты ў спісе гэта выпадковыя радкі патрэбнага фармату, яны генеруюцца пры запуску.

<figure class="fig">
<svg viewBox="0 0 640 617" role="img" aria-label="Табліца з 31 формы ўцечкі ў 2 групах і 2 калонках, codecard і gitleaks 8.30.1. Формы, якія выдаюць кодавую базу: codecard злавіў 10 з 18, gitleaks 0. Сакрэты: codecard злавіў 6 з 13, gitleaks 12. 8 формаў праходзяць абодва, усе з першай групы.">
  <text x="420" y="22" text-anchor="middle" class="f-label f-ink">codecard</text>
  <text x="540" y="22" text-anchor="middle" class="f-label f-ink">gitleaks</text>
  <text x="24" y="46" class="f-label f-muted">выдае кодавую базу (18)</text>
  <text x="420" y="46" text-anchor="middle" class="f-label f-muted">10</text>
  <text x="540" y="46" text-anchor="middle" class="f-label f-muted">0</text>
  <line x1="24" y1="51" x2="616" y2="51" class="f-line"/>
  <text x="330" y="69" text-anchor="end" class="f-mono f-ink" style="font-size:12px">пакет Java</text>
  <circle cx="420" cy="65" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="65" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="86" text-anchor="end" class="f-mono f-accent" style="font-size:12px">пакет Kotlin</text>
  <circle cx="420" cy="82" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="82" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="103" text-anchor="end" class="f-mono f-ink" style="font-size:12px">namespace C#</text>
  <circle cx="420" cy="99" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="99" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="120" text-anchor="end" class="f-mono f-ink" style="font-size:12px">імпарт Java</text>
  <circle cx="420" cy="116" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="116" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="137" text-anchor="end" class="f-mono f-ink" style="font-size:12px">імпарт Kotlin</text>
  <circle cx="420" cy="133" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="133" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="154" text-anchor="end" class="f-mono f-accent" style="font-size:12px">імпарт Python</text>
  <circle cx="420" cy="150" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="150" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="171" text-anchor="end" class="f-mono f-accent" style="font-size:12px">імпарт Go</text>
  <circle cx="420" cy="167" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="167" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="188" text-anchor="end" class="f-mono f-accent" style="font-size:12px">імпарт TypeScript</text>
  <circle cx="420" cy="184" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="184" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="205" text-anchor="end" class="f-mono f-ink" style="font-size:12px">C:\Users\ у трасе .NET</text>
  <circle cx="420" cy="201" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="201" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="222" text-anchor="end" class="f-mono f-ink" style="font-size:12px">шлях /home/ у памылцы</text>
  <circle cx="420" cy="218" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="218" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="239" text-anchor="end" class="f-mono f-ink" style="font-size:12px">шлях /Users/ у стэку</text>
  <circle cx="420" cy="235" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="235" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="256" text-anchor="end" class="f-mono f-ink" style="font-size:12px">шлях у трасе Python</text>
  <circle cx="420" cy="252" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="252" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="273" text-anchor="end" class="f-mono f-accent" style="font-size:12px">шлях з ~</text>
  <circle cx="420" cy="269" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="269" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="290" text-anchor="end" class="f-mono f-ink" style="font-size:12px">URL https://*.internal</text>
  <circle cx="420" cy="286" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="286" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="307" text-anchor="end" class="f-mono f-accent" style="font-size:12px">*.internal:5432 без схемы</text>
  <circle cx="420" cy="303" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="303" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="324" text-anchor="end" class="f-mono f-accent" style="font-size:12px">*.svc.cluster.local</text>
  <circle cx="420" cy="320" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="320" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="341" text-anchor="end" class="f-mono f-accent" style="font-size:12px">хост на дамене кампаніі</text>
  <circle cx="420" cy="337" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="337" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="358" text-anchor="end" class="f-mono f-ink" style="font-size:12px">адрас 10.x</text>
  <circle cx="420" cy="354" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="354" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="24" y="376" class="f-label f-muted">сакрэты (13)</text>
  <text x="420" y="376" text-anchor="middle" class="f-label f-muted">6</text>
  <text x="540" y="376" text-anchor="middle" class="f-label f-muted">12</text>
  <line x1="24" y1="381" x2="616" y2="381" class="f-line"/>
  <text x="330" y="399" text-anchor="end" class="f-mono f-ink" style="font-size:12px">API_KEY = &quot;...&quot;</text>
  <circle cx="420" cy="395" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="395" r="5" style="fill:var(--accent)"/>
  <text x="330" y="416" text-anchor="end" class="f-mono f-ink" style="font-size:12px">радок .env без двукоссяў</text>
  <circle cx="420" cy="412" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="412" r="5" style="fill:var(--accent)"/>
  <text x="330" y="433" text-anchor="end" class="f-mono f-ink" style="font-size:12px">пароль у YAML без двукоссяў</text>
  <circle cx="420" cy="429" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="429" r="5" style="fill:var(--accent)"/>
  <text x="330" y="450" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Authorization: Bearer</text>
  <circle cx="420" cy="446" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="446" r="5" style="fill:var(--accent)"/>
  <text x="330" y="467" text-anchor="end" class="f-mono f-ink" style="font-size:12px">загаловак token у curl</text>
  <circle cx="420" cy="463" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="463" r="5" style="fill:var(--accent)"/>
  <text x="330" y="484" text-anchor="end" class="f-mono f-ink" style="font-size:12px">ключ AWS AKIA...</text>
  <circle cx="420" cy="480" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="480" r="5" style="fill:var(--accent)"/>
  <text x="330" y="501" text-anchor="end" class="f-mono f-ink" style="font-size:12px">сакрэтны ключ AWS</text>
  <circle cx="420" cy="497" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="497" r="5" style="fill:var(--accent)"/>
  <text x="330" y="518" text-anchor="end" class="f-mono f-ink" style="font-size:12px">блок прыватнага ключа</text>
  <circle cx="420" cy="514" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="514" r="5" style="fill:var(--accent)"/>
  <text x="330" y="535" text-anchor="end" class="f-mono f-ink" style="font-size:12px">JWT</text>
  <circle cx="420" cy="531" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="531" r="5" style="fill:var(--accent)"/>
  <text x="330" y="552" text-anchor="end" class="f-mono f-ink" style="font-size:12px">postgres://user:pass@</text>
  <circle cx="420" cy="548" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="548" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="569" text-anchor="end" class="f-mono f-ink" style="font-size:12px">JDBC ?password=</text>
  <circle cx="420" cy="565" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="565" r="5" style="fill:var(--accent)"/>
  <text x="330" y="586" text-anchor="end" class="f-mono f-ink" style="font-size:12px">вэбхук Slack</text>
  <circle cx="420" cy="582" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="582" r="5" style="fill:var(--accent)"/>
  <text x="330" y="603" text-anchor="end" class="f-mono f-ink" style="font-size:12px">api_key=&quot;sk-proj-...&quot;</text>
  <circle cx="420" cy="599" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="599" r="5" style="fill:var(--accent)"/>
</svg>
<figcaption>31 форма ўцечкі, па радку на кожную. Зафарбаваная кропка азначае, што інструмент радок злавіў, сіні подпіс азначае, што не злавіў ніводзін. Сакрэты гэта выпадковыя радкі патрэбнага фармату.</figcaption>
</figure>

Гэтыя 2 інструменты амаль не перасякаюцца. З 18 формаў, якія выдаюць кодавую базу, codecard злавіў 10, а gitleaks ніводнай. Гэта справядліва, бо gitleaks зроблены для сакрэтаў. З 13 сакрэтаў gitleaks злавіў 12, а codecard 6. Яго правіла для ўліковых даных бачыць значэнне толькі ў двукоссі пасля імя накшталт `api_key` або `password`. Радок з файла `.env` малюецца. Малююцца і пароль у YAML без двукоссяў і загаловак `Authorization: Bearer` у логу і URL вэбхука Slack. Вось гэта крыху крыўдна. Тэму `ember` я зрабіў для логаў з памылкамі, а ў логу токен Bearer якраз стаіць без двукоссяў.

Разам яны злавілі 23 з 31. Усе 8, якія не злавіў ніводзін, выдаюць кодавую базу. Сярод іх пакет Kotlin і ўнутраны хост без `https://` наперадзе. Найцяжэй з хостам на ўласным дамене кампаніі і як яго лавіць, не ведаючы кампаніі, я не ведаю. У README ужо напісана, што гард не ведае, як называецца ваша кампанія.

## Першы радок README

Усталёўка ў README пачынаецца з `pip install codecard`. Я запусціў яе ў чыстым virtualenv і pip не знайшоў ніводнага дыстрыбутыва. Імя на PyPI наогул не зарэгістравана. Выходзіць, README інструмента, які існуе дзеля абароны ад уцечак, прапануе ставіць імя, якое можа зарэгістраваць хто заўгодна. Так ёсць з сярэдзіны жніўня, а я гэтага не заўважыў.

## Чаго я не правяраў

31 форма гэта мой уласны спіс, таму ён кажа, якія формы праходзяць, а не як часта людзі іх устаўляюць. Корпус гэта 9 рэпазіторыяў і 1 выпадковае зерне. Іншы памер акна мог бы зрушыць 2,2%. trufflehog я не запускаў. І я яшчэ нічога не паправіў. Кропка з коскай, сцяжок рэгістра, сакрэты без двукоссяў і імя на PyPI так і застаюцца адкрытымі ў codecard на `f10a09e`.
