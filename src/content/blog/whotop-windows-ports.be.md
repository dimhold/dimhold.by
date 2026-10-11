---
title: "На маім ноўтбуку з Windows whotop знайшоў, хто трымае кожны порт. 11 яго адказаў спасылаліся на слова, якога няма"
description: "Я ўзяў адзін здымак са свайго ноўтбука з Windows у 01:59 і праверыў, што whotop 0.4.1 сказаў пра кожны з 33 працэсаў, якія трымаюць порт на праслухоўванне. З партамі ўсё сышлося: 8 працэсаў astro сядзелі не на тым порце, што ў іх камандным радку, і whotop паказаў сапраўдны. Але 11 радкоў спасылаліся на vite як на доказ, а гэтага слова ў камандным радку няма, 8 угаданых каталогаў аказаліся кэшам npx або часовай папкай, а імёны службаў даходзілі толькі да інтэрактыўнага экрана."
date: 2026-10-09
lang: be
translationKey: whotop-windows-ports
tags: ["debugging", "networking"]
---
Я напісаў [whotop](https://github.com/dimhold/whotop) у жніўні, пасля вечара, калі порт 4310 аказаўся занятым і я забіў не той працэс node. 19 жніўня я выклаў пакет у npm. Галоўнае, што абяцае README: whotop кажа, што значэнне недаступнае і чаму, замест упэўненай здагадкі. У кожнай ролі ёсць правіла, якое яе вызначыла.

Гэтае абяцанне я правяраў на фікстурах, якія запісаў сам, і на ранерах CI. Ні разу я не ўзяў сапраўдны вечар сваёй машыны і не задаў ёй радок за радком тое адзінае пытанне, дзеля якога інструмент існуе. Некалькі дзён таму я пісаў пра [начны лог свайго ноўтбука](https://dimhold.by/be/blog/night-noise/). У тым жа логу ёсць адказ: 96 здымкаў `whotop ls --all --json`, версія 0.4.1, Windows, без правоў адміністратара. Я ўзяў здымак 29 верасня ў 01:59, калі мае агенцкія сесіі толькі што скончылі працу. Глядзеў толькі на працэсы, якія трымаюць TCP-порт на праслухоўванне.

Такіх 33 з 484 працэсаў. Ролю whotop даў 21 з іх: 20 працэсам node, якія ён называе dev-серверамі, і Postgres. Астатнія 12 whotop пазначыў як unknown. 11 з іх наогул не паказалі камандны радок.

## З партамі ўсё ў парадку

На Windows whotop адным выклікам PowerShell атрымлівае і табліцу працэсаў, і табліцу сокетаў. Pid уладальніка кожнага сокета зняты ў той жа момант, што і спіс працэсаў. Паводле README, порт, прыпісаны не таму працэсу, гэта тая памылка, якой гэты інструмент рабіць нельга. За гэтую ноч я не знайшоў у логу нічога, што супярэчыла б калонцы партоў.

Гэты прыклад я не планаваў. 5 працэсаў на ноўтбуку былі запушчаныя як `astro preview --port 4321`, у розны час на працягу 2 дзён. Я іх так і не спыніў. 4321 трымае толькі адзін з іх, pid 23620. Астатнія 4 паводле табліцы сокетаў сядзяць на 4322, 4323, 4324 і 4325. Яшчэ 5 запушчаныя з `--port 4326` у першыя 20 хвілін пасля поўначы і сядзяць на партах з 4326 па 4330. У 8 працэсаў порт у камандным радку не той, які яны трымаюць.

<figure class="fig">
<svg viewBox="0 0 640 290" role="img" aria-label="Дзве калонкі. Злева 10 камандных радкоў, 5 з іх astro preview --port 4321 і 5 з --port 4326. Справа порт, які працэс трымае насамрэч. просіць 4321, трымае 4321, просіць 4321, трымае 4322, просіць 4321, трымае 4323, просіць 4321, трымае 4324, просіць 4321, трымае 4325, просіць 4326, трымае 4326, просіць 4326, трымае 4327, просіць 4326, трымае 4328, просіць 4326, трымае 4329, просіць 4326, трымае 4330. Порт са свайго каманднага радка трымаюць толькі 2 з 10.">
  <text x="145" y="24" text-anchor="middle" class="f-label f-muted">просіць камандны радок</text>
  <text x="505" y="24" text-anchor="middle" class="f-label f-muted">трымае паводле табліцы сокетаў</text>
  <rect x="20" y="44" width="250" height="16" class="f-box"/>
  <text x="30" y="56" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="44" width="70" height="16" class="f-box"/>
  <text x="505" y="56" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">4321</text>
  <line x1="270" y1="52" x2="470" y2="52" style="stroke:var(--muted);stroke-width:1.2"/>
  <rect x="20" y="66" width="250" height="16" class="f-box"/>
  <text x="30" y="78" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="66" width="70" height="16" class="f-box"/>
  <text x="505" y="78" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4322</text>
  <line x1="270" y1="74" x2="470" y2="74" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="88" width="250" height="16" class="f-box"/>
  <text x="30" y="100" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="88" width="70" height="16" class="f-box"/>
  <text x="505" y="100" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4323</text>
  <line x1="270" y1="96" x2="470" y2="96" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="110" width="250" height="16" class="f-box"/>
  <text x="30" y="122" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="110" width="70" height="16" class="f-box"/>
  <text x="505" y="122" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4324</text>
  <line x1="270" y1="118" x2="470" y2="118" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="132" width="250" height="16" class="f-box"/>
  <text x="30" y="144" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="132" width="70" height="16" class="f-box"/>
  <text x="505" y="144" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4325</text>
  <line x1="270" y1="140" x2="470" y2="140" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="170" width="250" height="16" class="f-box"/>
  <text x="30" y="182" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="170" width="70" height="16" class="f-box"/>
  <text x="505" y="182" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">4326</text>
  <line x1="270" y1="178" x2="470" y2="178" style="stroke:var(--muted);stroke-width:1.2"/>
  <rect x="20" y="192" width="250" height="16" class="f-box"/>
  <text x="30" y="204" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="192" width="70" height="16" class="f-box"/>
  <text x="505" y="204" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4327</text>
  <line x1="270" y1="200" x2="470" y2="200" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="214" width="250" height="16" class="f-box"/>
  <text x="30" y="226" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="214" width="70" height="16" class="f-box"/>
  <text x="505" y="226" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4328</text>
  <line x1="270" y1="222" x2="470" y2="222" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="236" width="250" height="16" class="f-box"/>
  <text x="30" y="248" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="236" width="70" height="16" class="f-box"/>
  <text x="505" y="248" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4329</text>
  <line x1="270" y1="244" x2="470" y2="244" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="258" width="250" height="16" class="f-box"/>
  <text x="30" y="270" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="258" width="70" height="16" class="f-box"/>
  <text x="505" y="270" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4330</text>
  <line x1="270" y1="266" x2="470" y2="266" style="stroke:var(--accent);stroke-width:1.4"/>
</svg>
<figcaption>10 працэсаў astro preview, запушчаных з --port 4321 або --port 4326, здымак у 01:59. 8 з іх трымаюць порт, якога няма ў іх камандным радку.</figcaption>
</figure>

Гэта зноў мой жнівеньскі вечар. Калі шукаць 4321 у камандных радках, будзе 5 кандыдатаў і 4 з іх не тыя. `whotop port 4321` дае адзін pid.

## 11 радкоў спасылаюцца на доказ, якога няма

Усе 11 працэсаў astro, гэтыя 10 і яшчэ адзін з `--port 4331`, падпісаныя як `vite`. Побач з кожным надрукавана прычына "known dev server in the command line (vite)". Слова "vite" няма ні ў адным з гэтых 11 камандных радкоў. Там запушчаны `astro.js preview`.

Я палез у код. Правіла спрацоўвае таму, што ўваходны скрыпт гэта astro. Гэта правільна. Але ярлык і прычыну збірае адна дапаможная функцыя, якая шукае ў камандным радку першы токен dev-сервера. Калі не знаходзіць ніводнага, яна ўсё роўна вяртае першы токен са спіса. Першым у спісе стаіць vite. Роля правільная. Але слова ў ярлыку і ў прычыне бярэцца са значэння па змаўчанні. У README напісана, што класіфікацыя, якую нельга праверыць, гэта тая ж здагадка, толькі ветлівейшая. Тут камандны радок ляжаў у логу, так што праверыць я мог.

## Каталогі толькі выведзеныя

На Windows whotop не чытае працоўны каталог чужога працэсу. Для гэтага давялося б чытаць памяць працэсу, таму ён бярэ самы доўгі абсалютны шлях з каманднага радка і пазначае яго `(inferred)`. Для 11 радкоў astro гэта каталог праекта. Падобна на праўду, хоць па логу я і гэтага праверыць не магу.

Яшчэ для 7 радкоў ён не кажа нічога карыснага. 6 працэсаў `http-server` і 1 `serve` запушчаныя з кэша npx, таму адзіны шлях у іх камандным радку вядзе ў гэты кэш. whotop абразае яго перад `node_modules` і выдае каталог кэша. У 6 радкоў `http-server` атрымліваецца адзін і той жа каталог. Па ім іх не адрозніць. Адзін з гэтых працэсаў трымае 4310, той самы порт з жнівеньскага вечара.

Адзін радок няправільны з-за памылкі ў разборы шляху. У сервера `ts-node-dev` на порце 4400 у камандным радку 2 шляхі: файл хука ў `D:/Temp` і за ім шлях праекта. Мой рэгулярны выраз для пошуку шляхоў дазваляе прабелы ўнутры шляху. Першае супадзенне пераскоквае праз прабел і забірае з сабой літару дыска другога шляху. Другі шлях whotop не бачыць зусім. У радку стаіць `D:/Temp`. Я ўзнавіў гэта на апублікаваным пакеце: без шляху хука тая ж каманда дае каталог праекта.

<figure class="fig">
<svg viewBox="0 0 640 166" role="img" aria-label="Камандны радок сервера ts-node-dev, скарочаны. Пошук шляху пачынаецца з D:/Temp, праходзіць праз прабел і спыняецца на двукроп'і наступнай літары дыска. Каталогам застаецца D:/Temp. Шлях праекта пасля яго не знаходзіцца, бо яго літару дыска з'ела першае супадзенне.">
  <text x="24" y="62" textLength="15.6" lengthAdjust="spacingAndGlyphs" class="f-mono f-muted">-r</text>
  <rect x="47.4" y="44" width="171.6" height="26" style="fill:var(--accent);fill-opacity:0.18;stroke:var(--accent);stroke-width:1"/>
  <text x="47.4" y="62" textLength="171.6" lengthAdjust="spacingAndGlyphs" class="f-mono f-ink">D:/Temp/hook-0417.js D</text>
  <rect x="219.0" y="44" width="273.0" height="26" style="fill:none;stroke:var(--muted);stroke-width:1;stroke-dasharray:3 2"/>
  <text x="219" y="62" textLength="273.0" lengthAdjust="spacingAndGlyphs" class="f-mono f-muted">:\work\api\node_modules\...\wrap.js</text>
  <text x="47.4" y="34" class="f-label f-accent">1-е супадзенне, да двукроп'я</text>
  <text x="219.0" y="88" class="f-label f-muted">не знойдзены</text>
  <text x="24" y="124" class="f-label f-muted">выдадзены як каталог:</text>
  <text x="274" y="124" class="f-mono f-accent">D:/Temp</text>
  <text x="24" y="150" class="f-label f-muted">тая ж каманда без шляху хука:</text>
  <text x="274" y="150" class="f-mono f-ink">D:\work\api</text>
</svg>
<figcaption>Пошук шляху дазваляе прабелы ўнутры шляху. Першае супадзенне забірае літару дыска наступнага шляху, таму шлях праекта не чытаецца зусім. Шляхі скарочаныя.</figcaption>
</figure>

З 20 радкоў node у 8 каталог фармальна пазначаны як `(inferred)` і нічым не дапамагае, калі я збіраюся нешта забіць. Яшчэ 3 радкі атрымалі замест ярлыка толькі імя свайго скрыпта, але там прычына сумленна кажа, што больш нічога не супала. У README гэтая праблема з каталогам апісана на прыкладзе `claude.exe`: яго каталог усталёўкі выглядаў як працоўны. Той выпадак я выправіў у жніўні, а іншых шукаць не стаў.

<figure class="fig">
<svg viewBox="0 0 640 386" role="img" aria-label="Сетка з 20 радкоў node, якія трымаюць порт на праслухоўванне, па радку на працэс, 3 калонкі: порт, доказ у ярлыку, каталог. Порт у парадку ва ўсіх радках. У 11 радках доказам названа vite, а гэтага слова ў камандным радку няма. У 8 радках выведзены каталог гэта кэш npx або часовая папка.">
  <text x="225" y="30" text-anchor="middle" class="f-label f-muted">порт</text>
  <text x="375" y="30" text-anchor="middle" class="f-label f-muted">доказ</text>
  <text x="525" y="30" text-anchor="middle" class="f-label f-muted">каталог</text>
  <text x="140" y="52" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4301 serve</text>
  <rect x="152" y="40" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="40" width="146" height="14" style="fill:var(--muted);fill-opacity:0.3"/>
  <text x="375" y="51" text-anchor="middle" class="f-label f-ink" style="font-size:11px">імя файла</text>
  <rect x="452" y="40" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="51" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="69" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4310 http-server</text>
  <rect x="152" y="57" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="57" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="57" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="68" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="86" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4311 http-server</text>
  <rect x="152" y="74" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="74" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="74" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="85" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="103" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4312 http-server</text>
  <rect x="152" y="91" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="91" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="91" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="102" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="120" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4313 http-server</text>
  <rect x="152" y="108" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="108" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="108" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="119" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="137" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4314 http-server</text>
  <rect x="152" y="125" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="125" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="125" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="136" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="154" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4315 http-server</text>
  <rect x="152" y="142" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="142" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="142" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="153" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="171" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4321 astro</text>
  <rect x="152" y="159" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="159" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="170" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">цытуе vite</text>
  <rect x="452" y="159" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="188" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4322 astro</text>
  <rect x="152" y="176" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="176" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="187" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">цытуе vite</text>
  <rect x="452" y="176" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="205" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4323 astro</text>
  <rect x="152" y="193" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="193" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="204" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">цытуе vite</text>
  <rect x="452" y="193" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="222" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4324 astro</text>
  <rect x="152" y="210" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="210" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="221" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">цытуе vite</text>
  <rect x="452" y="210" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="239" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4325 astro</text>
  <rect x="152" y="227" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="227" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="238" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">цытуе vite</text>
  <rect x="452" y="227" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="256" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4326 astro</text>
  <rect x="152" y="244" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="244" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="255" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">цытуе vite</text>
  <rect x="452" y="244" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="273" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4327 astro</text>
  <rect x="152" y="261" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="261" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="272" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">цытуе vite</text>
  <rect x="452" y="261" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="290" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4328 astro</text>
  <rect x="152" y="278" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="278" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="289" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">цытуе vite</text>
  <rect x="452" y="278" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="307" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4329 astro</text>
  <rect x="152" y="295" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="295" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="306" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">цытуе vite</text>
  <rect x="452" y="295" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="324" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4330 astro</text>
  <rect x="152" y="312" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="312" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="323" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">цытуе vite</text>
  <rect x="452" y="312" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="341" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4331 astro</text>
  <rect x="152" y="329" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="329" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="340" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">цытуе vite</text>
  <rect x="452" y="329" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="358" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4400 ts-node-dev</text>
  <rect x="152" y="346" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="346" width="146" height="14" style="fill:var(--muted);fill-opacity:0.3"/>
  <text x="375" y="357" text-anchor="middle" class="f-label f-ink" style="font-size:11px">імя файла</text>
  <rect x="452" y="346" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="357" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">часовая папка</text>
  <text x="140" y="375" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8765 script</text>
  <rect x="152" y="363" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="363" width="146" height="14" style="fill:var(--muted);fill-opacity:0.3"/>
  <text x="375" y="374" text-anchor="middle" class="f-label f-ink" style="font-size:11px">імя файла</text>
  <rect x="452" y="363" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
</svg>
<figcaption>20 радкоў node з портам на праслухоўванне ў 01:59. 11 ярлыкоў спасылаюцца на слова, якога няма, 8 каталогаў нічога не кажуць пра праект.</figcaption>
</figure>

## Імёны службаў застаюцца на адным экране

У гэтым здымку 163 з 484 працэсаў схавалі камандны радок. Рэестр службаў, які whotop чытае без правоў адміністратара, назваў 115 з іх. Папярэджанне ў кожным здымку так і кажа. Але я пашукаў ва ўсім начным логу хоць адно імя службы і не знайшоў. Імёны прывязаныя да працэсу, але друкуе іх толькі інтэрактыўны экран. `whotop ls`, `whotop port` і вывад JSON іх выкідваюць.

Я ўзнавіў гэта на падрыхтаваных даных: `svchost.exe` трымае порт 135 і запускае службу `RpcSs`. На інтэрактыўным экране гэта `svchost.exe [RpcSs]`. `whotop port 135` паказвае `unknown` і раіць запусціць абалонку з правамі адміністратара. `whotop ls RpcSs` нічога не знаходзіць. На маім ноўтбуку 4 з 12 невядомых працэсаў з портам на праслухоўванне былі `svchost`, а ён існуе для таго, каб запускаць у сабе службы. Якія гэта былі службы, лог сказаць не можа: JSON ужо выкінуў імёны.

## Чаго я не правяраў

Сапраўдны працоўны каталог ніводнага з гэтых працэсаў я па логу праверыць не магу. Я не запускаў whotop з правамі адміністратара, таму не ведаю, колькі з 11 маўклівых працэсаў whotop назваў бы з правамі адміністратара. Парты 139, 445 і 5357 належаць pid 4, `System`. whotop там проста піша unknown. Яшчэ ў здымку 25 сокетаў без працэсу-ўладальніка, іх не паказвае ніводзін радок.

Гэта адзін ноўтбук і адзін здымак, але за ноч лічбы амаль не мяняюцца. У 81 з 96 здымкаў 32 ці 33 працэсы з портам на праслухоўванне, з іх 21 з роляй. 11 ярлыкоў vite ёсць у 91 здымку, а 7 каталогаў npx ва ўсіх 96.

Ніводная з 3 праблем не выпраўлена ў 0.4.1, версіі, якая цяпер ляжыць у npm.
