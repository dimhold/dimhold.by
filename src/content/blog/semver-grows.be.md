---
title: "У npm 2.14.0 дадалі каманду і npm te перастаў запускаць тэсты"
description: "Я загрузіў 10 301 версію 200 пакетаў npm, ад якіх найбольш залежаць іншыя, і параўнаў экспартаваныя імёны. Мінорныя рэлізы і патчы губляюць імя рэдка, але такіх 73 супраць 64 мажорных. А npm te перастаў працаваць, бо ў npm дадалі каманду."
date: 2016-12-10
lang: be
translationKey: semver-grows
tags: ["dependencies", "open-data"]
---

Я зрабіў пусты праект, у якім тэставы скрыпт друкуе адзін радок. Потым выклікаў `npm te` у дзвюх суседніх версіях npm.

```
$ npm te   # 2.13.5
> x@1.0.0 test ...
> echo tests ran

tests ran

$ npm te   # 2.14.0

Usage: npm <command>
```

Паміж гэтымі версіямі ў npm з'явілася адна новая каманда, `team`. Паводле правілаў semver гэта мінорны рэліз як з падручніка: нешта дадалі, нічога не прыбралі. Але `te` раней было скарачэннем ад `test`, а цяпер пасуе дзвюм камандам і таму не значыць нічога.

Узяўся я за гэта пасля даклада Рыча Хікі `Spec-ulation`, які ён прачытаў 2 снежня на Clojure/conj. Змены ён дзеліць на рост і паломку. Пры росце бібліятэка патрабуе менш або дае больш, пры паломцы наадварот. Пра нумары версій у яго на слайдзе напісана, што новая мінорная значыць "you don't care" (вам усё роўна), а новая мажорная значыць "you're screwed" (вам гамон).

Я слухаў і згаджаўся, але сам гадамі стаўлю карэтку `^` перад кожнай залежнасцю і ні разу не лічыў, што яна прапускае. Вырашыў палічыць.

Лічылі і да мяне. Рамакерс, ван Дзёрсен і Вісер у 2014 годзе зрабілі гэта для Maven значна акуратней. Там прыкладна траціна рэлізаў хоць нешта ды ламала і мажорныя мала адрозніваліся ад мінорных. Менеджар пакетаў Elm параўноўвае тыпы і сам вылічвае нумар за аўтара. Для npm мне хапала чагосьці грубейшага.

## Што я ўзяў

Пакеты ўзятыя са спіса anvaka/npmrank, дзе яны стаяць паводле колькасці залежных ад іх пакетаў, першыя 200 радкоў, рэвізія ад 3 снежня. Версіі я ўзяў усе стабільныя, апублікаваныя да гэтага дня, іх 11 715. Кожную я распакаваў з тымі залежнасцямі, якія яна атрымала б 3 снежня, без install-скрыптоў, і загрузіў праз `require` у Node.js 6.9.1. З 10 301 версіі ўдалося зняць спіс экспартаваных імён, сваіх і ўспадкаваных, а для экспартаванага канструктара яшчэ і метадаў яго прататыпа. Імёны з падкрэсліваннем у пачатку не ў лік. Астатнія 1414 не загрузіліся, 627 з іх таму, што не знайшоўся нейкі модуль.

Кожная версія параўноўваецца са старэйшай з меншых, якія да яе дня ўжо выйшлі. Лічыцца, што рэліз прыбраў імя, калі прапала хаця б адно. Слабейшай праверкі на "дае менш" не прыдумаеш, бо функцыя можа захаваць імя і памяняць усё астатняе. Да прагону я запісаў, чаго чакаю: некалькі працэнтаў для мінорных і патчаў, прыкладна палова для мажорных.

## Што налічылася

| крок | пар | імя знікла | толькі дадаліся | імёны тыя самыя |
|---|---|---|---|---|
| patch | 4305 | 34 | 179 | 4092 |
| minor | 1506 | 39 | 282 | 1185 |
| major | 205 | 64 | 30 | 111 |
| 0.x patch | 2380 | 47 | 189 | 2144 |
| 0.x minor | 700 | 97 | 138 | 465 |
| з 0.x на 1 і вышэй | 83 | 21 | 17 | 45 |

<figure class="fig">
<svg viewBox="0 0 680 314" role="img" aria-label="Доля рэлізаў, у якіх знікла экспартаванае імя, і доля рэлізаў, дзе імёны толькі дадаліся, па відах кроку. patch: 0,8%, 4,2%; minor: 2,6%, 18,7%; 0.x patch: 2,0%, 7,9%; 0.x minor: 13,9%, 19,7%; з 0.x на 1 і вышэй: 25,3%, 20,5%; major: 31,2%, 14,6%.">
  <line x1="160.0" y1="40" x2="160.0" y2="284" class="f-plain"/>
  <text x="160.0" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">0%</text>
  <line x1="285.7" y1="40" x2="285.7" y2="284" class="f-plain"/>
  <text x="285.7" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">10%</text>
  <line x1="411.4" y1="40" x2="411.4" y2="284" class="f-plain"/>
  <text x="411.4" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">20%</text>
  <line x1="537.1" y1="40" x2="537.1" y2="284" class="f-plain"/>
  <text x="537.1" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">30%</text>
  <text x="148.0" y="64.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">patch</text>
  <rect x="160.0" y="46.0" width="9.9" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="176.9" y="57.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">0,8</text>
  <rect x="160.0" y="62.0" width="52.3" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="219.3" y="73.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">4,2</text>
  <text x="148.0" y="104.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">minor</text>
  <rect x="160.0" y="86.0" width="32.6" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="199.6" y="97.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">2,6</text>
  <rect x="160.0" y="102.0" width="235.4" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="402.4" y="113.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">18,7</text>
  <text x="148.0" y="144.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">0.x patch</text>
  <rect x="160.0" y="126.0" width="24.8" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="191.8" y="137.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">2,0</text>
  <rect x="160.0" y="142.0" width="99.8" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="266.8" y="153.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">7,9</text>
  <text x="148.0" y="184.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">0.x minor</text>
  <rect x="160.0" y="166.0" width="174.2" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="341.2" y="177.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">13,9</text>
  <rect x="160.0" y="182.0" width="247.8" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="414.8" y="193.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">19,7</text>
  <text x="148.0" y="224.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">з 0.x на 1 і вышэй</text>
  <rect x="160.0" y="206.0" width="318.1" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="485.1" y="217.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">25,3</text>
  <rect x="160.0" y="222.0" width="257.5" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="424.5" y="233.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">20,5</text>
  <text x="148.0" y="264.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">major</text>
  <rect x="160.0" y="246.0" width="392.5" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="559.5" y="257.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">31,2</text>
  <rect x="160.0" y="262.0" width="184.0" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="351.0" y="273.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">14,6</text>
  <rect x="160.0" y="12.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="179.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">імя знікла</text>
  <rect x="360.0" y="12.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="379.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">імёны толькі дадаліся</text>
</svg>
<figcaption>Доля пар, працэнты. 200 пакетаў npm, ад якіх найбольш залежаць іншыя, версіі да 3 снежня 2016 года.</figcaption>
</figure>

З мінорнымі і патчамі я ўгадаў, 2,6% і 0,8%. Карэтка ў гэтай табліцы выглядае прыстойна. Але мажорных рэлізаў мала. Пачынаючы з версіі 1 імя страцілі 73 мінорныя рэлізы і патчы і толькі 64 мажорныя.

За жыццё адной мажорнай галіны гэтыя малыя долі назапашваюцца. Я ўзяў у кожнай галіне першую і апошнюю версію, якія загрузіліся. У 35 галінах з 319 хаця б аднаго імя з першай версіі ў апошняй ужо няма.

Я думаў, што гэтыя 73 акажуцца вантробамі, якія вылезлі вонкі, і прачытаў спіс. У 13 рэлізах імя, якое прапала, потым вярнулася ў той самай мажорнай галіне, частка такіх выпадкаў падобная да недагляду. chalk 1.1.2 страціў `hasColor` і `stripColor`, а праз 45 хвілін у 1.1.3 яны зноў былі, `aws-sdk` пражыў без `SimpleWorkflow` 11 дзён. Яшчэ 13 прыпадаюць на npm, пра яго ніжэй. У 12 з астатніх 47 імя, якое знікла, ёсць у README старой версіі. Гэта ацэнка зверху, словы накшталт `log` і `then` супадаюць выпадкова, але `node-uuid` 1.4.0 сапраўды выкінуў 3 апісаныя ў дакументацыі генератары выпадковых лікаў. Астатнія 35, як на мяне, збольшага і праўда вантробы, у самім толькі TypeScript іх 7.

У 41 рэлізе з 73 адначасова нешта дадалося. Сярод іх ёсць простыя перайменаванні, у immutable 2.0.2 `fromJSON` стаў `fromJS`. Парада Хікі каштавала б тут аднаго радка: старое імя пакінуць, новае пакласці побач.

## Мажорныя рэлізы, якія нічога не прыбралі

З мажорнымі я прамахнуўся. Чакаў, што імя прападзе ў палове, а прапала ў 64 з 205. Яшчэ ў 22 імя знікла ўзроўнем ніжэй, у аб'екце або прататыпе, ці змяніўся тып экспарту. У астатніх 119 я не бачу ніякіх страт і ў 102 з іх імёны верхняга ўзроўню супадаюць цалкам. lodash 2.0.0 захаваў усе 262 імёны і дадаў 24. У browserify 8 мажорных версій запар, з 6 па 13, адны і тыя ж 9 імён.

<figure class="fig">
<svg viewBox="0 0 680 204" role="img" aria-label="205 мажорных рэлізаў адной паласой з 4 частак. 64: знікла імя верхняга ўзроўню; 22: знікла імя ўзроўнем ніжэй або змяніўся тып; 17: нічога не знікла, імёны дадаліся; 102: імёны верхняга ўзроўню тыя самыя.">
  <rect x="30.0" y="34.0" width="191.6" height="44.0" style="fill:var(--accent);stroke:none"/>
  <text x="125.8" y="26.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">64</text>
  <rect x="223.6" y="34.0" width="64.5" height="44.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="255.8" y="26.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">22</text>
  <rect x="290.1" y="34.0" width="49.4" height="44.0" style="fill:var(--muted);opacity:0.3;stroke:none"/>
  <text x="314.8" y="26.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">17</text>
  <rect x="341.5" y="34.0" width="306.5" height="44.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="494.8" y="26.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">102</text>
  <rect x="30.0" y="98.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="82.0" y="109.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">64</text>
  <text x="94.0" y="109.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">знікла імя верхняга ўзроўню</text>
  <rect x="30.0" y="122.0" width="12.0" height="12.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="82.0" y="133.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">22</text>
  <text x="94.0" y="133.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">знікла імя ўзроўнем ніжэй або змяніўся тып</text>
  <rect x="30.0" y="146.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.3;stroke:none"/>
  <text x="82.0" y="157.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">17</text>
  <text x="94.0" y="157.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">нічога не знікла, імёны дадаліся</text>
  <rect x="30.0" y="170.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="82.0" y="181.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">102</text>
  <text x="94.0" y="181.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">імёны верхняга ўзроўню тыя самыя</text>
</svg>
<figcaption>205 мажорных рэлізаў паводле таго, што відаць у экспарце. У 119 з іх нічога не знікла.</figcaption>
</figure>

Нешта там, мусіць, усё ж зламалі, у опцыях або ў вывадзе, з нумара гэтага не даведаешся. У 10 са 119 падказка ёсць у `package.json`: пакет просіць навейшы Node або новую peer-залежнасць.

"Патрабуе больш" таксама не чакае мажорнай версіі. Пачынаючы з версіі 1 мінімальны Node у `engines` паднялі ў 68 рэлізах, з іх мажорных усяго 17.

## Выпадак з te

Скарачэнні npm будуе сам. Любы прэфікс, які пасуе толькі адной камандзе, працуе як гэтая каманда.

<figure class="fig">
<svg viewBox="0 0 680 180" role="img" aria-label="Прэфіксы каманд npm. У npm 2.13.5 te і tes вядуць да test. У npm 2.14.0 tes вядзе да test, tea вядзе да team, а te не вядзе нікуды, бо падыходзіць абедзвюм камандам.">
  <text x="20.0" y="24.0" text-anchor="start" class="f-mono f-muted" style="font-size:13px">npm 2.13.5</text>
  <text x="370.0" y="24.0" text-anchor="start" class="f-mono f-muted" style="font-size:13px">npm 2.14.0</text>
  <rect x="20" y="44" width="60" height="30" class="f-box"/>
  <text x="50.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">te</text>
  <rect x="20" y="88" width="60" height="30" class="f-box"/>
  <text x="50.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">tes</text>
  <rect x="200" y="66" width="90" height="30" class="f-box"/>
  <text x="245.0" y="86.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">test</text>
  <line x1="80" y1="59" x2="200" y2="78" class="f-line"/>
  <line x1="80" y1="103" x2="200" y2="86" class="f-line"/>
  <rect x="370" y="44" width="60" height="30" class="f-box"/>
  <text x="400.0" y="64.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">te</text>
  <rect x="370" y="88" width="60" height="30" class="f-box"/>
  <text x="400.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">tes</text>
  <rect x="370" y="132" width="60" height="30" class="f-box"/>
  <text x="400.0" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">tea</text>
  <rect x="550" y="88" width="90" height="30" class="f-box"/>
  <text x="595.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">test</text>
  <rect x="550" y="132" width="90" height="30" class="f-box"/>
  <text x="595.0" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">team</text>
  <line x1="430" y1="103" x2="550" y2="103" class="f-line"/>
  <line x1="430" y1="147" x2="550" y2="147" class="f-line"/>
  <line x1="430" y1="59" x2="520" y2="59" class="f-line" style="stroke-dasharray:4 4"/>
  <text x="532.0" y="63.0" text-anchor="start" class="f-mono f-accent" style="font-size:13px">нічога</text>
</svg>
<figcaption>Новая каманда адбірае кароткі прэфікс у старой.</figcaption>
</figure>

Таму кожная дададзеная каманда адбірае ў суседзяў частку прэфіксаў. `logout` у 2.6.0 адняў `npm log`, які значыў login. Пасля з'яўлення `install-test` у 3.4.0 нават `instal` нікуды не вядзе. У 2.1.12 npm вывучыў памылку друку `verison` і забыў `ver`. У 2.1.9 сярод прэфіксаў пачаў улічвацца псеўданім з памылкай друку `isntall` і `npm is` перастаў значыць issues, а каментарый у гэтым кодзе кажа "we have our reasons" (у нас свае прычыны). З 13 рэлізаў npm у маім спісе так зроблены 11, у двух іншых прыбралі саму каманду, `submodule` і `faq`, абодва разы ў патчы.

Паводле азначэння Хікі гэта паломка, npm дае менш, чым раней. У тым самым дакладзе ён кажа, што дадаць нешта ў калекцыю гэта рост і кропка. А тут дададзенае імя адабрала старое. Я б таксама палічыў гэта ростам і падняў мінорную версію.

## Дзе прагон зламаўся

У першым прагоне 25 пакетаў загрузіліся нармальна, потым у optimist адна версія з 39, а потым нічога ў наступных 38 пакетаў. optimist 0.1.4 устаўляе 2 элементы ў пачатак `process.argv`. Мая проба брала адтуль шлях для вываду ўжо пасля `require` і запісала JSON паверх уласнага зыходнага кода. Цяпер яна спачатку капіюе аргументы і ляжыць у каталогу толькі для чытання.

З пошукам па README таксама выйшла памылка. Рэгулярны выраз я збіраў з радка і адваротная касая рыса ў `\w` там згубілася, таму `obj` знаходзілася ўнутры слова object і рэлізаў налічылася 15 замест 12.

## Чаго я не правяраў

Да прагону я запісаў для пар просты парадак semver, але тады бэкпарт параўноўваецца з версіямі, якія выйшлі пазней за яго, таму правіла я памяняў, калі пісаў аналіз. Паводле першага правіла ў радку minor 38 страт замест 39.

Паводзін, аргументаў і опцый гэтым спосабам не ўбачыш. У пакетаў, якія экспартуюць адну голую функцыю, імён няма, таму ў табліцу яны не трапілі. 4 з 13 пар npm гэта адна змена, палічаная 4 разы, бо ў версій npm таго часу дзіўныя даты публікацыі ў рэестры, адзін такі паўтор ёсць і ў immutable. Без іх замест 73 будзе 69. Як выглядае хвост npm за першымі дзвюма сотнямі, я не ведаю. І не глядзеў, ці карыстаўся хто-небудзь імёнамі, якія прапалі, тым жа `npm te`.
