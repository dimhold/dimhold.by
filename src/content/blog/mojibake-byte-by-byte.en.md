---
title: "РџСЂРёРІРµС‚ is UTF-8 read as 1251"
description: "Mojibake is deterministic. Six letters, twelve bytes, four code pages, and a byte table that tells you which pair of encodings collided."
date: 2011-11-09
backfilled: 2026-08-18
lang: en
translationKey: mojibake-byte-by-byte
---

I wanted to see this in bytes instead of guessing at it again. So I printed `Привет` as UTF-8, got twelve bytes for six letters and handed them to a decoder that believes one byte is one character:

```
П      р      и      в      е      т
d0 9f  d1 80  d0 b8  d0 b2  d0 b5  d1 82

read as Windows-1251:  РџСЂРёРІРµС‚
```

<figure class="fig">
<svg viewBox="0 0 640 192" role="img" aria-label="The same twelve UTF-8 bytes decoded by four different single byte code pages">
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">read as windows-1251</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">read as windows-1252</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">read as cp866</text>
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
    <text x="320" y="140" class="f-label f-accent" text-anchor="middle">read as koi8-r</text>
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
<figcaption>The twelve bytes never change. Only the table used to read them changes. Windows-1252 draws nothing at all for 9f, 80 and 82, which is why three cells go empty.</figcaption>
</figure>


That string has been following me around for fifteen years. My fix used to be clicking through an encoding dropdown until the text came back, which worked and taught me nothing.

## Sixty six letters, two leading bytes

Russian Cyrillic sits at U+0410 through U+044F, with `Ё` and `ё` off on their own at U+0401 and U+0451. All of them are two bytes in UTF-8. I collected the leading byte of every letter, upper and lower case:

```
distinct leading bytes for the whole Russian alphabet: d0 d1
```

Two values for sixty six letters. So a single byte code page reading that stream prints its own idea of `d0` and `d1` in front of every second character. That makes the garbage readable in reverse:

| decoder | `d0` | `d1` | `Здравствуйте, коллеги` arrives as |
|---|---|---|---|
| Windows-1251 | `Р` | `С` | `Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ, РєРѕР»Р»РµРіРё` |
| Windows-1252 | `Ð` | `Ñ` | `ÐÐ´ÑÐ°Ð²ÑÑÐ²ÑÐ¹ÑÐµ, ÐºÐ¾Ð»Ð»ÐµÐ³Ð¸` |
| CP866 | `╨` | `╤` | `╨Ч╨┤╤А╨░╨▓╤Б╤В╨▓╤Г╨╣╤В╨╡, ╨║╨╛╨╗╨╗╨╡╨│╨╕` |
| KOI8-R | `п` | `я` | `п≈п╢я─п╟п╡я│я┌п╡я┐п╧я┌п╣, п╨п╬п╩п╩п╣пЁп╦` |

A wall of `Р` and `С` means the file was read as 1251. `Ð` and `Ñ` points at 1252 or Latin-1. Box drawing like `╨` only comes out of CP866. A run of `п` and `я` only out of KOI8-R.

The trick is narrower than it looks. Belarusian also fits in `d0` and `d1`, `ў` included, but Ukrainian breaks it. `Ґ` is `d2 90`, which 1251 draws as `Т`. So the fingerprint holds for two alphabets I checked and starts leaking on the third.

## Backwards it is not recoverable

Reading 1251 bytes as UTF-8 is the same accident in reverse. It behaves nothing like the first one:

```
cf f0 e8 e2 e5 f2   read as UTF-8:   "������"
```

None of those bytes start a valid UTF-8 sequence, so the decoder writes U+FFFD for each one. The `Р`/`С` version keeps every original byte. I mapped that mojibake back through the 1251 table and got `d0 9f d1 80 d0 b8 d0 b2 d0 b5 d1 82` again, byte for byte, which reads as `Привет`. Reading 1251 as UTF-8 throws the bytes away instead.

Saving the mess back to disk is how a file gets encoded twice. I took `РџСЂРёРІРµС‚`, believed it and saved it as UTF-8. Twelve bytes became twenty five.

```
Р СџРЎР‚Р С‘Р Р†Р ВµРЎвЂљ      25 bytes
```

## KOI8-R put the alphabet in Latin order

KOI8-R looks like somebody shuffled the alphabet. `ю` comes before `а` and `ц` sits between `б` and `д`. Here is the upper half of the table with the ASCII character each byte turns into once the top bit is gone:

```
c0 ю/@  c1 а/A  c2 б/B  c3 ц/C  c4 д/D  c5 е/E  c6 ф/F  c7 г/G
c8 х/H  c9 и/I  ca й/J  cb к/K  cc л/L  cd м/M  ce н/N  cf о/O
d0 п/P  d1 я/Q  d2 р/R  d3 с/S  d4 т/T  d5 у/U  d6 ж/V  d7 в/W
d8 ь/X  d9 ы/Y  da з/Z  db ш/[  dc э/\  dd щ/]  de ч/^  df ъ/_
```

`а` is at `A`, `б` at `B`, `ц` at `C`, `ф` at `F`. Most letters sit on top of their Latin transliteration. The ones with no Latin counterpart took whatever was left, which is how `ю` ended up on `@` and `ъ` on `_`. Clear the eighth bit of a KOI8-R string and the transliteration falls out:

```
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


Case comes out inverted because lower case Cyrillic occupies the upper case ASCII range. That is the only damage. The layout was built for exactly this. Strip the high bit somewhere in transit and the text stays legible. The same operation on the 1251 bytes gives `Ophber`.

All three words I tried happen to use letters from the mapped side of the table. `ъ` or `щ` in there would come out as punctuation.

## What did not work

Node has no encoder for any of these code pages. `TextDecoder` handles 1251 and KOI8-R without complaint. `Buffer.from` takes `latin1`, `utf16le` and a few others, none of them Cyrillic. `TextEncoder` speaks UTF-8 only. So I built the reverse map by decoding all 256 single byte values one at a time:

```js
function encode(label, str) {
  const d = new TextDecoder(label);
  const map = new Map();
  for (let i = 0; i < 256; i++) map.set(d.decode(new Uint8Array([i])), i);
  return Buffer.from([...str].map((c) => map.get(c) ?? 0x3f));
}
```

That map is not a real encoder. Several byte values decode to the same replacement character depending on the table, so the reverse lookup keeps whichever one it saw last. It survived every word I threw at it. I would not put it near production.

The other surprise was in my own output. The Latin-1 reading printed as `ÐÑÐ¸Ð²ÐµÑ`, nine characters out of twelve bytes. Bytes `9f`, `80` and `82` land in the C1 control range there. My terminal drew nothing at all for them. I spent a while comparing character counts before I noticed.

## Still here in 2026

Windows PowerShell 5.1 reads a file with no byte order mark using the system ANSI code page:

```
PS version            : 5.1.19041.7058
Default ANSI codepage : Windows-1252
Get-Content nobom.txt : ÐŸÑ€Ð¸Ð²ÐµÑ‚
Get-Content bom.txt   : Привет
```

The content is the same and so is the encoder. One file has `ef bb bf` on the front. The output came out full of `Ð` and `Ñ`. The second line names the decoder. Three bytes of BOM fixed it. I still had to look at the hex to be sure which one was wrong.
