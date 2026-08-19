---
title: "Option замест null: 16 байтаў, якіх я не знайшоў"
description: "Тры розныя абрывы аднаго ланцужка даюць адзін і той жа NullPointerException з пустым паведамленнем. Option ператварае ўсе тры ў None. А потым лічыльнік алакацый кажа, што Some не каштуе нічога. Знайсці сам Some атрымліваецца толькі праз -XX:-DoEscapeAnalysis."
date: 2011-11-30
lang: be
translationKey: option-vs-null
---

NullPointerException прыляцеў з радка, у якім тры кропкі.

```scala
def zipOf(order: Order): String = order.customer.address.zip
```

Паведамленне пустое. Стэктрэйс назваў метад і радок, якія я і так ведаў з таго, што выключэнне наогул адбылося. Любы з трох мог аказацца null і выключэнне ў любым выпадку выглядае аднолькава.

Я хацеў закрыць два пытанні. Ці прыбірае Option гэты клас памылак насамрэч: вакол мяне так кажуць, а я веру ў гэта напалову. І колькі ён каштуе, бо я даўно паўтараю, што Option алакуе на кожны пошук і ні разу гэтага не памераў. Усё, што ніжэй, гэта Scala 2.9.1 на jdk 7.

```
complete: 00-001
no address: NullPointerException, message=[null] at zipOf line 8
no customer: NullPointerException, message=[null] at zipOf line 8
no order: NullPointerException, message=[null] at zipOf line 8
```

<figure class="fig">
<svg viewBox="0 0 640 222" role="img" aria-label="Тры зламаныя ланцужкі: няма заказу, няма кліента, няма адрасу. Кожны ламаецца ў іншым звяне. Усе тры сыходзяцца да аднаго і таго ж NullPointerException з пустым паведамленнем на радку 8 файла Chains.scala. Ніжэй тыя ж тры ўваходы праз ланцужок на Option вяртаюць None і не кідаюць нічога.">
  <defs>
    <marker id="oArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="117.5" y="20" class="f-label f-muted" text-anchor="middle">order</text>
  <text x="186.5" y="20" class="f-label f-muted" text-anchor="middle">customer</text>
  <text x="255.5" y="20" class="f-label f-muted" text-anchor="middle">address</text>
  <text x="324.5" y="20" class="f-label f-muted" text-anchor="middle">zip</text>
  <text x="6" y="48" class="f-label f-muted">няма заказу</text>
  <rect x="90" y="30" width="55" height="26" rx="3" class="f-plain"/>
  <text x="117.5" y="48" class="f-mono f-accent" text-anchor="middle">null</text>
  <text x="152" y="49" class="f-glyph f-accent" text-anchor="middle">×</text>
  <rect x="159" y="30" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <circle cx="221" cy="43" r="1.6" class="f-muted"/>
  <rect x="228" y="30" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <circle cx="290" cy="43" r="1.6" class="f-muted"/>
  <rect x="297" y="30" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <path d="M 358 43 L 380 88" class="f-line" marker-end="url(#oArrow)"/>
  <text x="6" y="96" class="f-label f-muted">няма кліента</text>
  <rect x="90" y="78" width="55" height="26" rx="3" class="f-box"/>
  <circle cx="152" cy="91" r="1.6" class="f-muted"/>
  <rect x="159" y="78" width="55" height="26" rx="3" class="f-plain"/>
  <text x="186.5" y="96" class="f-mono f-accent" text-anchor="middle">null</text>
  <text x="221" y="97" class="f-glyph f-accent" text-anchor="middle">×</text>
  <rect x="228" y="78" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <circle cx="290" cy="91" r="1.6" class="f-muted"/>
  <rect x="297" y="78" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <path d="M 358 91 L 380 88" class="f-line" marker-end="url(#oArrow)"/>
  <text x="6" y="144" class="f-label f-muted">няма адрасу</text>
  <rect x="90" y="126" width="55" height="26" rx="3" class="f-box"/>
  <circle cx="152" cy="139" r="1.6" class="f-muted"/>
  <rect x="159" y="126" width="55" height="26" rx="3" class="f-box"/>
  <circle cx="221" cy="139" r="1.6" class="f-muted"/>
  <rect x="228" y="126" width="55" height="26" rx="3" class="f-plain"/>
  <text x="255.5" y="144" class="f-mono f-accent" text-anchor="middle">null</text>
  <text x="290" y="145" class="f-glyph f-accent" text-anchor="middle">×</text>
  <rect x="297" y="126" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <path d="M 358 139 L 380 88" class="f-line" marker-end="url(#oArrow)"/>
  <rect x="386" y="44" width="248" height="88" rx="4" class="f-plain"/>
  <text x="398" y="72" class="f-mono f-ink">NullPointerException</text>
  <text x="398" y="94" class="f-mono f-muted">message=[null]</text>
  <text x="398" y="116" class="f-mono f-muted">Chains.scala:8</text>
  <text x="6" y="172" class="f-label f-muted">тыя ж тры ўваходы, праз Option</text>
  <rect x="90" y="182" width="80" height="26" rx="3" class="f-box"/>
  <text x="130" y="200" class="f-mono f-ink" text-anchor="middle">None</text>
  <path d="M 172 195 L 178 195" class="f-line"/>
  <rect x="180" y="182" width="80" height="26" rx="3" class="f-box"/>
  <text x="220" y="200" class="f-mono f-ink" text-anchor="middle">None</text>
  <path d="M 262 195 L 268 195" class="f-line"/>
  <rect x="270" y="182" width="80" height="26" rx="3" class="f-box"/>
  <text x="310" y="200" class="f-mono f-ink" text-anchor="middle">None</text>
  <path d="M 352 195 L 380 195" class="f-line" marker-end="url(#oArrow)"/>
  <rect x="386" y="182" width="248" height="26" rx="4" class="f-plain"/>
  <text x="398" y="200" class="f-mono f-muted">выключэння няма</text>
</svg>
<figcaption>Тры розныя дэфекты ломаюць ланцужок у трох розных звёнах. Усе тры прыходзяць адным і тым жа выключэннем з пустым паведамленнем, на адным радку.</figcaption>
</figure>

Тры розныя дэфекты прыходзяць адным радком вываду, паўтораным тройчы. Каб зразумець, якое звяно абарвалося, мне давялося вярнуцца ў зыходнік і разабраць ланцужок рукамі. Аргумент за Option менавіта пра гэты клас памылак і ён справядлівы.

Той жа шлях, але палі аб'яўлены як Option:

```scala
def zipOf(order: Option[OrderO]): Option[String] =
  order.flatMap(_.customer).flatMap(_.address).map(_.zip)
```

```
complete: Some(00-001)
no address: None
no customer: None
no order: None
```

Не кідаецца нічога. Тры дэфекты нікуды не падзеліся і праграма па-ранейшаму не можа выдаць індэкс, але адсутнасць цяпер перадаецца як значэнне і даходзіць туды, дзе я вырашыў яе апрацоўваць. Заадно кампілятар не дае мне выцягнуць індэкс, пакуль я не скажу, што будзе пры яго адсутнасці.

Гэта праўда для кода, які ідзе праз `map` і `flatMap`. `get` нікуды з тыпу не падзеўся:

```
none.get: NoSuchElementException, message=[None.get]
```

Тое самае падзенне пад іншым імем класа. У паведамленні хаця б напісана `None.get`, што лепш за пустое, але гарантыя пашыраецца толькі на тыя выклікі, якія я сам выбіраю.

## Дзе цячэ

Вакол у асноўным java, а java вяртае null. Так і пішацца абгортка:

```scala
def zipOf(id: String): Option[String] = Some(Legacy.zip(id))
```

Менавіта так яна выходзіць, калі пішу хутка. Кампілюецца і пры гэтым няверная:

```
zipOf("c-1")                    = Some(null)
zipOf("c-1").isDefined          = true
zipOf("c-1").getOrElse("none")  = null
lengthOfZip("c-1")              ! java.lang.NullPointerException
    Interop$$anonfun$lengthOfZip$1.apply(Interop.scala:9) <- Interop$$anonfun$lengthOfZip$1.apply(Interop.scala:9) <- scala.Option.map(Option.scala:133)
```

`Some(null)` гэта значэнне, якое выглядае запоўненым і не трымае нічога. `isDefined` дае true, `getOrElse` вяртае той самы null, ад якога мусіў мяне закрыць, а NPE пераязджае ўнутр лямбды ў `map`. Сустракаць яго там горш, чым у зыходным ланцужку, бо стэк цяпер ідзе праз бібліятэчны код. Усё гэта чыніцца, калі пісаць `Option(...)` замест `Some(...)`, бо `Option.apply` правярае на null і аддае `None`.

Другой цечы я не чакаў. `Option` гэта спасылка, як любая іншая, таму ён і сам можа быць null:

```
val o: Option[String] = null    = null
o.isDefined                     ! java.lang.NullPointerException
    Interop$.main(Interop.scala:25) <- Interop.main(Interop.scala)
o.getOrElse("none")             ! java.lang.NullPointerException
    Interop$.main(Interop.scala:27) <- Interop.main(Interop.scala)
```

Кампілюецца без папярэджання. Я прагнаў кампілятар яшчэ раз з `-deprecation`, на выпадак, калі прапусціў. Адзіныя два папярэджанні на ўсю зборку тычацца аліяса `Integer` у іншым файле. Неініцыялізаванае поле тыпу `Option[String]` трымае null, а не `None`. Любы выклік на ім падае па-старому.

У 2.9.1 ёсць сцяг якраз пра гэта. `-Xcheck-null` папярэджвае пра зварот па спасылцы, якая можа быць null. На гэтых двух маленькіх файлах ён выдаў 54 папярэджанні. Тры з іх гэта сапраўдныя разыменаванні на восьмым радку. Ён жа адзначае `o.isDefined` на Option, які роўны null, гэта значыць выпадак, якому я толькі што здзівіўся. Астатняе накшталт стрэлкі на радковым літарале і `label.+`, бо канкатэнацыя радкоў таксама зварот па спасылцы. Сямнаццаць з 54 гэта канкатэнацыі, восем гэта тая самая стрэлка. Выцягнуць патрэбныя тры з астатніх пяцідзесяці аднаго ў мяне не атрымалася.

<figure class="fig">
<svg viewBox="0 0 640 186" role="img" aria-label="Чатыры станы за значэннем тыпу Option ад String. Some са значэннем і None гэта два станы, якія апісвае тып. Some ад null і сама спасылка null таксама законныя: першае прыходзіць ад null з java, другое ад поля без значэння. Абодва падаюць з NullPointerException.">
  <defs>
    <marker id="oArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="320" y="18" class="f-label f-muted" text-anchor="middle">val zip: Option[String]</text>
  <rect x="10" y="30" width="140" height="56" rx="4" class="f-box"/>
  <text x="80" y="64" class="f-mono f-ink" text-anchor="middle">Some("00-001")</text>
  <text x="80" y="106" class="f-label f-muted" text-anchor="middle">апісана тыпам</text>
  <text x="80" y="128" class="f-label f-muted" text-anchor="middle">значэнне</text>
  <rect x="170" y="30" width="140" height="56" rx="4" class="f-box"/>
  <text x="240" y="64" class="f-mono f-ink" text-anchor="middle">None</text>
  <text x="240" y="106" class="f-label f-muted" text-anchor="middle">апісана тыпам</text>
  <text x="240" y="128" class="f-label f-muted" text-anchor="middle">адсутнасць</text>
  <rect x="330" y="30" width="140" height="56" rx="4" class="f-plain" stroke-dasharray="4 3"/>
  <text x="400" y="64" class="f-mono f-accent" text-anchor="middle">Some(null)</text>
  <text x="400" y="106" class="f-label f-muted" text-anchor="middle">законна на гэтай jvm</text>
  <text x="400" y="128" class="f-label f-accent" text-anchor="middle">npe унутры map</text>
  <path d="M 400 138 L 400 152" class="f-line" marker-end="url(#oArrow)"/>
  <text x="400" y="172" class="f-label f-muted" text-anchor="middle">null з java</text>
  <rect x="490" y="30" width="140" height="56" rx="4" class="f-plain" stroke-dasharray="4 3"/>
  <text x="560" y="64" class="f-mono f-accent" text-anchor="middle">null</text>
  <text x="560" y="106" class="f-label f-muted" text-anchor="middle">законна на гэтай jvm</text>
  <text x="560" y="128" class="f-label f-accent" text-anchor="middle">npe на любым выкліку</text>
  <path d="M 560 138 L 560 152" class="f-line" marker-end="url(#oArrow)"/>
  <text x="560" y="172" class="f-label f-muted" text-anchor="middle">поле без значэння</text>
</svg>
<figcaption>За значэннем тыпу Option[String] уміщаецца чатыры станы. Тып апісвае з іх два.</figcaption>
</figure>

## Што я думаў пра цану

Я даўно паўтараю, што Option абыходзіцца ў алакацыю на кожны пошук. І ні разу не мераў. Табліца на 100000 элементаў, 20 мільёнаў пошукаў на цыкл, тры прагрэвы, потым пяць замераў з друкам медыяны. Тыя ж 2.9.1 і jdk 7, куча прыбітая `-Xms256m -Xmx256m`, каб compressed oops засталіся ўключанымі:

```
1 java null                median 192 ms   runs 192,192,176,201,182            15.9802 bytes/lookup
2 scala Option             median 436 ms   runs 453,447,436,430,412            15.9795 bytes/lookup
3 java + Option()          median 188 ms   runs 184,188,197,181,195            15.9795 bytes/lookup
4 scala apply, no Option   median 434 ms   runs 434,438,424,432,466            15.9795 bytes/lookup
```

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="Сетка два на два з медыян. Карта java адказвае за 192 мілісекунды з вяртаннем null і за 188 загорнутая ў Option. Карта scala адказвае за 434 мілісекунды праз apply і за 436 з вяртаннем Option. Абедзве марудныя клеткі стаяць у радку scala.">
  <text x="315" y="24" class="f-label f-muted" text-anchor="middle">без Option у цыкле</text>
  <text x="525" y="24" class="f-label f-muted" text-anchor="middle">з Option у цыкле</text>
  <text x="6" y="84" class="f-label f-muted">java.util.HashMap</text>
  <text x="6" y="174" class="f-label f-muted">scala mutable.HashMap</text>
  <rect x="220" y="44" width="190" height="70" rx="4" class="f-plain"/>
  <text x="315" y="70" class="f-mono f-muted" text-anchor="middle">jm.get(k)</text>
  <text x="315" y="100" class="f-glyph f-ink" text-anchor="middle">192 ms</text>
  <rect x="430" y="44" width="190" height="70" rx="4" class="f-plain"/>
  <text x="525" y="70" class="f-mono f-muted" text-anchor="middle">Option(jm.get(k))</text>
  <text x="525" y="100" class="f-glyph f-ink" text-anchor="middle">188 ms</text>
  <rect x="220" y="134" width="190" height="70" rx="4" class="f-box"/>
  <text x="315" y="160" class="f-mono f-muted" text-anchor="middle">sm(k)</text>
  <text x="315" y="190" class="f-glyph f-accent" text-anchor="middle">434 ms</text>
  <rect x="430" y="134" width="190" height="70" rx="4" class="f-box"/>
  <text x="525" y="160" class="f-mono f-muted" text-anchor="middle">sm.get(k)</text>
  <text x="525" y="190" class="f-glyph f-accent" text-anchor="middle">436 ms</text>
</svg>
<figcaption>Медыяны пяці таймаваных прагонаў па 20 мільёнаў пошукаў. Абедзве марудныя клеткі стаяць у радку scala. Перанос Option у цыкл і з цыкла не мяняе нічога.</figcaption>
</figure>

Цыклы 1 і 3 працуюць па адной і той жа `java.util.HashMap`. Розніца якраз у тым, што цыкл 3 загортвае кожны вынік у `Option(...)`. 188 супраць 192. Па трох прагонах, якія я захаваў, яны ўкладваюцца ў 181..189 супраць 186..199. Абгортка не каштуе нічога прыкметнага. Цікавейшы разрыў паміж цыкламі 2 і 3: 248 мс, прытым што абодва будуюць `Option` на кожны пошук. Разводзіць іх `scala.collection.mutable.HashMap` супраць `java.util.HashMap`.

Калонка алакацый гэта тое, у чым я памыляўся. Цыклы 2, 3 і 4 алакуюць 15.9795 байта на пошук, а цыкл 1 стаіць на волас убок, 15.9802. Гэтыя байты ідуць на ключ, а не на `Some`. Ключ `i % SIZE` упакоўваецца ў `Integer`. Кэш па змаўчанні трымае ад -128 да 127, а ключы ідуць ад 0 да 99999. Значыць 128 пошукаў з кожных 100000 прыходзяць з кэша, а астатнія алакуюць па 16 байтаў. Гэта 16 × (1 − 128/100000) або 15.97952.

Цыкл 4 задумваўся кантрольным. `sm(k)` аддае значэнне наўпрост і слова Option у цыкле няма. Ён выйшаў такім жа марудным, як цыкл 2, у двух прагонах з трох крыху маруднейшым. Я чытаў гэта як пацвярджэнне, пакуль не выключыў escape analysis:

```
1 java null                median 195 ms   runs 192,189,195,195,210            15.9802 bytes/lookup
2 scala Option             median 544 ms   runs 540,552,536,562,544            31.9795 bytes/lookup
3 java + Option()          median 229 ms   runs 209,229,239,230,227            31.9795 bytes/lookup
4 scala apply, no Option   median 535 ms   runs 495,545,553,535,518            31.9795 bytes/lookup
```

Цыкл 1 трымаецца на 15.9802, а астатнія тры набіраюць роўна па 16 байтаў. Цыкл 4 набірае іх таксама, гэта значыць `Some` у ім усё-такі ёсць: `apply` кліча `get`, `get` будуе `Some`, а `apply` яго разгортвае і выкідае. У кантрольным цыкле сядзела тое, што ён мусіў выключыць. Заўважыў я гэта толькі таму, што лічыльнік алакацый не сышоўся з зыходнікам, які я сам напісаў.

Шаснаццаць байтаў гэта адзін `Some`: загаловак у 12 байтаў плюс адна спасылка ў 4 байты пад compressed oops. Пры ўключаным escape analysis, а ён уключаны па змаўчанні, JIT разумее, што аб'ект не пакідае метад і не алакуе яго зусім. Цыкл 3 сыходзіць са 188 мс да 229, калі я гэта выключаю. Аб'ект сапраўдны і ён каштуе часу, калі JIT не можа яго прыбраць. Проста ён не ствараецца.

Той жа блок закрывае другое пытанне лепш, чым мая першая пара. Цыклы 2 і 3 з прымусовай алакацыяй будуюць аднолькавую колькасць `Some` і алакуюць пароўну, па 31.9795 байта на пошук. Паміж імі ўсё роўна 315 мс. Чым бы гэты разрыў ні быў, гэта не Option.

## Чаго я не правяраў

Куды сыходзяць тыя самыя 248 мс. Я памераў, што гэта не Option. Далей не пайшоў, так што `scala.collection.mutable.HashMap` застаецца ў спісе.

Ці выжывае ўсё гэта па-за шчыльным цыклам. Дваццаць мільёнаў пошукаў, калі больш нічога не адбываецца, гэта цяплічныя ўмовы для escape analysis. У апрацоўшчыку запыту, у якога зверху стэк фрэймаў, я не ведаю, ці застанецца `Some` па-за кучай. Такога тэста я не сабраў.
