---
title: "У каго ключ ад пакета npm. У 2026 годзе на большасці рэлізаў стаіць імя машыны"
description: "Я прачытаў запісы пра публікацыі 5000 пакетаў npm, якія спампоўваюць найчасцей. Амаль у паловы 1 мэйнтэйнер, у 19 працэнтаў першага аўтара ўжо няма ў спісе, 1798 нічога не выпускалі 2 гады. У 2026 годзе большасць рэлізаў выпускае машына, 1429 пакетаў праз trusted publishing. Гэтая змена зламала мой уласны падлік кінутых пакетаў: сумленны дыяпазон ад 213 да 369."
date: 2026-10-08
lang: be
translationKey: npm-maintainer-life
tags: ["dependencies", "open-data", "statistics"]
---
У 2018 годзе аўтар `event-stream` аддаў пакет незнаёмцу, які пра гэта папрасіў. Незнаёмец дадаў код, які паляваў на кашалёк для біткойнаў, праграму Copay. Я гадамі пераказваў гэтую гісторыю як кароткую версію жыцця пакета npm. Адзін чалавек піша яго, стамляецца, а потым альбо перадае камусьці, альбо сыходзіць. Я расказваў гэта на рэўю кода, але ні разу не палічыў, як часта здараецца кожны з гэтых канцоў.

Рэестр захоўвае дастаткова, каб палічыць. У кожнай версіі ў дакуменце пакета ёсць `_npmUser`, акаўнт, які яе апублікаваў. Побач ляжаць час публікацыі і спіс мэйнтэйнераў на той момант. 8 кастрычніка 2026 года я ўзяў 5000 імёнаў, якія спампоўваюць найчасцей, з `npm-high-impact` 1.13.0, гэта спіс ад чэрвеня 2026. Невялікі скрыпт на Python 3.12 спампаваў поўны дакумент кожнага пакета. 4 аказаліся непрыдатнымі, застаецца 4996 пакетаў і 965617 версій з датай.

`_npmUser` гэта акаўнт, які націснуў publish або чый токен гэта зрабіў. Пра тое, хто пісаў код, ён не кажа нічога, для гэтага патрэбная гісторыя git, а яе я не адкрываў. Усё далей пра тое, у каго ключ.

## Хто публікуе

Амаль палова спіса гэта адзін чалавек. У 2351 пакета, 47 працэнтаў, сёння роўна 1 мэйнтэйнер. 2504 ні разу не атрымалі версію ад другога чалавечага акаўнта. Там, дзе правы ёсць у 2 і больш людзей, медыянны пакет усё роўна атрымаў 73 працэнты версій ад аднаго акаўнта.

Мая першая табліца "аўтараў" памылілася пацешна. На другім месцы з 217 пакетамі стаяў `types`, а гэта бот DefinitelyTyped ад Microsoft. Гуглаўскі `google-wombot` апублікаваў 78061 версію. Перш чым лічыць людзей, давялося аддзяліць машыны. Версія лічыцца машыннай, калі npm пазначыў яе як trusted publishing. Яшчэ яна лічыцца машыннай, калі імя акаўнта падобнае на бота або на рэлізны канвеер. 14 акаўнтаў кампаній я дадаў рукамі. Потым вярнуў 10 акаўнтаў з шаблона назад у людзі, бо `ceejbot` і `jonkoops` гэта людзі. Гэтаму падзелу я б не давяраў дакладней, чым да некалькіх працэнтаў.

## Хто перадае

У 4539 пакетаў была хоць адна версія ад чалавечага акаўнта. У 2864 з іх, 63 працэнты, першы чалавек-публікатар ён жа і апошні. 2035 пакетаў у нейкі момант атрымалі другога чалавека-публікатара, у медыяне праз 14 месяцаў пасля першага.

З гэтых 2035 у 1292 першы аўтар усё яшчэ ў спісе мэйнтэйнераў. Сярод усіх 4539 першага аўтара няма ў спісе ў 878 пакетаў, гэта 19 працэнтаў. Сярод іх `debug`, `commander` і `express`. Першым запісаным публікатарам ва ўсіх трох быў TJ Holowaychuk і сёння ніводзін з іх яго не пералічвае. `event-stream` таксама тут, яго адзіны мэйнтэйнер цяпер уласны акаўнт npm з імем `npm`.

## Хто знікае

1798 пакетаў, 36 працэнтаў, нічога не выпускалі 2 гады. Парог у 2 гады я ўзяў з даследавання "What are Weak Links in the npm Supply Chain?" (ICSE SEIP 2022). Многія маленькія бібліятэкі проста скончаныя. 104 з маўклівых пазначаныя як deprecated, гэта значыць нехта яўна развітаўся.

Ці застаўся там хто-небудзь? Мой першы адказ быў 664 пакеты, дзе ніводзін мэйнтэйнер-чалавек нічога не публікаваў 2 гады. Я ўжо збіраўся ўпісаць яго ў тэкст, потым убачыў, што правяраў людзей толькі ўнутры сваіх 5000, а яны могуць кожны тыдзень публікаваць іншыя пакеты. Тады я спытаў пошук рэестра, `/-/v1/search`, пра кожнага з 1077 мэйнтэйнераў маўклівых пакетаў. Для кожнага ўзяў самы свежы пакет, які ён апублікаваў дзе заўгодна. Гэта заняло 25 хвілін і скараціла лік да 369.

У 369 маўклівых пакетах, не пазначаных deprecated, ніводзін мэйнтэйнер-чалавек 2 гады нічога не публікаваў нідзе ў рэестры. У 316 з іх мэйнтэйнер адзін. Медыянны з іх на мінулым тыдні спампавалі 13 мільёнаў разоў, а `shebang-command` амаль 300 мільёнаў разоў. Мілер і сааўтары на ICSE 2025 знайшлі, што з 28100 шырока ўжываных пакетаў npm з 2015 па 2020 год былі кінутыя 14,6 працэнта. Яны лічылі акуратней за мяне і паводле свайго азначэння.

## Імя, якое знікае

Я ішоў лічыць кінутыя пакеты, але самая вялікая змена знайшлася ў іншым месцы. У 2024 годзе нешта выпусцілі 2836 пакетаў з майго спіса. У 672 з іх апошні рэліз года прыйшоў ад машыннага акаўнта. Праз trusted publishing не прыйшоў ніводзін, бо яго яшчэ не было. У 2026 годзе, па 8 кастрычніка, рэлізы былі ў 2542 пакетаў. Апошні рэліз прыйшоў ад машыны ў 1704 з іх. З гэтых 1704 у 1429 ён прайшоў праз trusted publishing.

Trusted publishing стаў агульнадаступным у npm 31 ліпеня 2025 года, а першая такая версія ў маім наборы ад 25 ліпеня. Ён дазваляе воркфлоў ў CI на GitHub або GitLab публікаваць з токенам, выдадзеным на 1 запуск. У верасні 2025 года чарвяк Shai Hulud распаўзаўся праз скрадзеныя токены npm. 9 снежня 2025 года npm адклікаў усе класічныя токены. Скачок пасля чарвяка відаць у штомесячных ліках: з 15 працэнтаў пакетаў з рэлізам у верасні 2025 да 33 працэнтаў у кастрычніку. Пік быў у чэрвені 2026, 941 з 1387, 68 працэнтаў. У верасні 2026 было 58 працэнтаў.

<figure class="fig">
<svg viewBox="0 0 640 276" role="img" aria-label="Слупкі па месяцах з чэрвеня 2025 па верасень 2026. Кожны слупок гэта доля пакетаў з топ-4996, якія выпускалі рэліз у гэтым месяцы і чый апошні рэліз месяца прайшоў праз trusted publishing: 2025-06 0%, 2025-07 1%, 2025-08 6%, 2025-09 15%, 2025-10 33%, 2025-11 32%, 2025-12 40%, 2026-01 48%, 2026-02 51%, 2026-03 52%, 2026-04 57%, 2026-05 56%, 2026-06 68%, 2026-07 62%, 2026-08 63%, 2026-09 58%. Пазначаныя агульны запуск 31 ліпеня 2025, чарвяк Shai Hulud у верасні 2025 і адкліканне класічных токенаў 9 снежня 2025.">
  <text x="10" y="12" class="f-label f-muted">доля пакетаў з рэлізам за месяц, выпушчаных праз trusted publishing</text>
  <line x1="50" y1="232" x2="620" y2="232" class="f-line"/>
  <text x="42" y="66" text-anchor="end" class="f-label f-muted">100%</text>
  <text x="42" y="232" text-anchor="end" class="f-label f-muted">0</text>
  <rect x="54.0" y="232.0" width="27.6" height="0.5" style="fill:var(--accent)"/>
  <text x="67.8" y="227.0" text-anchor="middle" class="f-label f-muted">0</text>
  <text x="67.8" y="248" text-anchor="middle" class="f-label f-muted">чэр</text>
  <rect x="89.6" y="230.3" width="27.6" height="1.7" style="fill:var(--accent)"/>
  <text x="103.4" y="225.3" text-anchor="middle" class="f-label f-muted">1</text>
  <text x="103.4" y="248" text-anchor="middle" class="f-label f-muted">ліп</text>
  <rect x="125.3" y="221.8" width="27.6" height="10.2" style="fill:var(--accent)"/>
  <text x="139.1" y="216.8" text-anchor="middle" class="f-label f-muted">6</text>
  <text x="139.1" y="248" text-anchor="middle" class="f-label f-muted">жні</text>
  <rect x="160.9" y="206.5" width="27.6" height="25.5" style="fill:var(--accent)"/>
  <text x="174.7" y="201.5" text-anchor="middle" class="f-label f-muted">15</text>
  <text x="174.7" y="248" text-anchor="middle" class="f-label f-muted">вер</text>
  <rect x="196.5" y="175.9" width="27.6" height="56.1" style="fill:var(--accent)"/>
  <text x="210.3" y="170.9" text-anchor="middle" class="f-label f-muted">33</text>
  <text x="210.3" y="248" text-anchor="middle" class="f-label f-muted">кас</text>
  <rect x="232.1" y="177.6" width="27.6" height="54.4" style="fill:var(--accent)"/>
  <text x="245.9" y="172.6" text-anchor="middle" class="f-label f-muted">32</text>
  <text x="245.9" y="248" text-anchor="middle" class="f-label f-muted">ліс</text>
  <rect x="267.8" y="164.0" width="27.6" height="68.0" style="fill:var(--accent)"/>
  <text x="281.6" y="159.0" text-anchor="middle" class="f-label f-muted">40</text>
  <text x="281.6" y="248" text-anchor="middle" class="f-label f-muted">сне</text>
  <rect x="303.4" y="150.4" width="27.6" height="81.6" style="fill:var(--accent)"/>
  <text x="317.2" y="145.4" text-anchor="middle" class="f-label f-muted">48</text>
  <text x="317.2" y="248" text-anchor="middle" class="f-label f-muted">сту</text>
  <rect x="339.0" y="145.3" width="27.6" height="86.7" style="fill:var(--accent)"/>
  <text x="352.8" y="140.3" text-anchor="middle" class="f-label f-muted">51</text>
  <text x="352.8" y="248" text-anchor="middle" class="f-label f-muted">лют</text>
  <rect x="374.6" y="143.6" width="27.6" height="88.4" style="fill:var(--accent)"/>
  <text x="388.4" y="138.6" text-anchor="middle" class="f-label f-muted">52</text>
  <text x="388.4" y="248" text-anchor="middle" class="f-label f-muted">сак</text>
  <rect x="410.3" y="135.1" width="27.6" height="96.9" style="fill:var(--accent)"/>
  <text x="424.1" y="130.1" text-anchor="middle" class="f-label f-muted">57</text>
  <text x="424.1" y="248" text-anchor="middle" class="f-label f-muted">кра</text>
  <rect x="445.9" y="136.8" width="27.6" height="95.2" style="fill:var(--accent)"/>
  <text x="459.7" y="131.8" text-anchor="middle" class="f-label f-muted">56</text>
  <text x="459.7" y="248" text-anchor="middle" class="f-label f-muted">тра</text>
  <rect x="481.5" y="116.4" width="27.6" height="115.6" style="fill:var(--accent)"/>
  <text x="495.3" y="111.4" text-anchor="middle" class="f-label f-muted">68</text>
  <text x="495.3" y="248" text-anchor="middle" class="f-label f-muted">чэр</text>
  <rect x="517.1" y="126.6" width="27.6" height="105.4" style="fill:var(--accent)"/>
  <text x="530.9" y="121.6" text-anchor="middle" class="f-label f-muted">62</text>
  <text x="530.9" y="248" text-anchor="middle" class="f-label f-muted">ліп</text>
  <rect x="552.8" y="124.9" width="27.6" height="107.1" style="fill:var(--accent)"/>
  <text x="566.6" y="119.9" text-anchor="middle" class="f-label f-muted">63</text>
  <text x="566.6" y="248" text-anchor="middle" class="f-label f-muted">жні</text>
  <rect x="588.4" y="133.4" width="27.6" height="98.6" style="fill:var(--accent)"/>
  <text x="602.2" y="128.4" text-anchor="middle" class="f-label f-muted">58</text>
  <text x="602.2" y="248" text-anchor="middle" class="f-label f-muted">вер</text>
  <text x="54" y="266" class="f-label f-ink">2025</text>
  <text x="303.4" y="266" class="f-label f-ink">2026</text>
  <line x1="121.3" y1="46" x2="121.3" y2="201.8" class="f-line" stroke-dasharray="3 3"/>
  <text x="117.3" y="42" text-anchor="end" class="f-label f-ink">даступны, 31 ліп</text>
  <line x1="172.9" y1="46" x2="172.9" y2="186.5" class="f-line" stroke-dasharray="3 3"/>
  <text x="176.9" y="42" text-anchor="start" class="f-label f-ink">чарвяк, вер</text>
  <line x1="274.4" y1="60" x2="274.4" y2="144.0" class="f-line" stroke-dasharray="3 3"/>
  <text x="278.4" y="56" text-anchor="start" class="f-label f-ink">токены адкліканыя, 9 сне</text>
</svg>
<figcaption>Да ліпеня 2025 года доля нулявая, да чэрвеня 2026 года яна даходзіць да дзвюх трэцяў. Доля лічыцца па пакетах. Пакет, які выпусціў за месяц 50 тэставых версій, лічыцца адзін раз.</figcaption>
</figure>

У 1452 пакетаў самая свежая версія цяпер апублікаваная так. У 1063 з іх версію якраз перад пераходам апублікаваў чалавек. `semver` паказвае ўвесь шлях у адным запісе. Першыя версіі з запісаным публікатарам, з кастрычніка 2011, выпускаў Isaac Schlueter. З 2023 года большую частку рэлізаў выпускаў акаўнт каманды npm `npm-cli-ops`, а з кастрычніка 2025 у полі публікатара стаіць `GitHub Actions`.

<figure class="fig">
<svg viewBox="0 0 640 170" role="img" aria-label="Храналогія ўсіх версій semver з запісаным публікатарам, з 2011 па 2026, на трох дарожках. З 2011 па 2023 версіі стаяць на дарожцы чалавека: isaacs, потым othiym23, lukekarrys і gar. З 2023 па 2025 яны пераходзяць на дарожку акаўнта каманды npm, npm-cli-ops. З кастрычніка 2025 яны на дарожцы trusted publishing, дзе публікатарам запісаны GitHub Actions.">
  <text x="158" y="42" text-anchor="end" class="f-label f-ink">чалавек</text>
  <line x1="170" y1="54" x2="620" y2="54" class="f-line" stroke-opacity="0.3"/>
  <text x="158" y="86" text-anchor="end" class="f-label f-ink">акаўнт каманды npm</text>
  <line x1="170" y1="98" x2="620" y2="98" class="f-line" stroke-opacity="0.3"/>
  <text x="158" y="130" text-anchor="end" class="f-label f-ink">trusted publishing</text>
  <line x1="170" y1="142" x2="620" y2="142" class="f-line" stroke-opacity="0.3"/>
  <line x1="191.3" y1="26" x2="191.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="194.5" y1="26" x2="194.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="194.7" y1="26" x2="194.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="197.3" y1="26" x2="197.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="209.4" y1="26" x2="209.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="219.3" y1="26" x2="219.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="223.7" y1="26" x2="223.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="226.7" y1="26" x2="226.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="229.1" y1="26" x2="229.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="230.8" y1="26" x2="230.8" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.0" y1="26" x2="239.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.2" y1="26" x2="239.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.7" y1="26" x2="239.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="240.6" y1="26" x2="240.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="240.8" y1="26" x2="240.8" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="242.0" y1="26" x2="242.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="242.6" y1="26" x2="242.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="249.2" y1="26" x2="249.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="249.4" y1="26" x2="249.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="264.1" y1="26" x2="264.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="267.3" y1="26" x2="267.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="269.9" y1="26" x2="269.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="270.0" y1="26" x2="270.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="270.1" y1="26" x2="270.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="273.9" y1="26" x2="273.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="275.3" y1="26" x2="275.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="275.4" y1="26" x2="275.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="276.6" y1="26" x2="276.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="281.5" y1="26" x2="281.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="281.8" y1="26" x2="281.8" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="285.6" y1="26" x2="285.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="285.6" y1="26" x2="285.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="285.7" y1="26" x2="285.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="286.7" y1="26" x2="286.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="289.0" y1="26" x2="289.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="289.0" y1="26" x2="289.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="292.0" y1="26" x2="292.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="293.9" y1="26" x2="293.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="294.1" y1="26" x2="294.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="297.2" y1="26" x2="297.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="297.4" y1="26" x2="297.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="302.0" y1="26" x2="302.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="302.0" y1="26" x2="302.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="307.2" y1="26" x2="307.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="324.0" y1="26" x2="324.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="324.4" y1="26" x2="324.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="325.6" y1="26" x2="325.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="354.5" y1="26" x2="354.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="354.5" y1="26" x2="354.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="368.0" y1="26" x2="368.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="384.5" y1="26" x2="384.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="388.6" y1="26" x2="388.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="401.5" y1="26" x2="401.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="401.5" y1="26" x2="401.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="405.9" y1="26" x2="405.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="406.3" y1="26" x2="406.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="408.4" y1="26" x2="408.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="408.9" y1="26" x2="408.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="408.9" y1="26" x2="408.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="410.6" y1="26" x2="410.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="412.2" y1="26" x2="412.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="421.7" y1="26" x2="421.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="422.0" y1="26" x2="422.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="422.0" y1="26" x2="422.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="425.4" y1="26" x2="425.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="426.3" y1="26" x2="426.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="430.5" y1="26" x2="430.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="430.5" y1="26" x2="430.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="430.8" y1="26" x2="430.8" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="431.0" y1="26" x2="431.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="431.1" y1="26" x2="431.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="431.1" y1="26" x2="431.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="431.1" y1="26" x2="431.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="448.9" y1="26" x2="448.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="448.9" y1="26" x2="448.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="457.5" y1="26" x2="457.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="486.7" y1="26" x2="486.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="487.2" y1="26" x2="487.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="500.6" y1="26" x2="500.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="515.1" y1="70" x2="515.1" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="515.7" y1="70" x2="515.7" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="517.6" y1="70" x2="517.6" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="520.2" y1="70" x2="520.2" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="520.7" y1="70" x2="520.7" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="521.9" y1="70" x2="521.9" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="522.1" y1="26" x2="522.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="522.1" y1="26" x2="522.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="538.3" y1="70" x2="538.3" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="545.4" y1="70" x2="545.4" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="545.5" y1="70" x2="545.5" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="550.8" y1="70" x2="550.8" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="565.9" y1="70" x2="565.9" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="566.3" y1="70" x2="566.3" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="573.9" y1="70" x2="573.9" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="585.3" y1="114" x2="585.3" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="594.6" y1="114" x2="594.6" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="601.7" y1="114" x2="601.7" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="602.7" y1="114" x2="602.7" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="603.8" y1="114" x2="603.8" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="604.1" y1="114" x2="604.1" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="604.1" y1="114" x2="604.1" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="604.9" y1="114" x2="604.9" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <text x="193.3" y="22" text-anchor="start" class="f-mono f-muted">isaacs</text>
  <text x="488.7" y="22" text-anchor="start" class="f-mono f-muted">lukekarrys, gar</text>
  <text x="517.1" y="66" text-anchor="start" class="f-mono f-muted">npm-cli-ops</text>
  <text x="579.3" y="110" text-anchor="end" class="f-mono f-muted">GitHub Actions</text>
  <text x="170.0" y="160" text-anchor="middle" class="f-label f-muted">2011</text>
  <text x="254.4" y="160" text-anchor="middle" class="f-label f-muted">2014</text>
  <text x="338.8" y="160" text-anchor="middle" class="f-label f-muted">2017</text>
  <text x="423.1" y="160" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="507.5" y="160" text-anchor="middle" class="f-label f-muted">2023</text>
  <text x="591.9" y="160" text-anchor="middle" class="f-label f-muted">2026</text>
</svg>
<figcaption>Усе версіі semver з запісаным публікатарам, па штрыху на версію. Імя на рэлізе перайшло ад чалавека да акаўнта каманды, а потым да воркфлоў.</figcaption>
</figure>

Тады я вярнуўся да сваіх 369. Пошук рэестра кажа, хто апублікаваў апошнюю версію кожнага пакета. У мэйнтэйнера, які перавёў свае пакеты на trusted publishing, гэта цяпер `GitHub Actions`. Выходзіць, што маўклівымі ў маім падліку выглядаюць якраз тыя, хто паслухаўся парады пасля чарвяка. Мэйнтэйнер `buffer` значыцца ў спісах пакетаў, якія ўчора выйшлі праз GitHub Actions. Калі лічыць чалавека прысутным пры любым рэлізе яго пакета за 2 гады, лік падае да 213. Гэтае правіла занадта шчодрае. Быць у спісе актыўнага пакета не тое самае, што над ім працаваць. Сумленны адказ недзе паміж 213 і 369. Дакладней з аднаго рэестра я яго атрымаць не здолеў.

<figure class="fig">
<svg viewBox="0 0 640 264" role="img" aria-label="Гарызантальныя палосы для 4996 пакетаў npm, якія спампоўваюць найчасцей: цяпер 1 мэйнтэйнер 2351, першы чалавек і ёсць апошні 2864, першага аўтара няма ў спісе 878, няма рэлізу 2 гады 1798, маўчаць: толькі свае рэлізы 369, маўчаць: любы пакет са спіса 213. Дзве апошнія палосы (пакеты, дзе па двух розных правілах усе мэйнтэйнеры-людзі маўчаць 2 гады) залітыя акцэнтным колерам.">
  <text x="10" y="18" class="f-label f-muted">што рэестр кажа пра 4996 пакетаў</text>
  <line x1="580" y1="28" x2="580" y2="254" class="f-line" stroke-dasharray="3 3"/>
  <text x="580" y="24" text-anchor="end" class="f-label f-muted">4996</text>
  <text x="252" y="51.8" text-anchor="end" class="f-label f-ink">цяпер 1 мэйнтэйнер</text>
  <rect x="262" y="36" width="149.6" height="22" class="f-box"/>
  <text x="419.6" y="51.8" class="f-label f-muted">2351</text>
  <text x="252" y="89.8" text-anchor="end" class="f-label f-ink">першы чалавек і ёсць апошні</text>
  <rect x="262" y="74" width="182.3" height="22" class="f-box"/>
  <text x="452.3" y="89.8" class="f-label f-muted">2864</text>
  <text x="252" y="127.8" text-anchor="end" class="f-label f-ink">першага аўтара няма ў спісе</text>
  <rect x="262" y="112" width="55.9" height="22" class="f-box"/>
  <text x="325.9" y="127.8" class="f-label f-muted">878</text>
  <text x="252" y="165.8" text-anchor="end" class="f-label f-ink">няма рэлізу 2 гады</text>
  <rect x="262" y="150" width="114.4" height="22" class="f-box"/>
  <text x="384.4" y="165.8" class="f-label f-muted">1798</text>
  <text x="252" y="203.8" text-anchor="end" class="f-label f-ink">маўчаць: толькі свае рэлізы</text>
  <rect x="262" y="188" width="23.5" height="22" style="fill:var(--accent)"/>
  <text x="293.5" y="203.8" class="f-label f-muted">369</text>
  <text x="252" y="241.8" text-anchor="end" class="f-label f-ink">маўчаць: любы пакет са спіса</text>
  <rect x="262" y="226" width="13.6" height="22" style="fill:var(--accent)"/>
  <text x="283.6" y="241.8" class="f-label f-muted">213</text>
</svg>
<figcaption>Усяго 4996 пакетаў. Дзве ніжнія палосы: пакеты без рэлізу 2 гады, не deprecated, дзе ніводзін мэйнтэйнер-чалавек за 2 гады нічога не публікаваў у рэестры. Верхняя лічыць толькі рэлізы пад уласным імем, ніжняя любы рэліз пакета, дзе чалавек ёсць у спісе. Праўда паміж імі.</figcaption>
</figure>

Гэтая змена мне падабаецца. Токен, які жыве адзін запуск, украсці значна цяжэй, чым той, што жыве гадамі. Але поле публікатара цяпер называе воркфлоў. Чалавек у лепшым выпадку ёсць у неабавязковым полі `approver`. Я бачыў яго ў `express` 4.22.3. У астатніх выпадках застаецца толькі атэстацыя provenance са спасылкай на запуск у CI. Тая ж змена ашукала і мой уласны падлік кінутых пакетаў.

Я не першы, хто лічыць trusted publishing. sxzz вядзе трэкер OIDC і provenance па ўсім спісе `npm-high-impact`, а гэта больш за 17000 пакетаў. Мае лікі адказваюць толькі на пытанне, чыё імя стаіць на рэлізе.

## Чаго я не правяраў

- Аўтарства кода. Гісторыю git я не адкрываў, таму ў пакета з 1 публікатарам можа быць 40 аўтараў камітаў.
- 5415 з 12197 месцаў мэйнтэйнераў-людзей, 44 працэнты, належаць тым, хто ні разу не публікаваў гэты пакет. Адны рэўюяць і даюць публікаваць CI, іншыя могуць быць ключамі, пра якія ніхто не памятае. Рэестр іх не адрознівае.
- Усе лікі атрыманыя адным праходам 8 кастрычніка 2026. Паўтор у іншы дзень зрушыць хвасты, бо пакеты працягваюць выходзіць.
