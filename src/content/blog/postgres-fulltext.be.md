---
title: "PostgreSQL знайшоў слова \"массив\" у 23 паведамленнях з 89 і Lucene рэжа яго гэтак жа"
description: "Я загрузіў у PostgreSQL 9.4.1 паведамленні 95 127 камітаў Linux і рускія паведамленні самога PostgreSQL, каб пабачыць, дзе ўбудаваны пошук перастае быць танным або правільным. Слова з 9652 камітаў абышлося ў меншую колькасць зваротаў да старонак, чым слова з 3002. На 267 апісак з 300 паўнатэкставы пошук не знайшоў нічога. Рускі стэмер разрывае 3 звычайныя назоўнікі, а Lucene 4.10.4 дала тыя ж асновы на 16 354 словаформах."
date: 2015-03-28
lang: be
translationKey: postgres-fulltext
tags: ["databases", "performance", "text"]
---

```
=# select plainto_tsquery('russian', 'массив');
 'масс'
=# select to_tsvector('russian', 'массива');
 'массив':1
```

Назоўны склон і родны, а лексемы розныя. Я загрузіў у базу рускі каталог паведамленняў самога PostgreSQL, 4172 штукі з `ru.po`. Потым пашукаў у ім масіў. Слова ў нейкай форме ёсць у 89 паведамленнях. Запыт знайшоў 23.

Я часта паўтараю параду пачынаць з паўнатэкставага пошуку ў базе, а Elasticsearch ставіць, калі базы перастане хапаць. Але як выглядае гэтае "перастане хапаць", я сказаць не мог. Лікаў у мяне не было.

Паасобку ўсё вядома. У дакументацыі, у 12.3.3, наўпрост напісана, што ранжыраванне чытае `tsvector` кожнага знойдзенага дакумента. Караткоў і Бартуноў на PGConf.EU 2012 паказвалі, як сартаваць унутры GIN. З той працы ў 9.4 увайшлі сціснутыя спісы і fast scan, сартавання пакуль няма. Рашыд Белайд летась пісаў, што пошуку ў Postgres цалкам хапае. Мне хацелася пабачыць межы на адным корпусе.

## На чым мераў

PostgreSQL 9.4.1, `shared_buffers` 512 МБ, `work_mem` 16 МБ, віртуальная машына з 2 ядрамі. Корпус гэта 95 127 паведамленняў камітаў Linux ад v3.12 да v4.0-rc5, без зліццяў і без радкоў накшталт `Signed-off-by`. Тэксту там 34,6 МБ. Калонка `tsvector` займае 38,0 МБ, больш за сам тэкст, у сярэднім 26 лексем на паведамленне. Індэкс GIN займае 19,8 МБ.

Скрыпт загрузкі перадаваў `psql` 5 каманд пяццю ключамі `-c`. Ён надрукаваў `VACUUM`, памылак не было, а першы ж запыт паведаміў, што індэкса няма. psql 9.4 выконвае толькі апошні `-c`.

## Дзе плацяць за сартаванне

Я ўзяў 9 асноў рознай частаты і лічыў звароты да старонак праз `EXPLAIN (ANALYZE, BUFFERS)`. Да прагону запісаў, што мяжой лічу месца, дзе першая дзясятка паводле `ts_rank` чытае больш за 10% табліцы. Разам з TOAST у табліцы 9205 старонак. Слову з 300 камітаў спатрэбілася ўжо 1022 звароты, а гэта 0,3% корпуса. Аснове `use`, якая ёсць у 33 679 камітах, спатрэбілася 15 104. Гэта больш, чым старонак ва ўсёй табліцы, бо да некаторых вяртаюцца шмат разоў.

Я чакаў, што гэты лік расце разам з колькасцю супадзенняў. А паміж дзвюма асновамі ён упаў.

<figure class="fig">
<svg viewBox="0 0 680 318" role="img" aria-label="Звароты да старонак пры выбарцы першых 10 паводле ts_rank для 5 слоў, у парадку камітаў і пасля перамешвання. pid, камітаў 1000: 3173 у парадку камітаў, 3276 пасля перамешвання; pass, камітаў 3002: 3558 у парадку камітаў, 3815 пасля перамешвання; stage, камітаў 9652: 2409 у парадку камітаў, 6114 пасля перамешвання; remov, камітаў 18 353: 9535 у парадку камітаў, 10 535 пасля перамешвання; use, камітаў 33 679: 15 104 у парадку камітаў, 15 535 пасля перамешвання. Частка, якая прыпадае на TOAST, ад перамешвання амаль не мяняецца.">
  <line x1="600.0" y1="268" x2="600.0" y2="276" class="f-plain"/>
  <line x1="482.5" y1="268" x2="482.5" y2="276" class="f-plain"/>
  <line x1="365.0" y1="268" x2="365.0" y2="276" class="f-plain"/>
  <line x1="247.5" y1="268" x2="247.5" y2="276" class="f-plain"/>
  <line x1="130.0" y1="32" x2="130.0" y2="276" class="f-plain"/>
  <text x="120.0" y="52.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">pid</text>
  <text x="120.0" y="67.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1000</text>
  <rect x="130.0" y="40.0" width="25.2" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="155.2" y="40.0" width="68.0" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="229.2" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3173</text>
  <rect x="130.0" y="58.0" width="28.1" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="158.1" y="58.0" width="68.2" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="232.2" y="69.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3276</text>
  <text x="120.0" y="100.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">pass</text>
  <text x="120.0" y="115.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3002</text>
  <rect x="130.0" y="88.0" width="68.1" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="198.1" y="88.0" width="36.4" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="240.5" y="99.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3558</text>
  <rect x="130.0" y="106.0" width="75.7" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="205.7" y="106.0" width="36.4" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="248.1" y="117.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3815</text>
  <text x="120.0" y="148.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">stage</text>
  <text x="120.0" y="163.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">9652</text>
  <rect x="130.0" y="136.0" width="60.5" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="190.5" y="136.0" width="10.3" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="206.8" y="147.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">2409</text>
  <rect x="130.0" y="154.0" width="169.4" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="299.4" y="154.0" width="10.2" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="315.6" y="165.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">6114</text>
  <text x="120.0" y="196.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">remov</text>
  <text x="120.0" y="211.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">18 353</text>
  <rect x="130.0" y="184.0" width="193.6" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="323.6" y="184.0" width="86.5" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="416.1" y="195.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">9535</text>
  <rect x="130.0" y="202.0" width="223.0" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="353.0" y="202.0" width="86.5" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="445.5" y="213.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">10 535</text>
  <text x="120.0" y="244.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">use</text>
  <text x="120.0" y="259.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">33 679</text>
  <rect x="130.0" y="232.0" width="233.0" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="363.0" y="232.0" width="210.7" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="579.7" y="243.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">15 104</text>
  <rect x="130.0" y="250.0" width="246.1" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="376.1" y="250.0" width="210.2" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="592.3" y="261.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">15 535</text>
  <text x="130.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="247.5" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4000</text>
  <text x="365.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8000</text>
  <text x="482.5" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12 000</text>
  <text x="600.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">16 000</text>
  <text x="120.0" y="20.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">камітаў</text>
  <rect x="130.0" y="12.0" width="12.0" height="10.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <text x="148.0" y="21.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">індэкс і куча</text>
  <rect x="290.0" y="12.0" width="12.0" height="10.0" style="fill:var(--accent);stroke:none"/>
  <text x="308.0" y="21.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">TOAST</text>
  <text x="600.0" y="308.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">зваротаў да старонак</text>
</svg>
<figcaption>Што чытае першая дзясятка паводле ts_rank. Шэрая частка гэта індэкс і куча, каляровая гэта TOAST. Верхні слупок у пары для табліцы ў парадку камітаў, ніжні для тых жа радкоў уперамешку.</figcaption>
</figure>

`pass` ёсць у 3002 камітах і каштуе 3558 зваротаў. `stage` ёсць у 9652 і каштуе 2409. Гэта аснова слова staging, з яго пачынаюцца 9070 такіх загалоўкаў. Патчы ў staging ідуць доўгімі серыямі, таму ў табліцы ляжаць побач, а паведамленні ў іх кароткія, 18 лексем супраць 44 у `pass`. Я перапісаў табліцу ў выпадковым парадку. У `stage` частка, якая прыпадае на індэкс і кучу, вырасла з 2059 да 5766, а ўсяго стала 6114. У `pass` толькі 3815.

Другая частка цаны гэта TOAST. У доўгага паведамлення доўгі `tsvector`, ён з'язджае з радка і за кожны такі трэба заплаціць яшчэ прыкладна 3 звароты. Я зверыўся з `pg_statio_user_tables` і калонка пра індэкс TOAST не сышлася, яна ўдвая большая, чым дазваляе `EXPLAIN`. Прадстаўленне злучае табліцу з усімі яе індэксамі і потым сумуе, таму гэтая калонка множыцца на іх колькасць. У мяне іх 2. Я дадаў трэці і на тым жа запыце замест 2964 стала 4446, а функцыя пад прадстаўленнем абодва разы налічыла 1482.

Па часе пакуль можна трываць. Самы павольны пошук заняў 42 мс, калі ўсё ў памяці, на перамяшанай табліцы 46. `ILIKE '%deadlock%'` заняў 451. Звароты стануць важныя, калі табліца ў памяць не ўлезе.

Для пошуку без сартавання я абяцаў менш за 100 старонак на любым слове. `stage` прачытаў 281: пад `LIMIT 10` планавальнік выбраў паслядоўнае чытанне, а ў пачатку табліцы супадзенняў амаль не было. У перамяшанай хапіла 25.

## Рэдкае слова нічога не важыць

`ts_rank` нічога не ведае пра калекцыю цалкам. Я склаў 50 выпадковых пар з рэдкай асновы (ад 10 да 30 камітаў) і частай (ад 3000 да 10 000) і запытаў адну АБО другую. Рэдкім словам дасталося 67 месцаў з 500 у першых дзясятках. У 14 парах не дасталося ніводнага. Я чакаў, што такіх будзе больш за палову, так што па змаўчанні ўсё мякчэй, чым я думаў. З нармалізацыяй 1, на лагарыфм даўжыні дакумента, іх ужо 34 з 50.

## Апіскам патрэбная свая табліца

Самае відавочнае тут `subject % 'schedulr'` з pg_trgm. Вярнулася 0 радкоў. Нават правільнае `scheduler` вярнула 2, хоць паўнатэкставы пошук знаходзіць яго ў 159 загалоўках, бо падабенства лічыцца з усім загалоўкам адразу.

Тады я сабраў праз `ts_stat` асобны слоўнік, 11 198 слоў даўжынёй ад 5 да 14 літар, з трыграмным індэксам. Потым узяў 300 слоў, якія ёсць хаця б у 50 камітах. У кожным зрабіў адну выпадковую памылку. На 267 з іх паўнатэкставы пошук не знайшоў нічога. Трыграмы паставілі патрэбнае слова першым у 234 выпадках, у першыя 5 яно трапіла ў 282. Я абяцаў 80% на першым месцы, выйшла 78%. Калі адсартаваць кандыдатаў паводле `levenshtein`, будзе 244.

<figure class="fig">
<svg viewBox="0 0 680 172" role="img" aria-label="Па 75 апісак кожнага віду, колькі разоў патрэбнае слова стаяла першым і колькі разоў трапіла ў першыя 5. лішняя літара: 73 і 75; не тая літара: 63 і 75; прапушчаная літара: 61 і 75; літары памяняліся месцамі: 37 і 57.">
  <text x="160.0" y="29.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">лішняя літара</text>
  <rect x="170.0" y="14.0" width="418.5" height="22.0" style="fill:var(--accent);stroke:none"/>
  <rect x="588.5" y="14.0" width="11.5" height="22.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="608.0" y="29.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">73 / 75</text>
  <text x="160.0" y="63.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">не тая літара</text>
  <rect x="170.0" y="48.0" width="361.2" height="22.0" style="fill:var(--accent);stroke:none"/>
  <rect x="531.2" y="48.0" width="68.8" height="22.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="608.0" y="63.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">63 / 75</text>
  <text x="160.0" y="97.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">прапушчаная</text>
  <rect x="170.0" y="82.0" width="349.7" height="22.0" style="fill:var(--accent);stroke:none"/>
  <rect x="519.7" y="82.0" width="80.3" height="22.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="608.0" y="97.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">61 / 75</text>
  <text x="160.0" y="131.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">перастаноўка</text>
  <rect x="170.0" y="116.0" width="212.1" height="22.0" style="fill:var(--accent);stroke:none"/>
  <rect x="382.1" y="116.0" width="114.7" height="22.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="608.0" y="131.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">37 / 57</text>
  <line x1="170" y1="146" x2="600" y2="146" class="f-plain"/>
  <text x="170.0" y="162.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="313.3" y="162.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">25</text>
  <text x="456.7" y="162.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="600.0" y="162.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">75</text>
</svg>
<figcaption>pg_trgm па слоўніку з 11 198 слоў, па 75 апісак кожнага віду. Колерам паказана патрэбнае слова на першым месцы, шэрая частка гэта месцы з 2 па 5.</figcaption>
</figure>

Слабое месца гэта перастаўленыя літары, 37 з 75. 7 кароткіх слоў прапалі зусім, напрыклад `trsut`, парог 0,3 для іх не прайшло ніводнае слова слоўніка.

## Назад да масіва

Для рускай часткі я ўзяў слоўнік OpenCorpora ў студзеньскай зборцы для pymorphy2. Пакінуў з каталога толькі словы з адной магчымай лемай, тых часцін мовы, што ў табліцы. Пытанне такое: колькі ўваходжанняў іншых форм знойдзецца, калі набраць слоўнікавую.

| | лем | іншых форм у тэксце | знайшлося |
|---|---|---|---|
| назоўнікі | 571 | 5754 | 91,4% |
| прыметнікі | 279 | 1436 | 98,7% |
| дзеясловы | 404 | 1900 | 61,8% |
| усе | 1254 | 9090 | 86,4% |

Чакаў я 90%. Псуюць усё дзеясловы, а дзеясловы псуе адна форма: 190 з 726 страчаных гэта "существует", найчасцей з "не существует". Назоўнікі мне непрыемнейшыя, думаю, набіраюць часцей іх. "Таблица" (243 з 243) і "индекс" (107 з 107) знаходзяцца цалкам. А "массив" канчаецца як дзеепрыслоўе, "запись" як зваротны дзеяслоў, "память" як інфінітыў. Snowball рэжа па канчатках і часцін мовы не ведае.

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Слоўнікавая форма і яе лексема побач з іншай формай таго ж назоўніка. массив ператвараецца ў масс, массива у массив, пошук знаходзіць 23 з 89 паведамленняў; запись ператвараецца ў зап, записи у запис, пошук знаходзіць 42 з 104 паведамленняў; память ператвараецца ў памя, памяти у памят, пошук знаходзіць 8 з 46 паведамленняў.">
  <text x="14.0" y="22.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">што набралі</text>
  <text x="326.0" y="22.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">што стаіць у тэксце</text>
  <rect x="14" y="40" width="108" height="30" class="f-plain"/>
  <text x="68.0" y="60.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">массив</text>
  <line x1="126" y1="55" x2="156" y2="55" class="f-line"/>
  <path d="M 156 51 L 164 55 L 156 59 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="170" y="40" width="108" height="30" class="f-box"/>
  <text x="224.0" y="60.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">масс</text>
  <rect x="326" y="40" width="108" height="30" class="f-plain"/>
  <text x="380.0" y="60.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">массива</text>
  <line x1="438" y1="55" x2="468" y2="55" class="f-line"/>
  <path d="M 468 51 L 476 55 L 468 59 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="482" y="40" width="108" height="30" class="f-box"/>
  <text x="536.0" y="60.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">массив</text>
  <text x="670.0" y="60.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">23/89</text>
  <rect x="14" y="84" width="108" height="30" class="f-plain"/>
  <text x="68.0" y="104.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">запись</text>
  <line x1="126" y1="99" x2="156" y2="99" class="f-line"/>
  <path d="M 156 95 L 164 99 L 156 103 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="170" y="84" width="108" height="30" class="f-box"/>
  <text x="224.0" y="104.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">зап</text>
  <rect x="326" y="84" width="108" height="30" class="f-plain"/>
  <text x="380.0" y="104.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">записи</text>
  <line x1="438" y1="99" x2="468" y2="99" class="f-line"/>
  <path d="M 468 95 L 476 99 L 468 103 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="482" y="84" width="108" height="30" class="f-box"/>
  <text x="536.0" y="104.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">запис</text>
  <text x="670.0" y="104.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">42/104</text>
  <rect x="14" y="128" width="108" height="30" class="f-plain"/>
  <text x="68.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">память</text>
  <line x1="126" y1="143" x2="156" y2="143" class="f-line"/>
  <path d="M 156 139 L 164 143 L 156 147 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="170" y="128" width="108" height="30" class="f-box"/>
  <text x="224.0" y="148.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">памя</text>
  <rect x="326" y="128" width="108" height="30" class="f-plain"/>
  <text x="380.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">памяти</text>
  <line x1="438" y1="143" x2="468" y2="143" class="f-line"/>
  <path d="M 468 139 L 476 143 L 468 147 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="482" y="128" width="108" height="30" class="f-box"/>
  <text x="536.0" y="148.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">памят</text>
  <text x="670.0" y="148.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">8/46</text>
  <text x="670.0" y="184.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">знойдзена паведамленняў</text>
</svg>
<figcaption>3 назоўнікі з рускага каталога. Слоўнікавая форма і астатнія формы атрымліваюць розныя лексемы, таму пошук па адной не бачыць другой.</figcaption>
</figure>

Звычайна гэта абыходзяць запытам па прэфіксе. `массив:*` знаходзіць усе 89, `память:*` усе 46. `запись:*` ператвараецца ў `зап:*` і вяртае 319 паведамленняў на 104 сапраўдныя.

Потым я запусціў Lucene 4.10.4, на якой стаіць Elasticsearch 1.5.0, што выйшаў на гэтым тыдні. Яе `RussianAnalyzer`, таксама Snowball, даў тую ж аснову, што і PostgreSQL, на ўсіх 16 354 словаформах, разыходжанняў 0. Лёгкі стэмер адтуль жа выпраўляе масіў і падымае назоўнікі да 95,2%, але дзеясловы ў яго падаюць да 4,8%, а ўсё разам да 76,8%. Так што ад рускага аналізатара Elasticsearch я чакаю, што ён разарве тыя ж 3 назоўнікі.

## Чаго я не праверыў

Сам Elasticsearch я не запускаў, толькі яго стэмер. Не спрабаваў слоўнікі ispell у PostgreSQL, а іх варта ставіць перад Snowball і для рускай мовы гэта мой наступны крок. Цану абнаўленняў таксама прапусціў. Халодны кэш бачыў адзін раз і выпадкова: пасля перазапуску PostgreSQL першы `stage` на перамяшанай табліцы заняў 1328 мс і прачытаў 5893 старонкі, паўтараць я не стаў. З 21 781 ужывання рускіх слоў 3818 маглі належаць да некалькіх лем і ў падлік не трапілі, а апіскі ў мяне выпадковыя, не чалавечыя. Канфігурацый у 9.4 усяго 16 і беларускай сярод іх няма.
