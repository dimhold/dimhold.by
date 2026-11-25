---
title: "Rust 1.0 не сабраў маю гонку, а з яго ж падказкай лічыльнік надрукаваў 0"
description: "39 маленькіх праграм для rustc 1.0.0 і тая ж гонка на C і Java 8. Усе 20 праграм з парушаным правілам сумеснага доступу адхілены, усе 7 няправільных праграм без гонкі даных сабраліся, а падказка з паведамлення пра памылку дала лічыльнік, які друкуе 0."
date: 2015-05-31
lang: be
translationKey: rust-borrow-race
tags: ["compilers", "reliability", "types"]
---

15 мая выйшаў Rust 1.0. Я даў яму праграму, з якой заўсёды пачынаю, калі разбіраюся з патокамі: 2 патокі, кожны мільён разоў дадае 1 да агульнага лічыльніка. Яна не сабралася.

```
error: closure may outlive the current function, but it borrows `counter`, which is owned by the current function [E0373]
help: to force the closure to take ownership of `counter` (and any other referenced variables), use the `move` keyword, as shown:
      let a = thread::spawn(move || for _ in 0..1000000 { counter += 1; });
```

Я зрабіў тое, што напісана ў help, у абодвух патоках. Сабралася без памылак і без папярэджанняў. Я запусціў яе 20 разоў і ўсе 20 разоў убачыў 0.

Тлумачыцца гэта проста. Цэлы лік капіюецца, таму з `move` кожны паток лічыць у сваёй копіі, а main друкуе трэцюю. Агульнага больш нічога няма, таму і гонкі няма. Праўда, карысці ад праграмы таксама няма.

Словы пра бяспеку патокаў з анонсаў я прыняў так, як звычайна прымаю такія словы, не пытаючыся, што менавіта там бяспечна. Гонка даных і няправільны вынік былі для мяне адным і тым жа. Аарон Турон у красавіцкім артыкуле "Fearless Concurrency with Rust" кажа больш дакладна, ён абяцае, што не будзе гонак даных. Таму я вырашыў палічыць і тое і другое.

## 39 маленькіх праграм

Я напісаў 39 праграм даўжынёй ад 6 да 19 радкоў у 5 групах і да першай зборкі запісаў у файл, якую з іх кампілятар прыме, а якую не. Кампілятар rustc 1.0.0 (a59de37e9). Для параўнання той жа лічыльнік і спіс, які расце, на C з gcc і на Java 8. Усё запускалася на 2 ядрах віртуальнай машыны.

Першая група гэта 20 праграм, у якіх парушана нейкае правіла сумеснага доступу. Сапраўдная гонка была б толькі ў 10: 2 патокі працуюць з адной памяццю без блакіроўкі і хаця б адзін піша. Адзначаў я іх уручную, ужо пасля прагону. Астатнія 10 парушаюць тыя ж правілы, але гонкі ў іх няма, а ў 3 увогуле адзін паток.

<figure class="fig">
<svg viewBox="0 0 680 204" role="img" aria-label="39 маленькіх праграм на Rust, сабраных rustc 1.0.0, адзін квадрат на праграму. Праграмы, дзе парушана правіла сумеснага доступу: адхілена 20 з 20, з іх 11 з памылкамі валодання і пазычання, 7 з памылкамі Send і Sync, 2 з іншымі. Няправільныя праграмы без гонкі даных: кампілююцца 7 з 7. Код з unsafe: кампілююцца 3 з 3. Правільныя праграмы з данымі ў лакальнай зменнай: адхілена 6 з 6. Правільныя праграмы з Arc або каналам: кампілююцца 3 з 3.">
  <text x="158.0" y="31.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">парушана правіла</text>
  <rect x="170.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <circle cx="178.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="191.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <circle cx="199.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="212.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <circle cx="220.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="233.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <circle cx="241.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="254.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="275.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="296.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="317.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="338.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="359.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="380.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="409.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <circle cx="417.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="430.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <circle cx="438.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="451.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <circle cx="459.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="472.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <circle cx="480.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="493.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <rect x="514.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <rect x="535.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <rect x="564.0" y="18.0" width="17.0" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <circle cx="572.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="585.0" y="18.0" width="17.0" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <circle cx="593.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <text x="170.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">валоданне, пазычанне: 11</text>
  <text x="409.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Send, Sync: 7</text>
  <text x="564.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">іншае: 2</text>
  <text x="158.0" y="87.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">памылка без гонкі</text>
  <rect x="170.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="191.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="212.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="233.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="254.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="275.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="296.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <text x="325.0" y="87.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">кампілюецца</text>
  <text x="158.0" y="119.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">unsafe</text>
  <rect x="170.0" y="106.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="191.0" y="106.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="212.0" y="106.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <text x="241.0" y="119.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">кампілюецца</text>
  <text x="158.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">правільна, без Arc</text>
  <rect x="170.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="191.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="212.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="233.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="254.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="275.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="304.0" y="151.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">адхілена</text>
  <text x="158.0" y="183.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">правільна, Arc/канал</text>
  <rect x="170.0" y="170.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="191.0" y="170.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="212.0" y="170.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <text x="241.0" y="183.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">кампілюецца</text>
</svg>
<figcaption>Квадрат гэта адна праграма, зафарбаваны значыць, што rustc 1.0.0 яе не прыняў. У першым радку 20 адмоў раскладзены паводле таго, пра што кажа паведамленне, кропкай пазначаны 10 праграм, дзе гонка была б насамрэч.</figcaption>
</figure>

Адхілены ўсе 20 і спраўдзіліся ўсе 39 прагнозаў. Гучыць лепш, чым ёсць, бо я пісаў праграмы, ужо ведаючы правілы. Цікавей было чытаць паведамленні. Слова "race" няма ў ніводным з 20. 11 з іх пра валоданне і пазычанне: значэнне ўжо перамешчана, замыканне жыве занадта доўга, другое пазычанне на змену. Гэта тыя самыя правілы, дзякуючы якім Rust вызваляе памяць без зборшчыка смецця. І толькі 7 кажуць, што нешта нельга перадаць або падзяліць "between threads safely". Апошнія 2 гэта статычная зменная па-за `unsafe` і `+=` над Mutex, які ніхто не захапіў.

З 10 праграм з сапраўднай гонкай 4 ловяць правілы валодання, яшчэ 4 ловяць Send і Sync. Мне падабаецца, што прыкметную частку працы робяць правілы, прыдуманыя для памяці, але ў іх ёсць цана. Я напісаў яшчэ 6 правільных праграм, дзе даныя ляжаць у лакальнай зменнай main. Усе 6 былі адхілены. Самая простая гэта лакальны Mutex і 2 патокі, main чакае, пакуль абодва скончацца, а rustc усё роўна кажа, што замыканне можа перажыць функцыю. Для такога выпадку ёсць `thread::scoped`, але ў 1.0.0 ён адказвае "use of unstable library feature 'scoped': memory unsafe if destructor is avoided, see #24292". 3 правільныя праграмы з Arc або каналам збіраюцца і далі 2 000 000 ва ўсіх 120 запусках.

Падказку пра `move` атрымалі 5 праграм з 39. Я механічна ўжыў яе да ўсіх. 4 атрымалі наступную памылку, пра ўжо перамешчанае значэнне, а пятая гэта лічыльнік, які друкуе 0. Правільнай не стала ніводная.

## Тая ж гонка на C і Java

gcc з `-Wall -Wextra` і javac з `-Xlint:all` не выдалі ніводнага папярэджання. Каб убачыць гонку ў Rust, давялося напісаць `unsafe`, тут гэта `static mut`. Вось па 100 запускаў кожнай праграмы, правільны адказ 2 000 000.

| праграма | правільных запускаў | найменшы вынік |
|---|---|---|
| C, gcc -O0 | 61 | 986 351 |
| C, gcc -O2 | 100 | 2 000 000 |
| Java 8 | 15 | 966 766 |
| Rust unsafe | 13 | 1 328 963 |
| Rust unsafe -O | 33 | 1 000 000 |

<figure class="fig">
<svg viewBox="0 0 680 328" role="img" aria-label="Выніковае значэнне лічыльніка з гонкай у 100 запусках кожнай праграмы, правільнае значэнне 2 000 000. C без аптымізацыі: 61 правільны запуск, астатнія раскіданы пачынаючы з 986 351. C з -O2: 100 правільных. Java 8: 15 правільных, астатнія раскіданы пачынаючы з 966 766. Rust з unsafe без аптымізацыі: 13 правільных. Rust з unsafe і -O: 33 правільныя і 67 запускаў роўна на 1 000 000.">
  <line x1="130" y1="66" x2="590" y2="66" class="f-plain"/>
  <text x="120.0" y="60.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">C, gcc -O0</text>
  <rect x="131.0" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="151.9" y="63.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="172.8" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="193.7" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="214.6" y="64.2" width="18.9" height="1.8" style="fill:var(--accent);stroke:none"/>
  <rect x="235.5" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="256.5" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="277.4" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="298.3" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="340.1" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="361.0" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="402.8" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="423.7" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="444.6" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="465.5" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="486.5" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="507.4" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="528.3" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="570.1" y="44.0" width="18.9" height="22.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="40.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">61</text>
  <text x="602.0" y="60.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">61 / 100</text>
  <line x1="130" y1="124" x2="590" y2="124" class="f-plain"/>
  <text x="120.0" y="118.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">C, gcc -O2</text>
  <rect x="570.1" y="88.0" width="18.9" height="36.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="84.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">100</text>
  <text x="602.0" y="118.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">100 / 100</text>
  <line x1="130" y1="182" x2="590" y2="182" class="f-plain"/>
  <text x="120.0" y="176.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Java 8</text>
  <rect x="131.0" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="151.9" y="179.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="172.8" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="193.7" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="319.2" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="381.9" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="402.8" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="423.7" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="444.6" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="465.5" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="486.5" y="180.2" width="18.9" height="1.8" style="fill:var(--accent);stroke:none"/>
  <rect x="507.4" y="179.8" width="18.9" height="2.2" style="fill:var(--accent);stroke:none"/>
  <rect x="528.3" y="179.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="549.2" y="166.9" width="18.9" height="15.1" style="fill:var(--accent);stroke:none"/>
  <text x="558.6" y="162.9" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">42</text>
  <rect x="570.1" y="176.6" width="18.9" height="5.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="172.6" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">15</text>
  <text x="602.0" y="176.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">15 / 100</text>
  <line x1="130" y1="240" x2="590" y2="240" class="f-plain"/>
  <text x="120.0" y="234.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Rust unsafe</text>
  <rect x="277.4" y="238.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="298.3" y="237.8" width="18.9" height="2.2" style="fill:var(--accent);stroke:none"/>
  <rect x="319.2" y="238.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="340.1" y="238.2" width="18.9" height="1.8" style="fill:var(--accent);stroke:none"/>
  <rect x="361.0" y="237.5" width="18.9" height="2.5" style="fill:var(--accent);stroke:none"/>
  <rect x="381.9" y="237.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="402.8" y="235.0" width="18.9" height="5.0" style="fill:var(--accent);stroke:none"/>
  <text x="412.3" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">14</text>
  <rect x="423.7" y="236.0" width="18.9" height="4.0" style="fill:var(--accent);stroke:none"/>
  <text x="433.2" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <rect x="444.6" y="237.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="465.5" y="237.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="486.5" y="237.8" width="18.9" height="2.2" style="fill:var(--accent);stroke:none"/>
  <rect x="507.4" y="237.8" width="18.9" height="2.2" style="fill:var(--accent);stroke:none"/>
  <rect x="528.3" y="238.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="549.2" y="238.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="570.1" y="235.3" width="18.9" height="4.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="231.3" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">13</text>
  <text x="602.0" y="234.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">13 / 100</text>
  <line x1="130" y1="298" x2="590" y2="298" class="f-plain"/>
  <text x="120.0" y="292.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Rust unsafe -O</text>
  <rect x="151.9" y="273.9" width="18.9" height="24.1" style="fill:var(--accent);stroke:none"/>
  <text x="161.4" y="269.9" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">67</text>
  <rect x="570.1" y="286.1" width="18.9" height="11.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="282.1" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">33</text>
  <text x="602.0" y="292.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">33 / 100</text>
  <text x="161.4" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 000 000</text>
  <text x="265.9" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 250 000</text>
  <text x="370.5" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 500 000</text>
  <text x="475.0" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 750 000</text>
  <text x="579.5" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2 000 000</text>
  <text x="602.0" y="22.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">правільна</text>
</svg>
<figcaption>Вынік аднаго і таго ж лічыльніка з гонкай, 100 запускаў на радок. Вышыня слупка гэта колькасць запускаў у паласе шырынёй 50 000, лік падпісаны над слупкамі ад 10 запускаў.</figcaption>
</figure>

Я чакаў, што з аптымізацыяй гонка стане горшай. У Rust сказаць цяжка: правільных запускаў стала 33 замест 13, а астатнія 67 страцілі роўна палову. У C гонкі не стала відаць, бо gcc ператварыў увесь цыкл у адну каманду `addq $1000000, counter(%rip)`. rustc 1.0.0 узяў лічыльнік у рэгістр, мільён разоў дадаў там 1 і запісаў вынік у самым канцы. ThreadSanitizer пры гэтым паведаміў пра гонку ў 10 запусках з 10 таго ж файла на C з -O2, хоць кожны з іх надрукаваў 2 000 000.

<figure class="fig">
<svg viewBox="0 0 680 240" role="img" aria-label="Што робяць з лічыльнікам у памяці два патокі. У варыянце gcc -O2 кожны паток выконвае адну каманду, якая дадае да памяці 1 000 000, два складанні не накладваюцца і атрымліваецца 2 000 000. У варыянце rustc -O кожны паток чытае лічыльнік у рэгістр, мільён разоў дадае 1 у рэгістры і запісвае назад. Абодва патокі чытаюць 0, другі запіс зацірае першы і атрымліваецца 1 000 000.">
  <text x="10.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">gcc -O2: addq $1000000, counter(%rip)</text>
  <text x="86.0" y="48.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">паток 1</text>
  <line x1="100" y1="44" x2="560" y2="44" class="f-plain"/>
  <text x="86.0" y="76.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">паток 2</text>
  <line x1="100" y1="72" x2="560" y2="72" class="f-plain"/>
  <rect x="160.0" y="36.0" width="14.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <rect x="230.0" y="64.0" width="14.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="182.0" y="40.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0 + 1000000</text>
  <text x="252.0" y="68.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1000000 + 1000000</text>
  <text x="568.0" y="62.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">counter =</text>
  <text x="568.0" y="78.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">2 000 000</text>
  <text x="10.0" y="124.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">rustc 1.0.0 -O: movq, incq, movq</text>
  <text x="86.0" y="164.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">паток 1</text>
  <line x1="100" y1="160" x2="140" y2="160" class="f-plain"/>
  <line x1="390" y1="160" x2="560" y2="160" class="f-plain"/>
  <text x="86.0" y="208.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">паток 2</text>
  <line x1="100" y1="204" x2="210" y2="204" class="f-plain"/>
  <line x1="460" y1="204" x2="560" y2="204" class="f-plain"/>
  <rect x="140.0" y="152.0" width="10.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <rect x="150.0" y="152.0" width="230.0" height="18.0" style="fill:var(--muted);opacity:0.22;stroke:none"/>
  <rect x="380.0" y="152.0" width="10.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="265.0" y="165.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1 000 000 × incq %rax</text>
  <rect x="210.0" y="196.0" width="10.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <rect x="220.0" y="196.0" width="230.0" height="18.0" style="fill:var(--muted);opacity:0.22;stroke:none"/>
  <rect x="450.0" y="196.0" width="10.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="335.0" y="209.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1 000 000 × incq %rax</text>
  <text x="145.0" y="146.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">чытанне 0</text>
  <text x="385.0" y="146.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">запіс 1 000 000</text>
  <text x="215.0" y="190.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">чытанне 0</text>
  <text x="455.0" y="228.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">запіс 1 000 000</text>
  <text x="568.0" y="188.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">counter =</text>
  <text x="568.0" y="204.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1 000 000</text>
</svg>
<figcaption>Два кампілятары на адным і тым жа цыкле. У gcc акно шырынёй у адну каманду, у rustc 1.0.0 яно даўжынёй ва ўвесь цыкл.</figcaption>
</figure>

Яшчэ я думаў, што горш за 1 000 000 быць не можа, столькі дае адзін паток. Адзін запуск на C і адзін на Java скончыліся меншым лікам. Аднаго спозненага запісу для гэтага мала, трэба 2. Першы паток запісвае старое значэнне паверх амаль усёй працы другога. Другі бярэ гэты маленькі лік, каб дадаць сваю апошнюю адзінку, чакае канца першага і піша вынік апошнім. Іншага шляху я не бачу, але самі гэтыя запускі не трасіраваў.

Спіс гэта тое месца, дзе зборшчык смецця мусіць дапамагаць. У C упалі 40 запускаў са 100 з -O0 і 34 з -O2. Java не ўпала ні разу, у 67 запусках вылецела выключэнне, у 14 памер быў правільны. Астатнія 19 надрукавалі няправільны памер і ні на што не паскардзіліся. У Rust такі ж push з 2 патокаў адхіляецца і праз спасылку і праз Arc.

На гэтым спісе спыніўся мой скрыпт. У звычайных запусках завісанне ён апрацоўваў, я думаў пра ўзаемныя блакіроўкі, а ў частцы з ThreadSanitizer стаяла мяжа ў 120 секунд, якую ніхто не лавіў. Спіс на C там завіс і пацягнуў за сабой скрыпт. Падлікі ўжо ляжалі ў файле, таму паўтарыў я толькі гэтую частку.

## Што збіраецца і хлусіць

Трэцяе, на што я хацеў паглядзець, гэта праграмы, у якіх гонкі даных няма, а адказ усё роўна няправільны. Іх 7 і rustc без папярэджанняў прымае ўсе 7. Адна з іх лічыльнік з `move`, астатнія 6 у табліцы. Завіслым я лічыў запуск, які не скончыўся за 3 секунды.

| праграма | няправільных запускаў |
|---|---|
| чытанне пад блакіроўкай, запіс пад наступнай | 50 з 50 |
| атамарнае чытанне, потым атамарны запіс | 26 з 50 |
| праверка астатку, потым спісанне пад іншай блакіроўкай | 40 са 100, астатак -1 |
| 2 блакіроўкі ў розным парадку | 18 з 20 завіслі |
| адна блакіроўка двойчы | 5 з 5 завіслі |
| без join | 100 са 100 надрукавалі 0 |

У C і Java першы радок такі ж, 0 правільных запускаў з 50. ThreadSanitizer на праграме на C маўчыць ва ўсіх 20 запусках. Паводле азначэння гонкі даных там няма. Калі б я спыніўся на лічыльніку, я б напісаў, што Rust ловіць страчаныя абнаўленні. Тут ён іх не ловіць.

Практычная выснова для мяне вузкая, але карысная. Калі ў праграме на Rust без `unsafe` няправільны лік, можна не шукаць памяць, да якой звяртаюцца без блакіроўкі, а адразу глядзець на парадак дзеянняў. Яго я і далей правяраў бы вачыма.

## Чаго я не правяраў

Праграмы малюсенькія і мае, таму 20 з 20 нічога не кажа пра тое, як часта праверка пазычанняў адхіляе правільны код у сапраўдным праекце. Колькасць страчаных абнаўленняў залежыць ад машыны і ад таго, што яшчэ на ёй працуе, запомніць варта толькі форму. Кампілятар C быў адзін, сямейства працэсараў адно, налад Java я не чапаў. Бём у 2011 годзе пісаў, як кампілятары ламаюць "бяскрыўдныя" гонкі, я паглядзеў на 2 цыклы. І я не шукаў дзірак у самой стандартнай бібліятэцы, накшталт той, што апісана ў #24292.
