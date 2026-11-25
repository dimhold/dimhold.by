---
title: "У адных і тых жа 20 файлах LIGO я бачу 2 зліцці або ўсе 10, гледзячы як лічыць"
description: "Я прагнаў адбельванне і паласавы фільтр з вядомага малюнка LIGO па адкрытых 32-секундных файлах усіх 10 зліццяў чорных дзірак з GWTC-1. У залежнасці ад акна і статыстыкі відаць ад 2 да 10. Узгоднены фільтр з апублікаванымі масамі знаходзіць усе 10, адрозненне ад SNR PyCBC не большае за 7%."
date: 2019-02-24
lang: be
translationKey: ligo-open-data
tags: ["open-data", "statistics"]
---

Файл `H-H1_GWOSC_4KHZ_R1-1126259447-32.hdf5` займае 1 МБ. У ім 131 072 лікі, 32 секунды запісу дэтэктара ў Хэнфардзе вакол першай гравітацыйнай хвалі. Стандартнае адхіленне ў гэтых лікаў 2,2e-19. Сама хваля, як я потым падагнаў яе па гэтым файле, у піку дае 1,0e-21, гэта ў 209 разоў менш.

Крывой, якую ўсе бачылі, у файле няма. Яна з'яўляецца пасля адбельвання і паласавога фільтра ад 35 да 350 Гц, потым запісы 2 дэтэктараў малююць адзін паверх другога і відаць, што яны супалі. Я гляджу на гэты малюнак з 2016 года і лічыў, што прыкладна так даныя і выглядаюць. На іншай падзеі я гэты рэцэпт ні разу не спрабаваў. Са снежня ў каталогу GWTC-1 ёсць 10 зліццяў чорных дзірак і для кожнага на GWOSC ляжаць такія ж файлы па 32 секунды. Я паспрабаваў.

Месца хаджанае. Тыя ж крокі на Python робіць падручнік GWOSC. Крэсвел з суаўтарамі ў 2017 годзе шукалі карэляцыі ў астатках, у 2018 годзе да гэтага пытання вярталіся Грын і Мофат, а потым Нільсен з суаўтарамі. Маё пытанне прасцейшае. На колькіх з 10 падзей рэцэпт увогуле нешта паказвае?

## Як я лічыў

20 файлаў, H1 і L1, 4096 Гц, выпуск R1. Спектр шуму ўзяты з тых жа 32 секунд, гэта `scipy.signal.welch` з адрэзкамі па 4 секунды і `average="median"`, гэтая опцыя з'явілася ў SciPy 1.2 у снежні. Па 2 секунды з краёў я выкідаю. Зліццё нейтронных зорак не браў.

Погляд без шаблона я замяніў лікам. У слізгальным акне я перамнажаю 2 адфільтраваныя запісы і складаю здабыткі. Адзін запіс зрушваю адносна другога на час да 10 мс і бяру найбольшую суму па модулі. Прыкладна столькі святло ідзе ад аднаго дэтэктара да другога. Узровень шуму дае той жа файл далёка ад падзеі, дзе L1 зрушаны ў часе 40 разоў. Я лічу шумавыя выпрабаванні, не цішэйшыя за зліццё. Да іх колькасці і да агульнай колькасці дадаю па 1. Зліццё "відаць", калі іх доля меншая за 1 на 1000. Усё гэта я запісаў да прагону. Галоўнае акно 0,2 с, яшчэ 3 вокны і нармаваная карэляцыя замест сумы патрэбныя для праверкі.

Далей шаблон. Гэта IMRPhenomD з LALSuite, масы і спіны я ўзяў з другой версіі артыкула GWTC-1 на arXiv, 1811.12907v2. Узгоднены фільтр пачынаецца з 20 Гц, я бяру найбольшае SNR у межах 0,1 с ад часу з каталога.

## З GW150914 лёгка

На першай падзеі ўсё атрымліваецца. У H1 пік 7,6 сігмы, у L1 6,8. У акне шуму даўжынёй 0,2 с найбольшы адлік звычайна 2,9, а ў 95% з 2580 акон не даходзіць да 3,7. Затрымка паміж дэтэктарамі 7,3 мс па карэляцыі і 7,1 мс па піках шаблона. У артыкуле 6,9 з хібнасцю каля паловы мілісекунды. Знакі ў H1 і L1 супрацьлеглыя, бо дэтэктары павернутыя адзін адносна аднаго, карэляцыя ў акне 0,2 с роўная -0,72.

Потым я намаляваў тое ж самае для GW151226.

<figure class="fig">
<svg viewBox="0 0 680 378" role="img" aria-label="2 панэлі адбеленых даных у паласе ад 35 да 350 Гц, 0,26 секунды вакол зліцця. Зверху GW150914: H1 і перавернуты запіс L1 са зрухам 7,1 мс ідуць разам, пік у H1 7,6 сігмы, сеткавае SNR 23,9. Знізу GW151226: тыя ж 2 лініі падобныя да шуму, пік у H1 3,0 сігмы, сеткавае SNR 12,5.">
  <line x1="50" y1="174.0" x2="660" y2="174.0" class="f-plain"/>
  <text x="42.0" y="178.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-6σ</text>
  <line x1="50" y1="144.0" x2="660" y2="144.0" class="f-plain"/>
  <text x="42.0" y="148.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-3σ</text>
  <line x1="50" y1="114.0" x2="660" y2="114.0" class="f-plain"/>
  <text x="42.0" y="118.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0σ</text>
  <line x1="50" y1="84.0" x2="660" y2="84.0" class="f-plain"/>
  <text x="42.0" y="88.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+3σ</text>
  <line x1="50" y1="54.0" x2="660" y2="54.0" class="f-plain"/>
  <text x="42.0" y="58.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+6σ</text>
  <line x1="519.2" y1="34" x2="519.2" y2="194" class="f-plain"/>
  <polyline points="66.3,112.9 68.6,107.3 70.9,97.7 73.2,104.5 75.4,125.0 77.7,114.4 80.0,102.7 82.3,112.5 84.6,112.1 86.9,110.0 89.2,115.4 91.5,119.2 93.8,122.1 96.1,120.4 98.4,118.5 100.6,115.1 102.9,107.8 105.2,117.8 107.5,125.6 109.8,117.2 112.1,115.7 114.4,115.5 116.7,113.9 119.0,109.3 121.3,100.9 123.6,105.2 125.8,105.3 128.1,109.3 130.4,120.3 132.7,117.5 135.0,112.6 137.3,118.7 139.6,115.0 141.9,110.0 144.2,122.9 146.5,117.7 148.8,103.9 151.1,111.2 153.3,117.2 155.6,110.1 157.9,105.2 160.2,119.7 162.5,126.7 164.8,116.5 167.1,119.9 169.4,131.8 171.7,120.2 174.0,104.0 176.3,106.8 178.5,104.3 180.8,109.3 183.1,116.1 185.4,112.0 187.7,111.0 190.0,117.8 192.3,112.0 194.6,104.3 196.9,105.6 199.2,103.5 201.5,110.3 203.7,126.9 206.0,129.8 208.3,116.8 210.6,108.3 212.9,119.3 215.2,119.9 217.5,115.0 219.8,114.5 222.1,109.1 224.4,117.5 226.7,130.9 229.0,121.6 231.2,103.5 233.5,111.2 235.8,121.0 238.1,106.8 240.4,100.1 242.7,104.2 245.0,102.7 247.3,118.6 249.6,127.5 251.9,98.7 254.2,95.0 256.4,131.1 258.7,129.8 261.0,102.8 263.3,102.9 265.6,113.8 267.9,128.0 270.2,130.3 272.5,115.0 274.8,112.5 277.1,115.4 279.4,113.9 281.6,117.8 283.9,124.8 286.2,119.7 288.5,114.2 290.8,119.0 293.1,106.5 295.4,109.4 297.7,119.3 300.0,106.2 302.3,100.3 304.6,97.6 306.9,92.8 309.1,102.1 311.4,124.2 313.7,128.7 316.0,123.1 318.3,114.3 320.6,108.6 322.9,119.3 325.2,115.6 327.5,107.0 329.8,113.5 332.1,115.5 334.3,120.3 336.6,124.9 338.9,119.7 341.2,128.0 343.5,129.3 345.8,118.0 348.1,123.6 350.4,120.0 352.7,101.5 355.0,99.5 357.3,102.2 359.5,93.6 361.8,100.9 364.1,114.9 366.4,109.8 368.7,109.0 371.0,106.3 373.3,92.8 375.6,115.3 377.9,143.3 380.2,123.4 382.5,95.8 384.8,109.3 387.0,130.5 389.3,128.2 391.6,138.8 393.9,146.9 396.2,121.4 398.5,103.4 400.8,105.3 403.1,112.9 405.4,115.4 407.7,103.7 410.0,103.5 412.2,98.8 414.5,93.9 416.8,102.3 419.1,111.2 421.4,108.9 423.7,101.7 426.0,108.8 428.3,130.2 430.6,135.2 432.9,120.8 435.2,121.3 437.4,122.0 439.7,125.0 442.0,126.9 444.3,127.0 446.6,125.2 448.9,100.0 451.2,88.6 453.5,98.7 455.8,104.5 458.1,102.4 460.4,102.2 462.7,106.6 464.9,106.9 467.2,124.2 469.5,146.9 471.8,145.7 474.1,130.8 476.4,121.3 478.7,116.9 481.0,108.5 483.3,91.8 485.6,80.1 487.9,80.4 490.1,90.8 492.4,115.4 494.7,134.6 497.0,146.9 499.3,158.7 501.6,137.6 503.9,87.3 506.2,65.3 508.5,73.8 510.8,105.4 513.1,167.9 515.3,170.8 517.6,97.7 519.9,68.2 522.2,124.5 524.5,157.8 526.8,122.8 529.1,98.4 531.4,106.2 533.7,108.2 536.0,102.6 538.3,101.0 540.6,102.7 542.8,112.9 545.1,126.9 547.4,122.0 549.7,106.1 552.0,105.2 554.3,109.4 556.6,102.6 558.9,109.7 561.2,131.6 563.5,130.4 565.8,117.1 568.0,119.3 570.3,121.5 572.6,112.7 574.9,113.3 577.2,116.5 579.5,116.5 581.8,115.6 584.1,110.6 586.4,113.7 588.7,110.5 591.0,109.1 593.2,112.6 595.5,109.5 597.8,109.6 600.1,111.9 602.4,112.3 604.7,111.7 607.0,110.7 609.3,108.4 611.6,123.2 613.9,117.3 616.2,104.5 618.4,121.4 620.7,128.0 623.0,108.0 625.3,101.8 627.6,116.7 629.9,119.0 632.2,112.5 634.5,114.3 636.8,130.1 639.1,132.4 641.4,118.8 643.7,104.7 645.9,98.8 648.2,120.6 650.5,126.3 652.8,103.9 655.1,99.2 657.4,104.9 659.7,114.2" style="fill:none;stroke:var(--ink);stroke-width:1.1"/>
  <polyline points="51.8,124.8 54.1,116.2 56.4,116.9 58.7,123.2 61.0,105.3 63.3,99.7 65.6,118.0 67.9,119.1 70.2,117.7 72.5,113.7 74.7,101.1 77.0,107.2 79.3,135.8 81.6,131.4 83.9,99.7 86.2,106.9 88.5,110.5 90.8,107.2 93.1,124.3 95.4,119.9 97.7,104.7 99.9,101.8 102.2,112.2 104.5,121.8 106.8,117.1 109.1,114.6 111.4,110.8 113.7,116.1 116.0,120.3 118.3,107.7 120.6,102.3 122.9,115.5 125.2,124.8 127.4,122.6 129.7,115.3 132.0,107.4 134.3,114.7 136.6,124.7 138.9,122.3 141.2,104.3 143.5,89.7 145.8,113.5 148.1,136.4 150.4,111.1 152.6,102.9 154.9,130.1 157.2,127.5 159.5,112.5 161.8,116.0 164.1,99.7 166.4,90.0 168.7,113.7 171.0,117.0 173.3,108.5 175.6,119.2 177.8,110.9 180.1,106.3 182.4,135.9 184.7,136.3 187.0,119.8 189.3,119.0 191.6,95.3 193.9,94.0 196.2,111.3 198.5,98.8 200.8,93.2 203.0,116.2 205.3,138.2 207.6,132.5 209.9,118.7 212.2,122.1 214.5,120.0 216.8,114.2 219.1,112.5 221.4,103.9 223.7,107.9 226.0,123.3 228.3,119.7 230.5,115.2 232.8,115.0 235.1,112.8 237.4,107.4 239.7,106.2 242.0,110.5 244.3,115.4 246.6,118.0 248.9,102.5 251.2,97.1 253.5,114.5 255.7,120.3 258.0,121.1 260.3,113.8 262.6,112.6 264.9,115.5 267.2,105.1 269.5,112.9 271.8,120.1 274.1,112.2 276.4,116.8 278.7,127.4 280.9,123.1 283.2,119.2 285.5,119.3 287.8,121.4 290.1,118.5 292.4,106.4 294.7,108.2 297.0,121.9 299.3,120.1 301.6,114.1 303.9,104.5 306.2,100.0 308.4,104.8 310.7,103.2 313.0,101.2 315.3,106.0 317.6,104.6 319.9,109.6 322.2,113.3 324.5,113.1 326.8,119.7 329.1,117.3 331.4,121.2 333.6,139.3 335.9,138.6 338.2,132.1 340.5,123.7 342.8,108.5 345.1,105.9 347.4,109.5 349.7,110.6 352.0,113.0 354.3,123.3 356.6,120.6 358.8,115.5 361.1,118.4 363.4,92.5 365.7,77.9 368.0,98.7 370.3,97.6 372.6,92.1 374.9,104.0 377.2,109.4 379.5,110.3 381.8,130.8 384.1,139.4 386.3,134.7 388.6,131.3 390.9,135.3 393.2,143.0 395.5,138.8 397.8,125.3 400.1,118.9 402.4,114.9 404.7,102.6 407.0,89.6 409.3,88.8 411.5,93.6 413.8,89.5 416.1,84.0 418.4,94.4 420.7,108.4 423.0,109.2 425.3,106.5 427.6,124.4 429.9,153.3 432.2,141.4 434.5,118.4 436.7,134.6 439.0,137.9 441.3,116.3 443.6,120.3 445.9,135.0 448.2,122.0 450.5,93.5 452.8,97.4 455.1,99.5 457.4,60.5 459.7,61.2 462.0,102.3 464.2,117.9 466.5,124.8 468.8,140.1 471.1,156.7 473.4,158.1 475.7,142.1 478.0,124.1 480.3,115.6 482.6,112.5 484.9,84.1 487.2,58.1 489.4,65.4 491.7,85.3 494.0,116.5 496.3,155.1 498.6,176.6 500.9,164.0 503.2,122.5 505.5,69.1 507.8,38.1 510.1,74.2 512.4,152.7 514.6,189.9 516.9,132.3 519.2,63.2 521.5,92.9 523.8,150.7 526.1,130.8 528.4,96.1 530.7,108.3 533.0,119.4 535.3,112.5 537.6,104.0 539.9,96.0 542.1,112.9 544.4,124.8 546.7,108.3 549.0,105.7 551.3,124.6 553.6,126.2 555.9,109.5 558.2,110.5 560.5,123.8 562.8,126.5 565.1,118.2 567.3,101.3 569.6,100.6 571.9,111.5 574.2,116.8 576.5,131.3 578.8,128.3 581.1,108.7 583.4,104.0 585.7,106.8 588.0,113.9 590.3,115.7 592.5,106.7 594.8,101.3 597.1,105.0 599.4,113.6 601.7,109.3 604.0,121.3 606.3,141.0 608.6,126.5 610.9,110.8 613.2,114.6 615.5,115.8 617.8,110.3 620.0,97.5 622.3,105.6 624.6,124.4 626.9,115.9 629.2,108.5 631.5,114.9 633.8,114.0 636.1,111.4 638.4,114.5 640.7,119.0 643.0,116.2 645.2,115.6 647.5,120.3 649.8,123.3 652.1,112.2 654.4,106.5 656.7,117.3 659.0,114.3" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="50.0" y="24.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GW150914</text>
  <text x="130.0" y="24.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">SNR 23,9</text>
  <text x="240.0" y="24.0" text-anchor="start" class="f-label f-accent" style="font-size:11px">H1</text>
  <text x="280.0" y="24.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">L1 перавернуты, зрух 7,1 мс</text>
  <line x1="50" y1="314.0" x2="660" y2="314.0" class="f-plain"/>
  <text x="42.0" y="318.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-3σ</text>
  <line x1="50" y1="284.0" x2="660" y2="284.0" class="f-plain"/>
  <text x="42.0" y="288.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0σ</text>
  <line x1="50" y1="254.0" x2="660" y2="254.0" class="f-plain"/>
  <text x="42.0" y="258.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+3σ</text>
  <line x1="519.2" y1="234" x2="519.2" y2="334" class="f-plain"/>
  <polyline points="51.6,284.3 53.8,289.0 56.1,290.9 58.4,282.1 60.7,276.6 63.0,277.4 65.3,282.7 67.6,286.1 69.9,272.5 72.2,264.4 74.5,281.5 76.8,286.1 79.0,268.2 81.3,281.8 83.6,304.8 85.9,301.0 88.2,288.6 90.5,281.4 92.8,284.0 95.1,295.0 97.4,289.5 99.7,272.3 102.0,282.2 104.2,292.1 106.5,278.0 108.8,273.6 111.1,286.8 113.4,296.4 115.7,286.6 118.0,275.2 120.3,283.9 122.6,286.3 124.9,279.9 127.2,280.0 129.5,282.9 131.7,294.8 134.0,290.4 136.3,281.8 138.6,276.3 140.9,265.9 143.2,272.7 145.5,285.2 147.8,277.4 150.1,280.2 152.4,289.3 154.7,291.6 156.9,303.5 159.2,297.1 161.5,288.6 163.8,299.3 166.1,291.4 168.4,274.3 170.7,270.6 173.0,271.2 175.3,277.2 177.6,282.7 179.9,275.2 182.1,279.4 184.4,295.6 186.7,287.4 189.0,285.0 191.3,296.9 193.6,288.2 195.9,269.1 198.2,269.7 200.5,282.1 202.8,288.6 205.1,292.6 207.4,290.7 209.6,286.2 211.9,284.3 214.2,281.6 216.5,285.6 218.8,291.0 221.1,285.4 223.4,271.9 225.7,271.2 228.0,281.1 230.3,289.4 232.6,297.0 234.8,284.3 237.1,269.2 239.4,277.8 241.7,296.4 244.0,295.4 246.3,284.9 248.6,283.3 250.9,273.0 253.2,271.4 255.5,285.9 257.8,294.3 260.0,303.7 262.3,298.5 264.6,279.6 266.9,273.2 269.2,277.8 271.5,273.2 273.8,263.1 276.1,283.4 278.4,298.3 280.7,278.2 283.0,270.2 285.3,297.1 287.5,305.3 289.8,291.0 292.1,289.8 294.4,283.9 296.7,273.7 299.0,281.6 301.3,287.9 303.6,275.4 305.9,273.1 308.2,284.3 310.5,276.8 312.7,273.3 315.0,297.8 317.3,312.4 319.6,302.8 321.9,278.4 324.2,263.3 326.5,266.5 328.8,268.5 331.1,279.6 333.4,308.9 335.7,298.4 337.9,274.6 340.2,289.0 342.5,290.6 344.8,278.1 347.1,275.4 349.4,277.9 351.7,291.4 354.0,292.6 356.3,275.9 358.6,282.2 360.9,303.5 363.2,292.3 365.4,269.2 367.7,271.5 370.0,282.7 372.3,284.7 374.6,278.6 376.9,278.1 379.2,276.1 381.5,283.6 383.8,306.6 386.1,292.5 388.4,273.1 390.6,288.4 392.9,295.5 395.2,281.1 397.5,264.1 399.8,275.0 402.1,291.6 404.4,288.3 406.7,282.8 409.0,290.0 411.3,295.5 413.6,293.8 415.8,293.4 418.1,282.6 420.4,271.1 422.7,276.6 425.0,278.2 427.3,274.0 429.6,279.8 431.9,292.3 434.2,289.7 436.5,276.4 438.8,278.7 441.1,279.2 443.3,276.1 445.6,286.1 447.9,293.0 450.2,292.9 452.5,297.5 454.8,293.8 457.1,274.2 459.4,271.4 461.7,281.6 464.0,281.1 466.3,294.0 468.5,311.2 470.8,297.9 473.1,271.3 475.4,250.7 477.7,254.4 480.0,287.2 482.3,314.2 484.6,305.1 486.9,273.0 489.2,261.0 491.5,275.1 493.7,288.7 496.0,291.5 498.3,292.4 500.6,283.2 502.9,270.1 505.2,289.7 507.5,304.2 509.8,286.1 512.1,290.1 514.4,290.1 516.7,273.5 518.9,284.2 521.2,292.2 523.5,270.0 525.8,257.4 528.1,273.1 530.4,296.7 532.7,297.3 535.0,285.7 537.3,274.8 539.6,273.4 541.9,286.6 544.2,294.3 546.4,300.1 548.7,291.1 551.0,275.4 553.3,276.2 555.6,286.0 557.9,290.0 560.2,284.5 562.5,280.1 564.8,283.5 567.1,285.4 569.4,281.1 571.6,280.6 573.9,281.7 576.2,282.4 578.5,284.8 580.8,290.4 583.1,297.3 585.4,290.5 587.7,274.6 590.0,273.3 592.3,281.6 594.6,285.6 596.8,280.4 599.1,276.1 601.4,278.2 603.7,280.7 606.0,285.8 608.3,291.1 610.6,293.2 612.9,293.0 615.2,289.9 617.5,292.0 619.8,283.8 622.1,263.0 624.3,271.1 626.6,299.0 628.9,293.4 631.2,269.1 633.5,270.3 635.8,291.8 638.1,296.3 640.4,291.5 642.7,288.2 645.0,280.5 647.3,279.9 649.5,282.1 651.8,280.7 654.1,280.9 656.4,272.5 658.7,260.1" style="fill:none;stroke:var(--ink);stroke-width:1.1"/>
  <polyline points="51.8,278.8 54.1,285.6 56.4,285.1 58.7,283.7 61.0,279.2 63.3,275.1 65.6,288.5 67.9,299.0 70.2,292.1 72.5,289.9 74.7,290.9 77.0,272.1 79.3,260.9 81.6,274.1 83.9,280.9 86.2,279.2 88.5,287.2 90.8,297.2 93.1,297.7 95.4,288.6 97.7,278.3 99.9,277.1 102.2,288.6 104.5,286.8 106.8,280.9 109.1,280.4 111.4,278.3 113.7,283.0 116.0,280.7 118.3,280.5 120.6,292.9 122.9,289.1 125.2,285.0 127.4,287.1 129.7,285.4 132.0,289.9 134.3,288.5 136.6,282.8 138.9,280.1 141.2,280.4 143.5,283.2 145.8,272.0 148.1,275.2 150.4,287.8 152.6,287.6 154.9,282.2 157.2,276.0 159.5,285.8 161.8,304.4 164.1,295.0 166.4,274.2 168.7,275.6 171.0,286.2 173.3,286.2 175.6,284.1 177.8,284.5 180.1,289.1 182.4,287.1 184.7,266.8 187.0,276.9 189.3,295.9 191.6,278.2 193.9,273.4 196.2,295.2 198.5,301.3 200.8,283.6 203.0,280.5 205.3,285.6 207.6,282.2 209.9,278.1 212.2,277.6 214.5,290.5 216.8,287.8 219.1,267.9 221.4,281.2 223.7,287.8 226.0,282.0 228.3,286.7 230.5,283.8 232.8,296.2 235.1,302.5 237.4,286.5 239.7,279.9 242.0,275.3 244.3,270.9 246.6,288.4 248.9,286.0 251.2,268.2 253.5,282.5 255.7,292.9 258.0,277.6 260.3,283.6 262.6,306.2 264.9,300.1 267.2,272.9 269.5,266.2 271.8,274.9 274.1,280.0 276.4,276.4 278.7,274.2 280.9,289.4 283.2,300.7 285.5,296.4 287.8,284.5 290.1,288.0 292.4,301.3 294.7,289.9 297.0,282.1 299.3,286.1 301.6,270.1 303.9,266.3 306.2,282.4 308.4,283.8 310.7,279.3 313.0,281.8 315.3,288.1 317.6,296.6 319.9,280.6 322.2,262.2 324.5,275.7 326.8,293.1 329.1,285.8 331.4,281.7 333.6,292.8 335.9,296.1 338.2,296.9 340.5,289.8 342.8,286.9 345.1,284.6 347.4,265.1 349.7,265.6 352.0,286.2 354.3,292.2 356.6,282.6 358.8,279.2 361.1,285.4 363.4,291.8 365.7,296.8 368.0,289.0 370.3,280.8 372.6,286.9 374.9,280.1 377.2,270.0 379.5,266.7 381.8,266.1 384.1,281.7 386.3,290.9 388.6,297.6 390.9,305.3 393.2,283.4 395.5,270.9 397.8,298.3 400.1,302.9 402.4,281.6 404.7,274.3 407.0,274.4 409.3,290.8 411.5,308.9 413.8,289.3 416.1,265.4 418.4,266.5 420.7,263.6 423.0,259.0 425.3,273.1 427.6,289.5 429.9,301.6 432.2,305.4 434.5,305.2 436.7,299.3 439.0,285.2 441.3,269.1 443.6,266.2 445.9,289.3 448.2,301.0 450.5,281.8 452.8,278.9 455.1,287.2 457.4,273.3 459.7,261.0 462.0,272.2 464.2,280.5 466.5,289.3 468.8,299.9 471.1,295.0 473.4,291.9 475.7,282.2 478.0,278.0 480.3,284.6 482.6,295.5 484.9,306.2 487.2,290.8 489.4,262.6 491.7,256.3 494.0,278.9 496.3,305.0 498.6,294.9 500.9,276.6 503.2,270.8 505.5,280.4 507.8,287.7 510.1,267.7 512.4,271.0 514.6,302.7 516.9,296.0 519.2,283.7 521.5,284.1 523.8,281.8 526.1,284.4 528.4,290.6 530.7,291.8 533.0,286.7 535.3,274.1 537.6,275.1 539.9,291.3 542.1,292.8 544.4,285.1 546.7,285.5 549.0,287.8 551.3,281.5 553.6,272.2 555.9,272.7 558.2,277.4 560.5,270.4 562.8,281.4 565.1,305.8 567.3,297.0 569.6,265.4 571.9,269.9 574.2,304.8 576.5,312.0 578.8,294.0 581.1,276.6 583.4,281.3 585.7,291.2 588.0,284.0 590.3,269.3 592.5,268.9 594.8,283.4 597.1,289.8 599.4,292.9 601.7,284.9 604.0,268.0 606.3,268.5 608.6,280.0 610.9,279.1 613.2,285.4 615.5,283.1 617.8,279.4 620.0,299.0 622.3,301.0 624.6,288.4 626.9,284.9 629.2,298.1 631.5,301.5 633.8,287.9 636.1,284.2 638.4,273.1 640.7,262.2 643.0,278.1 645.2,285.6 647.5,276.8 649.8,268.4 652.1,273.4 654.4,293.2 656.7,292.7 659.0,278.9" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="50.0" y="224.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GW151226</text>
  <text x="130.0" y="224.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">SNR 12,5</text>
  <text x="240.0" y="224.0" text-anchor="start" class="f-label f-accent" style="font-size:11px">H1</text>
  <text x="280.0" y="224.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">L1 перавернуты, зрух 0,9 мс</text>
  <text x="50.0" y="352.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-200</text>
  <text x="167.3" y="352.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-150</text>
  <text x="284.6" y="352.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-100</text>
  <text x="401.9" y="352.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-50</text>
  <text x="519.2" y="352.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="636.5" y="352.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="660.0" y="370.0" text-anchor="end" class="f-label f-muted" style="font-size:11px">мс ад зліцця ў H1</text>
</svg>
<figcaption>Адзін і той жа рэцэпт для 2 падзей. H1 акцэнтным колерам, L1 перавернуты і зрушаны на затрымку, знойдзеную шаблонам, ён цёмны. Вертыкальная лінія гэта час зліцця паводле шаблона, шкала ў стандартных адхіленнях шуму.</figcaption>
</figure>

Сеткавае SNR з шаблонам у яе 12,5, у падзеі я не сумняваюся. А на малюнку пік 3,0 сігмы ў H1 і 3,6 у L1, столькі дае і шум. Не ведаючы, куды глядзець, я б яе не знайшоў. Я чакаў, што малюнак будзе горшы, але тут не відаць наогул нічога.

## Вырашае акно

Пры галоўнай настройцы відаць 7 з 10. Няма GW151012, GW151226 і GW170818, у іх гучнейшымі за падзею аказаліся 4, 50 і 89 шумавых выпрабаванняў. У пошуку cWB, які таксама абыходзіцца без шаблонаў, у артыкуле столькі ж, 7 з 10. Але гэта іншыя 7, там ёсць GW151226 і няма GW170809.

<figure class="fig">
<svg viewBox="0 0 680 344" role="img" aria-label="Табліца: 10 падзей, вокны 50, 100, 200 і 500 мс і 2 статыстыкі. У клетцы колькасць шумавых выпрабаванняў, якія гучнейшыя за падзею. Падзей відаць: 10, 8, 7, 4 паводле сумы здабыткаў, 3, 5, 5, 2 паводле карэляцыі.">
  <text x="242.0" y="18.0" text-anchor="middle" class="f-label f-ink" style="font-size:11px">сума здабыткаў</text>
  <text x="143.0" y="40.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50 мс</text>
  <text x="143.0" y="56.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6300</text>
  <rect x="112.0" y="72" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="143.0" y="86.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="112.0" y="96" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="143.0" y="110.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="112.0" y="120" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="143.0" y="134.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="112.0" y="144" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="143.0" y="158.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="112.0" y="168" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="143.0" y="182.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="112.0" y="192" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="143.0" y="206.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="112.0" y="216" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="143.0" y="230.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="112.0" y="240" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="143.0" y="254.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">2</text>
  <rect x="112.0" y="264" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="143.0" y="278.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="112.0" y="288" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="143.0" y="302.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <text x="143.0" y="330.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">10</text>
  <text x="209.0" y="40.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100 мс</text>
  <text x="209.0" y="56.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4700</text>
  <rect x="178.0" y="72" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="209.0" y="86.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="178.0" y="96" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="209.0" y="110.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">1</text>
  <rect x="178.0" y="120" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="209.0" y="134.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <rect x="178.0" y="144" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="209.0" y="158.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="178.0" y="168" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="209.0" y="182.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="178.0" y="192" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="209.0" y="206.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="178.0" y="216" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="209.0" y="230.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="178.0" y="240" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="209.0" y="254.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">2</text>
  <rect x="178.0" y="264" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="209.0" y="278.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">29</text>
  <rect x="178.0" y="288" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="209.0" y="302.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <text x="209.0" y="330.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">8</text>
  <text x="275.0" y="40.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200 мс</text>
  <text x="275.0" y="56.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3100</text>
  <rect x="244.0" y="72" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="275.0" y="86.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="244.0" y="96" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="275.0" y="110.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <rect x="244.0" y="120" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="275.0" y="134.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <rect x="244.0" y="144" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="275.0" y="158.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="244.0" y="168" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="275.0" y="182.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="244.0" y="192" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="275.0" y="206.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="244.0" y="216" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="275.0" y="230.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="244.0" y="240" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="275.0" y="254.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">2</text>
  <rect x="244.0" y="264" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="275.0" y="278.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">89</text>
  <rect x="244.0" y="288" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="275.0" y="302.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <text x="275.0" y="330.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">7</text>
  <text x="341.0" y="40.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">500 мс</text>
  <text x="341.0" y="56.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1400</text>
  <rect x="310.0" y="72" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="341.0" y="86.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="310.0" y="96" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="341.0" y="110.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="310.0" y="120" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="341.0" y="134.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <rect x="310.0" y="144" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="341.0" y="158.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="310.0" y="168" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="341.0" y="182.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="310.0" y="192" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="341.0" y="206.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="310.0" y="216" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="341.0" y="230.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="310.0" y="240" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="341.0" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <rect x="310.0" y="264" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="341.0" y="278.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">500</text>
  <rect x="310.0" y="288" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="341.0" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <text x="341.0" y="330.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">4</text>
  <text x="522.0" y="18.0" text-anchor="middle" class="f-label f-ink" style="font-size:11px">карэляцыя</text>
  <text x="423.0" y="40.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50 мс</text>
  <text x="423.0" y="56.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6300</text>
  <rect x="392.0" y="72" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="423.0" y="86.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="392.0" y="96" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="423.0" y="110.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">45</text>
  <rect x="392.0" y="120" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="423.0" y="134.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1626</text>
  <rect x="392.0" y="144" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="423.0" y="158.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="392.0" y="168" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="423.0" y="182.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">625</text>
  <rect x="392.0" y="192" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="423.0" y="206.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">38</text>
  <rect x="392.0" y="216" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="423.0" y="230.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">94</text>
  <rect x="392.0" y="240" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="423.0" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <rect x="392.0" y="264" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="423.0" y="278.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3547</text>
  <rect x="392.0" y="288" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="423.0" y="302.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">1</text>
  <text x="423.0" y="330.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">3</text>
  <text x="489.0" y="40.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100 мс</text>
  <text x="489.0" y="56.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4700</text>
  <rect x="458.0" y="72" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="489.0" y="86.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="458.0" y="96" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="489.0" y="110.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">27</text>
  <rect x="458.0" y="120" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="489.0" y="134.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2059</text>
  <rect x="458.0" y="144" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="489.0" y="158.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="458.0" y="168" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="489.0" y="182.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">108</text>
  <rect x="458.0" y="192" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="489.0" y="206.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <rect x="458.0" y="216" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="489.0" y="230.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="458.0" y="240" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="489.0" y="254.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">3</text>
  <rect x="458.0" y="264" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="489.0" y="278.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3727</text>
  <rect x="458.0" y="288" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="489.0" y="302.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <text x="489.0" y="330.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">5</text>
  <text x="555.0" y="40.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200 мс</text>
  <text x="555.0" y="56.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3100</text>
  <rect x="524.0" y="72" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="555.0" y="86.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="524.0" y="96" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="555.0" y="110.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">72</text>
  <rect x="524.0" y="120" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="555.0" y="134.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">629</text>
  <rect x="524.0" y="144" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="555.0" y="158.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="524.0" y="168" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="555.0" y="182.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">76</text>
  <rect x="524.0" y="192" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="555.0" y="206.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="524.0" y="216" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="555.0" y="230.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">2</text>
  <rect x="524.0" y="240" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="555.0" y="254.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="524.0" y="264" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="555.0" y="278.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1198</text>
  <rect x="524.0" y="288" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="555.0" y="302.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <text x="555.0" y="330.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">5</text>
  <text x="621.0" y="40.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">500 мс</text>
  <text x="621.0" y="56.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1400</text>
  <rect x="590.0" y="72" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="621.0" y="86.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="590.0" y="96" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="621.0" y="110.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">69</text>
  <rect x="590.0" y="120" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="621.0" y="134.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">21</text>
  <rect x="590.0" y="144" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="621.0" y="158.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <rect x="590.0" y="168" width="62" height="20" style="fill:var(--accent);opacity:0.22;stroke:none"/>
  <text x="621.0" y="182.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="590.0" y="192" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="621.0" y="206.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">71</text>
  <rect x="590.0" y="216" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="621.0" y="230.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <rect x="590.0" y="240" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="621.0" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="590.0" y="264" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="621.0" y="278.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">949</text>
  <rect x="590.0" y="288" width="62" height="20" style="fill:none;stroke:var(--muted);opacity:0.4"/>
  <text x="621.0" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <text x="621.0" y="330.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">2</text>
  <text x="100.0" y="40.0" text-anchor="end" class="f-label f-muted" style="font-size:11px">акно</text>
  <text x="100.0" y="56.0" text-anchor="end" class="f-label f-muted" style="font-size:11px">выпрабаванняў</text>
  <text x="100.0" y="86.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW150914</text>
  <text x="100.0" y="110.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW151012</text>
  <text x="100.0" y="134.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW151226</text>
  <text x="100.0" y="158.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170104</text>
  <text x="100.0" y="182.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170608</text>
  <text x="100.0" y="206.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170729</text>
  <text x="100.0" y="230.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170809</text>
  <text x="100.0" y="254.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170814</text>
  <text x="100.0" y="278.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170818</text>
  <text x="100.0" y="302.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170823</text>
  <text x="100.0" y="330.0" text-anchor="end" class="f-label f-muted" style="font-size:11px">відаць</text>
</svg>
<figcaption>Колькі шумавых выпрабаванняў гучнейшыя за падзею пры кожным спосабе глядзець. Зафарбаваныя клеткі, дзе выканана маё правіла, менш за 1 на 1000, калі дадаць па 1 да абодвух лікаў. Пад шырынёй акна сярэдняя колькасць выпрабаванняў на падзею, акругленая. Унізе колькі падзей відаць.</figcaption>
</figure>

7 з 10 выглядалі як вынік. Але іншыя вокны даюць 10, 8 і 4, а нармаваная карэляцыя дае 3, 5, 5 і 2. Суме больш падабаецца кароткае акно, пры 50 мс праходзяць усе 10. Пры 500 мс выпрабаванняў усяго каля 1400 на падзею, таму паводле майго правіла гучнейшага за падзею не павінна быць ніводнага. Я магу выбраць лік, які спадабаецца. 0,2 с варта браць толькі таму, што яно запісана да прагону.

Не так з маім поглядам і яшчэ нешта. GW151226 пры акне 50 мс лічыцца ўбачанай, але найлепшы зрух там 4,4 мс. Шаблон дае 0,9 мс, у артыкуле было 1,1. З GW170608 пры 50 мс тая ж бяда, -3,4 мс замест -7,1. У гэтых 2 выпадках сума дадатная. У астатніх 8 яна адмоўная, як у GW150914. Промах 3,5 і 3,6 мс, гэта прыкладна палова перыяду на 140 Гц. Думаю, сума саскочыла на суседнюю паўхвалю, а модуль дараваў ёй знак. Так што гэтыя 2 зліцці залічаныя як убачаныя, але з няправільнай затрымкай.

GW170814 прайшла галоўны тэст ледзь-ледзь, 2 выпрабаванні з 3078 гучнейшыя. Я пачаў шукаць прычыну і знайшоў перашкоду ў L1 за 5,7 с да падзеі, вышынёй 19 сігм. Абодва гучныя выпрабаванні яе закранаюць. Калі прыбраць усе 174 выпрабаванні, куды яна трапіла, самы гучны шум дае суму 172, а падзея 354. Перашкоду я ўсё роўна пакінуў, такі шум гэта частка фону. Яна псуе і тэст з шаблонам. У самага гучнага шуму ў гэтым файле сеткавае SNR 12,8, а ў падзеі 16,0. Для астатніх 9 шум не паднімаецца вышэй за 6,1.

## Шаблон знаходзіць усе 10

| падзея | маё SNR | PyCBC | самы гучны шум |
|---|---|---|---|
| GW150914 | 23,9 | 23,6 | 5,2 |
| GW151012 | 9,1 | 9,5 | 5,3 |
| GW151226 | 12,5 | 13,1 | 5,7 |
| GW170104 | 12,9 | 13,0 | 5,5 |
| GW170608 | 14,3 | 15,4 | 6,0 |
| GW170729 | 10,5 | 9,8 | 5,1 |
| GW170809 | 12,2 | 12,2 | 5,4 |
| GW170814 | 16,0 | 16,3 | 12,8 |
| GW170818 | 11,1 | няма | 5,8 |
| GW170823 | 11,2 | 11,1 | 6,1 |

Я дапускаў 15% адрознення ад апублікаванага SNR, найгоршы выпадак 7%. Для GW170818 у артыкуле няма радка PyCBC, у GstLAL 11,3. У мяне гэта амаль адзін дэтэктар, 10,4 у L1 і 3,7 у H1.

Вынік сціплейшы, чым здаецца, бо масы ў маім шаблоне вымераныя на тых жа даных. Сапраўдны пошук перабірае банк шаблонаў, не ведаючы адказу. Я праверыў на кожным файле астатнія 9 шаблонаў. Найгучнейшы ў падзеі свой, але запас бывае малы, на GW170814 шаблон GW170104 набірае 15,9 супраць 16,0.

## Колькі ў гэтай хвалі ад фільтра

Я баяўся, што паласавы фільтр ператварае любы пстрычок у маленькі чырп. Здаецца, што не. Імпульс пасля адбельвання і паласы трымаецца вышэй за 5% сваёй вышыні 14 мс і мяняе знак 2 разы. Сама паласа захоўвае ад 92% да 99% SNR шаблона.

Іншая справа ваганне ў паласе, яго шум дае ўвесь час. Я падагнаў шаблон да акон шуму са свабоднымі амплітудай, фазай і часам. Найлепшая падгонка за паўсекунды шуму звычайна забірае ад 8% да 10% энергіі акна 0,2 с. Самая ўдалая забрала 20%. На GW150914 гэта 71% у H1 і 65% у L1. З 20 пар "падзея і дэтэктар" 19 вышэйшыя за максімум шуму ў сваім файле. Адзіная іншая пара гэта GW170818 у H1, 11%.

<figure class="fig">
<svg viewBox="0 0 680 326" role="img" aria-label="Доля энергіі акна ў 0,2 секунды, якую тлумачыць найлепшы шаблон, 10 падзей, дэтэктары H1 і L1, побач з шумам з тых жа файлаў. GW150914 H1 71, L1 65; GW151012 H1 29, L1 23; GW151226 H1 24, L1 21; GW170104 H1 44, L1 41; GW170608 H1 48, L1 29; GW170729 H1 28, L1 30; GW170809 H1 24, L1 52; GW170814 H1 38, L1 58; GW170818 H1 11, L1 44; GW170823 H1 28, L1 50. Медыяна шуму ад 8 да 10 працэнтаў, максімум шуму да 20 працэнтаў.">
  <line x1="100.0" y1="36" x2="100.0" y2="280" class="f-plain"/>
  <text x="100.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="237.5" y1="36" x2="237.5" y2="280" class="f-plain"/>
  <text x="237.5" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="375.0" y1="36" x2="375.0" y2="280" class="f-plain"/>
  <text x="375.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="512.5" y1="36" x2="512.5" y2="280" class="f-plain"/>
  <text x="512.5" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="650.0" y1="36" x2="650.0" y2="280" class="f-plain"/>
  <text x="650.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <text x="90.0" y="56.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW150914</text>
  <rect x="100" y="46.0" width="110.5" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="163.2" y1="46.0" x2="163.2" y2="58.0" class="f-line"/>
  <circle cx="549.2" cy="52.0" r="4.5" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="590.1" cy="52.0" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="90.0" y="80.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW151012</text>
  <rect x="100" y="70.0" width="110.3" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="163.7" y1="70.0" x2="163.7" y2="82.0" class="f-line"/>
  <circle cx="257.2" cy="76.0" r="4.5" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="299.6" cy="76.0" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="90.0" y="104.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW151226</text>
  <rect x="100" y="94.0" width="122.1" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="163.9" y1="94.0" x2="163.9" y2="106.0" class="f-line"/>
  <circle cx="242.0" cy="100.0" r="4.5" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="265.2" cy="100.0" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="90.0" y="128.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170104</text>
  <rect x="100" y="118.0" width="121.0" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="167.5" y1="118.0" x2="167.5" y2="130.0" class="f-line"/>
  <circle cx="380.3" cy="124.0" r="4.5" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="400.9" cy="124.0" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="90.0" y="152.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170608</text>
  <rect x="100" y="142.0" width="111.5" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="163.3" y1="142.0" x2="163.3" y2="154.0" class="f-line"/>
  <circle cx="302.1" cy="148.0" r="4.5" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="428.7" cy="148.0" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="90.0" y="176.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170729</text>
  <rect x="100" y="166.0" width="99.0" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="157.2" y1="166.0" x2="157.2" y2="178.0" class="f-line"/>
  <circle cx="305.7" cy="172.0" r="4.5" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="293.9" cy="172.0" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="90.0" y="200.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170809</text>
  <rect x="100" y="190.0" width="106.7" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="163.9" y1="190.0" x2="163.9" y2="202.0" class="f-line"/>
  <circle cx="457.7" cy="196.0" r="4.5" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="265.5" cy="196.0" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="90.0" y="224.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170814</text>
  <rect x="100" y="214.0" width="139.3" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="165.6" y1="214.0" x2="165.6" y2="226.0" class="f-line"/>
  <circle cx="497.9" cy="220.0" r="4.5" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="358.1" cy="220.0" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="90.0" y="248.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170818</text>
  <rect x="100" y="238.0" width="104.5" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="163.4" y1="238.0" x2="163.4" y2="250.0" class="f-line"/>
  <circle cx="405.3" cy="244.0" r="4.5" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="177.5" cy="244.0" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="90.0" y="272.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">GW170823</text>
  <rect x="100" y="262.0" width="127.5" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="165.3" y1="262.0" x2="165.3" y2="274.0" class="f-line"/>
  <circle cx="444.8" cy="268.0" r="4.5" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="292.1" cy="268.0" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="650.0" y="316.0" text-anchor="end" class="f-label f-muted" style="font-size:11px">доля энергіі акна, якую тлумачыць шаблон, %</text>
  <circle cx="105" cy="16" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="116.0" y="20.0" text-anchor="start" class="f-label f-accent" style="font-size:11px">H1</text>
  <circle cx="165" cy="16" r="4.5" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <text x="176.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">L1</text>
  <rect x="230" y="10" width="24" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="262.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">шум, да максімуму</text>
</svg>
<figcaption>Якую частку адфільтраванай крывой складае шаблон. Шэрая паласа: тая ж падгонка да шуму з тых жа файлаў, да яе максімуму (большы з 2 дэтэктараў). Штрых у паласе гэта медыяна.</figcaption>
</figure>

71% мне падабаліся, пакуль я не зрабіў арыфметыку. У акне прыкладна 126 незалежных лікаў, гэта 2 на 315 Гц на 0,2 с. Пры SNR 19,6 у H1 ідэальны шаблон у белым шуме забраў бы каля 75%, а ў L1 пры 13,8 каля 60%. Мае 65% у L1 нават большыя, значыць, ацэнка грубая. Усё ж гэтая доля ў асноўным паўтарае SNR і даўжыню акна, пра форму яна кажа мала.

## Чаго я не правяраў

На падзею адна падгонка з медыянамі з артыкула, прэцэсіі спінаў у ёй няма. Virgo я не браў. Шум узяты з 28 секунд, зрушаных адносна саміх сябе 40 разоў, таму выпрабаванні залежаць адно ад аднаго і 1 з 1000 гучыць занадта аптымістычна. Нязрушаны шум прайшоў невялікую праверку, 8 з 847 акон вышэйшыя за 99-ы працэнтыль зрушаных, прыкладна як і павінна быць. Пра астаткі я нічога не сцвярджаю, для гэтага 32 секунд на падзею мала.
