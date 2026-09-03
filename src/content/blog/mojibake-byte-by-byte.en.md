---
title: "Reading UTF-8 as 1251: \"РџСЂРёРІРµС‚\""
description: "Mojibake is deterministic. 6 letters, 12 bytes and 5 code pages, plus a byte table that tells you which pair of encodings collided."
date: 2011-11-09
lang: en
translationKey: mojibake-byte-by-byte
tags: ["text", "debugging"]
---

I wanted to see this in bytes instead of guessing at it again. So I printed `Привет` as UTF-8 and got 12 bytes for 6 letters. Then I handed them to a decoder that believes one byte is one character:

```
$ printf 'Привет' | xxd
00000000: d09f d180 d0b8 d0b2 d0b5 d182            ............

$ printf 'Привет' | iconv -f CP1251 -t UTF-8
РџСЂРёРІРµС‚
```

<figure class="fig">
<svg viewBox="0 0 640 192" role="img" aria-label="The same twelve UTF-8 bytes decoded by five different single byte code pages">
  <defs>
    <marker id="figArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="320" y="14" class="f-label f-muted" text-anchor="middle">typed</text>
  <text x="90.0" y="42" class="f-glyph f-ink" text-anchor="middle">П</text>
  <text x="182.0" y="42" class="f-glyph f-ink" text-anchor="middle">р</text>
  <text x="274.0" y="42" class="f-glyph f-ink" text-anchor="middle">и</text>
  <text x="366.0" y="42" class="f-glyph f-ink" text-anchor="middle">в</text>
  <text x="458.0" y="42" class="f-glyph f-ink" text-anchor="middle">е</text>
  <text x="550.0" y="42" class="f-glyph f-ink" text-anchor="middle">т</text>
  <text x="320" y="62" class="f-label f-muted" text-anchor="middle">utf-8 bytes</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">read as CP1251</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">read as CP1252</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">read as ISO-8859-1</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">read as CP866</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">read as KOI8-R</text>
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
<figcaption>The 12 bytes never change. Only the table used to read them changes. ISO-8859-1 has C1 controls at 9f, 80 and 82, which is why 3 of its cells stay empty while CP1252 fills them.</figcaption>
</figure>


My fix for this has always been clicking through an encoding dropdown until the text comes back. It works. I have never once looked at what was underneath.

## 66 letters, 2 leading bytes

Russian Cyrillic sits at U+0410 through U+044F, with `Ё` and `ё` off on their own at U+0401 and U+0451. All of them are 2 bytes in UTF-8. I collected the leading byte of every letter, upper and lower case:

```
$ perl -CO -e 'print map { chr } (0x401, 0x451, 0x410..0x44f)' \
    | perl -ne 'for my $b (unpack "C*", $_) { $seen{$b} = 1 if $b >= 0xC0 }
        END { print join " ", map { sprintf "%02x", $_ } sort keys %seen }'
d0 d1
```

2 values for 66 letters. So a single byte code page reading that stream prints its own idea of `d0` and `d1` in front of every second character. That makes the garbage readable in reverse:

| decoder | `d0` | `d1` | `Привет` arrives as |
|---|---|---|---|
| CP1251 | `Р` | `С` | `РџСЂРёРІРµС‚` |
| CP1252 | `Ð` | `Ñ` | `ÐŸÑ€Ð¸Ð²ÐµÑ‚` |
| ISO-8859-1 | `Ð` | `Ñ` | `ÐÑÐ¸Ð²ÐµÑ` |
| CP866 | `╨` | `╤` | `╨Я╤А╨╕╨▓╨╡╤В` |
| KOI8-R | `п` | `я` | `п÷я─п╦п╡п╣я┌` |

A wall of `Р` and `С` means the file was read as 1251. That is the case I hit almost every time. The other 4 are rarer and just as readable off the first column.

CP1252 and ISO-8859-1 agree on `d0` and `d1`, so the fingerprint is the same. They disagree from `80` to `9f`. CP1252 has printable characters there. It prints `ÐŸÑ€Ð¸Ð²ÐµÑ‚`, 12 characters for 12 bytes. In ISO-8859-1 that band is C1 controls. Bytes `9f`, `80` and `82` print as nothing at all, so the same string comes out as `ÐÑÐ¸Ð²ÐµÑ`, 9 visible characters. I lost half an hour comparing character counts before I worked that out.

The trick is narrower than it looks. Belarusian also fits in `d0` and `d1`, `ў` included, but Ukrainian breaks it. `Ґ` is `d2 90`, which 1251 draws as `Т`.

## Backwards it is not recoverable

Reading 1251 bytes as UTF-8 is the same accident in reverse. It behaves nothing like the first one:

```
$ printf 'Привет' | iconv -f UTF-8 -t CP1251 | xxd
00000000: cff0 e8e2 e5f2                           ......

$ printf 'Привет' | iconv -f UTF-8 -t CP1251 | iconv -f UTF-8 -t UTF-8
iconv: (stdin):1:0: cannot convert
```

None of those 6 bytes start a valid UTF-8 sequence, so iconv stops on the first one. The editor I had open on the same file was less honest about it. It put U+FFFD in every position, which looks like a text you can still work with.

The `Р`/`С` version keeps every original byte. Feeding the mojibake back through 1251 returns the source exactly:

```
$ printf 'Привет' | iconv -f CP1251 -t UTF-8 | iconv -f UTF-8 -t CP1251 | xxd
00000000: d09f d180 d0b8 d0b2 d0b5 d182            ............
```

Saving the mess instead of converting it back is how a file gets encoded twice. 12 bytes become 25.

```
$ printf 'Привет' | iconv -f CP1251 -t UTF-8 | wc -c
25
```

## KOI8-R put the alphabet in Latin order

KOI8-R looks like somebody shuffled the alphabet. `ю` comes before `а` and `ц` sits between `б` and `д`. Here is the upper half of the table with the ASCII character each byte turns into once the top bit is gone:

```
c0 ю @  c1 а A  c2 б B  c3 ц C  c4 д D  c5 е E  c6 ф F  c7 г G
c8 х H  c9 и I  ca й J  cb к K  cc л L  cd м M  ce н N  cf о O
d0 п P  d1 я Q  d2 р R  d3 с S  d4 т T  d5 у U  d6 ж V  d7 в W
d8 ь X  d9 ы Y  da з Z  db ш [  dc э \  dd щ ]  de ч ^  df ъ _
```

`а` is at `A`, `б` at `B`, `ц` at `C`, `ф` at `F`. Most letters sit on top of their Latin transliteration. The ones with no Latin counterpart took whatever was left, which is how `ю` ended up on `@` and `ъ` on `_`. Clear the eighth bit of a KOI8-R string and the transliteration falls out:

```
$ printf 'Кодировка' | iconv -f UTF-8 -t KOI8-R | perl -pe 's/(.)/chr(ord($1) & 0x7f)/ge'
kODIROWKA

Здравствуйте   fa c4 d2 c1 d7 d3 d4 d7 d5 ca d4 c5   ->   zDRAWSTWUJTE
Кодировка      eb cf c4 c9 d2 cf d7 cb c1            ->   kODIROWKA
Спасибо        f3 d0 c1 d3 c9 c2 cf                  ->   sPASIBO
```

<figure class="fig">
<svg viewBox="0 0 640 194" role="img" aria-label="A KOI8-R byte losing its high bit and turning into the Latin letter it was placed on top of">
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
<figcaption>Byte eb in KOI8-R is К. Clear the eighth bit and it becomes 6b, which is k. The whole alphabet is laid out this way.</figcaption>
</figure>


Case comes out inverted because lower case Cyrillic occupies the upper case ASCII range. Strip the high bit somewhere in transit and the text is still legible. At this hit rate that cannot be an accident. The same operation on the 1251 bytes gives `Ophber`.

All 3 words I tried happen to use letters from the mapped side of the table. `ъ` or `щ` in there would come out as punctuation.

## What did not work

I tried to run the longer phrase `Здравствуйте, коллеги` through every decoder in one pass. CP1252 refused:

```
CP1252   Ð—Ð´Ñ€Ð°Ð²Ñ
iconv: (stdin):1:11: cannot convert
```

It stopped at byte eleven, which is `81`. CP1252 leaves 5 byte values undefined. `81` is one of them, so a converter following the table has nothing to return. The C1 band that makes CP1252 and ISO-8859-1 print differently is the same band that makes one of them fail outright.

That band is busy. 34 of the 66 letters have their second byte between `80` and `9f`. So a little over half of any Cyrillic text lands where those 2 tables stop agreeing. I have not checked yet what CP1250 or CP1257 do with the same bytes.
