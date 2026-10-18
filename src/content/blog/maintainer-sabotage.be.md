---
title: "У студзені colors і faker зламаў іх уласны аўтар. У снежні абодва імёны ўсё яшчэ належаць таму самаму акаўнту"
description: "У студзені аўтар colors і faker зламаў абодва пакеты. Я запусціў код, які застаўся, у тым ліку тарбол 1.4.2 з Wayback Machine, на 9 топавых пакетах npm, што залежалі ад colors. З 1.4.2 завіслі б 7 з іх, большасць адрэагавала за 5 дзён. Але ў снежні абодва імёны ўсё яшчэ ў аўтара і большая частка спамповак ідзе туды ж."
date: 2022-12-27
lang: be
translationKey: maintainer-sabotage
tags: ["dependencies", "reliability"]
---
8 студзеня аўтар colors апублікаваў версію `1.4.44-liberty-2`. Яна друкавала "LIBERTY LIBERTY LIBERTY", сцяг з сімвалаў ASCII і потым смецце ў бясконцым цыкле. За 3 дні да гэтага выйшаў faker 6.6.6, у якім кода не было зусім. У трэдах пасля гэтага спрачаліся, ці меў аўтар на гэта права. Мой адказ на такія гісторыі заўсёды быў стандартны: камітаваць lockfile і пініць версіі. Але колькі праектаў гэта насамрэч закранула, я не ўяўляў.

У лістападзе 2020 года той самы аўтар адкрыў на GitHub issue з назвай "No more free work from Marak". Кампаніям там прапаноўваліся 2 варыянты: гадавы кантракт з аўтарам або форк, "fork the project and have someone else work on it". Пакуль год не скончыўся, я вырашыў праверыць, як далёка дацягваецца адзін мейнтэйнер, які ламае ўласны пакет. І які з 2 варыянтаў у выніку спраўдзіўся.

## Першая версія, якую ўдалося прачытаць

Зламаных версій у npm больш няма. Рэестр яшчэ паказвае `1.4.44-liberty-2`, 1.4.1 і 1.4.2 з часам публікацыі, але тарболы выдалены. Яшчэ 4 месцы, якія я праверыў, у тым ліку npmmirror і jsDelivr, адказваюць 404. Таму я пачаў з гісторыі git у `Marak/colors.js`. За 3 хвіліны да каміта, які падымае версію да liberty-2, іншы каміт дадае 10 радкоў у `lib/index.js`. Яны нават не парсяцца. Каміт "Fix bug" праз 2 хвіліны прыбірае лішнюю кропку з коскай. Пасля праўкі:

```js
/* remove this line after testing */
let am = require('../lib/custom/american');
am();
for (let i = 666; i < Infinity; i++) {
  if (i % 333) {
    // console.log('testing'.zalgo.rainbow)
  }
  console.log('testing testing testing testing testing testing testing'.zalgo)
}
```

Я запусціў гэта на Node 16.13.1, тагачасным LTS на 8 студзеня. `require('colors')` надрукаваў каля 60 МБ, пакуль яго не забіў мой таймаўт у 3 секунды. Да наступнага радка майго скрыпта ён так і не дайшоў. `require('colors/safe')`, уваход, які не чапае `String.prototype`, вярнуўся за 0,1 секунды і нічога не надрукаваў. Прычына ў тым, што `safe.js` грузіць `lib/colors.js` наўпрост, а цыкл стаіць толькі ў `lib/index.js`.

Далей я праверыў, хто ўвогуле паставіў бы liberty-2. Гэта прэрэліз, а дыяпазон накшталт `^1.4.0` прэрэлізы не бярэ ніколі. Я правяраў праз `npm-pick-manifest` 6.1.1, гэта той код, якім npm 8.1 выбірае версію. Калі `latest` паказвае на прэрэліз, `^1.4.0` усё роўна дае 1.4.0. Зламаную версію даюць толькі `latest` і `*`. У Live Server у package.json стаяла `"colors": "latest"`. Першы каментар у issue пра паломку пакінуў якраз адзін з карыстальнікаў Live Server.

Спіс пакетаў я ўзяў з `npm-high-impact` 1.1.0, тую яго частку, дзе не менш за 1 мільён спамповак у тыдзень, гэта 4366 пакетаў npm. Спіс лістападаўскі, значыць гэта топ канца года, а не студзеня. У 31 з іх colors у нейкі момант быў у залежнасцях. На 8 студзеня наўпрост ён быў у 9, разам яны мелі 21 мільён спамповак за першы тыдзень студзеня. Ніводзін з 9 liberty-2 не атрымаў бы. 8 з іх грузяць толькі `colors/safe`. Толькі `cli-progress` грузіць звычайны `colors`.

Да гэтага моманту палова паста была напісана. У загалоўку стаяла, што завісне 1 з 9 топавых пакетаў. Я зыходзіў з таго, што ў 1.4.2 той самы цыкл, што ў liberty-2, хоць гэтага не правяраў.

## 1.4.2

1.4.1 выйшла тым самым вечарам, а 1.4.2 праз дзень. Гэта звычайныя версіі, таму пры свежай устаноўцы без lockfile усе дыяпазоны з `^` ішлі на іх. 7 з 9 атрымлівалі 1.4.2. Выключэнні толькі `cli-table` (пін на 1.0.3) і `jasmine-spec-reporter` (пін на 1.4.0). Паводле паведамлення DABH ад 11 студзеня (каміты ў colors з 2018 года), npm гэтыя версіі выдаліў. Паводле бюлетэня бяспекі GitHub ад 10 студзеня, цыкл ёсць ва ўсіх 3 версіях, але дзе менавіта ў кодзе, не сказана.

10 студзеня Wayback Machine захаваў тарбол 1.4.2. Я звярыў яго з хешам integrity з lockfile рэпазіторыя `ngx-ui-scroll`. Там 1.4.2 паставілі 9 студзеня і ў той жа дзень адкацілі з паведамленнем "tests don't work with 1.4.2". Хеш супадае. У `lib/index.js` той самы цыкл. У `safe.js` ён таксама ёсць, пасля новага каментара:

```js
/* attempting to patch existing bug */
```

Выходзіць, `colors/safe` быў бяспечным усяго 1 дзень. Я паставіў кожны з 9 пакетаў у версіі, бягучай на 8 студзеня, праз npm 8.1.2. Потым замяніў у дрэве ўсе копіі colors на 1.4.2 і запусціў на тым самым Node. 3 з іх завісаюць на `require`: logform, `cli-progress` і тэставы ранер Playwright. Астатнія 4 як бібліятэкі загружаюцца нармальна і завісаюць, як толькі загружаецца частка, што працуе з колерам. У каманд `http-server` і jscodeshift гэта сам запуск. karma завісае, калі загружае свой рэпарцёр, а `cli-table3` на першай табліцы з каляровым загалоўкам. 2 пакеты з пінам працуюць.

<figure class="fig">
<svg viewBox="0 0 680 266" role="img" aria-label="9 пакетаў са спісу 4366 найбольш спампоўваных пакетаў npm, якія на 8 студзеня 2022 года наўпрост залежалі ад colors. Для кожнага: яго дыяпазон colors, версія, якую npm выбірае для яго дыяпазону пасля выхаду 1.4.2, што адбылося, калі я запусціў яго з 1.4.2, і ад чаго ён залежыць у канцы 2022 года. logform: дыяпазон ^1.2.1, npm выбірае 1.4.2, завісае на require, у канцы 2022 @colors/colors. cli-progress: дыяпазон ^1.1.2, npm выбірае 1.4.2, завісае на require, у канцы 2022 без colors. @playwright/test: дыяпазон ^1.4.0, npm выбірае 1.4.2, завісае на require, у канцы 2022 без colors. cli-table3: дыяпазон ^1.1.2, npm выбірае 1.4.2, завісае пры выкліку, у канцы 2022 @colors/colors. karma: дыяпазон ^1.4.0, npm выбірае 1.4.2, завісае пры выкліку, у канцы 2022 @colors/colors. jscodeshift: дыяпазон ^1.1.2, npm выбірае 1.4.2, завісае пры выкліку, у канцы 2022 без colors. http-server: дыяпазон ^1.4.0, npm выбірае 1.4.2, завісае пры выкліку, у канцы 2022 без colors. cli-table: дыяпазон 1.0.3, npm выбірае 1.0.3, працуе, у канцы 2022 пін 1.0.3. jasmine-spec-reporter: дыяпазон 1.4.0, npm выбірае 1.4.0, працуе, у канцы 2022 пін 1.4.0.">
  <text x="16" y="26" class="f-label f-muted">пакет</text>
  <text x="214" y="26" class="f-label f-muted">дыяпазон</text>
  <text x="300" y="26" class="f-label f-muted">на 9 студз.</text>
  <text x="392" y="26" class="f-label f-muted">з 1.4.2</text>
  <text x="540" y="26" class="f-label f-muted">канец 2022</text>
  <line x1="16" y1="34" x2="664" y2="34" class="f-plain"/>
  <rect x="8" y="42" width="664" height="22" rx="3" class="f-box"/>
  <text x="16" y="58" class="f-mono f-ink" style="font-size:12px">logform</text>
  <text x="214" y="58" class="f-mono f-muted" style="font-size:12px">^1.2.1</text>
  <text x="300" y="58" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="58" class="f-mono f-accent" style="font-size:12px;font-weight:600">завісае на require</text>
  <text x="540" y="58" class="f-mono f-ink" style="font-size:12px">@colors/colors</text>
  <rect x="8" y="66" width="664" height="22" rx="3" class="f-box"/>
  <text x="16" y="82" class="f-mono f-ink" style="font-size:12px">cli-progress</text>
  <text x="214" y="82" class="f-mono f-muted" style="font-size:12px">^1.1.2</text>
  <text x="300" y="82" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="82" class="f-mono f-accent" style="font-size:12px;font-weight:600">завісае на require</text>
  <text x="540" y="82" class="f-mono f-ink" style="font-size:12px">без colors</text>
  <rect x="8" y="90" width="664" height="22" rx="3" class="f-box"/>
  <text x="16" y="106" class="f-mono f-ink" style="font-size:12px">@playwright/test</text>
  <text x="214" y="106" class="f-mono f-muted" style="font-size:12px">^1.4.0</text>
  <text x="300" y="106" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="106" class="f-mono f-accent" style="font-size:12px;font-weight:600">завісае на require</text>
  <text x="540" y="106" class="f-mono f-ink" style="font-size:12px">без colors</text>
  <text x="16" y="130" class="f-mono f-ink" style="font-size:12px">cli-table3</text>
  <text x="214" y="130" class="f-mono f-muted" style="font-size:12px">^1.1.2</text>
  <text x="300" y="130" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="130" class="f-mono f-accent" style="font-size:12px">завісае пры выкліку</text>
  <text x="540" y="130" class="f-mono f-ink" style="font-size:12px">@colors/colors</text>
  <text x="16" y="154" class="f-mono f-ink" style="font-size:12px">karma</text>
  <text x="214" y="154" class="f-mono f-muted" style="font-size:12px">^1.4.0</text>
  <text x="300" y="154" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="154" class="f-mono f-accent" style="font-size:12px">завісае пры выкліку</text>
  <text x="540" y="154" class="f-mono f-ink" style="font-size:12px">@colors/colors</text>
  <text x="16" y="178" class="f-mono f-ink" style="font-size:12px">jscodeshift</text>
  <text x="214" y="178" class="f-mono f-muted" style="font-size:12px">^1.1.2</text>
  <text x="300" y="178" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="178" class="f-mono f-accent" style="font-size:12px">завісае пры выкліку</text>
  <text x="540" y="178" class="f-mono f-ink" style="font-size:12px">без colors</text>
  <text x="16" y="202" class="f-mono f-ink" style="font-size:12px">http-server</text>
  <text x="214" y="202" class="f-mono f-muted" style="font-size:12px">^1.4.0</text>
  <text x="300" y="202" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="202" class="f-mono f-accent" style="font-size:12px">завісае пры выкліку</text>
  <text x="540" y="202" class="f-mono f-ink" style="font-size:12px">без colors</text>
  <text x="16" y="226" class="f-mono f-ink" style="font-size:12px">cli-table</text>
  <text x="214" y="226" class="f-mono f-muted" style="font-size:12px">1.0.3</text>
  <text x="300" y="226" class="f-mono f-muted" style="font-size:12px">1.0.3</text>
  <text x="392" y="226" class="f-mono f-muted" style="font-size:12px">працуе</text>
  <text x="540" y="226" class="f-mono f-ink" style="font-size:12px">пін 1.0.3</text>
  <text x="16" y="250" class="f-mono f-ink" style="font-size:12px">jasmine-spec-reporter</text>
  <text x="214" y="250" class="f-mono f-muted" style="font-size:12px">1.4.0</text>
  <text x="300" y="250" class="f-mono f-muted" style="font-size:12px">1.4.0</text>
  <text x="392" y="250" class="f-mono f-muted" style="font-size:12px">працуе</text>
  <text x="540" y="250" class="f-mono f-ink" style="font-size:12px">пін 1.4.0</text>
</svg>
<figcaption>Версіі, бягучыя на 8 студзеня 2022 года, версіі па дыяпазонах выбраны так, як гэта робіць npm 8.1, запуск на Node 16.13.1, усе копіі colors заменены на 1.4.2 з Wayback Machine.</figcaption>
</figure>

Што рабіла 1.4.1, я не ведаю: яе копію я не знайшоў нідзе, нават у Wayback Machine. У `ngx-ui-scroll` 1.4.1 праляжала ў lockfile 17 гадзін. За гэты час там былі каміты з праўкай тэстаў і канфіга karma. Менавіта на яе яны спачатку і адкаціліся. Тэсты ў іх ідуць праз karma, а яна грузіць толькі `colors/safe`. Гэта адпавядала б версіі 1.4.1, у якой цыкл стаіць толькі ў `lib/index.js`. Але праз 90 хвілін яны перайшлі на 1.4.0, не растлумачыўшы чаму. І гэта 1 рэпазіторый.

## Як хутка сышлі

7 з 9 адрэагавалі за 5 дзён. `cli-progress` выпусціў версію без colors 9 студзеня, `cli-table3` у той жа дзень запініў 1.4.0. Яшчэ 4 падцягнуліся 10 студзеня, сярод іх logform і Playwright. karma зрабіла гэта 13 студзеня. Да канца года 3 з 9 залежаць ад `@colors/colors`, форка, які DABH выпусціў у лютым. winston, які атрымліваў colors праз logform, таксама перайшоў на яго. DABH да таго ж мейнтэйнер logform і winston.

У faker таксама з'явіўся форк ад супольнасці, `@faker-js/faker`, праз 5 дзён пасля 6.6.6. Сам faker не быў у звычайных dependencies ні ў аднаго з 4366. Ён жыве ў devDependencies, а 6.6.6 гэта новая мажорная версія, таму `^5.5.3` па-ранейшаму дае 5.5.3.

## Імя застаецца

Вось гэта мне здаецца дзіўным. На npmjs.com у снежні ў colors стаіць версія 1.4.0, у faker 6.6.6. У абодвух 1 мейнтэйнер, marak. Зламаныя версіі colors выдалілі, але імя нікому не перадалі. faker 6.6.6 дагэтуль `latest`, а кода ў ім няма. README з аднаго радка пра Аарона Шварца, а ў `.github/FUNDING.yml` усё гэтак жа `github: marak`. `npm install faker` сёння ставіць пакет, у якім `require('faker')` падае з `MODULE_NOT_FOUND`.

<figure class="fig">
<svg viewBox="0 0 680 296" role="img" aria-label="Спампоўкі npm па месяцах са студзеня 2021 па лістапад 2022 года. colors: 96,7 млн у лістападзе 2021, 88,5 млн у лістападзе 2022. @colors/colors: з лютага 2022, 47,7 млн у лістападзе 2022. faker: 11,8 млн у лістападзе 2021, 11,0 млн у лістападзе 2022. @faker-js/faker: са студзеня 2022, 6,6 млн у лістападзе 2022.">
  <text x="70" y="16" class="f-mono f-muted" style="font-size:11px">млн у месяц</text>
  <line x1="70" y1="150.0" x2="600" y2="150.0" class="f-plain"/>
  <text x="64" y="154.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="103.8" x2="600" y2="103.8" class="f-plain"/>
  <text x="64" y="107.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="70" y1="57.7" x2="600" y2="57.7" class="f-plain"/>
  <text x="64" y="61.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="359.1" y1="26" x2="359.1" y2="150" class="f-line" style="stroke-dasharray:3 3"/>
  <polyline points="70.0,74.5 94.1,68.1 118.2,53.3 142.3,63.8 166.4,64.1 190.5,64.8 214.5,69.0 238.6,65.8 262.7,63.2 286.8,57.6 310.9,60.8 335.0,61.1 359.1,47.5 383.2,48.6 407.3,36.5 431.4,60.5 455.5,65.7 479.5,61.9 503.6,74.4 527.7,64.8 551.8,67.6 575.9,71.1 600.0,68.3" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <polyline points="383.2,142.9 407.3,132.2 431.4,133.6 455.5,127.1 479.5,120.6 503.6,121.3 527.7,114.3 551.8,112.2 575.9,110.2 600.0,106.0" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <text x="606" y="72.3" class="f-mono f-ink" style="font-size:11px">colors</text>
  <text x="606" y="110.0" class="f-mono f-accent" style="font-size:11px">@colors</text>
  <line x1="70" y1="265.0" x2="600" y2="265.0" class="f-plain"/>
  <text x="64" y="269.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="236.4" x2="600" y2="236.4" class="f-plain"/>
  <text x="64" y="240.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">5</text>
  <line x1="70" y1="207.9" x2="600" y2="207.9" class="f-plain"/>
  <text x="64" y="211.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="359.1" y1="181" x2="359.1" y2="265" class="f-line" style="stroke-dasharray:3 3"/>
  <polyline points="70.0,224.0 94.1,219.1 118.2,209.1 142.3,212.8 166.4,212.8 190.5,207.5 214.5,207.2 238.6,205.7 262.7,201.3 286.8,200.0 310.9,197.4 335.0,202.6 359.1,197.6 383.2,200.0 407.3,191.4 431.4,201.7 455.5,199.4 479.5,198.2 503.6,204.1 527.7,194.8 551.8,199.1 575.9,201.2 600.0,202.1" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <polyline points="359.1,264.1 383.2,261.0 407.3,256.6 431.4,253.4 455.5,246.3 479.5,241.8 503.6,240.9 527.7,231.5 551.8,231.0 575.9,230.1 600.0,227.3" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <text x="606" y="206.1" class="f-mono f-ink" style="font-size:11px">faker</text>
  <text x="606" y="231.3" class="f-mono f-accent" style="font-size:11px">@faker-js</text>
  <text x="70" y="284" text-anchor="start" class="f-mono f-muted" style="font-size:11px">студз. 2021</text>
  <text x="359.1" y="284" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">студз. 2022</text>
  <text x="600" y="284" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ліст. 2022</text>
</svg>
<figcaption>API спамповак npm, сумы за месяц. Вертыкальная лінія — студзень 2022.</figcaption>
</figure>

Спампоўкі таксама амаль не зрушыліся. У лістападзе ў colors было 88,5 мільёна спамповак, на 8% менш, чым у лістападзе 2021 года, а ў `@colors/colors` 47,7 мільёна. У faker 11,0 мільёна, на 7% менш, чым год таму, супраць 6,6 мільёна ў форка. API npm не дзеліць спампоўкі па версіях, таму колькі з 11 мільёнаў прыпадае на старую 5.5.3, я сказаць не магу.

З 2 варыянтаў 2020 года я бачу форк. Топавыя пакеты адрэагавалі за тыдзень, у асноўным пінам на 1.4.0. Але імя засталося ў аўтара. Большая частка спамповак дагэтуль ідзе на гэтае імя. Форк colors выпусціў DABH, чые ўласныя logform і winston ад colors залежалі. Падазраю, што так трымаецца шмат інфраструктуры, але 9 пакетаў занадта мала, каб гэта сцвярджаць.

## Чаго я не правяраў

Транзітыўных залежных за межамі топу. Хутчэй за ўсё, большая частка з 88 мільёнаў спамповак colors прыходзіць адтуль. Колькі праектаў мелі lockfile і так і не ўбачылі зламаных версій. Код 1.4.1. І дакладны час, калі npm выдаліў 3 версіі, бо рэестр яго не паказвае.
