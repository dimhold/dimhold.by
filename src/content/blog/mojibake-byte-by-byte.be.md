---
title: "РџСЂРёРІРµС‚: гэта UTF-8, прачытаны як 1251"
description: "Краказябры дэтэрмінаваныя. Шэсць літар, дванаццаць байтаў, чатыры кодавыя старонкі і табліца, паводле якой відаць, якая пара кадовак сутыкнулася."
date: 2011-11-09
backfilled: 2026-08-18
lang: be
translationKey: mojibake-byte-by-byte
---

Мне надакучыла гадаць, і я вырашыў паглядзець на гэта ў байтах. Надрукаваў `Привет` у UTF-8, атрымаў дванаццаць байтаў на шэсць літар і аддаў іх дэкодару, які ўпэўнены, што адзін байт роўны аднаму сімвалу:

```
П      р      и      в      е      т
d0 9f  d1 80  d0 b8  d0 b2  d0 b5  d1 82

чытаем як Windows-1251:  РџСЂРёРІРµС‚
```

<figure class="fig">
<svg viewBox="0 0 640 192" role="img" aria-label="Тыя ж дванаццаць байтаў UTF-8, прачытаныя чатырма аднабайтавымі кадоўкамі">
  <defs>
    <marker id="figArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="320" y="14" class="f-label f-muted" text-anchor="middle">набрана</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">чытаем як windows-1251</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">чытаем як windows-1252</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">чытаем як cp866</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">чытаем як koi8-r</text>
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
<figcaption>Дванаццаць байтаў не мяняюцца. Мяняецца толькі табліца, паводле якой іх чытаюць. Windows-1252 не малюе нічога для 9f, 80 і 82, таму тры ячэйкі пустыя.</figcaption>
</figure>


Гэты радок цягнецца за мной пятнаццаць гадоў. Раней я выпраўляў яго пераборам кадовак у выпадальным спісе, пакуль тэкст не вернецца, і гэта працавала, нічому мяне не навучыўшы.

## Шэсцьдзясят шэсць літар, два першыя байты

Руская кірыліца жыве ад U+0410 да U+044F, а `Ё` і `ё` стаяць асобна на U+0401 і U+0451. У UTF-8 усе яны займаюць па два байты. Я сабраў першы байт кожнай літары, вялікай і малой:

```
distinct leading bytes for the whole Russian alphabet: d0 d1
```

Два значэнні на шэсцьдзясят шэсць літар. Значыць, любая аднабайтавая кодавая старонка намалюе сваё ўяўленне пра `d0` і `d1` перад кожным другім сімвалам. З-за гэтага смецце чытаецца ў адваротны бок:

| дэкодар | `d0` | `d1` | `Здравствуйте, коллеги` прыходзіць як |
|---|---|---|---|
| Windows-1251 | `Р` | `С` | `Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ, РєРѕР»Р»РµРіРё` |
| Windows-1252 | `Ð` | `Ñ` | `ÐÐ´ÑÐ°Ð²ÑÑÐ²ÑÐ¹ÑÐµ, ÐºÐ¾Ð»Ð»ÐµÐ³Ð¸` |
| CP866 | `╨` | `╤` | `╨Ч╨┤╤А╨░╨▓╤Б╤В╨▓╤Г╨╣╤В╨╡, ╨║╨╛╨╗╨╗╨╡╨│╨╕` |
| KOI8-R | `п` | `я` | `п≈п╢я─п╟п╡я│я┌п╡я┐п╧я┌п╣, п╨п╬п╩п╩п╣пЁп╦` |

Частакол з `Р` і `С` значыць, што файл прачыталі як 1251. `Ð` і `Ñ` паказваюць на 1252 або Latin-1. Псеўдаграфіка накшталт `╨` выходзіць толькі з CP866. Чаргаванне `п` і `я` толькі з KOI8-R.

Найцікавей мне было праверыць сваю мову. Беларуская кірыліца таксама ўкладваецца ў `d0` і `d1`, разам з `ў`. А ўкраінская ламае правіла: `Ґ` кадуецца як `d2 90`, і `d2` у 1251 малюецца як `Т`. Значыць, адбітак трымаецца на дзвюх мовах з трох правераных.

## Назад ужо не сабраць

Прачытаць байты 1251 як UTF-8 значыць зладзіць тую самую аварыю наадварот. Паводзіць яна сябе зусім інакш:

```
cf f0 e8 e2 e5 f2   як UTF-8:   "������"
```

Ніводзін з гэтых байтаў не пачынае карэктную UTF-8-паслядоўнасць, таму замест кожнага з іх дэкодар піша U+FFFD. Варыянт з `Р` і `С` захоўвае ўсе зыходныя байты. Я прагнаў краказябры назад праз табліцу 1251 і атрымаў роўна тыя ж `d0 9f d1 80 d0 b8 d0 b2 d0 b5 d1 82`, байт у байт, а з іх чытаецца `Привет`. Чытанне 1251 як UTF-8 байты выкідвае.

Калі захаваць такое смецце на дыск, файл акажацца закадаваны двойчы. Я ўзяў `РџСЂРёРІРµС‚`, паверыў яму і запісаў як UTF-8. Дванаццаць байтаў ператварыліся ў дваццаць пяць.

```
Р СџРЎР‚Р С‘Р Р†Р ВµРЎвЂљ      25 байтаў
```

## У KOI8-R алфавіт раскладзены па лацінцы

KOI8-R выглядае так, быццам алфавіт ператасавалі. `ю` ідзе раней за `а`, `ц` сядзіць паміж `б` і `д`. Вось верхняя палова табліцы, а побач з кожным байтам стаіць ASCII-сімвал, у які ён ператвараецца пасля скідання восьмага біта:

```
c0 ю/@  c1 а/A  c2 б/B  c3 ц/C  c4 д/D  c5 е/E  c6 ф/F  c7 г/G
c8 х/H  c9 и/I  ca й/J  cb к/K  cc л/L  cd м/M  ce н/N  cf о/O
d0 п/P  d1 я/Q  d2 р/R  d3 с/S  d4 т/T  d5 у/U  d6 ж/V  d7 в/W
d8 ь/X  d9 ы/Y  da з/Z  db ш/[  dc э/\  dd щ/]  de ч/^  df ъ/_
```

`а` стаіць на `A`, `б` на `B`, `ц` на `C`, `ф` на `F`. Большасць літар легла паверх сваёй лацінскай транслітарацыі. Тым, каму пары не знайшлося, дасталіся рэшткі: так `ю` апынулася на `@`, а `ъ` на `_`. Скіньце восьмы біт у радка ў KOI8-R, і транслітарацыя праявіцца сама:

```
Здравствуйте   fa c4 d2 c1 d7 d3 d4 d7 d5 ca d4 c5   ->   zDRAWSTWUJTE
Кодировка      eb cf c4 c9 d2 cf d7 cb c1            ->   kODIROWKA
Спасибо        f3 d0 c1 d3 c9 c2 cf                  ->   sPASIBO
```

<figure class="fig">
<svg viewBox="0 0 640 194" role="img" aria-label="Байт KOI8-R губляе старэйшы біт і ператвараецца ў лацінскую літару, паверх якой ён быў пакладзены">
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
<figcaption>Байт eb у KOI8-R гэта К. Скіньце восьмы біт, атрымаецца 6b, гэта значыць k. Увесь алфавіт раскладзены паводле гэтага прынцыпу.</figcaption>
</figure>


Рэгістр перакульваецца, бо малая кірыліца займае дыяпазон вялікай лацінкі. Гэта ўся плата. Дзеля гэтага табліцу і складалі: канал па дарозе з'еў восьмы біт, а тэкст усё яшчэ чытаецца. Тая ж аперацыя над байтамі 1251 дае `Ophber`.

Усе тры словы, якія я ўзяў, складаюцца з літар, якія маюць лацінскую пару. `ъ` ці `щ` усярэдзіне выйшлі б знакамі прыпынку.

## Што не атрымалася

У Node няма кадавальніка ні для адной з гэтых кодавых старонак. `TextDecoder` спакойна чытае і 1251, і KOI8-R. `Buffer.from` умее `latin1`, `utf16le` ды яшчэ пару варыянтаў, кірыліцы сярод іх няма. `TextEncoder` гаворыць толькі на UTF-8. Так што адваротную табліцу я сабраў сам, дэкадуючы ўсе 256 аднабайтавых значэнняў па адным:

```js
function encode(label, str) {
  const d = new TextDecoder(label);
  const map = new Map();
  for (let i = 0; i < 256; i++) map.set(d.decode(new Uint8Array([i])), i);
  return Buffer.from([...str].map((c) => map.get(c) ?? 0x3f));
}
```

Гэта не сапраўдны кадавальнік. Некалькі байтавых значэнняў у розных табліцах дэкадуюцца ў адзін і той самы сімвал, і адваротны пошук запамінае апошняе ўбачанае значэнне. На ўсіх словах, што я спрабаваў, ён адпрацаваў. У прадакшн я б яго не пусціў.

Другі сюрпрыз чакаў у маім уласным вывадзе. Чытанне праз Latin-1 надрукавалася як `ÐÑÐ¸Ð²ÐµÑ`: дзевяць сімвалаў з дванаццаці байтаў. Байты `9f`, `80` і `82` трапляюць там у дыяпазон кіравальных сімвалаў C1. Тэрмінал не намаляваў для іх наогул нічога. Я даволі доўга звяраў колькасць сімвалаў, перш чым гэта заўважыў.

## Усё яшчэ жывое ў 2026-м

Windows PowerShell 5.1 чытае файл без меткі парадку байтаў праз сістэмную ANSI-старонку:

```
PS version            : 5.1.19041.7058
Default ANSI codepage : Windows-1252
Get-Content nobom.txt : ÐŸÑ€Ð¸Ð²ÐµÑ‚
Get-Content bom.txt   : Привет
```

Змест той самы, кадавальнік таксама. Розніца ў трох байтах `ef bb bf` на пачатку файла. У вывадзе суцэльныя `Ð` і `Ñ`. Другі радок называе дэкодар. Тры байты BOM усё палагодзілі. Але ў hex я ўсё роўна палез: без яго было незразумела, які бок хлусіць.
