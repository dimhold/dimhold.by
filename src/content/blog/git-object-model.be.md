---
title: "Коміт, сабраны рукамі: 187 байтаў"
description: "Пяць выклікаў пламбінга даюць коміт, і git log яго чытае. Адзінаццаць рэвізій файла на 1703 радкі каштуюць 187576 байтаў свабоднымі аб’ектамі супраць 16490 у пакеце. Базай дэльты выяўляецца самая новая версія файла."
date: 2011-12-07
lang: be
translationKey: git-object-model
---

Мой рабочы git гэта шэсць каманд і адно правіла. Каманды: `add`, `commit`, `pull`, `push`, `checkout` і `log`. Правіла: калі рэпазіторый трапіў у стан, якога я не пазнаю, выдаліць каталог і скланаваць нанова. Правіла працуе. Заадно яно значыць, што я ні разу не ведаў, што менавіта выдаляю.

Таму замест таго каб вывучыць сёмую каманду, я сабраў коміт рукамі, толькі з пламбінга. Усё ніжэй гэта git 1.7.8, сабраны з зыходнікаў, са стандартным узроўнем сціскання. Даты аўтара і коміцера прыбітыя да адной секунды, каб кожны хэш тут паўтараўся.

Спачатку імёны, у рэпазіторыі, у якім няма нічога:

```
$ printf 'hello world\n' > a.txt
$ git hash-object a.txt
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ printf 'blob 12\0hello world\n' | sha1sum
3b18e512dba79e4c8300dd08aeb37f8e728b8dad  -
```

Імя аб’екта гэта sha1 ад загалоўка і змесціва. Загаловак гэта тып, прабел, даўжыня ў байтах і нулявы байт. Калі палічыць хэш ад адных дванаццаці байтаў, выйдзе `22596363b3de40b06f981fb85d82312e8c0ed511`, і ў гэтым рэпазіторыі такое імя не сустракаецца.

Потым я скапіяваў `a.txt` у `b.txt` і запісаў абодва:

```
$ git hash-object -w a.txt
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ git hash-object -w b.txt
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ find .git/objects -type f
.git/objects/3b/18e512dba79e4c8300dd08aeb37f8e728b8dad
```

Два файлы, адно імя, адзін аб’ект. Імя гэта функцыя ад гэтых байтаў разам з загалоўкам, таму адно і тое ж змесціва пад двума шляхамі не можа лягчы ў два аб’екты. На дыску аб’ект займае 28 байтаў. На ўваход deflate ідуць дваццаць байтаў (дванаццаць змесціва і восем загалоўка), на выхадзе 28. Сцісканне дадало тут восем байтаў.

<figure class="fig">
<svg viewBox="0 0 640 210" role="img" aria-label="Імя аб’екта git гэта sha1 ад загалоўка і змесціва. Загаловак гэта слова blob, прабел, даўжыня 12 і нулявы байт, далей дванаццаць байтаў hello world. Выходзіць 3b18e512, пад гэтым імем аб’ект і ляжыць. Калі хэшаваць дванаццаць байтаў змесціва асобна, выходзіць 22596363, і ў рэпазіторыі такога імя няма.">
  <defs>
    <marker id="gArrow1" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="6" y="34" class="f-label f-muted">што git хэшуе</text>
  <rect x="150" y="44" width="130" height="30" rx="3" class="f-box"/>
  <text x="215" y="64" class="f-mono f-ink" text-anchor="middle">blob 12\0</text>
  <rect x="280" y="44" width="180" height="30" rx="3" class="f-box"/>
  <text x="370" y="64" class="f-mono f-ink" text-anchor="middle">hello world\n</text>
  <text x="215" y="92" class="f-label f-muted" text-anchor="middle">8 байтаў загалоўка</text>
  <text x="370" y="92" class="f-label f-muted" text-anchor="middle">12 байтаў змесціва</text>
  <path d="M 462 59 L 494 59" class="f-line" marker-end="url(#gArrow1)"/>
  <text x="500" y="64" class="f-mono f-accent">3b18e512</text>
  <text x="500" y="92" class="f-label f-muted">імя аб’екта</text>
  <text x="6" y="134" class="f-label f-muted">толькі змесціва</text>
  <rect x="280" y="144" width="180" height="30" rx="3" class="f-plain" stroke-dasharray="4 3"/>
  <text x="370" y="164" class="f-mono f-muted" text-anchor="middle">hello world\n</text>
  <path d="M 462 159 L 494 159" class="f-line" marker-end="url(#gArrow1)"/>
  <text x="500" y="164" class="f-mono f-muted">22596363</text>
  <text x="500" y="192" class="f-label f-muted">git яго не ўжывае</text>
</svg>
<figcaption>Загаловак таксама ідзе на ўваход хэша. Палічыць хэш ад аднаго змесціва можна, але імя выйдзе іншае, і ў гэтым рэпазіторыі такое імя не сустракаецца.</figcaption>
</figure>


## Коміт, у якім няма фарфору

Чысты рэпазіторый, далей два блобы, дрэва, коміт і спасылка. Пяць выклікаў:

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

У коміце 187 байтаў змесціва і гэта ўсё, што ў ім ёсць:

```
$ git cat-file -p b0eabc99e5bbf3ffdc8127c50e8ea05c0de3dfba
tree b88f66c9fea440e76158a5d4dec51ecaf7e3f53d
author Dmitriy Semenkevich <dimhold@gmail.com> 1323253380 +0100
committer Dmitriy Semenkevich <dimhold@gmail.com> 1323253380 +0100

handmade
```

Дрэва гэта 76 байтаў. Галіна гэта файл, у якім сорак шаснаццатковых лічбаў і знак новага радка:

```
$ wc -c .git/refs/heads/master
41 .git/refs/heads/master
$ cat .git/HEAD
ref: refs/heads/master
```

`git log --stat` гэта чытае і друкуе мае два файлы як дададзеныя, што я і хацеў убачыць. Чытачу накшталт `log` патрэбныя аб’екты і адна спасылка. І тое і другое я напісаў рукамі.

Далей вось гэта:

```
$ git status --short
D  greeting.txt
D  note.txt
?? greeting.txt
?? note.txt
```

Абодва файлы адначасова выдаленыя і неадсочваныя. Файла `.git/index` на дыску не было зусім: дрэва я сабраў праз `mktree` і праз індэкс не праходзіў. Git параўноўвае індэкс з HEAD, бачыць два файлы ў HEAD і нічога ў індэксе, далей паведамляе пра два выдаленні. Спіс неадсочваных бярэцца з абходу каталога: застаецца тое, пра што індэкс не ведае, а гэта тыя ж два файлы. `git reset` без аргументаў піша індэкс на 184 байты з HEAD, статус змаўкае, спасылка застаецца на месцы. Значыць, індэкс гэта трэцяя сутнасць на дыску, побач з аб’ектамі і спасылкамі. Ён трымае спіс файлаў, якія git пакладзе ў наступны коміт. Пасля `git reset` без аргументаў гэты спіс гэта копія дрэва з HEAD, таму статус і змаўкае.

<figure class="fig">
<svg viewBox="0 0 640 250" role="img" aria-label="Ланцужок, сабраны рукамі пяццю выклікамі пламбінга. У файле refs/heads/master ляжыць 41 байт: сорак знакаў імя коміта і перавод радка. Коміт b0eabc99 займае 187 байтаў і называе адно дрэва. Дрэва b88f66c9 займае 76 байтаў і называе два блобы па 12 байтаў, greeting.txt і note.txt. Убаку індэкс, які так і не запісаны, таму git status друкуе абодва файлы як выдаленыя і як неадсочваныя, пакуль git reset не пабудуе індэкс з HEAD.">
  <defs>
    <marker id="gArrow2" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <rect x="10" y="40" width="150" height="34" rx="4" class="f-plain"/>
  <text x="85" y="62" class="f-mono f-ink" text-anchor="middle">master</text>
  <text x="85" y="90" class="f-label f-muted" text-anchor="middle">галіна, 41 байт</text>
  <path d="M 162 57 L 194 57" class="f-line" marker-end="url(#gArrow2)"/>
  <rect x="200" y="40" width="150" height="34" rx="4" class="f-box"/>
  <text x="275" y="62" class="f-mono f-ink" text-anchor="middle">b0eabc99</text>
  <text x="275" y="90" class="f-label f-muted" text-anchor="middle">коміт, 187 байтаў</text>
  <path d="M 352 57 L 384 57" class="f-line" marker-end="url(#gArrow2)"/>
  <rect x="390" y="40" width="150" height="34" rx="4" class="f-box"/>
  <text x="465" y="62" class="f-mono f-ink" text-anchor="middle">b88f66c9</text>
  <text x="465" y="90" class="f-label f-muted" text-anchor="middle">дрэва, 76 байтаў</text>
  <path d="M 465 96 L 465 122" class="f-line" marker-end="url(#gArrow2)"/>
  <path d="M 465 96 L 275 122" class="f-line" marker-end="url(#gArrow2)"/>
  <rect x="200" y="128" width="150" height="34" rx="4" class="f-box"/>
  <text x="275" y="150" class="f-mono f-ink" text-anchor="middle">3b18e512</text>
  <text x="275" y="178" class="f-label f-muted" text-anchor="middle">greeting.txt</text>
  <text x="275" y="196" class="f-label f-muted" text-anchor="middle">блоб, 12 байтаў</text>
  <rect x="390" y="128" width="150" height="34" rx="4" class="f-box"/>
  <text x="465" y="150" class="f-mono f-ink" text-anchor="middle">1c59427a</text>
  <text x="465" y="178" class="f-label f-muted" text-anchor="middle">note.txt</text>
  <text x="465" y="196" class="f-label f-muted" text-anchor="middle">блоб, 12 байтаў</text>
  <rect x="10" y="128" width="150" height="34" rx="4" class="f-plain" stroke-dasharray="4 3"/>
  <text x="85" y="150" class="f-mono f-accent" text-anchor="middle">.git/index</text>
  <text x="85" y="178" class="f-label f-accent" text-anchor="middle">індэкс, не запісаны</text>
  <text x="10" y="230" class="f-label f-muted">status друкуе D і ?? пакуль git reset яго не пабудуе</text>
</svg>
<figcaption>Гэта вынік пяці выклікаў пламбінга. Індэкс гэта адзінае, чаго mktree не чапае, і вывад status быў якраз пра гэта.</figcaption>
</figure>


## Што трапляе ў хэш

`commit-tree` на тым жа дрэве з той жа датай і тым жа паведамленнем зноў дае `b0eabc99`. Праз секунду ён дае `47e87c9eaa1871559a5ee5c44ca3170cfc73f0a2`. Дрэва абодва разы хэшуецца ў `b88f66c9`.

Дрэва гэта функцыя ад змесціва. Коміт нясе яшчэ час і аўтара. Рэбэйз я тут не запускаў, але новыя імёны комітаў пасля рэбэйзу бяруцца адсюль: радок коміцера пішацца нанова ў кожнага коміта, які пераехаў.

## Што я думаў пра змесціва коміта

Я лічыў, што ў коміце ляжыць дыф, бо дыф гэта тое, што друкуе `git show`. Таму я ўзяў `read-cache.c` з зыходнікаў git, 46456 байтаў на 1703 радкі. Далей адзінаццаць комітаў: файл як ён ёсць, потым яшчэ дзесяць, у кожным перапісаны адзін радок у сярэдзіне:

```
$ git diff --stat HEAD~1 HEAD
 read-cache.c |    2 +-
 1 files changed, 1 insertions(+), 1 deletions(-)
```

`count-objects -v` кажа count: 33. Трыццаць тры аб’екты на адзінаццаць комітаў, значыць адзінаццаць блобаў і адзінаццаць дрэў пад імі. Кожны блоб гэта цэлая копія файла, ад 16828 да 16833 байтаў на дыску ў залежнасці ад рэвізіі. Свабодныя аб’екты ў суме даюць 187576 байтаў. Адзін перапісаны радок каментара каштуе цэлага новага блоба.

Далей `git gc`:

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

187576 байтаў ператварыліся ў 16490, гэта ў 11,4 раза менш. Вышэй чатыры з адзінаццаці радкоў з блобамі. З сямі, якіх я не прывёў, шэсць гэта дэльты па 16 байтаў, а адна 14.

База `1530d3b5` гэта самая новая версія файла. Дзесяць старых рэвізій ляжаць дэльтамі ад яе, глыбіня 1, памер ад 14 да 18 байтаў. Рэвізія, якую я закоміціў першай, захоўваецца як дэльта ў 18 байтаў ад апошняй. Калонку size я перачытаў двойчы, перш чым паверыў: у дэльта-аб’екта ў ёй памер дэльты.

```
$ git cat-file -s 4723c6ab5406c51c12595742b8770ebd36062d5b
46467
```

Дыфы існуюць, але ляжаць слоем ніжэй коміта. Лічыць іх repack, а запускае яго `gc`. Тут ён лічыць назад, ад самай новай версіі. У коміце запісана імя дрэва, у дрэве імя блоба, а блоб на дыску гэта па-ранейшаму цэлая копія `read-cache.c`.

<figure class="fig">
<svg viewBox="0 0 640 230" role="img" aria-label="Адзінаццаць рэвізій read-cache.c, захаваныя двума спосабамі. Свабоднымі аб’ектамі кожная рэвізія гэта цэлая копія файла, ад 16828 да 16833 байтаў на дыску, а ўсе 33 аб’екты даюць 187576 байтаў. У пакеце самая новая рэвізія ляжыць цалкам у 13889 байтах, а дзесяць старых гэта дэльты ад 14 да 18 байтаў, якія на яе паказваюць, глыбіня 1, увесь пакет 16490 байтаў.">
  <defs>
    <marker id="gArrow3" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="30" y="34" class="f-label f-muted">свабодныя аб’екты, 11 блобаў</text>
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
  <text x="220" y="120" class="f-label f-muted">ад 16828 да 16833 байтаў на дыску</text>
  <text x="220" y="140" class="f-label f-ink">усе 33 свабодныя аб’екты, 187576 байтаў</text>
  <text x="430" y="34" class="f-label f-muted">у пакеце, адзін файл</text>
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
  <text x="360" y="204" class="f-label f-muted">рэвізія 10, цалкам, 13889</text>
  <text x="430" y="222" class="f-label f-ink">16490 байтаў</text>
  <text x="30" y="222" class="f-label f-muted">рэвізіі з 0 па 9, дэльты ад 14 да 18 байтаў, глыбіня 1</text>
</svg>
<figcaption>Адзінаццаць цэлых копій супраць адной цэлай копіі і дзесяці дэльт. Дэльты паказваюць на самую новую рэвізію, таму самая старая збіраецца з апошняй.</figcaption>
</figure>


## Сорак адзін байт

Правіла пра выдаленне каталога гэта тое, што я і хацеў паправіць. Далей усё гэта ідзе на копіі рэпазіторыя, знятай да `gc`:

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

Гэта першыя два запісы рэфлога з дванаццаці. Рабочае дрэва паехала на тры рэвізіі назад. Коміт, з якога я пайшоў, па-ранейшаму аб’ект і рэфлог яго па-ранейшаму помніць. Вярнуць яго каштавала аднаго `update-ref`. Наступны `reset --hard` перапісаў індэкс і 46 КБ рабочага файла з аб’ектаў, якія нікуды не падзеліся. `count-objects` паказвае 33 і да і пасля ўсяго гэтага.

`git branch invoice-fix` піша спасылку на 41 байт і не дадае ні аднаго аб’екта. Заадно ён піша рэфлог новай галіны на 167 байтаў, значыць галіна абышлася тут у 208 байтаў. «Галіны ў git танныя» гэта фраза, якую я паўтараў, не маючы за ёй ліку.

## Чаго я не праверыў

Як repack выбірае базу дэльты і ці трымаецца глыбіня 1 на сапраўднай гісторыі. Стандартна тут акно 10 і глыбіня да 50. Адзінаццаць рэвізій аднаго тэкставага файла гэта лёгкі выпадак для акна ў 10.

Бінарны файл, у якім дэльце няма чаго паўторна выкарыстоўваць. Тут толькі тэкст.

Калі недасягальны коміт сапраўды знікае. Я памераў, што ён перажывае reset, а да `prune` не дайшоў.
