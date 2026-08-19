---
title: "Option вместо null: 477 миллисекунд против 107"
description: "Три разных недостающих звена в цепочке null бросают одно и то же пустое исключение. Option превращает эту цепочку в тип, который никогда не бросается. Поиск в хэш-таблице через этот тип всё равно оказался в четыре раза медленнее, 477 миллисекунд против 107. Счётчик аллокаций для потока показал почти одинаковое число байт на поиск в обоих случаях."
date: 2011-11-30
lang: ru
translationKey: option-vs-null
---

Я написал эту цепочку так, как писал всегда: три точки, и ни разу не задумался ни об одной из них:

```
class Address(val zip: String)
class Customer(val address: Address)
class Order(val customer: Customer)

def zipOf(order: Order): String = order.customer.address.zip
```

Прогнал её на четырёх заказах: один полный, у трёх чего-то не хватает на разной глубине:

```
complete:    00-001
no address:  NullPointerException, message=[null]
no customer: NullPointerException, message=[null]
no order:    NullPointerException, message=[null]
```

Три разных заказа сломаны в трёх разных местах. Исключение не различает их. Сообщение пустое. Трассировка стека даёт мне строку, и в этой строке три точки. Я знаю, что в цепочке чего-то не хватало. Какого из трёх звеньев не хватало, я не могу сказать без принтов или дебаггера.

<figure class="fig">
<svg viewBox="0 0 640 150" role="img" aria-label="Три колонки, нет заказа, нет клиента, нет адреса, каждая ломает цепочку в другом звене, но все дают одинаковый NullPointerException с пустым сообщением">
  <defs>
    <marker id="arr1" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="116" y="16" class="f-label f-muted" text-anchor="middle">нет заказа</text>
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
<text x="316" y="16" class="f-label f-muted" text-anchor="middle">нет клиента</text>
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
<text x="516" y="16" class="f-label f-muted" text-anchor="middle">нет адреса</text>
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
<figcaption>Три разных разрыва одной и той же цепочки. Каждый из них печатает одинаковое исключение с пустым сообщением.</figcaption>
</figure>

Переписываю ту же цепочку через `Option`, и вместе с ней меняется тип:

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

Ничего не бросается. Сигнатура говорит `Option[String]` вместо `String`. Компилятор не даст мне вызвать `.length` на результате напрямую, только `map`, `flatMap`, `getOrElse` или сопоставление с образцом. Возможность отсутствующего почтового индекса раньше жила только у меня в голове. Теперь проверку на каждой строке, где используется значение, делает компилятор. Забыть про неё теперь ошибка компиляции, а не крах тремя вызовами позже.

## Обходной путь

У `Option` есть метод, который сводит на нет весь этот аргумент:

```
val none: Option[String] = None
none.get
// java.util.NoSuchElementException: None.get
```

Та же форма краха под новым именем класса. Я всё так же не знаю, какое из значений выше по цепочке было пустым. `get` остаётся публичным методом `Option` с тех пор, как у него появились `map` и `flatMap`. Ничто не мешает цепочке вызовов `.get` воспроизвести любой отказ, на который был способен `null`. Гарантия со страницы выше распространяется только на код, который тянется за `map` и `flatMap` вместо `get`. Старая привычка тянется за `get` первой, потому что `get` читается как та самая проверка на null, которую он заменяет. `if (x != null) x.field` превращается в `if (x.isDefined) x.get.field`. Этот перевод сохраняет крах и добавляет к нему церемонию.

## Хэш-таблица

Стандартная претензия к `Option` в том, что он упаковывает значение в объект. Каждый `Some` это настоящий объект в куче, там где nullable-поле не стоило бы ничего лишнего. Поиск в хэш-таблице через `Option` должен бы показать себя мусором. Я собрал две таблицы по сто тысяч записей: одну `java.util.HashMap<Integer, String>`, вторую `scala.collection.mutable.HashMap[Int, String]`. Обе прогнал по двадцать миллионов поисков после трёх прогревочных проходов:

```
java   ms per run: Vector(112, 102, 120, 105, 107)
scala  ms per run: Vector(579, 478, 429, 474, 477)
```

Медиана из пяти: 107 мс против 477, то есть в 4.46 раза медленнее через `Option`. Это отношение держалось на трёх отдельных прогонах всей программы: 4.15, 4.46 и 3.88. Так что фольклор про медленный `Option` не врёт. Но перед тем как решить почему, я навесил на оба замеряемых блока счётчик аллокаций текущего потока:

```
java   bytes allocated, 5 runs of 20000000 lookups: 1597991864
scala  bytes allocated, 5 runs of 20000000 lookups: 1597956632
```

Это 15.9799 байта на поиск для null-версии и 15.9796 для `Option`, разница около 0.002 процента. Эта разница это упакованный `Integer`-ключ, который оба цикла строят для одного и того же `i % SIZE`. Ни один из циклов не тащит на себе лишний `Some`. JIT делает scalar replacement: держит единственное поле в регистре вместо кучи. Обёртка не выходит за пределы тех нескольких инструкций между поиском и проверкой `isDefined`. Четырёхкратное замедление реально. Это не давление сборщика мусора. Куда уходит разница на самом деле, я не выяснил. Одна догадка это лишний шаг перемешивания хэша, который `scala.collection.mutable.HashMap` делает на каждом ключе. Другая это слой диспетчеризации трейтов над обычным массивом бакетов. Я не прогнал ничего, что развело бы эти две догадки.

<figure class="fig">
<svg viewBox="0 0 640 190" role="img" aria-label="Два цикла рядом. null-цикл аллоцирует один упакованный Integer на поиск. Option-цикл аллоцирует тот же один упакованный Integer, а обёртка Some рядом с ним перечёркнута, потому что JIT устраняет её до того, как она попадёт в кучу">
  <text x="160" y="20" class="f-label f-muted" text-anchor="middle">null-цикл (java.util.HashMap)</text>
  <rect x="120" y="40" width="80" height="50" rx="3" class="f-box"/>
  <text x="160" y="70" class="f-mono f-ink" text-anchor="middle" font-size="11">Integer</text>

  <text x="480" y="20" class="f-label f-muted" text-anchor="middle">Option-цикл (scala mutable.HashMap)</text>
  <rect x="400" y="40" width="80" height="50" rx="3" class="f-box"/>
  <text x="440" y="70" class="f-mono f-ink" text-anchor="middle" font-size="11">Integer</text>
  <rect x="490" y="40" width="80" height="50" rx="3" class="f-plain" stroke-dasharray="4 3"/>
  <text x="530" y="65" class="f-mono f-muted" text-anchor="middle" font-size="11">Some</text>
  <line x1="495" y1="45" x2="565" y2="85" class="f-line"/>
  <text x="530" y="104" class="f-label f-muted" text-anchor="middle" font-size="8">устранён JIT</text>

  <text x="320" y="150" class="f-mono f-ink" text-anchor="middle" font-size="12">15.98 байта на поиск, с обеих сторон</text>
</svg>
<figcaption>Оба цикла упаковывают один и тот же ключ Integer. Лишний Some, которого ждёт фольклор, в кучу не попадает.</figcaption>
</figure>

## Что я не проверил

У escape analysis есть своя история. Он появился как экспериментальный флаг до того, как стал включён по умолчанию. У меня нет способа подтвердить это на железе этого года. JIT здесь устраняет `Some` ещё до того, как тот стал бы мусором. Делал ли он это так же надёжно тогда, на этой машине я проверить не могу. Если не делал, у фольклора была настоящая почва под ногами какое-то время, и он перестал быть правдой только когда компилятор её догнал.

Я проверил только мутабельную хэш-таблицу. Иммутабельный `Map` в Scala это другая структура данных со своими компромиссами, и я её вообще не замерял. Не проверил и то направление, в котором чаще всего ломается мой настоящий код: Java-библиотеку, которая возвращает `null`. Этот `null` оборачивается в `Option(x)` на границе. Аллоцирует только тот случай, когда библиотека и правда что-то вернула. `null`, пришедший обратно, не стоит ничего. Он превращается в тот же самый `None` каждый раз.
