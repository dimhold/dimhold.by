---
title: "Код быў унутры акна, а GPT-2 усё роўна назвала іншы"
description: "Я ўставіў 8 запісаў віду 'The code for the blue room is 17004.' у 1000 токенаў WikiText і спытаў у GPT-2 і GPT-Neo пра адзін з іх. Адзін запіс мадэлі знаходзяць на любой адлегласці. З 8 адзін падобны запіс паміж фактам і пытаннем забірае больш за палову правільных адказаў."
date: 2021-11-27
lang: be
translationKey: long-context-decay
tags: ["llm", "machine-learning"]
---
Першае, чаго ўсе хочуць ад GPT-3, гэта ўставіць доўгі дакумент і задаць пра яго пытанне. GPT-2 чытае 1024 токены, GPT-3 і мадэлі EleutherAI чытаюць 2048. Што бывае за гэтай мяжой, я ведаў. Калі падаць GPT-2 у PyTorch даўжэйшы ўваход, усё падае з `IndexError: index out of range in self`. Пазіцыйнага эмбедынгу для токена 1025 проста няма. З `truncation=True` токенізатар замест гэтага рэжа канец і пытанне ў канцы сыходзіць разам з ім.

Пра тое, што ўнутры акна, у мяне было простае ўяўленне. Акно гэта буфер: што ўлезла, тое прачытана, што не ўлезла, тое страчана. Першую палову гэтага сказа я ні разу не правяраў. Мадэль не паведамляе, якую частку ўваходу яна выкарыстала. Калі яна добра чытае апошнія 200 токенаў, а астатняе дрэнна, адказ выглядае гэтак жа ўпэўнена.

## Стэнд

Я ўзяў мадэлі, якія працуюць на працэсары з 4 ядрамі: GPT-2 small (124M) і GPT-2 medium (355M) ад OpenAI з акном 1024 токены. Трэцяя гэта `GPT-Neo 125M` ад EleutherAI, выйшла ў сакавіку, акно 2048 токенаў. Далей я называю яе Neo. Вагі ў fp32, нічога не генеруецца. Я чытаю верагоднасці наступнага токена, таму паўторны прагон дае тыя ж лікі.

Тэкст сапраўдны англійскі: сказы з тэставай часткі WikiText-103 запар, вельмі кароткія і вельмі доўгія прапушчаныя. Паміж сказамі я ўставіў запісы такога выгляду:

```
The code for the blue room is 17004.
```

Запісаў 8, у іх 8 розных колераў і выпадковыя коды з 5 лічбаў, стаяць яны ў выпадковых месцах. Уваход 1000 токенаў. У самым канцы пытанне, `The code for the blue room is`. Для кожнага з 8 кодаў я бяру верагоднасць яго першага токена як наступнага. Код з найвышэйшай верагоднасцю і ёсць выбар мадэлі. Выпадковы выбар угадвае ў 1 выпадку з 8, гэта 12,5%. Адлегласць гэта колькасць токенаў паміж пытаннем і канцом патрэбнага запісу.

<figure class="fig">
<svg viewBox="0 0 680 172" role="img" aria-label="Паласа з 1000 токенаў, у ёй 8 запісаў, у кожнага свой колер. Пытанне ў правым канцы пытае пра пакой blue. Запіс blue заканчваецца за 439 токенаў да пытання, і паміж імі стаяць яшчэ 3 запісы. Самы верагодны наступны токен у GPT-2 medium гэта пачатак кода пакоя yellow, 13135, а гэты запіс стаіць за 347 токенаў да пытання.">
  <rect x="20" y="64" width="570" height="18" class="f-plain"/>
  <rect x="594" y="64" width="82" height="18" rx="2" class="f-box"/>
  <text x="598.0" y="77.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">пытанне</text>
  <polyline points="47.4,34 47.4,56 47.4,82" class="f-line"/>
  <text x="47.4" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">grey</text>
  <polyline points="213.6,34 218.4,56 218.4,82" class="f-line"/>
  <text x="213.6" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">green</text>
  <polyline points="261.9,34 290.2,56 290.2,82" class="f-line"/>
  <text x="261.9" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">orange</text>
  <polyline points="310.2,34 309.6,56 309.6,82" class="f-line"/>
  <text x="310.2" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">brown</text>
  <polyline points="351.9,34 335.8,56 335.8,82" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <text x="351.9" y="30.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">blue</text>
  <polyline points="396.9,34 388.2,56 388.2,82" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="396.9" y="30.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">yellow</text>
  <polyline points="448.5,34 440.7,56 440.7,82" class="f-line"/>
  <text x="448.5" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">silver</text>
  <polyline points="578.1,34 586.0,56 586.0,82" class="f-line"/>
  <text x="578.1" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">red</text>
  <line x1="335.8" x2="590" y1="98" y2="98" class="f-line"/>
  <line x1="335.8" x2="335.8" y1="93" y2="103" class="f-line"/>
  <line x1="590" x2="590" y1="93" y2="103" class="f-line"/>
  <text x="462.9" y="116.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">439 токенаў, паміж імі 3 запісы</text>
  <text x="20.0" y="102.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1000 токенаў тэксту WikiText-103</text>
  <text x="20.0" y="144.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">патрэбны: blue → 34359</text>
  <text x="20.0" y="162.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 medium, наступны токен: 13 → yellow (13135)</text>
</svg>
<figcaption>Адна сапраўдная проба GPT-2 medium. Пытанне пра пакой blue (34359). Самы верагодны наступны токен мадэлі гэта пачатак кода пакоя yellow (13135).</figcaption>
</figure>

## Адзін запіс не праблема

Спачатку кантроль: у тых жа 1000 токенаў толькі адзін запіс. Тут я гляджу, ці з'яўляецца найверагоднейшы наступны токен пачаткам правільнага кода. Усе 3 мадэлі знайшлі адзіны запіс на любой адлегласці: ад 88 да 100% проб. Neo памылілася 1 раз з 330. GPT-2 small горш капіявала астатак кода, але і гэта ад адлегласці не залежала.

Значыць, з адным запісам адлегласць не мела значэння. Я чакаў адваротнага і паловы артыкула, які быў у мяне ў галаве, не стала.

## 8 запісаў

З 8 запісамі карціна іншая. Калі запіс стаяў адразу перад пытаннем, GPT-2 small выбірала правільны код у 38% проб. На адлегласці каля 860 токенаў доля ўпала да 12%, гэта ўзровень угадвання. Ля пачатку акна яна вярнулася да 32%. GPT-2 medium пачала лепш, з 62%. Ужо на адлегласці каля 220 токенаў у яе было 14%. У Neo было 37% побач з пытаннем і ад 17 да 32% на ўсіх астатніх адлегласцях.

<figure class="fig">
<svg viewBox="0 0 680 290" role="img" aria-label="Доля правільных адказаў па адлегласці да пытання. Суцэльныя лініі: 8 запісаў, правільны код выбраны сярод 8. Пункцір: 1 запіс, самы верагодны наступны токен гэта пачатак правільнага кода. GPT-2 small, 1: 0 88%, 100 98%, 200 100%, 298 100%, 400 100%, 500 100%, 599 100%, 701 98%, 799 100%, 899 100%, 922 100%; GPT-2 small, 8: 0 38%, 109 31%, 217 29%, 323 35%, 430 27%, 534 20%, 645 19%, 753 15%, 861 12%, 972 32%, 981 34%; GPT-2 medium, 1: 0 100%, 99 100%, 201 100%, 295 100%, 400 100%, 502 100%, 596 90%, 698 97%, 797 97%, 902 100%, 920 100%; GPT-2 medium, 8: 0 62%, 106 38%, 218 14%, 320 12%, 430 20%, 539 14%, 646 24%, 755 12%, 858 26%, 972 34%, 981 52%; GPT-Neo 125M, 1: 0 100%, 99 100%, 201 100%, 295 100%, 400 100%, 502 100%, 596 100%, 698 100%, 797 100%, 902 100%, 920 97%; GPT-Neo 125M, 8: 0 37%, 110 23%, 214 17%, 323 17%, 431 27%, 537 27%, 646 25%, 753 20%, 858 32%, 973 23%, 982 20%.">
  <line x1="60" x2="650" y1="240.0" y2="240.0" class="f-plain"/>
  <text x="54.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0%</text>
  <line x1="60" x2="650" y1="190.0" y2="190.0" class="f-plain"/>
  <text x="54.0" y="194.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25%</text>
  <line x1="60" x2="650" y1="140.0" y2="140.0" class="f-plain"/>
  <text x="54.0" y="144.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50%</text>
  <line x1="60" x2="650" y1="90.0" y2="90.0" class="f-plain"/>
  <text x="54.0" y="94.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75%</text>
  <line x1="60" x2="650" y1="40.0" y2="40.0" class="f-plain"/>
  <text x="54.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100%</text>
  <text x="60.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="178.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <text x="296.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">400</text>
  <text x="414.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">600</text>
  <text x="532.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">800</text>
  <text x="650.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <text x="355.0" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">адлегласць ад запісу да пытання, токенаў</text>
  <text x="60.0" y="16.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">доля проб</text>
  <line x1="60" x2="650" y1="215.0" y2="215.0" class="f-line" style="stroke-dasharray:2 3"/>
  <text x="66.0" y="229.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">угадванне, 1 з 8</text>
  <polyline points="60.0,65.0 118.8,45.0 177.9,40.0 235.9,40.0 295.9,40.0 354.7,40.0 413.5,40.0 473.3,45.0 531.5,40.0 590.4,40.0 603.7,40.0" class="f-line" style="stroke:var(--accent);stroke-width:1.6;stroke-dasharray:5 4"/>
  <polyline points="60.0,164.0 124.3,178.0 187.8,182.0 250.5,170.0 313.8,186.0 374.8,200.0 440.3,202.0 504.4,210.0 567.8,216.0 633.3,176.0 638.8,172.0" class="f-line" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="60.0" cy="164.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="124.3" cy="178.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="187.8" cy="182.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="250.5" cy="170.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="313.8" cy="186.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="374.8" cy="200.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="440.3" cy="202.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="504.4" cy="210.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="567.8" cy="216.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="633.3" cy="176.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="638.8" cy="172.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <polyline points="60.0,40.0 118.4,40.0 178.6,40.0 233.9,40.0 296.0,40.0 355.9,40.0 411.6,60.0 471.6,46.6 530.1,46.6 591.9,40.0 602.7,40.0" class="f-line" style="stroke:var(--ink);stroke-width:1.6;stroke-dasharray:5 4"/>
  <polyline points="60.0,116.0 122.8,164.0 188.4,212.0 249.0,216.0 313.8,200.0 377.8,212.0 440.9,192.0 505.4,216.0 566.5,188.0 633.2,172.0 638.7,136.0" class="f-line" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="57.0" y="113.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="119.8" y="161.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="185.4" y="209.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="246.0" y="213.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="310.8" y="197.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="374.8" y="209.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="437.9" y="189.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="502.4" y="213.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="563.5" y="185.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="630.2" y="169.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="635.7" y="133.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <polyline points="60.0,40.0 118.4,40.0 178.6,40.0 233.9,40.0 296.0,40.0 355.9,40.0 411.6,40.0 471.6,40.0 530.1,40.0 591.9,40.0 602.7,46.6" class="f-line" style="stroke:var(--muted);stroke-width:1.6;stroke-dasharray:5 4"/>
  <polyline points="60.0,166.6 125.1,193.4 186.4,206.6 250.7,206.6 314.5,186.6 377.0,186.6 441.1,190.0 504.3,200.0 566.0,176.6 634.2,193.4 639.1,200.0" class="f-line" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M60.0 162.6 L64.0 166.6 L60.0 170.6 L56.0 166.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M125.1 189.4 L129.1 193.4 L125.1 197.4 L121.1 193.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M186.4 202.6 L190.4 206.6 L186.4 210.6 L182.4 206.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M250.7 202.6 L254.7 206.6 L250.7 210.6 L246.7 206.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M314.5 182.6 L318.5 186.6 L314.5 190.6 L310.5 186.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M377.0 182.6 L381.0 186.6 L377.0 190.6 L373.0 186.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M441.1 186.0 L445.1 190.0 L441.1 194.0 L437.1 190.0 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M504.3 196.0 L508.3 200.0 L504.3 204.0 L500.3 200.0 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M566.0 172.6 L570.0 176.6 L566.0 180.6 L562.0 176.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M634.2 189.4 L638.2 193.4 L634.2 197.4 L630.2 193.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M639.1 196.0 L643.1 200.0 L639.1 204.0 L635.1 200.0 Z" style="fill:var(--muted);stroke:none"/>
  <line x1="210" x2="228" y1="12" y2="12" class="f-line" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="219.0" cy="12.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <text x="234.0" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 small</text>
  <line x1="324.6" x2="342.6" y1="12" y2="12" class="f-line" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="330.6" y="9.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <text x="348.6" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 medium</text>
  <line x1="445.8" x2="463.8" y1="12" y2="12" class="f-line" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M454.8 8.0 L458.8 12.0 L454.8 16.0 L450.8 12.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="469.8" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-Neo 125M</text>
</svg>
<figcaption>Уваход 1000 токенаў. Суцэльныя: 8 запісаў, той, пра які пытаюць, на зададзенай адлегласці, 7 іншых у выпадковых месцах, доля проб, дзе ў правільнага кода найвышэйшая верагоднасць сярод 8 (ад 50 да 100 проб на пункт). Пункцір: запіс адзін, доля проб, дзе самы верагодны наступны токен гэта пачатак яго кода (30 або 40 проб). Гэта 2 розныя меры.</figcaption>
</figure>

Я прачытаў гэта як "чым далей, тым горш" і амаль на гэтым спыніўся. Другая серыя ў гэта не ўлеглася. У ёй патрэбны запіс заўсёды стаяў за 50-65 токенаў перад пытаннем, мянялася толькі даўжыня ўваходу. GPT-2 small дала 13% на 250 токенах і 45% на 1000, GPT-2 medium 22% і 48%. Даўжэйшы ўваход зрабіў адказ лепшым. Сэнсу ў гэтым я не бачыў.

Першым тлумачэннем былі іншыя запісы. У 250 токенах астатнія 7 стаяць шчыльна і часта трапляюць у прамежак паміж патрэбным запісам і пытаннем. Я згрупаваў пробы першай серыі па колькасці іншых запісаў у гэтым прамежку. У GPT-2 small гэта 45% пры пустым прамежку і 25% з адным запісам у ім. Пры 2 або 3 запісах у прамежку яшчэ ад 24 да 27%, пры 4, 5 або 6 ужо ад 15 да 17%. Частку гэтага эфекту дае адлегласць: чым больш запісаў у прамежку, тым далей звычайна стаіць патрэбны. Таму я асобна параўнаў толькі пробы, дзе патрэбны запіс стаяў у межах ад 50 да 250 токенаў ад пытання. Там GPT-2 small выбірала правільны код у 57% проб з пустым прамежкам і ў 20% з адным запісам у ім.

<figure class="fig">
<svg viewBox="0 0 680 290" role="img" aria-label="Доля проб, у якіх правільны код выбраны сярод 8, па колькасці іншых запісаў паміж патрэбным запісам і пытаннем. GPT-2 small: 0: 45%, 1: 25%, 2: 24%, 3: 27%, 4: 16%, 5: 17%, 6: 15%, 7: 32%; GPT-2 medium: 0: 51%, 1: 21%, 2: 13%, 3: 20%, 4: 16%, 5: 19%, 6: 20%, 7: 43%; GPT-Neo 125M: 0: 34%, 1: 20%, 2: 15%, 3: 19%, 4: 21%, 5: 35%, 6: 29%, 7: 21%.">
  <line x1="60" x2="650" y1="240.0" y2="240.0" class="f-plain"/>
  <text x="54.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0%</text>
  <line x1="60" x2="650" y1="190.0" y2="190.0" class="f-plain"/>
  <text x="54.0" y="194.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25%</text>
  <line x1="60" x2="650" y1="140.0" y2="140.0" class="f-plain"/>
  <text x="54.0" y="144.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50%</text>
  <line x1="60" x2="650" y1="90.0" y2="90.0" class="f-plain"/>
  <text x="54.0" y="94.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75%</text>
  <line x1="60" x2="650" y1="40.0" y2="40.0" class="f-plain"/>
  <text x="54.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100%</text>
  <text x="60.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="144.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="228.6" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="312.9" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <text x="397.1" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="481.4" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="565.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="650.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="355.0" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">іншых запісаў паміж патрэбным і пытаннем</text>
  <text x="60.0" y="16.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">доля проб</text>
  <line x1="60" x2="650" y1="215.0" y2="215.0" class="f-line" style="stroke-dasharray:2 3"/>
  <text x="66.0" y="229.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">угадванне, 1 з 8</text>
  <polyline points="60.0,149.8 144.3,189.6 228.6,192.8 312.9,185.2 397.1,208.0 481.4,206.2 565.7,209.2 650.0,176.4" class="f-line" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="60.0" cy="149.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="144.3" cy="189.6" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="228.6" cy="192.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="312.9" cy="185.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="397.1" cy="208.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="481.4" cy="206.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="565.7" cy="209.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="650.0" cy="176.4" r="3.2" style="fill:var(--accent);stroke:none"/>
  <polyline points="60.0,139.0 144.3,198.4 228.6,214.2 312.9,200.8 397.1,208.0 481.4,202.8 565.7,200.6 650.0,154.0" class="f-line" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="57.0" y="136.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="141.3" y="195.4" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="225.6" y="211.2" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="309.9" y="197.8" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="394.1" y="205.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="478.4" y="199.8" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="562.7" y="197.6" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="647.0" y="151.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <polyline points="60.0,171.4 144.3,200.0 228.6,210.6 312.9,202.8 397.1,199.0 481.4,170.4 565.7,182.4 650.0,199.0" class="f-line" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M60.0 167.4 L64.0 171.4 L60.0 175.4 L56.0 171.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M144.3 196.0 L148.3 200.0 L144.3 204.0 L140.3 200.0 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M228.6 206.6 L232.6 210.6 L228.6 214.6 L224.6 210.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M312.9 198.8 L316.9 202.8 L312.9 206.8 L308.9 202.8 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M397.1 195.0 L401.1 199.0 L397.1 203.0 L393.1 199.0 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M481.4 166.4 L485.4 170.4 L481.4 174.4 L477.4 170.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M565.7 178.4 L569.7 182.4 L565.7 186.4 L561.7 182.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M650.0 195.0 L654.0 199.0 L650.0 203.0 L646.0 199.0 Z" style="fill:var(--muted);stroke:none"/>
  <line x1="210" x2="228" y1="12" y2="12" class="f-line" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="219.0" cy="12.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <text x="234.0" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 small</text>
  <line x1="324.6" x2="342.6" y1="12" y2="12" class="f-line" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="330.6" y="9.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <text x="348.6" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 medium</text>
  <line x1="445.8" x2="463.8" y1="12" y2="12" class="f-line" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M454.8 8.0 L458.8 12.0 L454.8 16.0 L450.8 12.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="469.8" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-Neo 125M</text>
</svg>
<figcaption>Тыя ж пробы, што на суцэльных лініях вышэй, толькі згрупаваныя інакш: доля проб, дзе правільны код выбраны сярод 8. 7 у прамежку азначае, што патрэбны запіс першы з 8. Ад 50 да 198 проб на пункт.</figcaption>
</figure>

На тых жа адлегласцях GPT-2 medium упала з 43% да 17%, а Neo з 32% да 11%. Далей пункты Neo скачуць уверх і ўніз.

Але і запісы ў прамежку не растлумачылі другую серыю да канца. Я ўзяў з яе толькі пробы з пустым прамежкам. GPT-2 small усё роўна выбрала правільна ў 8 пробах з 44 на 250 і 500 токенах і ў 42 з 77 на 750 і 1000. У кароткім уваходзе 8 запісаў займаюць прыкладна траціну тэксту. Магчыма, мадэль бачыць там спіс. Я гэтага не правяраў і не ведаю.

Калі ў прамежку стаяў хоць адзін іншы запіс, а GPT-2 small памылялася, яна выбірала найбліжэйшы да пытання запіс у 27% такіх проб. Гэта прыкладна ўдвая часцей за выпадковы няправільны выбар, 1 з 7, але большасць памылак усё роўна прыпала на іншыя запісы.

Яшчэ аднаго я не чакаў. Часам патрэбны запіс быў першым з 8 і ўсе 7 астатніх стаялі пасля яго. Тады GPT-2 medium выбірала правільна ў 43% проб, а GPT-2 small у 32%. У абедзвюх пачатак акна спрацаваў лепш за яго сярэдзіну. Ні з аднаго ліку вышэй я б такога не ўгадаў.

## Што кажа звычайная метрыка

Звычайная праверка кантэксту гэта дакладнасць наступнага токена па пазіцыі. Я палічыў яе на той жа тэставай частцы WikiText-103. З 1 токенам кантэксту GPT-2 small угадвае наступны ў 6% выпадкаў, на пазіцыях з 769 па 1023 у 41%. Neo ідзе ад 10% да 42% і выходзіць на плато ў другой палове сваіх 2048 токенаў. Па гэтай метрыцы канец доўгага акна найлепшае месца для токена. Для сярэдняга токена гэта праўда. У маім тэсце з 8 запісамі тое ж акно давала што заўгодна ад 12 да 62%, залежна ад таго, дзе стаяў запіс і што стаяла ў прамежку.

## Што я з гэтага бяру

Калі ў промпце некалькі падобных фактаў, адказ пра адзін з іх значна лепшы, калі паміж ім і пытаннем няма нічога падобнага. Таму патрэбны факт я б ставіў апошнім. На аднолькавай адлегласці адзін падобны запіс у прамежку забіраў больш за палову правільных адказаў. Sun et al. у верасні паказалі, што кантэкст далей за 2K токенаў дапамагае мадэлям для доўгага тэксту найперш на токенах, якія можна скапіяваць здалёк. Мой пошук якраз такое капіяванне. З адным запісам яно працавала па ўсім акне. Старэйшы вынік Khandelwal et al. блізкі па духу: LSTM там улічвае парадак слоў толькі прыкладна ў найбліжэйшых 50 токенах.

## Чаго я не правяраў

Гэта 3 маленькія мадэлі. Neo не паказала выйгрышу ў пачатку акна: у яе там 21%. GPT-3 праз API і GPT-J 6B я не запускаў, яны, хутчэй за ўсё, справяцца лепш, а наколькі, я не ведаю. Усе запісы зроблены па адным шаблоне з 8 колерамі. Пункт на графіках гэта ад 30 да 200 проб. Інтэрвал каля 6 працэнтных пунктаў у кожны бок пры 200 пробах і каля 16 пры 30. Асобныя пункты скачуць унутры яго. У Neo ёсць яшчэ дэталь, уплыў якой я не вылучаў: палова яе слаёў бачыць толькі апошнія 256 токенаў. Яшчэ я прагнаў Neo на 2000 токенах, амаль на ўсім яе акне, але толькі па 30 проб на пункт. Адразу перад пытаннем яна выбірала правільны код у 67% проб, на адлегласці каля 200 токенаў у 37%, далей ад 7 да 40% без яснага кірунку.
