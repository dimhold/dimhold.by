---
title: "РџСЂРёРІРµС‚: это UTF-8, прочитанный как 1251"
description: "Кракозябры детерминированы. Шесть букв, двенадцать байт, четыре кодовые страницы и таблица, по которой видно, какая пара кодировок столкнулась."
date: 2011-11-09
backfilled: 2026-08-18
lang: ru
translationKey: mojibake-byte-by-byte
---

Мне надоело гадать, и я решил посмотреть на это в байтах. Напечатал `Привет` в UTF-8, получил двенадцать байт на шесть букв и отдал их декодеру, который уверен, что один байт равен одному символу:

```
П      р      и      в      е      т
d0 9f  d1 80  d0 b8  d0 b2  d0 b5  d1 82

читаем как Windows-1251:  РџСЂРёРІРµС‚
```

<figure class="fig">
<svg viewBox="0 0 640 192" role="img" aria-label="Те же двенадцать байт UTF-8, прочитанные четырьмя однобайтовыми кодировками">
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">читаем как windows-1251</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">читаем как windows-1252</text>
    <rect x="46.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="67.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ð</text>
    <rect x="92.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="113.0" y="171" class="f-glyph f-ink" text-anchor="middle"></text>
    <rect x="138.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="159.0" y="171" class="f-glyph f-ink" text-anchor="middle">Ñ</text>
    <rect x="184.0" y="150" width="42" height="30" rx="4" class="f-plain"/>
    <text x="205.0" y="171" class="f-glyph f-ink" text-anchor="middle"></text>
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
    <text x="573.0" y="171" class="f-glyph f-ink" text-anchor="middle"></text>
  </g>
  <g class="f-cycle f-c2">
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">читаем как cp866</text>
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
  <g class="f-cycle f-c3">
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">читаем как koi8-r</text>
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
<figcaption>Двенадцать байт не меняются. Меняется только таблица, по которой их читают. Windows-1252 не рисует ничего для 9f, 80 и 82, поэтому три ячейки пустые.</figcaption>
</figure>


Эта строка ходит за мной пятнадцать лет. Раньше я чинил её перебором кодировок в выпадающем списке, пока текст не вернётся, и это работало, ничему меня не научив.

## Шестьдесят шесть букв, два первых байта

Русская кириллица живёт от U+0410 до U+044F, а `Ё` и `ё` стоят отдельно на U+0401 и U+0451. В UTF-8 все они занимают по два байта. Я собрал первый байт каждой буквы, прописной и строчной:

```
distinct leading bytes for the whole Russian alphabet: d0 d1
```

Два значения на шестьдесят шесть букв. Значит, любая однобайтовая кодовая страница нарисует своё представление о `d0` и `d1` перед каждым вторым символом. Из-за этого мусор можно читать в обратную сторону:

| декодер | `d0` | `d1` | `Здравствуйте, коллеги` приходит как |
|---|---|---|---|
| Windows-1251 | `Р` | `С` | `Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ, РєРѕР»Р»РµРіРё` |
| Windows-1252 | `Ð` | `Ñ` | `ÐÐ´ÑÐ°Ð²ÑÑÐ²ÑÐ¹ÑÐµ, ÐºÐ¾Ð»Ð»ÐµÐ³Ð¸` |
| CP866 | `╨` | `╤` | `╨Ч╨┤╤А╨░╨▓╤Б╤В╨▓╤Г╨╣╤В╨╡, ╨║╨╛╨╗╨╗╨╡╨│╨╕` |
| KOI8-R | `п` | `я` | `п≈п╢я─п╟п╡я│я┌п╡я┐п╧я┌п╣, п╨п╬п╩п╩п╣пЁп╦` |

Частокол из `Р` и `С` значит, что файл прочитали как 1251. `Ð` и `Ñ` указывают на 1252 или Latin-1. Псевдографика вроде `╨` выходит только из CP866. Чередование `п` и `я` только из KOI8-R.

Интереснее всего было проверить свой язык. Белорусская кириллица тоже укладывается в `d0` и `d1`, вместе с `ў`. А украинская ломает правило: `Ґ` кодируется как `d2 90`, и `d2` в 1251 рисуется как `Т`. То есть отпечаток держится на двух языках из трёх проверенных.

## Обратно уже не собрать

Прочитать байты 1251 как UTF-8 значит устроить ту же аварию наоборот. Ведёт она себя совсем иначе:

```
cf f0 e8 e2 e5 f2   как UTF-8:   "������"
```

Ни один из этих байтов не начинает корректную UTF-8-последовательность, поэтому вместо каждого из них декодер пишет U+FFFD. Вариант с `Р` и `С` сохраняет все исходные байты. Я прогнал кракозябры обратно через таблицу 1251 и получил ровно те же `d0 9f d1 80 d0 b8 d0 b2 d0 b5 d1 82`, байт в байт, а из них читается `Привет`. Чтение 1251 как UTF-8 байты выбрасывает.

Если сохранить такой мусор на диск, файл окажется закодирован дважды. Я взял `РџСЂРёРІРµС‚`, поверил ему и записал как UTF-8. Двенадцать байт превратились в двадцать пять.

```
Р СџРЎР‚Р С‘Р Р†Р ВµРЎвЂљ      25 байт
```

## В KOI8-R алфавит разложен по латинице

KOI8-R выглядит так, будто алфавит перетасовали. `ю` идёт раньше `а`, `ц` сидит между `б` и `д`. Вот верхняя половина таблицы, а рядом с каждым байтом стоит ASCII-символ, в который он превращается после сброса восьмого бита:

```
c0 ю/@  c1 а/A  c2 б/B  c3 ц/C  c4 д/D  c5 е/E  c6 ф/F  c7 г/G
c8 х/H  c9 и/I  ca й/J  cb к/K  cc л/L  cd м/M  ce н/N  cf о/O
d0 п/P  d1 я/Q  d2 р/R  d3 с/S  d4 т/T  d5 у/U  d6 ж/V  d7 в/W
d8 ь/X  d9 ы/Y  da з/Z  db ш/[  dc э/\  dd щ/]  de ч/^  df ъ/_
```

`а` стоит на `A`, `б` на `B`, `ц` на `C`, `ф` на `F`. Большинство букв легло поверх своей латинской транслитерации. Тем, кому пары не нашлось, достались остатки: так `ю` оказалась на `@`, а `ъ` на `_`. Сбросьте восьмой бит у строки в KOI8-R, и транслитерация проявится сама:

```
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


Регистр переворачивается, потому что строчная кириллица занимает диапазон прописной латиницы. Это вся плата. Ради этого таблицу и составляли: канал по дороге съел восьмой бит, а текст всё ещё читается. Та же операция над байтами 1251 даёт `Ophber`.

Все три слова, которые я взял, состоят из букв с латинской парой. `ъ` или `щ` внутри вышли бы знаками препинания.

## Что не получилось

У Node нет кодировщика ни для одной из этих кодовых страниц. `TextDecoder` спокойно читает и 1251, и KOI8-R. `Buffer.from` умеет `latin1`, `utf16le` и ещё пару вариантов, кириллицы среди них нет. `TextEncoder` знает только UTF-8. Так что обратную таблицу я собрал сам, декодируя все 256 однобайтовых значений по одному:

```js
function encode(label, str) {
  const d = new TextDecoder(label);
  const map = new Map();
  for (let i = 0; i < 256; i++) map.set(d.decode(new Uint8Array([i])), i);
  return Buffer.from([...str].map((c) => map.get(c) ?? 0x3f));
}
```

Это не настоящий кодировщик. Несколько байтовых значений в разных таблицах декодируются в один и тот же символ, и обратный поиск запоминает последнее из них. На всех словах, что я пробовал, он отработал. В продакшен я бы его не пустил.

Второй сюрприз ждал в моём собственном выводе. Чтение через Latin-1 напечаталось как `ÐÑÐ¸Ð²ÐµÑ`: девять символов из двенадцати байт. Байты `9f`, `80` и `82` попадают там в диапазон управляющих символов C1. Терминал не нарисовал для них вообще ничего. Я довольно долго сверял количество символов, прежде чем это заметил.

## Всё ещё живо в 2026-м

Windows PowerShell 5.1 читает файл без метки порядка байт через системную ANSI-страницу:

```
PS version            : 5.1.19041.7058
Default ANSI codepage : Windows-1252
Get-Content nobom.txt : ÐŸÑ€Ð¸Ð²ÐµÑ‚
Get-Content bom.txt   : Привет
```

Содержимое одно и то же, кодировщик тоже. Разница в трёх байтах `ef bb bf` в начале файла. В выводе сплошные `Ð` и `Ñ`. Вторая строка называет декодер. Три байта BOM всё починили. Но в hex я всё равно полез: без него было непонятно, какая сторона врёт.
