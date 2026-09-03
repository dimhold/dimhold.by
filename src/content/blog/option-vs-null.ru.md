---
title: "Option вместо null: 16 байт, которых я не нашёл"
description: "Три разных обрыва одной цепочки дают один и тот же NullPointerException с пустым сообщением. Option превращает все три в None. А потом счётчик аллокаций говорит, что Some не стоит ничего. Найти сам Some получается только через -XX:-DoEscapeAnalysis."
date: 2011-11-30
lang: ru
translationKey: option-vs-null
tags: ["types", "code-quality"]
---

NullPointerException прилетел из строки, в которой три точки.

```scala
def zipOf(order: Order): String = order.customer.address.zip
```

Сообщение пустое. Стектрейс назвал метод и строку, которые я и так знал из того, что исключение вообще случилось. Любой из трёх мог оказаться null и исключение в любом случае выглядит одинаково.

Я хотел закрыть два вопроса. Убирает ли Option этот класс ошибок на самом деле: вокруг меня так говорят, а я верю в это наполовину. И сколько он стоит, потому что я давно повторяю, что Option аллоцирует на каждый поиск и ни разу этого не померил. Всё, что ниже, это Scala 2.9.1 на jdk 7.

```
complete: 00-001
no address: NullPointerException, message=[null] at zipOf line 8
no customer: NullPointerException, message=[null] at zipOf line 8
no order: NullPointerException, message=[null] at zipOf line 8
```

<figure class="fig">
<svg viewBox="0 0 640 222" role="img" aria-label="Три сломанные цепочки: нет заказа, нет клиента, нет адреса. Каждая ломается в другом звене. Все три сходятся к одному и тому же NullPointerException с пустым сообщением на строке 8 файла Chains.scala. Ниже те же три входа через цепочку на Option возвращают None и не бросают ничего.">
  <defs>
    <marker id="oArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="117.5" y="20" class="f-label f-muted" text-anchor="middle">order</text>
  <text x="186.5" y="20" class="f-label f-muted" text-anchor="middle">customer</text>
  <text x="255.5" y="20" class="f-label f-muted" text-anchor="middle">address</text>
  <text x="324.5" y="20" class="f-label f-muted" text-anchor="middle">zip</text>
  <text x="6" y="48" class="f-label f-muted">нет заказа</text>
  <rect x="90" y="30" width="55" height="26" rx="3" class="f-plain"/>
  <text x="117.5" y="48" class="f-mono f-accent" text-anchor="middle">null</text>
  <text x="152" y="49" class="f-glyph f-accent" text-anchor="middle">×</text>
  <rect x="159" y="30" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <circle cx="221" cy="43" r="1.6" class="f-muted"/>
  <rect x="228" y="30" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <circle cx="290" cy="43" r="1.6" class="f-muted"/>
  <rect x="297" y="30" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <path d="M 358 43 L 380 88" class="f-line" marker-end="url(#oArrow)"/>
  <text x="6" y="96" class="f-label f-muted">нет клиента</text>
  <rect x="90" y="78" width="55" height="26" rx="3" class="f-box"/>
  <circle cx="152" cy="91" r="1.6" class="f-muted"/>
  <rect x="159" y="78" width="55" height="26" rx="3" class="f-plain"/>
  <text x="186.5" y="96" class="f-mono f-accent" text-anchor="middle">null</text>
  <text x="221" y="97" class="f-glyph f-accent" text-anchor="middle">×</text>
  <rect x="228" y="78" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <circle cx="290" cy="91" r="1.6" class="f-muted"/>
  <rect x="297" y="78" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <path d="M 358 91 L 380 88" class="f-line" marker-end="url(#oArrow)"/>
  <text x="6" y="144" class="f-label f-muted">нет адреса</text>
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
  <text x="6" y="172" class="f-label f-muted">те же три входа, через Option</text>
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
  <text x="398" y="200" class="f-mono f-muted">исключения нет</text>
</svg>
<figcaption>Три разных дефекта ломают цепочку в трёх разных звеньях. Все три приходят одним и тем же исключением с пустым сообщением, на одной строке.</figcaption>
</figure>

Три разных дефекта приходят одной строкой вывода, повторённой трижды. Чтобы понять, какое звено оборвалось, мне пришлось вернуться в исходник и разобрать цепочку руками. Аргумент за Option именно про этот класс ошибок и он справедлив.

Тот же путь, но поля объявлены как Option:

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

Не бросается ничего. Три дефекта никуда не делись и программа по-прежнему не может выдать индекс, но отсутствие теперь передаётся как значение и доходит туда, где я решил его обрабатывать. Заодно компилятор не даёт мне вытащить индекс, пока я не скажу, что будет при его отсутствии.

Это верно для кода, который идёт через `map` и `flatMap`. `get` никуда с типа не делся:

```
none.get: NoSuchElementException, message=[None.get]
```

То же падение под другим именем класса. В сообщении хотя бы написано `None.get`, что лучше пустого, но гарантия распространяется только на те вызовы, которые я сам выбираю.

## Где протекает

Вокруг в основном java, а java возвращает null. Так и пишется обёртка:

```scala
def zipOf(id: String): Option[String] = Some(Legacy.zip(id))
```

Именно так она выходит, когда пишу быстро. Компилируется и при этом неверна:

```
zipOf("c-1")                    = Some(null)
zipOf("c-1").isDefined          = true
zipOf("c-1").getOrElse("none")  = null
lengthOfZip("c-1")              ! java.lang.NullPointerException
    Interop$$anonfun$lengthOfZip$1.apply(Interop.scala:9) <- Interop$$anonfun$lengthOfZip$1.apply(Interop.scala:9) <- scala.Option.map(Option.scala:133)
```

`Some(null)` это значение, которое выглядит заполненным и не держит ничего. `isDefined` даёт true, `getOrElse` возвращает тот самый null, от которого должен был меня закрыть, а NPE переезжает внутрь лямбды в `map`. Встречать его там хуже, чем в исходной цепочке, потому что стек теперь идёт через библиотечный код. Всё это чинится, если писать `Option(...)` вместо `Some(...)`, потому что `Option.apply` проверяет на null и отдаёт `None`.

Второй течи я не ожидал. `Option` это ссылка, как любая другая, поэтому он и сам может быть null:

```
val o: Option[String] = null    = null
o.isDefined                     ! java.lang.NullPointerException
    Interop$.main(Interop.scala:25) <- Interop.main(Interop.scala)
o.getOrElse("none")             ! java.lang.NullPointerException
    Interop$.main(Interop.scala:27) <- Interop.main(Interop.scala)
```

Компилируется без предупреждения. Я прогнал компилятор ещё раз с `-deprecation`, на случай, если пропустил. Единственные два предупреждения на всю сборку относятся к алиасу `Integer` в другом файле. Неинициализированное поле типа `Option[String]` держит null, а не `None`. Любой вызов на нём падает по-старому.

В 2.9.1 есть флаг ровно про это. `-Xcheck-null` предупреждает об обращении по ссылке, которая может быть null. На этих двух маленьких файлах он выдал 54 предупреждения. Три из них это настоящие разыменования на восьмой строке. Он же отмечает `o.isDefined` на Option, который равен null, то есть случай, которому я только что удивился. Остальное вроде стрелки на строковом литерале и `label.+`, потому что конкатенация строк тоже обращение по ссылке. Семнадцать из 54 это конкатенации, восемь это та самая стрелка. Вытащить нужные три из оставшихся пятидесяти одного у меня не получилось.

<figure class="fig">
<svg viewBox="0 0 640 186" role="img" aria-label="Четыре состояния за значением типа Option от String. Some со значением и None это два состояния, которые описывает тип. Some от null и сама ссылка null тоже законны: первое приходит от null из java, второе от поля без значения. Оба падают с NullPointerException.">
  <defs>
    <marker id="oArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="320" y="18" class="f-label f-muted" text-anchor="middle">val zip: Option[String]</text>
  <rect x="10" y="30" width="140" height="56" rx="4" class="f-box"/>
  <text x="80" y="64" class="f-mono f-ink" text-anchor="middle">Some("00-001")</text>
  <text x="80" y="106" class="f-label f-muted" text-anchor="middle">описано типом</text>
  <text x="80" y="128" class="f-label f-muted" text-anchor="middle">значение</text>
  <rect x="170" y="30" width="140" height="56" rx="4" class="f-box"/>
  <text x="240" y="64" class="f-mono f-ink" text-anchor="middle">None</text>
  <text x="240" y="106" class="f-label f-muted" text-anchor="middle">описано типом</text>
  <text x="240" y="128" class="f-label f-muted" text-anchor="middle">отсутствие</text>
  <rect x="330" y="30" width="140" height="56" rx="4" class="f-plain" stroke-dasharray="4 3"/>
  <text x="400" y="64" class="f-mono f-accent" text-anchor="middle">Some(null)</text>
  <text x="400" y="106" class="f-label f-muted" text-anchor="middle">законно на этой jvm</text>
  <text x="400" y="128" class="f-label f-accent" text-anchor="middle">npe внутри map</text>
  <path d="M 400 138 L 400 152" class="f-line" marker-end="url(#oArrow)"/>
  <text x="400" y="172" class="f-label f-muted" text-anchor="middle">null из java</text>
  <rect x="490" y="30" width="140" height="56" rx="4" class="f-plain" stroke-dasharray="4 3"/>
  <text x="560" y="64" class="f-mono f-accent" text-anchor="middle">null</text>
  <text x="560" y="106" class="f-label f-muted" text-anchor="middle">законно на этой jvm</text>
  <text x="560" y="128" class="f-label f-accent" text-anchor="middle">npe на любом вызове</text>
  <path d="M 560 138 L 560 152" class="f-line" marker-end="url(#oArrow)"/>
  <text x="560" y="172" class="f-label f-muted" text-anchor="middle">поле без значения</text>
</svg>
<figcaption>За значением типа Option[String] помещается четыре состояния. Тип описывает из них два.</figcaption>
</figure>

## Что я думал про цену

Я давно повторяю, что Option обходится в аллокацию на каждый поиск. И ни разу не мерил. Таблица на 100000 элементов, 20 миллионов поисков на цикл, три прогрева, потом пять замеров с печатью медианы. Те же 2.9.1 и jdk 7, куча прибита `-Xms256m -Xmx256m`, чтобы compressed oops остались включёнными:

```
1 java null                median 192 ms   runs 192,192,176,201,182            15.9802 bytes/lookup
2 scala Option             median 436 ms   runs 453,447,436,430,412            15.9795 bytes/lookup
3 java + Option()          median 188 ms   runs 184,188,197,181,195            15.9795 bytes/lookup
4 scala apply, no Option   median 434 ms   runs 434,438,424,432,466            15.9795 bytes/lookup
```

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="Сетка два на два из медиан. Карта java отвечает за 192 миллисекунды с возвратом null и за 188 обёрнутая в Option. Карта scala отвечает за 434 миллисекунды через apply и за 436 с возвратом Option. Обе медленные клетки стоят в строке scala.">
  <text x="315" y="24" class="f-label f-muted" text-anchor="middle">без Option в цикле</text>
  <text x="525" y="24" class="f-label f-muted" text-anchor="middle">с Option в цикле</text>
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
<figcaption>Медианы пяти таймированных прогонов по 20 миллионов поисков. Обе медленные клетки стоят в строке scala. Перенос Option в цикл и из цикла не меняет ничего.</figcaption>
</figure>

Циклы 1 и 3 работают с одной и той же `java.util.HashMap`. Разница ровно в том, что цикл 3 заворачивает каждый результат в `Option(...)`. 188 против 192. По трём прогонам, которые я сохранил, они укладываются в 181..189 против 186..199. Обёртка не стоит ничего заметного. Интереснее разрыв между циклами 2 и 3: 248 мс, притом что оба строят `Option` на каждый поиск. Разводит их `scala.collection.mutable.HashMap` против `java.util.HashMap`.

Колонка аллокаций это то, в чём я ошибался. Циклы 2, 3 и 4 аллоцируют 15.9795 байта на поиск, а цикл 1 стоит на волос в стороне, 15.9802. Эти байты уходят на ключ, а не на `Some`. Ключ `i % SIZE` упаковывается в `Integer`. Кэш по умолчанию держит от -128 до 127, а ключи идут от 0 до 99999. Значит 128 поисков из каждых 100000 приходят из кэша, а остальные аллоцируют по 16 байт. Это 16 × (1 − 128/100000) или 15.97952.

Цикл 4 задумывался контрольным. `sm(k)` отдаёт значение напрямую и слова Option в цикле нет. Он вышел таким же медленным, как цикл 2, в двух прогонах из трёх чуть медленнее. Я читал это как подтверждение, пока не выключил escape analysis:

```
1 java null                median 195 ms   runs 192,189,195,195,210            15.9802 bytes/lookup
2 scala Option             median 544 ms   runs 540,552,536,562,544            31.9795 bytes/lookup
3 java + Option()          median 229 ms   runs 209,229,239,230,227            31.9795 bytes/lookup
4 scala apply, no Option   median 535 ms   runs 495,545,553,535,518            31.9795 bytes/lookup
```

Цикл 1 держится на 15.9802, а остальные три набирают ровно по 16 байт. Цикл 4 набирает их тоже, то есть `Some` в нём всё-таки есть: `apply` зовёт `get`, `get` строит `Some`, а `apply` его разворачивает и выбрасывает. В контрольном цикле сидело то, что он должен был исключить. Заметил я это только потому, что счётчик аллокаций не сошёлся с исходником, который я сам написал.

Шестнадцать байт это один `Some`: заголовок в 12 байт плюс одна ссылка в 4 байта под compressed oops. При включённом escape analysis, а он включён по умолчанию, JIT понимает, что объект не покидает метод и не аллоцирует его вовсе. Цикл 3 уходит с 188 мс до 229, когда я это выключаю. Объект настоящий и он стоит времени, когда JIT не может его убрать. Просто он не создаётся.

Тот же блок закрывает второй вопрос лучше, чем моя первая пара. Циклы 2 и 3 с принудительной аллокацией строят одинаковое количество `Some` и аллоцируют поровну, по 31.9795 байта на поиск. Между ними всё равно 315 мс. Чем бы этот разрыв ни был, это не Option.

## Чего я не проверял

Куда уходят те самые 248 мс. Я померил, что это не Option. Дальше не пошёл, так что `scala.collection.mutable.HashMap` остаётся в списке.

Выживает ли всё это за пределами плотного цикла. Двадцать миллионов поисков, когда больше ничего не происходит, это тепличные условия для escape analysis. В обработчике запроса, у которого сверху стек фреймов, я не знаю, останется ли `Some` вне кучи. Такого теста я не собрал.
