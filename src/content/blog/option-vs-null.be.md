---
title: "Option замест null: 477 мілісекунд супраць 107"
description: "Тры розныя недастаючыя звёны ў ланцужку null кідаюць адно і тое ж пустое выключэнне. Option ператварае гэты ланцужок у тып, які ніколі не кідаецца. Пошук у хэш-табліцы праз гэты тып усё роўна апынуўся ў чатыры разы маруднейшым, 477 мілісекунд супраць 107. Лічыльнік алакацый на паток паказаў амаль аднолькавую колькасць байтаў на пошук у абодвух выпадках."
date: 2011-11-30
lang: be
translationKey: option-vs-null
---

Я напісаў гэты ланцужок так, як пісаў заўсёды: тры кропкі, і ні разу не задумаўся ні пра адну з іх:

```
class Address(val zip: String)
class Customer(val address: Address)
class Order(val customer: Customer)

def zipOf(order: Order): String = order.customer.address.zip
```

Прагнаў яго на чатырох заказах: адзін поўны, у трох чагосьці не хапае на рознай глыбіні:

```
complete:    00-001
no address:  NullPointerException, message=[null]
no customer: NullPointerException, message=[null]
no order:    NullPointerException, message=[null]
```

Тры розныя заказы зламаныя ў трох розных месцах. Выключэнне не адрознівае іх. Паведамленне пустое. Трасіроўка стэка дае мне радок, і ў гэтым радку тры кропкі. Я ведаю, што ў ланцужку чагосьці не хапала. Якога з трох звёнаў не хапала, я не магу сказаць без прынтаў ці дэбагера.

<figure class="fig">
<svg viewBox="0 0 640 150" role="img" aria-label="Тры калонкі, няма заказу, няма кліента, няма адрасу, кожная ломае ланцужок у іншым звяне, але ўсе даюць адно і тое ж NullPointerException з пустым паведамленнем">
  <defs>
    <marker id="arr1" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="116" y="16" class="f-label f-muted" text-anchor="middle">няма заказу</text>
<rect x="54" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="69" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">order</text>
<circle cx="69" cy="36" r="3" class="f-accent"/>
<rect x="90" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="105" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">customer</text>
<rect x="126" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="141" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">address</text>
<rect x="162" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="177" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">zip</text>
<line x1="116" y1="66" x2="116" y2="92" class="f-line" marker-end="url(#arr1)"/>
<rect x="36" y="96" width="160" height="44" rx="3" class="f-box"/>
<text x="116" y="114" class="f-mono f-ink" text-anchor="middle" font-size="10">NullPointerException</text>
<text x="116" y="130" class="f-mono f-muted" text-anchor="middle" font-size="10">message=[null]</text>
<text x="316" y="16" class="f-label f-muted" text-anchor="middle">няма кліента</text>
<rect x="254" y="26" width="30" height="20" rx="2" class="f-box"/>
<text x="269" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">order</text>
<rect x="290" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="305" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">customer</text>
<circle cx="305" cy="36" r="3" class="f-accent"/>
<rect x="326" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="341" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">address</text>
<rect x="362" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="377" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">zip</text>
<line x1="316" y1="66" x2="316" y2="92" class="f-line" marker-end="url(#arr1)"/>
<rect x="236" y="96" width="160" height="44" rx="3" class="f-box"/>
<text x="316" y="114" class="f-mono f-ink" text-anchor="middle" font-size="10">NullPointerException</text>
<text x="316" y="130" class="f-mono f-muted" text-anchor="middle" font-size="10">message=[null]</text>
<text x="516" y="16" class="f-label f-muted" text-anchor="middle">няма адрасу</text>
<rect x="454" y="26" width="30" height="20" rx="2" class="f-box"/>
<text x="469" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">order</text>
<rect x="490" y="26" width="30" height="20" rx="2" class="f-box"/>
<text x="505" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">customer</text>
<rect x="526" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="541" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">address</text>
<circle cx="541" cy="36" r="3" class="f-accent"/>
<rect x="562" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="577" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">zip</text>
<line x1="516" y1="66" x2="516" y2="92" class="f-line" marker-end="url(#arr1)"/>
<rect x="436" y="96" width="160" height="44" rx="3" class="f-box"/>
<text x="516" y="114" class="f-mono f-ink" text-anchor="middle" font-size="10">NullPointerException</text>
<text x="516" y="130" class="f-mono f-muted" text-anchor="middle" font-size="10">message=[null]</text>

</svg>
<figcaption>Тры розныя разрывы аднаго і таго ж ланцужка. Кожны з іх друкуе тое самае выключэнне з пустым паведамленнем.</figcaption>
</figure>

Перапісваю той самы ланцужок праз `Option`, і разам з ім змяняецца тып:

```
class AddressO(val zip: String)
class CustomerO(val address: Option[AddressO])
class OrderO(val customer: Option[CustomerO])

def zipOf(order: Option[OrderO]): Option[String] =
  order.flatMap(_.customer).flatMap(_.address).map(_.zip)
```

```
complete:    Some(00-001)
no address:  None
no customer: None
no order:    None
```

Нічога не кідаецца. Сігнатура кажа `Option[String]` замест `String`. Кампілятар не дазволіць мне выклікаць `.length` на выніку наўпрост, толькі `map`, `flatMap`, `getOrElse` або супастаўленне з узорам. Магчымасць адсутнага паштовага індэкса раней жыла толькі ў маёй галаве. Цяпер праверку на кожным радку, дзе выкарыстоўваецца значэнне, робіць кампілятар. Забыць пра яе цяпер памылка кампіляцыі, а не крах трыма выклікамі пазней.

## Абходны шлях

У `Option` ёсць метад, які зводзіць на нішто ўвесь гэты аргумент:

```
val none: Option[String] = None
none.get
// java.util.NoSuchElementException: None.get
```

Тая ж форма краху пад новым імем класа. Я ўсё роўна не ведаю, якое значэнне вышэй па ланцужку было пустым. `get` застаецца публічным метадам `Option` з тых часоў, як у яго з'явіліся `map` і `flatMap`. Нішто не перашкаджае ланцужку выклікаў `.get` паўторыць любы збой, на які быў здольны `null`. Гарантыя са старонкі вышэй распаўсюджваецца толькі на код, які цягнецца за `map` і `flatMap` замест `get`. Старая звычка цягнецца за `get` першай, бо `get` чытаецца як тая самая праверка на null, якую ён замяняе. `if (x != null) x.field` ператвараецца ў `if (x.isDefined) x.get.field`. Гэты пераклад захоўвае крах і дадае да яго цырымонію.

## Хэш-табліца

Стандартная прэтэнзія да `Option` у тым, што ён упакоўвае значэнне ў аб'ект. Кожны `Some` гэта сапраўдны аб'ект у купе, там дзе nullable-поле не каштавала б нічога лішняга. Пошук у хэш-табліцы праз `Option` мусіў бы паказаць сябе смеццем. Я збудаваў дзве табліцы па сто тысяч запісаў: адну `java.util.HashMap<Integer, String>`, другую `scala.collection.mutable.HashMap[Int, String]`. Абедзве прагнаў па дваццаць мільёнаў пошукаў пасля трох разагравальных праходаў:

```
java   ms per run: Vector(112, 102, 120, 105, 107)
scala  ms per run: Vector(579, 478, 429, 474, 477)
```

Медыяна з пяці: 107 мс супраць 477, гэта значыць у 4.46 раза марудней праз `Option`. Гэтыя суадносіны трымаліся на трох асобных прагонах усёй праграмы: 4.15, 4.46 і 3.88. Так што фальклор пра марудны `Option` не памыляецца. Але перш чым вырашыць чаму, я навесіў на абодва замяраныя блокі лічыльнік алакацый бягучага патоку:

```
java   bytes allocated, 5 runs of 20000000 lookups: 1597991864
scala  bytes allocated, 5 runs of 20000000 lookups: 1597956632
```

Гэта 15.9799 байта на пошук для null-версіі і 15.9796 для `Option`, розніца каля 0.002 працэнта. Гэтая розніца гэта ўпакаваны `Integer`-ключ, які абодва цыклы будуюць для аднаго і таго ж `i % SIZE`. Ні адзін з цыклаў не носіць на сабе лішні `Some`. JIT робіць scalar replacement: трымае адзінае поле ў рэгістры замест кучы. Абгортка не выходзіць за межы тых некалькіх інструкцый паміж пошукам і праверкай `isDefined`. Чатырохразовае запаволенне сапраўднае. Гэта не ціск зборшчыка смецця. Куды сыходзіць розніца на самай справе, я не выявіў. Адна здагадка гэта лішні крок перамешвання хэша, які `scala.collection.mutable.HashMap` робіць на кожным ключы. Другая гэта слой дыспетчарызацыі трэйтаў над звычайным масівам бакетаў. Я не прагнаў нічога, што развяло б гэтыя дзве здагадкі.

<figure class="fig">
<svg viewBox="0 0 640 190" role="img" aria-label="Два цыклы побач. null-цыкл алакуе адзін упакаваны Integer на пошук. Option-цыкл алакуе той самы адзін упакаваны Integer, а абгортка Some побач з ім перакрэслена, бо JIT ліквідуе яе да таго, як яна трапіла б у кучу">
  <text x="160" y="20" class="f-label f-muted" text-anchor="middle">null-цыкл (java.util.HashMap)</text>
  <rect x="120" y="40" width="80" height="50" rx="3" class="f-box"/>
  <text x="160" y="70" class="f-mono f-ink" text-anchor="middle" font-size="11">Integer</text>

  <text x="480" y="20" class="f-label f-muted" text-anchor="middle">Option-цыкл (scala mutable.HashMap)</text>
  <rect x="400" y="40" width="80" height="50" rx="3" class="f-box"/>
  <text x="440" y="70" class="f-mono f-ink" text-anchor="middle" font-size="11">Integer</text>
  <rect x="490" y="40" width="80" height="50" rx="3" class="f-plain" stroke-dasharray="4 3"/>
  <text x="530" y="65" class="f-mono f-muted" text-anchor="middle" font-size="11">Some</text>
  <line x1="495" y1="45" x2="565" y2="85" class="f-line"/>
  <text x="530" y="104" class="f-label f-muted" text-anchor="middle" font-size="8">ліквідаваны JIT</text>

  <text x="320" y="150" class="f-mono f-ink" text-anchor="middle" font-size="12">15.98 байта на пошук, з абодвух бакоў</text>
</svg>
<figcaption>Абодва цыклы упакоўваюць той самы ключ Integer. Лішні Some, якога чакае фальклор, у кучу не трапляе.</figcaption>
</figure>

## Што я не праверыў

У escape analysis ёсць свая гісторыя. Ён з'явіўся як эксперыментальны сцяг да таго, як стаў уключаны па змаўчанні. У мяне няма спосабу пацвердзіць гэта на жалезе гэтага года. JIT тут ліквідуе `Some` яшчэ да таго, як той стаў бы смеццем. Ці рабіў ён гэта так жа надзейна тады, я не магу праверыць на гэтай машыне. Калі не рабіў, у фальклору была сапраўдная падстава на нейкі час, і ён перастаў быць праўдай толькі калі кампілятар яе дагнаў.

Я праверыў толькі мутабельную хэш-табліцу. Іммутабельны `Map` у Scala гэта іншая структура даных са сваімі кампрамісамі, і я яе зусім не замяраў. Не праверыў і той напрамак, у якім часцей ламаецца мой сапраўдны код: Java-бібліятэку, якая вяртае `null`. Гэты `null` абгортваецца ў `Option(x)` на граніцы. Алакуе толькі той выпадак, калі бібліятэка і праўда нешта вернула. `null`, які вярнуўся, не каштуе нічога. Ён ператвараецца ў той самы `None` кожны раз.
