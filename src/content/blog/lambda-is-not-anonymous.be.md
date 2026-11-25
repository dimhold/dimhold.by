---
title: "Адна лямбда загружае на 126 класаў больш, чым адзін ананімны клас"
description: "Адны і тыя ж 100 функцый запісаныя ананімнымі класамі і лямбдамі на рэлізнай зборцы Java 8. Лямбды далі адзін файл класа замест 101, але загрузілі на 126 класаў больш, а першая каштавала 45,6 мс. Заадно пра тое, як слова final мяняе колькасць аб'ектаў і хто трымае знешні аб'ект у памяці."
date: 2014-04-06
lang: be
translationKey: lambda-is-not-anonymous
tags: ["compilers", "performance"]
---

Адны і тыя ж 100 маленькіх функцый я запісаў і скампіляваў двума спосабамі, кожны набор у адным метадзе. Пасля `javac` у каталогу з ананімнымі класамі ляжаў 101 файл, 43 623 байты. У каталогу з лямбдамі адзін файл на 11 977 байтаў. Потым я запусціў абодва варыянты з `-verbose:class` і палічыў радкі, якія пачынаюцца з `[Loaded`. Ананімныя класы: 477. Лямбды: 603.

Да прагону я запісаў сабе, што лямбды загружаюць больш класаў, пакуль іх мала, а да сотні чакаў, што яны нагоняць. Лямбду я заўсёды тлумачыў сабе як кароткі запіс ананімнага класа. Тлумачэнне зручнае і амаль ніколі не перашкаджае, таму глыбей я не зазіраў. 18 сакавіка Java 8 выйшла афіцыйна і адгаворак не засталося.

Будова лямбд не сакрэт, Браян Гец апісаў яе ў "Translation of Lambda Expressions" яшчэ ў 2012 годзе. Сяргей Куксенка летась паказваў на JVM Language Summit вымярэнні хуткасці, у тым ліку кошт першага звязвання. Мне хацелася сваіх лікаў на рэлізнай зборцы.

## На чым мераў

OpenJDK 1.8.0, зборка b132, VM 25.0-b70, `javac` адтуль жа са звычайнымі параметрамі, 2 ядры віртуальнай машыны. У тэставым класе N месцаў накшталт `f = x -> x + 1000; s = f.applyAsInt(s);`, канстанта ўсюды свая. У другім варыянце на тых самых месцах стаіць `new IntUnaryOperator() { ... }`. N роўнае 0, 1, 10 і 100.

## Што піша javac

Для ананімнага класа `javac` робіць файл `Sites$1.class`, а ў кодзе побач ставіць `new`. Для лямбды ён робіць прыватны статычны метад `lambda$go$0` з целам і адну інструкцыю `invokedynamic`, якая паказвае на `LambdaMetafactory.metafactory`. Класа, чый аб'ект мы атрымаем, у гэты момант яшчэ няма. JVM пабудуе яго, калі ўпершыню дойдзе да інструкцыі.

Калі запусціць праграму з `-Djdk.internal.lambda.dumpProxyClasses=dir`, гэты клас можна захаваць і адкрыць. У ім 259 байтаў: пусты канструктар і `applyAsInt`, які выклікае `Sites.lambda$go$0`.

<figure class="fig">
<svg viewBox="0 0 680 328" role="img" aria-label="Два шляхі. Ананімны клас: javac піша Sites.class з new Sites$1 і асобны файл Sites$1.class з целам, JVM загружае файл. Лямбда: javac піша адзін Sites.class з інструкцыяй invokedynamic і метадам lambda$go$0, у якім ляжыць цела. Пры першым выкананні LambdaMetafactory будуе ў памяці клас Sites$$Lambda$1 на 259 байтаў, а ён выклікае lambda$go$0.">
  <text x="20.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">піша javac</text>
  <text x="430.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">у памяці JVM</text>
  <text x="20.0" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">ананімны клас</text>
  <rect x="20" y="56" width="280" height="42" class="f-box"/>
  <text x="32.0" y="73.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Sites.class</text>
  <text x="32.0" y="90.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">new Sites$1</text>
  <rect x="20" y="108" width="280" height="42" class="f-box"/>
  <text x="32.0" y="125.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Sites$1.class</text>
  <text x="32.0" y="142.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">applyAsInt: x + 1000</text>
  <text x="290.0" y="125.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">цела тут</text>
  <rect x="430" y="108" width="230" height="42" class="f-box"/>
  <text x="442.0" y="134.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">Sites$1</text>
  <line x1="300" y1="129" x2="430" y2="129" style="stroke:var(--muted);stroke-width:1.2"/>
  <polygon points="430,129 423.6,126.3 423.6,131.7" style="fill:var(--muted);stroke:none"/>
  <text x="365.0" y="121.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">загрузка</text>
  <line x1="20" y1="166" x2="660" y2="166" class="f-plain"/>
  <text x="20.0" y="192.0" text-anchor="start" class="f-mono f-accent" style="font-size:13px">лямбда</text>
  <rect x="20" y="204" width="280" height="112" class="f-box" style="stroke:var(--accent)"/>
  <text x="32.0" y="223.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Sites.class</text>
  <text x="32.0" y="244.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">invokedynamic #0:applyAsInt</text>
  <line x1="32" y1="262" x2="288" y2="262" class="f-plain"/>
  <text x="32.0" y="284.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">lambda$go$0</text>
  <text x="290.0" y="284.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">цела тут</text>
  <text x="32.0" y="302.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">x + 1000</text>
  <rect x="430" y="224" width="230" height="32" class="f-box"/>
  <text x="442.0" y="244.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">LambdaMetafactory</text>
  <rect x="430" y="278" width="230" height="38" class="f-box" style="stroke:var(--accent)"/>
  <text x="442.0" y="301.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">Sites$$Lambda$1, 259 байтаў</text>
  <line x1="300" y1="240" x2="430" y2="240" style="stroke:var(--muted);stroke-width:1.2"/>
  <polygon points="430,240 423.6,237.3 423.6,242.7" style="fill:var(--muted);stroke:none"/>
  <text x="365.0" y="232.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">першы раз</text>
  <line x1="540" y1="256" x2="540" y2="278" style="stroke:var(--muted);stroke-width:1.2"/>
  <polygon points="540,278 542.7,271.6 537.3,271.6" style="fill:var(--muted);stroke:none"/>
  <line x1="430" y1="297" x2="300" y2="297" style="stroke:var(--accent);stroke-width:1.2"/>
  <polygon points="300,297 306.4,299.7 306.4,294.3" style="fill:var(--accent);stroke:none"/>
  <text x="365.0" y="289.0" text-anchor="middle" class="f-label f-accent" style="font-size:10px">выклік</text>
</svg>
<figcaption>Дзе ляжыць цела і калі з'яўляецца клас.</figcaption>
</figure>

Значыць, 100 лямбд гэта ўсё адно 100 класаў, толькі з'яўляюцца яны пазней. Захаваныя файлы займаюць 26 082 байты, разам з асноўным класам выходзіць 38 059 супраць 43 623. Па-сапраўднаму эканоміць толькі jar: 4147 байтаў супраць 44 109.

Яшчэ ў тым жа запісе стаяла, што на дыску лямбда выйграе заўсёды. З адной лямбдай гэта не так. Файл класа з ёй займае 1096 байтаў, а 2 файлы з ананімным класам 968.

## Адкуль бяруцца 126

Пустая праграма загружае тут 374 класы. Адзін ананімны клас дадае да іх 2, сябе і інтэрфейс `IntUnaryOperator`. Адна лямбда дадае 128. Больш за палову гэта механізм, які яе будуе. 57 класаў са 128 ляжаць у `java.lang.invoke`, яшчэ 13 належаць бібліятэцы ASM унутры JDK, з яе дапамогай і пішуцца тыя самыя 259 байтаў. А 35 са 128 няма ні ў адным файле, яны генеруюцца проста падчас працы.

Я думаў так: плаціш адзін раз, а далей з ростам N лямбды выйграюць. Першая палова слушная. Але кожная наступная лямбда таксама прыносіць адзін клас, гэтак жа як ананімны. Таму розніца застаецца 126 пры N = 1, 10 і 100. З другой паловай я памыліўся. Роўна 126 кожны раз выйшла збольшага выпадкова. На кожным кроку з абодвух бакоў загружалася яшчэ па адным класе самой JDK і класы гэтыя розныя: у 100 ананімных дадаўся `sun.misc.Cleaner`, у лямбд яшчэ адзін `LambdaForm`.

<figure class="fig">
<svg viewBox="0 0 680 248" role="img" aria-label="Слупкі для N = 1, 10 і 100 месцаў. N = 1: байтаў на дыску 968 у ананімных класаў і 1096 у лямбд, загружана класаў звыш пустой праграмы 2 і 128; N = 10: байтаў на дыску 4831 у ананімных класаў і 2077 у лямбд, загружана класаў звыш пустой праграмы 12 і 138; N = 100: байтаў на дыску 43 623 у ананімных класаў і 11 977 у лямбд, загружана класаў звыш пустой праграмы 103 і 229.">
  <text x="70.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">байтаў .class на дыску</text>
  <text x="400.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">загружана звыш пустой праграмы</text>
  <text x="10.0" y="56.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">N = 1</text>
  <rect x="70" y="34" width="4.2" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="80.2" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">968</text>
  <rect x="70" y="54" width="4.8" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="80.8" y="66.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">1096</text>
  <rect x="400" y="34" width="1.9" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="407.9" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2</text>
  <rect x="400" y="54" width="123.0" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="529.0" y="66.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">128</text>
  <text x="10.0" y="118.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">N = 10</text>
  <rect x="70" y="96" width="21.0" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="97.0" y="108.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">4831</text>
  <rect x="70" y="116" width="9.0" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="85.0" y="128.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">2077</text>
  <rect x="400" y="96" width="11.5" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="417.5" y="108.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">12</text>
  <rect x="400" y="116" width="132.6" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="538.6" y="128.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">138</text>
  <text x="10.0" y="180.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">N = 100</text>
  <rect x="70" y="158" width="190.0" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="266.0" y="170.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">43 623</text>
  <rect x="70" y="178" width="52.2" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="128.2" y="190.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">11 977</text>
  <rect x="400" y="158" width="99.0" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="505.0" y="170.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">103</text>
  <rect x="400" y="178" width="220.0" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="626.0" y="190.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">229</text>
  <rect x="70" y="224" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="88.0" y="234.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">ананімны клас</text>
  <rect x="260" y="224" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="278.0" y="234.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">лямбда</text>
</svg>
<figcaption>Злева файлы, справа запушчаная JVM. Справа розніца ва ўсіх радках аднолькавая, 126.</figcaption>
</figure>

## Першы выклік

Цяпер час. Кожны лік на малюнку гэта медыяна па 30 новых працэсах. Працэс вылічае выраз і адзін раз выклікае тое, што атрымалася, потым робіць тое ж з іншым выразам, потым паўтарае апошні.

Першы ананімны клас каштуе 0,33 мс. Першая лямбда 45,6 мс, 80% запускаў ляжаць паміж 37,8 і 54,0. Другая лямбда займае 0,28 мс, другі ананімны клас 0,23 мс. Пасля першай яны блізкія, выбіраць паміж імі з гэтай прычыны я б не стаў.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Кропкі на лагарыфмічнай шкале часу. першае месца: ананімны клас 332,5 мкс, лямбда 45591,1 мкс; іншае месца: ананімны клас 228,6 мкс, лямбда 278,3 мкс; тое ж месца зноў: ананімны клас 0,5 мкс, лямбда 5,5 мкс.">
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">вылічэнне і адзін выклік, лагарыфмічная шкала</text>
  <line x1="219.5" y1="28" x2="219.5" y2="200" class="f-plain"/>
  <text x="219.5" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 мкс</text>
  <line x1="301.9" y1="28" x2="301.9" y2="200" class="f-plain"/>
  <text x="301.9" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10 мкс</text>
  <line x1="384.4" y1="28" x2="384.4" y2="200" class="f-plain"/>
  <text x="384.4" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100 мкс</text>
  <line x1="466.8" y1="28" x2="466.8" y2="200" class="f-plain"/>
  <text x="466.8" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 мс</text>
  <line x1="549.3" y1="28" x2="549.3" y2="200" class="f-plain"/>
  <text x="549.3" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10 мс</text>
  <line x1="631.8" y1="28" x2="631.8" y2="200" class="f-plain"/>
  <text x="631.8" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100 мс</text>
  <text x="10.0" y="63.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">першае месца</text>
  <line x1="418.9" y1="48" x2="434.0" y2="48" style="stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="427.4" cy="48" r="4.5" style="fill:var(--ink);stroke:none"/>
  <text x="443.0" y="52.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0,33 мс</text>
  <line x1="596.9" y1="70" x2="609.7" y2="70" style="stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="603.6" cy="70" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="586.9" y="74.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">45,6 мс</text>
  <text x="10.0" y="119.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">іншае месца</text>
  <line x1="410.7" y1="104" x2="418.3" y2="104" style="stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="414.0" cy="104" r="4.5" style="fill:var(--ink);stroke:none"/>
  <text x="427.3" y="108.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0,23 мс</text>
  <line x1="416.6" y1="126" x2="427.9" y2="126" style="stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="421.0" cy="126" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="436.9" y="130.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">0,28 мс</text>
  <text x="10.0" y="175.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">тое ж месца зноў</text>
  <line x1="186.7" y1="160" x2="194.7" y2="160" style="stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="194.7" cy="160" r="4.5" style="fill:var(--ink);stroke:none"/>
  <text x="203.7" y="164.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0,5 мкс</text>
  <line x1="277.8" y1="182" x2="288.1" y2="182" style="stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="280.5" cy="182" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="297.1" y="186.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">5,5 мкс</text>
  <circle cx="176" cy="236" r="4.5" style="fill:var(--ink);stroke:none"/>
  <text x="188.0" y="240.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">ананімны клас</text>
  <circle cx="366" cy="236" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="378.0" y="240.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">лямбда</text>
</svg>
<figcaption>Медыяны па 30 новых працэсах, тонкія лініі ад 10-га да 90-га працэнтыля. Без архіва CDS.</figcaption>
</figure>

Зборка, якую я ўзяў, ідзе без архіва агульных класаў (class data sharing). Я падазраваў, што 45 мс гэта ў асноўным чытанне `rt.jar`. Зрабіў архіў праз `-Xshare:dump` і паўтарыў. У лямбды выйшла 45,9 мс. Сам архіў працуе, пустая праграма паскорылася з 66 да 51 мс (увесь працэс з jar, медыяна 15 запускаў), але са 128 дадатковых класаў у яго трапілі толькі 26.

Сервер гэтых 45 мс не заўважыць, а маленькая кансольная праграма заўважыць. Увесь працэс са 100 лямбдамі, вымераны гэтак жа і без архіва, заняў 170 мс супраць 103 мс са 100 ананімнымі класамі.

## Які аб'ект я атрымліваю

Ананімны клас кожны раз дае новы аб'ект. Пра лямбду спецыфікацыя (JLS 15.27.4) не абяцае ні новага аб'екта, ні ранейшага. Я вылічыў кожны выраз 1000 разоў і палічыў розныя аб'екты.

| выраз | аб'ектаў |
|---|---|
| ананімны клас | 1000 |
| `x -> x + 1` | 1 |
| `x -> x + k`, `int k = 5` | 1000 |
| `x -> x + k`, `final int k = 5` | 1 |
| `x -> x + field` | 1000 |
| `Identity::sq` (статычны) | 1 |
| `this::add` | 1000 |

Мне падабаюцца радкі 3 і 4. Адрозніваюцца яны толькі словам `final`. З ім `k` робіцца канстантай часу кампіляцыі, `javac` падстаўляе 5 проста ў цела і захопліваць няма чаго. Не думаў, што ад мадыфікатара залежыць, колькі аб'ектаў ствараецца.

Па тым жа правіле вырашаецца, хто застаецца ў памяці. Я стварыў 50 аб'ектаў па 1 МБ, у кожнага ўзяў па адным колбэку, пакінуў толькі колбэкі і 3 разы выклікаў `System.gc()`. З ананімным `Runnable`, які знешняга аб'екта ўвогуле не чапае, выжылі ўсе 50. Іх трымае схаванае поле `this$0`. З лямбдай, якая робіць тое ж самае, не выжыў ніводзін. Але калі лямбда чытае поле знешняга аб'екта, зноў жывыя ўсе 50. Яна захапіла `this`, хоць у зыходным кодзе гэтага слова нават не відаць.

## Імёны

`getClass().isAnonymousClass()` для лямбды вяртае false. Унутры яе цела `this` гэта знешні аб'ект. Клас яе завецца прыкладна так: `Who$$Lambda$1/1510467688`. `Class.forName` з гэтым імем кідае `ClassNotFoundException`. Потым я адкрыў `InnerClassLambdaMetafactory` праз `javap`, каб паглядзець, як клас трапляе ў JVM. Там знайшоўся выклік `Unsafe.defineAnonymousClass`. Выходзіць, ён усё ж ананімны, толькі ў іншым сэнсе слова, у тым, які прыняты ўнутры VM.

Адну рэч я зразумеў не адразу. У маім класе `Who` 5 лямбд і я шукаў у ім `lambda$go$0`. А метады называліся ад `lambda$go$24` да `lambda$go$28`. Я кампіляваў 4 файлы адной камандай, а гэты `javac` не скідвае лічыльнік, калі пераходзіць да наступнага класа. Калі сабраць `Who` асобна, нумары ідуць ад 0 да 4. Калі пасля `Identity.java`, то ад 19 да 23, так што байты файла класа залежаць ад суседзяў у камандным радку.

## Чаго я не правяраў

Зборка адна, у наступным абнаўленні класаў можа загружацца менш. Хуткасць прагрэтага кода я не мераў, у Куксенкі гэта зроблена як след. Паўторнае вылічэнне той самай лямбды заняло 5,5 мкс супраць 0,5 у ананімнага класа, але гэта адзіны выклік у інтэрпрэтатары, высноў я б адсюль не рабіў. Не ведаю і таго, якая частка 45 мс ідзе на загрузку, якая на звязванне, а якая на ASM. І ўсе мае лямбды адной формы, з рознымі інтэрфейсамі дадатковых класаў будзе іншая колькасць.
