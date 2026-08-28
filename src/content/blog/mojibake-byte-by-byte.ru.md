---
title: 'Читаем UTF-8 как 1251: "РџСЂРёРІРµС‚"'
description: "Кракозябры детерминированы. Шесть букв, двенадцать байт, пять кодовых страниц и таблица, по которой видно, какая пара кодировок столкнулась."
date: 2011-11-09
lang: ru
translationKey: mojibake-byte-by-byte
---

Мне надоело гадать. Я решил посмотреть на это в байтах. Напечатал `Привет` в UTF-8 и получил двенадцать байт на шесть букв. Потом отдал их декодеру, который уверен, что один байт равен одному символу:

```
$ printf 'Привет' | xxd
00000000: d09f d180 d0b8 d0b2 d0b5 d182            ............

$ printf 'Привет' | iconv -f CP1251 -t UTF-8
РџСЂРёРІРµС‚
```

<figure class="fig">
<svg viewBox="0 0 640 192" role="img" aria-label="Те же двенадцать байт UTF-8, прочитанные пятью однобайтовыми кодировками">
  <defs>
    <marker id="figArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="320" y="14" class="f-label f-muted" text-anchor="middle">набрано</text>
  <text x="90.0" y="42" class="f-glyph f-ink" text-anchor="middle">П</text>
  <text x="182.0" y="42" class="f-glyph f-ink" text-anchor="middle">р</text>
  <text x="274.0" y="42" class="f-glyph f-ink" text-anchor="middle">и</text>
  <text x="366.0" y="42" class="f-glyph f-ink" text-anchor="middle">в</text>
  <text x="458.0" y="42" class="f-glyph f-ink" text-anchor="middle">е</text>
  <text x="550.0" y="42" class="f-glyph f-ink" text-anchor="middle">т</text>
  <text x="320" y="62" class="f-label f-muted" text-anchor="middle">байты utf-8</text>
  <rect x="46.0" y="70" width="42" height="26" rx="4" class="f-box"/>
  <text x="67.0" y="88" class="f-mono f-ink" text-anchor="middle">d0</text>
  <rect x="92.0" y="70" width="42" height="26" rx="4" class="f-box"/>
  <text x="113.0" y="88" class="f-mono f-ink" text-anchor="middle">9f</text>
  <rect x="138.0" y="70" width="42" height="26" rx="4" class="f-box"/>
  <text x="159.0" y="88" class="f-mono f-ink" text-anchor="middle">d1</text>
  <rect x="184.0" y="70" width="42" height="26" rx="4" class="f-box"/>
  <text x="205.0" y="88" class="f-mono f-ink" text-anchor="middle">80</text>
  <rect x="230.0" y="70" width="42" height="26" rx="4" class="f-box"/>
  <text x="251.0" y="88" class="f-mono f-ink" text-anchor="middle">d0</text>
  <rect x="276.0" y="70" width="42" height="26" rx="4" class="f-box"/>
  <text x="297.0" y="88" class="f-mono f-ink" text-anchor="middle">b8</text>
  <rect x="322.0" y="70" width="42" height="26" rx="4" class="f-box"/>
  <text x="343.0" y="88" class="f-mono f-ink" text-anchor="middle">d0</text>
  <rect x="368.0" y="70" width="42" height="26" rx="4" class="f-box"/>
  <text x="389.0" y="88" class="f-mono f-ink" text-anchor="middle">b2</text>
  <rect x="414.0" y="70" width="42" height="26" rx="4" class="f-box"/>
  <text x="435.0" y="88" class="f-mono f-ink" text-anchor="middle">d0</text>
  <rect x="460.0" y="70" width="42" height="26" rx="4" class="f-box"/>
  <text x="481.0" y="88" class="f-mono f-ink" text-anchor="middle">b5</text>
  <rect x="506.0" y="70" width="42" height="26" rx="4" class="f-box"/>
  <text x="527.0" y="88" class="f-mono f-ink" text-anchor="middle">d1</text>
  <rect x="552.0" y="70" width="42" height="26" rx="4" class="f-box"/>
  <text x="573.0" y="88" class="f-mono f-ink" text-anchor="middle">82</text>
  <path d="M 320 103 L 320 121" class="f-line" marker-end="url(#figArrow)"/>
  <g class="f-cycle f-c0">
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">читаем как CP1251</text>
    <rect x="46.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="67.0" y="171" class="f-glyph f-ink" text-anchor="middle">Р</text>
    <rect x="92.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="113.0" y="171" class="f-glyph f-ink" text-anchor="middle">џ</text>
    <rect x="138.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="159.0" y="171" class="f-glyph f-ink" text-anchor="middle">С</text>
    <rect x="184.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="205.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ђ</text>
    <rect x="230.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="251.0" y="171" class="f-glyph f-ink" text-anchor="middle">Р</text>
    <rect x="276.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="297.0" y="171" class="f-glyph f-ink" text-anchor="middle">ё</text>
    <rect x="322.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="343.0" y="171" class="f-glyph f-ink" text-anchor="middle">Р</text>
    <rect x="368.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="389.0" y="171" class="f-glyph f-ink" text-anchor="middle">І</text>
    <rect x="414.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="435.0" y="171" class="f-glyph f-ink" text-anchor="middle">Р</text>
    <rect x="460.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="481.0" y="171" class="f-glyph f-ink" text-anchor="middle">µ</text>
    <rect x="506.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="527.0" y="171" class="f-glyph f-ink" text-anchor="middle">С</text>
    <rect x="552.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="573.0" y="171" class="f-glyph f-ink" text-anchor="middle">‚</text>
  </g>
  <g class="f-cycle f-c1">
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">читаем как CP1252</text>
    <rect x="46.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="67.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ð</text>
    <rect x="92.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="113.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ÿ</text>
    <rect x="138.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="159.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ñ</text>
    <rect x="184.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="205.0" y="171" class="f-glyph f-ink" text-anchor="middle">€</text>
    <rect x="230.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="251.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ð</text>
    <rect x="276.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="297.0" y="171" class="f-glyph f-ink" text-anchor="middle">¸</text>
    <rect x="322.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="343.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ð</text>
    <rect x="368.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="389.0" y="171" class="f-glyph f-ink" text-anchor="middle">²</text>
    <rect x="414.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="435.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ð</text>
    <rect x="460.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="481.0" y="171" class="f-glyph f-ink" text-anchor="middle">µ</text>
    <rect x="506.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="527.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ñ</text>
    <rect x="552.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="573.0" y="171" class="f-glyph f-ink" text-anchor="middle">‚</text>
  </g>
  <g class="f-cycle f-c2">
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">читаем как ISO-8859-1</text>
    <rect x="46.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="67.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ð</text>
    <rect x="92.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="113.0" y="169" class="f-mono f-muted" text-anchor="middle" opacity="0.55">&#8709;</text>
    <rect x="138.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="159.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ñ</text>
    <rect x="184.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="205.0" y="169" class="f-mono f-muted" text-anchor="middle" opacity="0.55">&#8709;</text>
    <rect x="230.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="251.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ð</text>
    <rect x="276.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="297.0" y="171" class="f-glyph f-ink" text-anchor="middle">¸</text>
    <rect x="322.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="343.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ð</text>
    <rect x="368.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="389.0" y="171" class="f-glyph f-ink" text-anchor="middle">²</text>
    <rect x="414.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="435.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ð</text>
    <rect x="460.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="481.0" y="171" class="f-glyph f-ink" text-anchor="middle">µ</text>
    <rect x="506.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="527.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ñ</text>
    <rect x="552.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="573.0" y="169" class="f-mono f-muted" text-anchor="middle" opacity="0.55">&#8709;</text>
  </g>
  <g class="f-cycle f-c3">
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">читаем как CP866</text>
    <rect x="46.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="67.0" y="171" class="f-glyph f-ink" text-anchor="middle">╨</text>
    <rect x="92.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="113.0" y="171" class="f-glyph f-ink" text-anchor="middle">Я</text>
    <rect x="138.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="159.0" y="171" class="f-glyph f-ink" text-anchor="middle">╤</text>
    <rect x="184.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="205.0" y="171" class="f-glyph f-ink" text-anchor="middle">А</text>
    <rect x="230.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="251.0" y="171" class="f-glyph f-ink" text-anchor="middle">╨</text>
    <rect x="276.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="297.0" y="171" class="f-glyph f-ink" text-anchor="middle">╕</text>
    <rect x="322.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="343.0" y="171" class="f-glyph f-ink" text-anchor="middle">╨</text>
    <rect x="368.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="389.0" y="171" class="f-glyph f-ink" text-anchor="middle">▓</text>
    <rect x="414.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="435.0" y="171" class="f-glyph f-ink" text-anchor="middle">╨</text>
    <rect x="460.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="481.0" y="171" class="f-glyph f-ink" text-anchor="middle">╡</text>
    <rect x="506.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="527.0" y="171" class="f-glyph f-ink" text-anchor="middle">╤</text>
    <rect x="552.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="573.0" y="171" class="f-glyph f-ink" text-anchor="middle">В</text>
  </g>
  <g class="f-cycle f-c4">
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">читаем как KOI8-R</text>
    <rect x="46.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="67.0" y="171" class="f-glyph f-ink" text-anchor="middle">п</text>
    <rect x="92.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="113.0" y="171" class="f-glyph f-ink" text-anchor="middle">÷</text>
    <rect x="138.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="159.0" y="171" class="f-glyph f-ink" text-anchor="middle">я</text>
    <rect x="184.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="205.0" y="171" class="f-glyph f-ink" text-anchor="middle">─</text>
    <rect x="230.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="251.0" y="171" class="f-glyph f-ink" text-anchor="middle">п</text>
    <rect x="276.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="297.0" y="171" class="f-glyph f-ink" text-anchor="middle">╦</text>
    <rect x="322.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="343.0" y="171" class="f-glyph f-ink" text-anchor="middle">п</text>
    <rect x="368.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="389.0" y="171" class="f-glyph f-ink" text-anchor="middle">╡</text>
    <rect x="414.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="435.0" y="171" class="f-glyph f-ink" text-anchor="middle">п</text>
    <rect x="460.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="481.0" y="171" class="f-glyph f-ink" text-anchor="middle">╣</text>
    <rect x="506.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="527.0" y="171" class="f-glyph f-ink" text-anchor="middle">я</text>
    <rect x="552.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="573.0" y="171" class="f-glyph f-ink" text-anchor="middle">┌</text>
  </g>
</svg>
<figcaption>Двенадцать байт не меняются. Меняется только таблица, по которой их читают. В ISO-8859-1 на местах 9f, 80 и 82 стоят управляющие C1, поэтому три ячейки пустуют, а CP1252 их заполняет.</figcaption>
</figure>


Обычно я чиню такое перебором кодировок в выпадающем списке, пока текст не вернётся. Способ работает. При этом я ни разу не заглянул, что там под капотом.

## Шестьдесят шесть букв, два первых байта

Русская кириллица живёт от U+0410 до U+044F, а `Ё` и `ё` стоят отдельно на U+0401 и U+0451. В UTF-8 все они занимают по два байта. Я собрал первый байт каждой буквы, прописной и строчной:

```
$ perl -CO -e 'print map { chr } (0x401, 0x451, 0x410..0x44f)' \
    | perl -ne 'for my $b (unpack "C*", $_) { $seen{$b} = 1 if $b >= 0xC0 }
        END { print join " ", map { sprintf "%02x", $_ } sort keys %seen }'
d0 d1
```

Два значения на шестьдесят шесть букв. Значит, любая однобайтовая кодовая страница нарисует своё представление о `d0` и `d1` перед каждым вторым символом. Из-за этого мусор можно читать в обратную сторону:

| декодер | `d0` | `d1` | `Привет` приходит как |
|---|---|---|---|
| CP1251 | `Р` | `С` | `РџСЂРёРІРµС‚` |
| CP1252 | `Ð` | `Ñ` | `ÐŸÑ€Ð¸Ð²ÐµÑ‚` |
| ISO-8859-1 | `Ð` | `Ñ` | `ÐÑÐ¸Ð²ÐµÑ` |
| CP866 | `╨` | `╤` | `╨Я╤А╨╕╨▓╨╡╤В` |
| KOI8-R | `п` | `я` | `п÷я─п╦п╡п╣я┌` |

Частокол из `Р` и `С` значит, что файл прочитали как 1251. На практике это почти всегда мой случай. Остальные четыре встречаются реже и точно так же читаются по первой колонке.

CP1252 и ISO-8859-1 согласны насчёт `d0` и `d1`, поэтому отпечаток у них одинаковый. А вот в диапазоне от `80` до `9f` они расходятся. У CP1252 там печатные символы. Он выдаёт `ÐŸÑ€Ð¸Ð²ÐµÑ‚`: двенадцать символов на двенадцать байт. В ISO-8859-1 тот же диапазон занят управляющими C1. Байты `9f`, `80` и `82` не печатаются вообще, поэтому та же строка выходит как `ÐÑÐ¸Ð²ÐµÑ`, девять видимых символов. Я полчаса сверял количество символов, прежде чем до этого дошёл.

Фокус у́же, чем кажется. Белорусская кириллица тоже укладывается в `d0` и `d1`, вместе с `ў`. А украинская ломает правило: `Ґ` кодируется как `d2 90`. В 1251 `d2` рисуется как `Т`.

## Обратно уже не собрать

Прочитать байты 1251 как UTF-8 значит устроить ту же аварию наоборот. Ведёт она себя совсем иначе:

```
$ printf 'Привет' | iconv -f UTF-8 -t CP1251 | xxd
00000000: cff0 e8e2 e5f2                           ......

$ printf 'Привет' | iconv -f UTF-8 -t CP1251 | iconv -f UTF-8 -t UTF-8
iconv: (stdin):1:0: cannot convert
```

Ни один из этих шести байт не начинает корректную UTF-8-последовательность, поэтому iconv останавливается на первом же. Редактор, в котором у меня был открыт тот же файл, повёл себя менее честно. Он подставил U+FFFD на каждую позицию, из-за чего кажется, будто с текстом ещё можно работать.

Вариант с `Р` и `С` сохраняет все исходные байты. Если прогнать кракозябры обратно через 1251, возвращается ровно то, что было:

```
$ printf 'Привет' | iconv -f CP1251 -t UTF-8 | iconv -f UTF-8 -t CP1251 | xxd
00000000: d09f d180 d0b8 d0b2 d0b5 d182            ............
```

А если вместо обратной конвертации мусор просто сохранить, файл окажется закодирован дважды. Двенадцать байт превращаются в двадцать пять.

```
$ printf 'Привет' | iconv -f CP1251 -t UTF-8 | wc -c
25
```

## В KOI8-R алфавит разложен по латинице

KOI8-R выглядит так, будто алфавит перетасовали. `ю` идёт раньше `а`, `ц` сидит между `б` и `д`. Вот верхняя половина таблицы, а рядом с каждым байтом стоит ASCII-символ, в который он превращается после сброса восьмого бита:

```
c0 ю @  c1 а A  c2 б B  c3 ц C  c4 д D  c5 е E  c6 ф F  c7 г G
c8 х H  c9 и I  ca й J  cb к K  cc л L  cd м M  ce н N  cf о O
d0 п P  d1 я Q  d2 р R  d3 с S  d4 т T  d5 у U  d6 ж V  d7 в W
d8 ь X  d9 ы Y  da з Z  db ш [  dc э \  dd щ ]  de ч ^  df ъ _
```

`а` стоит на `A`, `б` на `B`, `ц` на `C`, `ф` на `F`. Большинство букв легло поверх своей латинской транслитерации. Тем, кому пары не нашлось, достались остатки: так `ю` оказалась на `@`, а `ъ` на `_`. Сбросьте восьмой бит у строки в KOI8-R. Транслитерация проявится сама:

```
$ printf 'Кодировка' | iconv -f UTF-8 -t KOI8-R | perl -pe 's/(.)/chr(ord($1) & 0x7f)/ge'
kODIROWKA

Здравствуйте   fa c4 d2 c1 d7 d3 d4 d7 d5 ca d4 c5   ->   zDRAWSTWUJTE
Кодировка      eb cf c4 c9 d2 cf d7 cb c1            ->   kODIROWKA
Спасибо        f3 d0 c1 d3 c9 c2 cf                  ->   sPASIBO
```

<figure class="fig">
<svg viewBox="0 0 640 194" role="img" aria-label="Байт KOI8-R теряет старший бит и превращается в латинскую букву, поверх которой он был положен">
  <defs>
    <marker id="figArrow2" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="20" y="16" class="f-label f-muted">koi8-r</text>
  <text x="40" y="54" class="f-glyph f-ink" text-anchor="middle">К</text>
  <text x="82" y="52" class="f-mono f-muted" text-anchor="middle">=</text>
  <text x="124" y="52" class="f-mono f-ink" text-anchor="middle">eb</text>
  <text x="166" y="52" class="f-mono f-muted" text-anchor="middle">=</text>
  <g class="f-bit"><rect x="214" y="32" width="30" height="30" rx="4" class="f-box"/><text x="229" y="53" class="f-mono f-accent" text-anchor="middle">1</text></g>
  <rect x="248" y="32" width="30" height="30" rx="4" class="f-box"/><text x="263" y="53" class="f-mono f-accent" text-anchor="middle">1</text>
  <rect x="282" y="32" width="30" height="30" rx="4" class="f-box"/><text x="297" y="53" class="f-mono f-accent" text-anchor="middle">1</text>
  <rect x="316" y="32" width="30" height="30" rx="4" class="f-plain"/><text x="331" y="53" class="f-mono f-muted" text-anchor="middle">0</text>
  <rect x="350" y="32" width="30" height="30" rx="4" class="f-box"/><text x="365" y="53" class="f-mono f-accent" text-anchor="middle">1</text>
  <rect x="384" y="32" width="30" height="30" rx="4" class="f-plain"/><text x="399" y="53" class="f-mono f-muted" text-anchor="middle">0</text>
  <rect x="418" y="32" width="30" height="30" rx="4" class="f-box"/><text x="433" y="53" class="f-mono f-accent" text-anchor="middle">1</text>
  <rect x="452" y="32" width="30" height="30" rx="4" class="f-box"/><text x="467" y="53" class="f-mono f-accent" text-anchor="middle">1</text>
  <text x="229" y="26" class="f-label f-accent" text-anchor="middle">bit 8</text>
  <path d="M 229 70 L 229 96" class="f-line" marker-end="url(#figArrow2)"/>
  <text x="254" y="90" class="f-label f-muted">&amp; 0x7F</text>
  <g class="f-reveal">
  <text x="40" y="124" class="f-glyph f-accent" text-anchor="middle">k</text>
  <text x="82" y="122" class="f-mono f-muted" text-anchor="middle">=</text>
  <text x="124" y="122" class="f-mono f-ink" text-anchor="middle">6b</text>
  <text x="166" y="122" class="f-mono f-muted" text-anchor="middle">=</text>
  <rect x="214" y="102" width="30" height="30" rx="4" class="f-plain"/><text x="229" y="123" class="f-mono f-muted" text-anchor="middle">0</text>
  <rect x="248" y="102" width="30" height="30" rx="4" class="f-box"/><text x="263" y="123" class="f-mono f-accent" text-anchor="middle">1</text>
  <rect x="282" y="102" width="30" height="30" rx="4" class="f-box"/><text x="297" y="123" class="f-mono f-accent" text-anchor="middle">1</text>
  <rect x="316" y="102" width="30" height="30" rx="4" class="f-plain"/><text x="331" y="123" class="f-mono f-muted" text-anchor="middle">0</text>
  <rect x="350" y="102" width="30" height="30" rx="4" class="f-box"/><text x="365" y="123" class="f-mono f-accent" text-anchor="middle">1</text>
  <rect x="384" y="102" width="30" height="30" rx="4" class="f-plain"/><text x="399" y="123" class="f-mono f-muted" text-anchor="middle">0</text>
  <rect x="418" y="102" width="30" height="30" rx="4" class="f-box"/><text x="433" y="123" class="f-mono f-accent" text-anchor="middle">1</text>
  <rect x="452" y="102" width="30" height="30" rx="4" class="f-box"/><text x="467" y="123" class="f-mono f-accent" text-anchor="middle">1</text>
  </g>
  <text x="20" y="176" class="f-mono f-ink">Кодировка</text>
  <path d="M 130 171 L 176 171" class="f-line" marker-end="url(#figArrow2)"/>
  <g class="f-reveal"><text x="192" y="176" class="f-mono f-accent">kODIROWKA</text></g>
</svg>
<figcaption>Байт eb в KOI8-R это К. Сбросьте восьмой бит, получится 6b, то есть k. Весь алфавит разложен по этому принципу.</figcaption>
</figure>


Регистр переворачивается, потому что строчная кириллица занимает диапазон прописной латиницы. Канал по дороге съел восьмой бит, а текст всё ещё читается. При таком проценте попаданий это вряд ли совпадение. Та же операция над байтами 1251 даёт `Ophber`.

Все три слова, которые я взял, состоят из букв с латинской парой. `ъ` или `щ` внутри вышли бы знаками препинания.

## Что не получилось

Я хотел прогнать через все декодеры фразу подлиннее, `Здравствуйте, коллеги`. CP1252 отказался:

```
CP1252   Ð—Ð´Ñ€Ð°Ð²Ñ
iconv: (stdin):1:11: cannot convert
```

Он встал на одиннадцатом байте, а это `81`. В CP1252 пять байтовых значений не определены. `81` одно из них, так что конвертеру, который идёт строго по таблице, вернуть нечего. Тот самый диапазон C1, из-за которого CP1252 и ISO-8859-1 печатают по-разному, оказался и тем, где один из них падает совсем.

В этом диапазоне тесно. У тридцати четырёх букв из шестидесяти шести второй байт лежит между `80` и `9f`. То есть чуть больше половины любого кириллического текста попадает туда, где эти две таблицы перестают совпадать. Что делают с теми же байтами CP1250 и CP1257, я пока не проверял.
