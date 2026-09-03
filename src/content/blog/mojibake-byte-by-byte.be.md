---
title: 'Чытаем UTF-8 як 1251: "РџСЂРёРІРµС‚"'
description: "Краказябры дэтэрмінаваныя. Шэсць літар, дванаццаць байтаў, пяць кодавых старонак і табліца, паводле якой відаць, якая пара кадовак сутыкнулася."
date: 2011-11-09
lang: be
translationKey: mojibake-byte-by-byte
tags: ["text", "debugging"]
---

Мне надакучыла гадаць. Я вырашыў паглядзець на гэта ў байтах. Надрукаваў `Привет` у UTF-8 і атрымаў дванаццаць байтаў на шэсць літар. Потым аддаў іх дэкодару, які ўпэўнены, што адзін байт роўны аднаму сімвалу:

```
$ printf 'Привет' | xxd
00000000: d09f d180 d0b8 d0b2 d0b5 d182            ............

$ printf 'Привет' | iconv -f CP1251 -t UTF-8
РџСЂРёРІРµС‚
```

<figure class="fig">
<svg viewBox="0 0 640 192" role="img" aria-label="Тыя ж дванаццаць байтаў UTF-8, прачытаныя пяццю аднабайтавымі кадоўкамі">
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">чытаем як CP1251</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">чытаем як CP1252</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">чытаем як ISO-8859-1</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">чытаем як CP866</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">чытаем як KOI8-R</text>
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
<figcaption>Дванаццаць байтаў не мяняюцца. Мяняецца толькі табліца, паводле якой іх чытаюць. У ISO-8859-1 на месцах 9f, 80 і 82 стаяць кіравальныя C1, таму тры ячэйкі пустуюць, а CP1252 іх запаўняе.</figcaption>
</figure>


Звычайна я выпраўляю такое пераборам кадовак у выпадальным спісе, пакуль тэкст не вернецца. Спосаб працуе. Пры гэтым я ні разу не зазірнуў, што там пад капотам.

## Шэсцьдзясят шэсць літар, два першыя байты

Руская кірыліца жыве ад U+0410 да U+044F, а `Ё` і `ё` стаяць асобна на U+0401 і U+0451. У UTF-8 усе яны займаюць па два байты. Я сабраў першы байт кожнай літары, вялікай і малой:

```
$ perl -CO -e 'print map { chr } (0x401, 0x451, 0x410..0x44f)' \
    | perl -ne 'for my $b (unpack "C*", $_) { $seen{$b} = 1 if $b >= 0xC0 }
        END { print join " ", map { sprintf "%02x", $_ } sort keys %seen }'
d0 d1
```

Два значэнні на шэсцьдзясят шэсць літар. Значыць, любая аднабайтавая кодавая старонка намалюе сваё ўяўленне пра `d0` і `d1` перад кожным другім сімвалам. З-за гэтага смецце можна чытаць у адваротны бок:

| дэкодар | `d0` | `d1` | `Привет` прыходзіць як |
|---|---|---|---|
| CP1251 | `Р` | `С` | `РџСЂРёРІРµС‚` |
| CP1252 | `Ð` | `Ñ` | `ÐŸÑ€Ð¸Ð²ÐµÑ‚` |
| ISO-8859-1 | `Ð` | `Ñ` | `ÐÑÐ¸Ð²ÐµÑ` |
| CP866 | `╨` | `╤` | `╨Я╤А╨╕╨▓╨╡╤В` |
| KOI8-R | `п` | `я` | `п÷я─п╦п╡п╣я┌` |

Частакол з `Р` і `С` значыць, што файл прачыталі як 1251. На практыцы гэта амаль заўсёды мой выпадак. Астатнія чатыры трапляюцца радзей і гэтак жа чытаюцца па першай калонцы.

CP1252 і ISO-8859-1 згодныя наконт `d0` і `d1`, таму адбітак у іх аднолькавы. А вось у дыяпазоне ад `80` да `9f` яны разыходзяцца. У CP1252 там друкавальныя сімвалы. Ён выдае `ÐŸÑ€Ð¸Ð²ÐµÑ‚`: дванаццаць сімвалаў на дванаццаць байтаў. У ISO-8859-1 той самы дыяпазон заняты кіравальнымі C1. Байты `9f`, `80` і `82` не друкуюцца наогул, таму той самы радок выходзіць як `ÐÑÐ¸Ð²ÐµÑ`, дзевяць бачных сімвалаў. Я паўгадзіны звяраў колькасць сімвалаў, перш чым да гэтага дайшоў.

Найцікавей мне было праверыць сваю мову. Беларуская кірыліца таксама ўкладваецца ў `d0` і `d1`, разам з `ў`. А ўкраінская ламае правіла: `Ґ` кадуецца як `d2 90`. У 1251 `d2` малюецца як `Т`.

## Назад ужо не сабраць

Прачытаць байты 1251 як UTF-8 значыць зладзіць тую самую аварыю наадварот. Паводзіць яна сябе зусім інакш:

```
$ printf 'Привет' | iconv -f UTF-8 -t CP1251 | xxd
00000000: cff0 e8e2 e5f2                           ......

$ printf 'Привет' | iconv -f UTF-8 -t CP1251 | iconv -f UTF-8 -t UTF-8
iconv: (stdin):1:0: cannot convert
```

Ніводзін з гэтых шасці байтаў не пачынае карэктную UTF-8-паслядоўнасць, таму iconv спыняецца на першым жа. Рэдактар, у якім у мяне быў адкрыты той самы файл, павёў сябе менш сумленна. Ён падставіў U+FFFD на кожную пазіцыю, з-за чаго здаецца, быццам з тэкстам яшчэ можна працаваць.

Варыянт з `Р` і `С` захоўвае ўсе зыходныя байты. Калі прагнаць краказябры назад праз 1251, вяртаецца роўна тое, што было:

```
$ printf 'Привет' | iconv -f CP1251 -t UTF-8 | iconv -f UTF-8 -t CP1251 | xxd
00000000: d09f d180 d0b8 d0b2 d0b5 d182            ............
```

А калі замест адваротнай канверсіі смецце проста захаваць, файл акажацца закадаваны двойчы. Дванаццаць байтаў ператвараюцца ў дваццаць пяць.

```
$ printf 'Привет' | iconv -f CP1251 -t UTF-8 | wc -c
25
```

## У KOI8-R алфавіт раскладзены па лацінцы

KOI8-R выглядае так, быццам алфавіт ператасавалі. `ю` ідзе раней за `а`, `ц` сядзіць паміж `б` і `д`. Вось верхняя палова табліцы, а побач з кожным байтам стаіць ASCII-сімвал, у які ён ператвараецца пасля скідання восьмага біта:

```
c0 ю @  c1 а A  c2 б B  c3 ц C  c4 д D  c5 е E  c6 ф F  c7 г G
c8 х H  c9 и I  ca й J  cb к K  cc л L  cd м M  ce н N  cf о O
d0 п P  d1 я Q  d2 р R  d3 с S  d4 т T  d5 у U  d6 ж V  d7 в W
d8 ь X  d9 ы Y  da з Z  db ш [  dc э \  dd щ ]  de ч ^  df ъ _
```

`а` стаіць на `A`, `б` на `B`, `ц` на `C`, `ф` на `F`. Большасць літар легла паверх сваёй лацінскай транслітарацыі. Тым, каму пары не знайшлося, дасталіся рэшткі: так `ю` апынулася на `@`, а `ъ` на `_`. Скіньце восьмы біт у радка ў KOI8-R. Транслітарацыя праявіцца сама:

```
$ printf 'Кодировка' | iconv -f UTF-8 -t KOI8-R | perl -pe 's/(.)/chr(ord($1) & 0x7f)/ge'
kODIROWKA

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


Рэгістр перакульваецца, бо малая кірыліца займае дыяпазон вялікай лацінкі. Канал па дарозе з'еў восьмы біт, а тэкст усё яшчэ чытаецца. Пры такім адсотку трапленняў гэта наўрад ці выпадковасць. Тая самая аперацыя над байтамі 1251 дае `Ophber`.

Усе тры словы, якія я ўзяў, складаюцца з літар, якія маюць лацінскую пару. `ъ` ці `щ` усярэдзіне выйшлі б знакамі прыпынку.

## Што не атрымалася

Я хацеў прагнаць праз усе дэкодары фразу даўжэйшую, `Здравствуйте, коллеги`. CP1252 адмовіўся:

```
CP1252   Ð—Ð´Ñ€Ð°Ð²Ñ
iconv: (stdin):1:11: cannot convert
```

Ён стаў на адзінаццатым байце, а гэта `81`. У CP1252 пяць байтавых значэнняў не вызначаныя. `81` адно з іх, так што канвертару, які ідзе строга па табліцы, вяртаць няма чаго. Той самы дыяпазон C1, з-за якога CP1252 і ISO-8859-1 друкуюць па-рознаму, аказаўся і тым, дзе адзін з іх падае зусім.

У гэтым дыяпазоне цесна. У трыццаці чатырох літар з шасцідзесяці шасці другі байт ляжыць паміж `80` і `9f`. Гэта значыць, крыху больш за палову любога кірылічнага тэксту трапляе туды, дзе гэтыя дзве табліцы перастаюць супадаць. Што робяць з тымі ж байтамі CP1250 і CP1257, я пакуль не правяраў.
