---
title: "\"Please\" пагоршыла GPT-2 small і палепшыла GPT-2 medium"
description: "GPT-3 бярэ грошы за токены, таму я палічыў, колькі каштуе ветлівасць, і памераў, што яна робіць. На 872 водгуках SST-2 адзіночнае \"Please\" пагоршыла GPT-2 small і палепшыла GPT-2 medium, як любая іншая дробная праўка інструкцыі. Поўная фраза \"Could you please... Thank you.\" не пагоршыла ніводнай з 4 мадэляў і падоўжыла адказы."
date: 2021-11-21
lang: be
translationKey: polite-prompt
tags: ["llm", "machine-learning"]
---
У чацвер OpenAI зняла спіс чакання са свайго API. Цяпер кожны з краіны, дзе API даступны, можа плаціць за GPT-3. Плацяць за токены. Davinci каштуе $0,06 за 1000 токенаў, промпт і адказ лічацца разам. Значыць, у кожнага слова ў промпце ёсць цана, у тым ліку ў слоў, дададзеных толькі дзеля ветлівасці.

Я чуў пра гэта 2 процілеглыя меркаванні. Адно кажа, што на ветлівую просьбу адказ лепшы, бо мадэль вучылася на тэкстах, дзе на ветлівыя пытанні адказвалі старанна. Другое кажа, што "please" гэта змарнаваны токен і мадэлі ўсё роўна. Ні для аднаго з іх у мяне не было лічбы, таму я памераў цану і адказ.

## Колькі гэта каштуе

У GPT-3 той жа токенізатар, што ў GPT-2, таму токены можна палічыць лакальна. Інструкцыя для тэсту ніжэй `Tell me whether this movie review is positive or negative.`, у ёй 11 токенаў. "Please" перад ёй гэта яшчэ 1 токен. Поўная ветлівая версія з "Could you please" і "Thank you" у канцы займае 17 токенаў.

<figure class="fig">
<svg viewBox="0 0 680 208" role="img" aria-label="Тры версіі інструкцыі, разрэзаныя на токены GPT-2, тыя ж, за якія бярэ грошы GPT-3. Tell me whether this movie review is positive or negative.: 11 токенаў, базавая версія; Please tell me whether this movie review is positive or negative.: 12 токенаў, +$60 на мільён выклікаў; Could you please tell me whether this movie review is positive or negative? Thank you.: 17 токенаў, +$360 на мільён выклікаў. Токены, якія дадае ветлівасць, вылучаныя.">
  <rect x="20.0" y="22" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="37.2" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Tell</text>
  <rect x="58.4" y="22" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="69.0" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">me</text>
  <rect x="83.6" y="22" width="54.2" height="20" rx="2" class="f-plain"/>
  <text x="110.7" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">whether</text>
  <rect x="141.8" y="22" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="159.0" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">this</text>
  <rect x="180.2" y="22" width="41.0" height="20" rx="2" class="f-plain"/>
  <text x="200.7" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">movie</text>
  <rect x="225.2" y="22" width="47.6" height="20" rx="2" class="f-plain"/>
  <text x="249.0" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">review</text>
  <rect x="276.8" y="22" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="287.4" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">is</text>
  <rect x="302.0" y="22" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="332.4" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">positive</text>
  <rect x="366.8" y="22" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="377.4" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">or</text>
  <rect x="392.0" y="22" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="422.4" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">negative</text>
  <rect x="456.8" y="22" width="14.6" height="20" rx="2" class="f-plain"/>
  <text x="464.1" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">.</text>
  <text x="20.0" y="60.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">11 токенаў, базавая версія</text>
  <rect x="20.0" y="80" width="47.6" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="43.8" y="94.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">Please</text>
  <rect x="71.6" y="80" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="88.8" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">tell</text>
  <rect x="110.0" y="80" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="120.6" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">me</text>
  <rect x="135.2" y="80" width="54.2" height="20" rx="2" class="f-plain"/>
  <text x="162.3" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">whether</text>
  <rect x="193.4" y="80" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="210.6" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">this</text>
  <rect x="231.8" y="80" width="41.0" height="20" rx="2" class="f-plain"/>
  <text x="252.3" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">movie</text>
  <rect x="276.8" y="80" width="47.6" height="20" rx="2" class="f-plain"/>
  <text x="300.6" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">review</text>
  <rect x="328.4" y="80" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="339.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">is</text>
  <rect x="353.6" y="80" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="384.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">positive</text>
  <rect x="418.4" y="80" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="429.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">or</text>
  <rect x="443.6" y="80" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="474.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">negative</text>
  <rect x="508.4" y="80" width="14.6" height="20" rx="2" class="f-plain"/>
  <text x="515.7" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">.</text>
  <text x="20.0" y="118.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">12 токенаў, +$60 на мільён выклікаў</text>
  <rect x="20.0" y="138" width="41.0" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="40.5" y="152.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">Could</text>
  <rect x="65.0" y="138" width="27.8" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="78.9" y="152.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">you</text>
  <rect x="96.8" y="138" width="47.6" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="120.6" y="152.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">please</text>
  <rect x="148.4" y="138" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="165.6" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">tell</text>
  <rect x="186.8" y="138" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="197.4" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">me</text>
  <rect x="212.0" y="138" width="54.2" height="20" rx="2" class="f-plain"/>
  <text x="239.1" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">whether</text>
  <rect x="270.2" y="138" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="287.4" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">this</text>
  <rect x="308.6" y="138" width="41.0" height="20" rx="2" class="f-plain"/>
  <text x="329.1" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">movie</text>
  <rect x="353.6" y="138" width="47.6" height="20" rx="2" class="f-plain"/>
  <text x="377.4" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">review</text>
  <rect x="405.2" y="138" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="415.8" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">is</text>
  <rect x="430.4" y="138" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="460.8" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">positive</text>
  <rect x="495.2" y="138" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="505.8" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">or</text>
  <rect x="520.4" y="138" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="550.8" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">negative</text>
  <rect x="585.2" y="138" width="14.6" height="20" rx="2" class="f-plain"/>
  <text x="592.5" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">?</text>
  <rect x="603.8" y="138" width="41.0" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="624.3" y="152.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">Thank</text>
  <rect x="20.0" y="164" width="27.8" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="33.9" y="178.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">you</text>
  <rect x="51.8" y="164" width="14.6" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="59.1" y="178.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">.</text>
  <text x="20.0" y="202.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">17 токенаў, +$360 на мільён выклікаў</text>
</svg>
<figcaption>Толькі інструкцыя, разрэзаная токенізатарам GPT-2, ім жа карыстаецца GPT-3. Токены, якія дадае ветлівасць, вылучаныя. Цэны для davinci па $0,06 за 1000 токенаў.</figcaption>
</figure>

1 токен на выклік у davinci гэта $60 на мільён выклікаў, поўная ветлівая версія каштуе $360. Гучыць няшмат. Але ўвесь мой промпт з водгукам займаў у сярэднім каля 41 токена, так што 6 ветлівых токенаў рабілі рахунак за ўваход прыкладна на 15% большым. З 4 прыкладамі ў промпце выходзіла каля 135 токенаў. Тыя ж 6 токенаў дадавалі 4%.

## Як мераў

Задача: танальнасць водгуку пра фільм, 872 сказы з валідацыйнай часткі SST-2. Промпт выглядае так:

```
Tell me whether this movie review is positive or negative.

Review: it 's a charming and often affecting journey .
Answer:
```

Тут нічога не генеруецца. Я параўноўваю верагоднасць наступнага токена " positive" з " negative" і бяру большую. Паўторны прагон дае тыя ж лічбы. Мадэлі тыя, якія можа запусціць мой працэсар з 4 ядрамі: GPT-2 small, medium і large ад OpenAI і `GPT-Neo 125M` ад EleutherAI, далей проста Neo.

У простага параўнання ёсць праблема. GPT-2 small кажа "positive" на 80% водгукаў, што б у іх ні было, а станоўчых сярод іх прыкладна палова. GPT-2 large хіліцца ў іншы бок і кажа так на 16%. Таму для кожнай версіі інструкцыі я ставіў парог спрошчаным варыянтам кантэкстнай каліброўкі з працы Zhao et al. (люты). Той жа промпт з пустым водгукам накшталт "N/A" паказвае, куды мадэль хіліцца. Гэты нахіл адымаецца.

Акрамя 2 ветлівых версій я ўзяў 4 няветлівыя. `Now tell me...` той жа даўжыні, што `Please tell me...`, а `Say whether...` мяняе 1 слова. Нейтральны хвост `Now look at it and tell me... That is all.` прыкладна той жа даўжыні, што поўная ветлівая версія. Апошняя версія грубая: `Just tell me... Don't waste my time.`

## Першы лік

Першай скончыла GPT-2 small. З "Please" яе дакладнасць упала з 68,8% да 65,7%: 41 водгук стаў няправільным, а 14 сталі правільнымі. Для парнага тэсту гэта далёка ад шуму. Я ўжо збіраўся напісаць, што за ветлівасць плацяць дакладнасцю.

Потым GPT-2 medium паказала адваротнае. З "Please" яе дакладнасць вырасла з 69,2% да 72,4%, 36 водгукаў сталі правільнымі і 8 няправільнымі. GPT-2 large, як і medium, вырасла на 2,5 пункта, а Neo зрушылася на 0,3, гэта значыць ніяк.

<figure class="fig">
<svg viewBox="0 0 680 270" role="img" aria-label="Змяненне дакладнасці без прыкладаў на 872 водгуках SST-2 у параўнанні з простай інструкцыяй, па версіі інструкцыі і па мадэлі. Please tell me… GPT-2 small −3,1, GPT-2 medium +3,2, GPT-2 large +2,5, GPT-Neo 125M +0,3; Could you please… Thank you. GPT-2 small +1,3, GPT-2 medium +3,8, GPT-2 large +3,4, GPT-Neo 125M +2,1; Now tell me… GPT-2 small −0,5, GPT-2 medium −1,1, GPT-2 large +0,6, GPT-Neo 125M −0,7; Say whether… GPT-2 small +0,1, GPT-2 medium +4,7, GPT-2 large −1,0, GPT-Neo 125M +3,3; Now look at it… That is all. GPT-2 small −1,3, GPT-2 medium +4,0, GPT-2 large +2,5, GPT-Neo 125M −0,3; Just tell me… Don't waste my time. GPT-2 small −4,4, GPT-2 medium +4,4, GPT-2 large −0,7, GPT-Neo 125M +1,6.">
  <line x1="250.0" x2="250.0" y1="34" y2="220" class="f-plain"/>
  <text x="250.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−6</text>
  <line x1="316.7" x2="316.7" y1="34" y2="220" class="f-plain"/>
  <text x="316.7" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−4</text>
  <line x1="383.3" x2="383.3" y1="34" y2="220" class="f-plain"/>
  <text x="383.3" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−2</text>
  <line x1="450.0" x2="450.0" y1="34" y2="220" class="f-plain" style="stroke:var(--ink);stroke-width:1.2"/>
  <text x="450.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="516.7" x2="516.7" y1="34" y2="220" class="f-plain"/>
  <text x="516.7" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+2</text>
  <line x1="583.3" x2="583.3" y1="34" y2="220" class="f-plain"/>
  <text x="583.3" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+4</text>
  <line x1="650.0" x2="650.0" y1="34" y2="220" class="f-plain"/>
  <text x="650.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+6</text>
  <text x="20.0" y="254.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">змяненне дакладнасці ў параўнанні з &quot;Tell me whether…&quot;, працэнтныя пункты</text>
  <text x="20.0" y="59.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">Please tell me…</text>
  <circle cx="346.7" cy="55.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="553.7" y="51.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M534.0 50.5 L538.5 58.5 L529.5 58.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M461.7 50.5 L466.2 55.0 L461.7 59.5 L457.2 55.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="20.0" y="89.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">Could you please… Thank you.</text>
  <circle cx="492.0" cy="85.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="573.0" y="81.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M564.7 80.5 L569.2 88.5 L560.2 88.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M519.0 80.5 L523.5 85.0 L519.0 89.5 L514.5 85.0 Z" style="fill:var(--muted);stroke:none"/>
  <line x1="20" x2="650" y1="100.0" y2="100.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="20.0" y="119.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Now tell me…</text>
  <circle cx="434.7" cy="115.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="408.4" y="111.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M469.0 110.5 L473.5 118.5 L464.5 118.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M427.3 110.5 L431.8 115.0 L427.3 119.5 L422.8 115.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="20.0" y="149.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Say whether…</text>
  <circle cx="453.7" cy="145.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="603.4" y="141.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M415.3 140.5 L419.8 148.5 L410.8 148.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M561.0 140.5 L565.5 145.0 L561.0 149.5 L556.5 145.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="20.0" y="179.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Now look at it… That is all.</text>
  <circle cx="408.0" cy="175.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="580.7" y="171.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M534.0 170.5 L538.5 178.5 L529.5 178.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M438.7 170.5 L443.2 175.0 L438.7 179.5 L434.2 175.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="20.0" y="209.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Just tell me… Don't waste my time.</text>
  <circle cx="304.7" cy="205.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="592.0" y="201.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M427.0 200.5 L431.5 208.5 L422.5 208.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M503.7 200.5 L508.2 205.0 L503.7 209.5 L499.2 205.0 Z" style="fill:var(--muted);stroke:none"/>
  <circle cx="24.0" cy="16.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <text x="32.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 small</text>
  <rect x="127.3" y="12.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <text x="138.6" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 medium</text>
  <path d="M243.8 11.5 L248.3 19.5 L239.3 19.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <text x="251.8" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 large</text>
  <path d="M350.4 11.5 L354.9 16.0 L350.4 20.5 L345.9 16.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="358.4" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-Neo 125M</text>
</svg>
<figcaption>Без прыкладаў, 872 водгукі з валідацыйнага набору SST-2, парог па кантэкстнай каліброўцы асобна для кожнай версіі. Ветлівыя версіі ў двух верхніх радках. 1 пункт гэта прыкладна 9 водгукаў.</figcaption>
</figure>

Кантрольныя версіі паводзілі сябе гэтак жа. Грубая версія дала GPT-2 medium +4,4 пункта, больш, чым "Please". У GPT-2 small яна адняла 4,4 пункта. Толькі `Now tell me...`, роўна той жа даўжыні, што "Please", трымалася ў межах прыкладна пункта на ўсіх мадэлях. Выходзіць, адзіночнае "please" паводзіла сябе як любая іншая дробная праўка інструкцыі, са знакам, які залежыць ад мадэлі. Угадаць гэты знак загадзя я не здолеў.

Поўная ветлівая версія ў гэтую карціну не ўклалася. Гэтага я не чакаў. Па дакладнасці гэта адзіная версія, якая не пагоршыла ніводнай з 4 мадэляў. На medium і large яна дала больш за 3 пункты, Neo атрымала 2, а на small прыбаўка ў межах шуму. Нейтральны хвост прыкладна той жа даўжыні таксама дапамог medium і large, але ў small адняў 1,3 пункта, а на Neo не зрабіў нічога. Што менавіта ў ветлівай фразе гэта робіць, я сказаць не магу. Яшчэ гэта адзіная версія ў форме пытання, з "Could you" наперадзе і пытальнікам.

## Што насамрэч зрушылася

Каб зразумець, ці стала мадэль чытаць водгукі лепей або горш, я ўзяў меру без парога. Гэта доля пар са станоўчага і адмоўнага водгуку, якія мадэль ставіць у правільным парадку. У GPT-2 small "Please" знізіла яе з 0,796 да 0,782. `Now` зрабіла прыкладна тое ж. У GPT-2 medium "Please" падняла яе з 0,859 да 0,872, у large з 0,917 да 0,924. Зрухі маленькія, хоць парны бутстрэп кажа, што гэта не шум. Поўная ветлівая версія на GPT-2 large гэтую меру крыху знізіла, а дакладнасць пры гэтым вырасла на 3,4 пункта.

Па маіх ліках падобна, што інструкцыя ў асноўным мяняе тое, наколькі мадэль хіліцца да аднаго з адказаў. Адказ мяняецца ў асноўным у водгукаў побач з парогам. З 55 водгукаў, якія "Please" перавярнула на GPT-2 small, 53 былі ў чвэрці водгукаў, найбліжэйшых да парога.

З 4 прыкладамі ў промпце GPT-2 small і medium адказвалі "positive" амаль на кожны водгук пры любой інструкцыі. Каліброўка гэтага не выправіла. Толькі Neo з 3 мадэляў, якія я запускаў з прыкладамі, працавала: 75,2% з простай інструкцыяй. "Please" зрушыла яе ў межах шуму, а `Now` адняла 3 пункты.

## Бок адказу

Адказ аплачваецца гэтак жа, так што ветлівасць магла каштаваць і на выхадзе. Тут GPT-2 medium адказвала на 300 пытанняў з валідацыйнай часткі TriviaQA без кантэксту. Генерацыя прагная, да першага пераносу радка або да 32 токенаў.

<figure class="fig">
<svg viewBox="0 0 680 186" role="img" aria-label="Сярэдняя даўжыня адказу GPT-2 medium на 300 пытанняў TriviaQA пры 4 версіях інструкцыі. Answer the question. 16,0, 39 з 300 правільных; Please answer the question. 17,1, 40 з 300 правільных; Could you please… Thank you. 18,1, 36 з 300 правільных; Now answer the question. 14,8, 42 з 300 правільных.">
  <text x="20.0" y="35.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Answer the question.</text>
  <rect x="230" y="23" width="152.2" height="16" class="f-box"/>
  <text x="388.2" y="35.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">16,0</text>
  <text x="660.0" y="35.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">39 з 300 правільных</text>
  <text x="20.0" y="65.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">Please answer the question.</text>
  <rect x="230" y="53" width="162.4" height="16" class="f-box" style="stroke:var(--accent)"/>
  <text x="398.4" y="65.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">17,1</text>
  <text x="660.0" y="65.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40 з 300 правільных</text>
  <text x="20.0" y="95.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">Could you please… Thank you.</text>
  <rect x="230" y="83" width="171.7" height="16" class="f-box" style="stroke:var(--accent)"/>
  <text x="407.7" y="95.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">18,1</text>
  <text x="660.0" y="95.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">36 з 300 правільных</text>
  <text x="20.0" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Now answer the question.</text>
  <rect x="230" y="113" width="140.3" height="16" class="f-box"/>
  <text x="376.3" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">14,8</text>
  <text x="660.0" y="125.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">42 з 300 правільных</text>
  <line x1="230.0" x2="230.0" y1="144" y2="148" class="f-line"/>
  <text x="230.0" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="277.5" x2="277.5" y1="144" y2="148" class="f-line"/>
  <text x="277.5" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <line x1="325.0" x2="325.0" y1="144" y2="148" class="f-line"/>
  <text x="325.0" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="372.5" x2="372.5" y1="144" y2="148" class="f-line"/>
  <text x="372.5" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">15</text>
  <line x1="420.0" x2="420.0" y1="144" y2="148" class="f-line"/>
  <text x="420.0" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <text x="325.0" y="176.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">даўжыня адказу, токенаў (сярэдняе)</text>
</svg>
<figcaption>GPT-2 medium, 300 пытанняў TriviaQA без кантэксту, прагная генерацыя да першага пераносу радка або 32 токенаў. Палоса гэта сярэдняя даўжыня адказу, лік справа гэта колькі адказаў утрымліваюць правільны адказ.</figcaption>
</figure>

З "Please" адказы былі ў сярэднім на 1,1 токена даўжэйшыя, з поўнай ветлівай версіяй на 2,1 токена. Поўная ветлівая версія яшчэ і ўпіралася ў мяжу 32 токенаў у 93 адказах з 300, простая ў 63. `Now` зрабіла адказы на 1,2 токена карацейшымі. Адказаў, у якіх ёсць правільны адказ, пры ўсіх 4 версіях было ад 36 да 42 з 300. Даўжэйшыя адказы не сталі часцей правільнымі.

## Што я з гэтага вынес

Webson і Pavlick у верасні паказалі падобнае. У іх працы мадэлі, навучаныя з промптамі, вучыліся амаль гэтак жа добра на нерэлевантных і падманлівых інструкцыях, як на добрых. Адзіночнае "please" з гэтым сыходзіцца: мае лічбы яно зрушвала, але ў бок, які я не мог ведаць загадзя.

Поўная ветлівая фраза гэта тое, чаго я не чакаў. Называць гэта правілам я пакуль не гатовы. 4 маленькія мадэлі і 1 задача гэта мала, але па дакладнасці на ўсіх 4 яна дапамагла або нічога не зрабіла. А каштуе яна 6 токенаў на ўваходзе і каля 2 на выхадзе. Калі б я плаціў за мільёны такіх выклікаў, я б параўнаў гэтую фразу з простай на сваіх даных.

## Чаго я не правяраў

У OpenAI ёсць яшчэ мадэлі серыі instruct у беце, навучаныя выконваць інструкцыі. Ні GPT-3, ні іх я не запускаў. На ветлівасць яны могуць рэагаваць інакш. Я не ведаю. Класіфікацыя гэта 1 задача з 2 адказамі, прачытанымі па верагоднасці. Каліброўка абапіраецца ўсяго на 3 пустыя ўваходы і шуміць, таму я прыводжу яшчэ і меру без парога. GPT-2 large я запускаў толькі без прыкладаў: поўны прагон на гэтым працэсары заняў бы больш за 3 гадзіны. Ветлівую фразу на часткі я не разбіраў, гэта значыць форму пытання, "Could you" і "Thank you" паасобку. Тэст генерацыі зроблены на 1 мадэлі.
