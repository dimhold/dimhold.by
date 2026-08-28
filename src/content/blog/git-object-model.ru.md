---
title: "Коммит, собранный руками: 187 байт"
description: "Пять вызовов пламбинга дают коммит, который читает git log. Одиннадцать ревизий файла в 1703 строки стоят 187576 байт свободными объектами против 16490 в пакете. Базой дельты оказывается самая новая версия файла."
date: 2011-12-07
lang: ru
translationKey: git-object-model
---

Мой рабочий git это шесть команд и одно правило. Команды: `add`, `commit`, `pull`, `push`, `checkout` и `log`. Правило: если репозиторий пришёл в состояние, которое я не узнаю, удалить каталог и склонировать заново. Правило работает. Заодно оно означает, что я ни разу не знал, что именно удаляю.

Поэтому вместо того чтобы выучить седьмую команду, я собрал коммит руками, только из пламбинга. Всё ниже это git 1.7.8, собранный из исходников, с уровнем сжатия по умолчанию. Даты автора и коммиттера прибиты к одной секунде, чтобы каждый хэш здесь воспроизводился.

Сначала имена, в репозитории, в котором ничего нет:

```
$ printf 'hello world\n' > a.txt
$ git hash-object a.txt
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ printf 'blob 12\0hello world\n' | sha1sum
3b18e512dba79e4c8300dd08aeb37f8e728b8dad  -
```

Имя объекта это sha1 от заголовка и содержимого. Заголовок это тип, пробел, длина в байтах и нулевой байт. Если посчитать хэш от одних двенадцати байт, получится `22596363b3de40b06f981fb85d82312e8c0ed511`. В этом репозитории такое имя не встречается.

Потом я скопировал `a.txt` в `b.txt` и записал оба:

```
$ git hash-object -w a.txt
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ git hash-object -w b.txt
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ find .git/objects -type f
.git/objects/3b/18e512dba79e4c8300dd08aeb37f8e728b8dad
```

Два файла, одно имя, один объект. Имя это функция от этих байт вместе с заголовком, поэтому одно и то же содержимое под двумя путями не может лечь в два объекта. На диске объект занимает 28 байт. На вход deflate идут двадцать байт (двенадцать содержимого и восемь заголовка), на выходе 28. Сжатие здесь добавило восемь байт.

<figure class="fig">
<svg viewBox="0 0 640 210" role="img" aria-label="Имя объекта git это sha1 от заголовка и содержимого. Заголовок это слово blob, пробел, длина 12 и нулевой байт, дальше двенадцать байт hello world. Получается 3b18e512, под этим именем объект и лежит. Если хэшировать двенадцать байт содержимого отдельно, получается 22596363, и в репозитории такое имя не встречается.">
  <defs>
    <marker id="gArrow1" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="6" y="34" class="f-label f-muted">что git хэширует</text>
  <rect x="150" y="44" width="130" height="30" rx="3" class="f-box"/>
  <text x="215" y="64" class="f-mono f-ink" text-anchor="middle">blob 12\0</text>
  <rect x="280" y="44" width="180" height="30" rx="3" class="f-box"/>
  <text x="370" y="64" class="f-mono f-ink" text-anchor="middle">hello world\n</text>
  <text x="215" y="92" class="f-label f-muted" text-anchor="middle">8 байт заголовка</text>
  <text x="370" y="92" class="f-label f-muted" text-anchor="middle">12 байт содержимого</text>
  <path d="M 462 59 L 494 59" class="f-line" marker-end="url(#gArrow1)"/>
  <text x="500" y="64" class="f-mono f-accent">3b18e512</text>
  <text x="500" y="92" class="f-label f-muted">имя объекта</text>
  <text x="6" y="134" class="f-label f-muted">только содержимое</text>
  <rect x="280" y="144" width="180" height="30" rx="3" class="f-plain" stroke-dasharray="4 3"/>
  <text x="370" y="164" class="f-mono f-muted" text-anchor="middle">hello world\n</text>
  <path d="M 462 159 L 494 159" class="f-line" marker-end="url(#gArrow1)"/>
  <text x="500" y="164" class="f-mono f-muted">22596363</text>
  <text x="500" y="192" class="f-label f-muted">git его не использует</text>
</svg>
<figcaption>Заголовок это часть того, что хэшируется. Посчитать хэш от одного содержимого можно, но имя выйдет другое. В этом репозитории такое имя не встречается.</figcaption>
</figure>

## Коммит, в котором нет фарфора

Чистый репозиторий, дальше два блоба, дерево, коммит и ссылка. Пять вызовов:

```
$ git hash-object -w greeting.txt
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ git hash-object -w note.txt
1c59427adc4b205a270d8f810310394962e79a8b
$ printf '100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad\tgreeting.txt
100644 blob 1c59427adc4b205a270d8f810310394962e79a8b\tnote.txt
' | git mktree
b88f66c9fea440e76158a5d4dec51ecaf7e3f53d
$ echo handmade | git commit-tree b88f66c9fea440e76158a5d4dec51ecaf7e3f53d
b0eabc99e5bbf3ffdc8127c50e8ea05c0de3dfba
$ git update-ref refs/heads/master b0eabc99e5bbf3ffdc8127c50e8ea05c0de3dfba
```

В коммите 187 байт содержимого и это всё, что в нём есть:

```
$ git cat-file -p b0eabc99e5bbf3ffdc8127c50e8ea05c0de3dfba
tree b88f66c9fea440e76158a5d4dec51ecaf7e3f53d
author Dmitriy Semenkevich <dimhold@gmail.com> 1323253380 +0100
committer Dmitriy Semenkevich <dimhold@gmail.com> 1323253380 +0100

handmade
```

Дерево это 76 байт. Ветка это файл, в котором сорок шестнадцатеричных цифр и перевод строки:

```
$ wc -c .git/refs/heads/master
41 .git/refs/heads/master
$ cat .git/HEAD
ref: refs/heads/master
```

`git log --stat` это читает и печатает мои два файла как добавленные, что я и хотел увидеть. Читателю вроде `log` нужны объекты и одна ссылка. И то и другое я написал руками.

Дальше вот это:

```
$ git status --short
D  greeting.txt
D  note.txt
?? greeting.txt
?? note.txt
```

Оба файла одновременно удалены и не отслеживаются. Файла `.git/index` на диске не было вовсе: дерево я собрал через `mktree` и через индекс не проходил. Git сравнивает индекс с HEAD, видит два файла в HEAD и ничего в индексе, дальше сообщает о двух удалениях. Список неотслеживаемых берётся из обхода каталога: остаётся то, о чём индекс не знает, а это те же два файла. `git reset` без аргументов пишет индекс на 184 байта из HEAD, статус замолкает, ссылка остаётся на месте. Значит, индекс это третья сущность на диске, рядом с объектами и ссылками. Он держит список файлов, которые git положит в следующий коммит. После `git reset` без аргументов этот список это копия дерева из HEAD, поэтому статус и замолкает.

<figure class="fig">
<svg viewBox="0 0 640 250" role="img" aria-label="Цепочка, собранная руками пятью вызовами пламбинга. В файле refs/heads/master лежит 41 байт: сорок цифр имени коммита и перевод строки. Коммит b0eabc99 занимает 187 байт, и в нём записано имя одного дерева. Дерево b88f66c9 занимает 76 байт и называет два блоба по 12 байт, greeting.txt и note.txt. В стороне индекс, который так и не записан, поэтому git status печатает оба файла как удалённые и как неотслеживаемые, пока git reset не пересоберёт индекс из HEAD.">
  <defs>
    <marker id="gArrow2" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <rect x="10" y="40" width="150" height="34" rx="4" class="f-plain"/>
  <text x="85" y="62" class="f-mono f-ink" text-anchor="middle">master</text>
  <text x="85" y="90" class="f-label f-muted" text-anchor="middle">ветка, 41 байт</text>
  <path d="M 162 57 L 194 57" class="f-line" marker-end="url(#gArrow2)"/>
  <rect x="200" y="40" width="150" height="34" rx="4" class="f-box"/>
  <text x="275" y="62" class="f-mono f-ink" text-anchor="middle">b0eabc99</text>
  <text x="275" y="90" class="f-label f-muted" text-anchor="middle">коммит, 187 байт</text>
  <path d="M 352 57 L 384 57" class="f-line" marker-end="url(#gArrow2)"/>
  <rect x="390" y="40" width="150" height="34" rx="4" class="f-box"/>
  <text x="465" y="62" class="f-mono f-ink" text-anchor="middle">b88f66c9</text>
  <text x="465" y="90" class="f-label f-muted" text-anchor="middle">дерево, 76 байт</text>
  <path d="M 465 96 L 465 122" class="f-line" marker-end="url(#gArrow2)"/>
  <path d="M 465 96 L 275 122" class="f-line" marker-end="url(#gArrow2)"/>
  <rect x="200" y="128" width="150" height="34" rx="4" class="f-box"/>
  <text x="275" y="150" class="f-mono f-ink" text-anchor="middle">3b18e512</text>
  <text x="275" y="178" class="f-label f-muted" text-anchor="middle">greeting.txt</text>
  <text x="275" y="196" class="f-label f-muted" text-anchor="middle">блоб, 12 байт</text>
  <rect x="390" y="128" width="150" height="34" rx="4" class="f-box"/>
  <text x="465" y="150" class="f-mono f-ink" text-anchor="middle">1c59427a</text>
  <text x="465" y="178" class="f-label f-muted" text-anchor="middle">note.txt</text>
  <text x="465" y="196" class="f-label f-muted" text-anchor="middle">блоб, 12 байт</text>
  <rect x="10" y="128" width="150" height="34" rx="4" class="f-plain" stroke-dasharray="4 3"/>
  <text x="85" y="150" class="f-mono f-accent" text-anchor="middle">.git/index</text>
  <text x="85" y="178" class="f-label f-accent" text-anchor="middle">индекс, не записан</text>
  <text x="10" y="230" class="f-label f-muted">status печатает D и ??, пока git reset его не пересоберёт</text>
</svg>
<figcaption>Это результат пяти вызовов пламбинга. Индекс это единственное, чего mktree не касается. Вывод status был именно про это.</figcaption>
</figure>

## Что попадает в хэш

`commit-tree` на том же дереве с той же датой и тем же сообщением снова даёт `b0eabc99`. Через секунду он даёт `47e87c9eaa1871559a5ee5c44ca3170cfc73f0a2`. Дерево оба раза хэшируется в `b88f66c9`.

Дерево это функция от содержимого. Коммит несёт ещё время и автора. Ребейз я здесь не запускал, но новые хэши коммитов после ребейза берутся отсюда: строка коммиттера пишется заново у каждого коммита, который переехал.

## Что я думал про содержимое коммита

Я считал, что в коммите лежит дифф, потому что дифф это то, что печатает `git show`. Поэтому я взял `read-cache.c` из исходников git, 46456 байт на 1703 строки. Дальше одиннадцать коммитов: файл как он есть, потом ещё десять, в каждом переписана одна строка в середине:

```
$ git diff --stat HEAD~1 HEAD
 read-cache.c |    2 +-
 1 files changed, 1 insertions(+), 1 deletions(-)
```

`count-objects -v` говорит count: 33. Тридцать три объекта на одиннадцать коммитов, то есть одиннадцать блобов и одиннадцать деревьев под ними. Каждый блоб это целая копия файла, от 16828 до 16833 байт на диске в зависимости от ревизии. Свободные объекты в сумме дают 187576 байт. Одна переписанная строка комментария стоит целого нового блоба.

Дальше `git gc`:

```
$ git count-objects -v
count: 0
size: 0
in-pack: 33
packs: 1
size-pack: 18
prune-packable: 0
garbage: 0
$ wc -c .git/objects/pack/*.pack
16490 .git/objects/pack/pack-d208f07049583dc92008db070bb8c6daa90890fa.pack
$ git verify-pack -v .git/objects/pack/pack-*.idx | grep ' blob '
1530d3b547cf0a52ec2f6f4ed20053f5229581ea blob   46468 13889 1783
4723c6ab5406c51c12595742b8770ebd36062d5b blob   16 29 15722 1 1530d3b547cf0a52ec2f6f4ed20053f5229581ea
7765d864e63e91df92c92c73404d6d857be734d3 blob   16 29 15802 1 1530d3b547cf0a52ec2f6f4ed20053f5229581ea
5790a91044e4fdf5b2eec515051a66c110e0daa4 blob   18 31 16439 1 1530d3b547cf0a52ec2f6f4ed20053f5229581ea
```

187576 байт превратились в 16490, то есть в 11,4 раза меньше. Выше четыре из одиннадцати строк с блобами. Из семи, которые я не привёл, шесть это дельты по 16 байт, а одна 14.

База `1530d3b5` это самая новая версия файла. Десять старых ревизий лежат дельтами от неё, глубина 1, размер от 14 до 18 байт. Ревизия, которую я закоммитил первой, хранится как дельта в 18 байт от последней. Колонку size я перечитал дважды, прежде чем поверил: у дельта-объекта в ней размер дельты.

```
$ git cat-file -s 4723c6ab5406c51c12595742b8770ebd36062d5b
46467
```

Диффы существуют, но лежат слоем ниже коммита. Считает их repack, а его запускает `gc`. Считает назад, от самой новой версии. В коммите записано имя дерева, в дереве имя блоба, а блоб на диске это по-прежнему целая копия `read-cache.c`.

<figure class="fig">
<svg viewBox="0 0 640 230" role="img" aria-label="Одиннадцать ревизий read-cache.c, сохранённые двумя способами. Свободными объектами каждая ревизия это целая копия файла, от 16828 до 16833 байт на диске, а все 33 объекта дают 187576 байт. В пакете самая новая ревизия лежит целиком в 13889 байтах, а десять старых это дельты от 14 до 18 байт, которые на неё ссылаются, глубина 1, весь пакет 16490 байт.">
  <defs>
    <marker id="gArrow3" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="30" y="34" class="f-label f-muted">свободные объекты, 11 блобов</text>
  <rect x="30" y="56" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="70" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="84" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="98" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="112" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="126" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="140" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="154" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="168" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="182" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="196" width="180" height="12" rx="2" class="f-box"/>
  <text x="220" y="120" class="f-label f-muted">от 16828 до 16833 байт на диске</text>
  <text x="220" y="140" class="f-label f-ink">все 33 свободных объекта, 187576 байт</text>
  <text x="430" y="34" class="f-label f-muted">в пакете, один файл</text>
  <rect x="430" y="46" width="150" height="34" rx="3" class="f-box"/>
  <text x="505" y="68" class="f-mono f-ink" text-anchor="middle">1530d3b5</text>
  <path d="M 470 180 L 470 84" class="f-line" marker-end="url(#gArrow3)"/>
  <rect x="430" y="96" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 99 L 468 99" class="f-line"/>
  <rect x="430" y="105" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 108 L 468 108" class="f-line"/>
  <rect x="430" y="114" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 117 L 468 117" class="f-line"/>
  <rect x="430" y="123" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 126 L 468 126" class="f-line"/>
  <rect x="430" y="132" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 135 L 468 135" class="f-line"/>
  <rect x="430" y="141" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 144 L 468 144" class="f-line"/>
  <rect x="430" y="150" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 153 L 468 153" class="f-line"/>
  <rect x="430" y="159" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 162 L 468 162" class="f-line"/>
  <rect x="430" y="168" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 171 L 468 171" class="f-line"/>
  <rect x="430" y="177" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 180 L 468 180" class="f-line"/>
  <text x="360" y="204" class="f-label f-muted">ревизия 10, целиком, 13889</text>
  <text x="430" y="222" class="f-label f-ink">16490 байт</text>
  <text x="30" y="222" class="f-label f-muted">ревизии с 0 по 9, дельты от 14 до 18 байт, глубина 1</text>
</svg>
<figcaption>Одиннадцать целых копий против одной целой копии и десяти дельт. Дельты указывают на самую новую ревизию, поэтому самая старая собирается из последней.</figcaption>
</figure>

## Сорок один байт

Правило про удаление каталога это то, что я и хотел починить. Дальше всё это идёт на копии репозитория, снятой до `gc`:

```
$ git rev-parse HEAD
c4608054b7ae3474916ed487338c7d3a5c72ec20
$ git reset --hard HEAD~3
HEAD is now at 972ff27 revision 7
$ sed -n '853p' read-cache.c
	 * Trivial optimization, revision 7: if we find an entry that
$ git cat-file -t c4608054b7ae3474916ed487338c7d3a5c72ec20
commit
$ git reflog
972ff27 HEAD@{0}: reset: moving to HEAD~3
c460805 HEAD@{1}: commit: revision 10
```

Это первые две записи рефлога из двенадцати. Рабочее дерево уехало на три ревизии назад. Коммит, с которого я ушёл, всё ещё объект и рефлог его всё ещё помнит. Вернуть его стоило одного `update-ref`. Следующий `reset --hard` переписал индекс и 46 КБ рабочего файла из объектов, которые никуда не девались. `count-objects` показывает 33 и до и после всего этого.

`git branch invoice-fix` пишет ссылку на 41 байт и не добавляет ни одного объекта. Заодно он пишет рефлог новой ветки на 167 байт, то есть ветка обошлась здесь в 208 байт. "Ветки в git дешёвые" это фраза, которую я повторял, не имея за ней числа.

## Чего я не проверял

Как repack выбирает базу дельты и держится ли глубина 1 на настоящей истории. По умолчанию здесь окно 10 и глубина до 50. Одиннадцать ревизий одного текстового файла это лёгкий случай для окна в 10.

Бинарный файл, в котором дельте нечего переиспользовать. Здесь только текст.

Когда недостижимый коммит действительно исчезает. Я померил, что он переживает reset, а до `prune` не дошёл.
