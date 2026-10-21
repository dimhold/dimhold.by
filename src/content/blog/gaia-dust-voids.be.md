---
title: "Дзірка на зорнай карце Gaia і як далёка яна"
description: "У Gaia DR3 у цёмнага воблака Barnard 68 у межах паўхвіліны ад цэнтра 0 зорак пры 175 чаканых, а 2MASS у блізкім ІЧ бачыць там 41%, значыць гэта пыл. У туманнасці Люлька паглынанне па Gaia ў зорак цёмных клетак скача з 0,52 да 1,95 на 157 пк, побач з апублікаванымі адлегласцямі."
date: 2022-09-11
lang: be
translationKey: gaia-dust-voids
tags: ["open-data", "statistics"]
---
Калі на маім графіку з'яўляецца дзірка, першым я заўсёды падазраю канвеер даных. Фільтр, які выкінуў радкі, або пачку, якая не даехала. У чэрвені выйшаў Gaia DR3 са становішчамі 1,8 мільярда крыніц. Калі палічыць іх на квадратны градус, на карце ўздоўж усяго Млечнага Шляху відаць чорныя плямы. Адказ з падручніка я ведаю. Гэта воблакі пылу перад зоркамі. Але ў лічбах я гэтага ніколі не бачыў і не ведаў, што па тым жа каталогу можна зразумець, як далёка гэты пыл. Я хацеў праверыць і тое і другое толькі па адкрытым архіве.

Усё гэта запыты ADQL да архіва Gaia ў ESA і каля 230 радкоў на Python з numpy і scipy. У тым жа архіве ляжыць і каталог кропкавых крыніц 2MASS.

## Адно маленькае воблака

Barnard 68 гэта цёмнае воблака ў Змеяносцы памерам у некалькі вуглавых хвілін. Я ўзяў усе зоркі Gaia ў межах 15 вуглавых хвілін ад яго цэнтра і палічыў іх па кольцах. Паміж 6 і 15 хвілінамі на квадратную вуглавую хвіліну прыпадае 223 зоркі. Пры такой шчыльнасці ў межах паўхвіліны ад цэнтра павінна быць 175 зорак. Там 0. У межах 1 хвіліны 9 зорак з 700 чаканых, гэта 1,3%. Усе 9 слабейшыя за G = 19.

<figure class="fig">
<svg viewBox="0 0 680 400" role="img" aria-label="Карта колькасці зорак Gaia DR3 вакол цёмнага воблака Barnard 68, 25 на 25 вуглавых хвілін, адзін квадрат на квадратную вуглавую хвіліну, поўнач уверсе, усход злева. Чым цямнейшы квадрат, тым больш у ім зорак. Удалечыні ад воблака ў квадраце каля 198 зорак. Пасярэдзіне белая пляма памерам каля 3 вуглавых хвілін. З 4 цэнтральных квадратаў у 3 ад 0 да 4 зорак.">
  <rect x="496" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="496" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.83"/>
  <rect x="496" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="496" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.81"/>
  <rect x="496" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.89"/>
  <rect x="496" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.92"/>
  <rect x="496" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.84"/>
  <rect x="496" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="496" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.86"/>
  <rect x="496" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="496" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="496" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="496" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="496" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="496" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="496" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="496" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="496" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="496" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="496" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="496" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="496" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="496" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="496" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="496" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="496" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="483" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="483" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="483" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.86"/>
  <rect x="483" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.89"/>
  <rect x="483" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.77"/>
  <rect x="483" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.84"/>
  <rect x="483" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="483" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="483" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="483" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.89"/>
  <rect x="483" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="483" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="483" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="483" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:0.89"/>
  <rect x="483" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="483" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="483" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="483" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="483" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="483" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="483" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="483" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="483" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="483" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="483" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="483" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="470" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="470" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.84"/>
  <rect x="470" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="470" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="470" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="470" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="470" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="470" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="470" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="470" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="470" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="457" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="457" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="457" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="457" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="457" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.86"/>
  <rect x="457" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="457" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="457" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="457" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="457" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="444" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="444" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="444" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="444" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="444" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="444" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="444" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.89"/>
  <rect x="444" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="444" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="444" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="431" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="431" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="431" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="431" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="431" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.85"/>
  <rect x="431" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="431" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="431" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="418" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.83"/>
  <rect x="418" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="418" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="418" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="418" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="418" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="418" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="418" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="418" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="418" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.79"/>
  <rect x="405" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="405" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="405" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="405" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.89"/>
  <rect x="405" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="405" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="405" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="405" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.77"/>
  <rect x="392" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="392" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="392" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="392" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="392" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.73"/>
  <rect x="392" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="392" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="392" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="392" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="379" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="379" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="379" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.84"/>
  <rect x="379" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.82"/>
  <rect x="379" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="379" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="379" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="379" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="379" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="366" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.92"/>
  <rect x="366" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="366" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="366" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.82"/>
  <rect x="366" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.73"/>
  <rect x="366" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.84"/>
  <rect x="366" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.73"/>
  <rect x="366" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="366" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="366" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="366" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="353" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="353" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="353" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.79"/>
  <rect x="353" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.63"/>
  <rect x="353" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.41"/>
  <rect x="353" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:0.34"/>
  <rect x="353" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:0.50"/>
  <rect x="353" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="353" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="353" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="340" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="340" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="340" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="340" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="340" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="340" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.85"/>
  <rect x="340" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.60"/>
  <rect x="340" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.15"/>
  <rect x="340" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:0.10"/>
  <rect x="340" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:0.51"/>
  <rect x="340" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="340" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="327" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="327" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="327" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="327" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="327" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.92"/>
  <rect x="327" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.49"/>
  <rect x="327" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.06"/>
  <rect x="327" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:0.26"/>
  <rect x="327" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="327" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="327" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="314" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="314" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="314" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="314" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="314" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="314" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.92"/>
  <rect x="314" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.65"/>
  <rect x="314" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.05"/>
  <rect x="314" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:0.48"/>
  <rect x="314" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:0.43"/>
  <rect x="314" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:0.74"/>
  <rect x="314" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="314" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.78"/>
  <rect x="301" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.78"/>
  <rect x="301" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="301" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="301" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="301" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="301" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.92"/>
  <rect x="301" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="301" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="301" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="301" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="301" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.70"/>
  <rect x="301" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="301" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="288" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.83"/>
  <rect x="288" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.85"/>
  <rect x="288" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.68"/>
  <rect x="288" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.64"/>
  <rect x="288" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="288" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.41"/>
  <rect x="288" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.63"/>
  <rect x="288" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.78"/>
  <rect x="288" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="288" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="288" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="288" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="288" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="288" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="288" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="288" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="288" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="288" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="288" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="288" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="288" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="288" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="288" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="288" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="288" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="288" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="275" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.76"/>
  <rect x="275" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.80"/>
  <rect x="275" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.54"/>
  <rect x="275" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.33"/>
  <rect x="275" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.07"/>
  <rect x="275" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.35"/>
  <rect x="275" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.14"/>
  <rect x="275" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.77"/>
  <rect x="275" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.92"/>
  <rect x="275" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="275" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.83"/>
  <rect x="275" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="275" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="275" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="275" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="275" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="275" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="275" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="275" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="275" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="275" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="275" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="275" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="275" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="275" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="275" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.75"/>
  <rect x="262" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="262" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.72"/>
  <rect x="262" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.63"/>
  <rect x="262" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="262" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.43"/>
  <rect x="262" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.71"/>
  <rect x="262" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.29"/>
  <rect x="262" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="262" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="262" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="262" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="262" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="262" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:0.86"/>
  <rect x="262" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="262" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="262" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="262" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="262" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="262" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="262" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="262" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="262" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="262" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="262" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="262" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:0.83"/>
  <rect x="262" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.76"/>
  <rect x="249" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.76"/>
  <rect x="249" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.48"/>
  <rect x="249" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.74"/>
  <rect x="249" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.73"/>
  <rect x="249" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.81"/>
  <rect x="249" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.76"/>
  <rect x="249" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="249" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="249" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.85"/>
  <rect x="249" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="249" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="249" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="249" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="249" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="249" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="249" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="249" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="249" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="249" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="249" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="249" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="249" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="249" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="249" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="249" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:0.79"/>
  <rect x="249" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.81"/>
  <rect x="236" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.65"/>
  <rect x="236" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.36"/>
  <rect x="236" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.61"/>
  <rect x="236" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.83"/>
  <rect x="236" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="236" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.81"/>
  <rect x="236" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="236" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="236" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.86"/>
  <rect x="236" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="236" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="236" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="236" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="236" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="236" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="236" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="236" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="236" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="236" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="236" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="236" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="236" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="236" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="236" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="236" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="236" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="223" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.77"/>
  <rect x="223" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.66"/>
  <rect x="223" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.92"/>
  <rect x="223" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="223" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.86"/>
  <rect x="223" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="223" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.85"/>
  <rect x="223" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.81"/>
  <rect x="223" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="223" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="223" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="223" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="223" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="223" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="223" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="223" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="223" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:0.79"/>
  <rect x="223" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="223" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="223" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="223" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="223" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="223" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="223" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:0.85"/>
  <rect x="223" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="223" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.85"/>
  <rect x="210" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="210" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.86"/>
  <rect x="210" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="210" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="210" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="210" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="210" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.89"/>
  <rect x="210" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="210" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="210" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.73"/>
  <rect x="210" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="210" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="210" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="210" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="210" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="210" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="210" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="210" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="210" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="210" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:0.87"/>
  <rect x="210" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:0.80"/>
  <rect x="210" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:0.84"/>
  <rect x="210" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="210" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:0.89"/>
  <rect x="210" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="210" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="197" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="197" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="197" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="197" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="197" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="197" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="197" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="197" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.89"/>
  <rect x="197" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="197" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.79"/>
  <rect x="197" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="197" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="197" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="197" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="197" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:0.81"/>
  <rect x="197" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="197" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="197" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:0.99"/>
  <rect x="197" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="197" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:0.82"/>
  <rect x="197" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:0.70"/>
  <rect x="197" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:0.86"/>
  <rect x="197" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:0.56"/>
  <rect x="197" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:0.76"/>
  <rect x="197" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="197" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="184" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.51"/>
  <rect x="184" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.84"/>
  <rect x="184" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="184" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="184" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="184" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:0.83"/>
  <rect x="184" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:0.79"/>
  <rect x="184" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="184" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.76"/>
  <rect x="184" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.92"/>
  <rect x="184" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:0.83"/>
  <rect x="184" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="184" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="184" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:0.78"/>
  <rect x="184" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:0.83"/>
  <rect x="184" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="184" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:0.91"/>
  <rect x="184" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="184" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="184" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:0.84"/>
  <rect x="184" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:0.41"/>
  <rect x="184" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:0.36"/>
  <rect x="184" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:0.13"/>
  <rect x="184" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:0.47"/>
  <rect x="184" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:0.73"/>
  <rect x="184" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="171" y="351" width="13" height="13" style="fill:var(--ink);fill-opacity:0.20"/>
  <rect x="171" y="338" width="13" height="13" style="fill:var(--ink);fill-opacity:0.19"/>
  <rect x="171" y="325" width="13" height="13" style="fill:var(--ink);fill-opacity:0.77"/>
  <rect x="171" y="312" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="171" y="299" width="13" height="13" style="fill:var(--ink);fill-opacity:0.88"/>
  <rect x="171" y="286" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="171" y="273" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="171" y="260" width="13" height="13" style="fill:var(--ink);fill-opacity:0.93"/>
  <rect x="171" y="247" width="13" height="13" style="fill:var(--ink);fill-opacity:0.76"/>
  <rect x="171" y="234" width="13" height="13" style="fill:var(--ink);fill-opacity:0.83"/>
  <rect x="171" y="221" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="171" y="208" width="13" height="13" style="fill:var(--ink);fill-opacity:0.97"/>
  <rect x="171" y="195" width="13" height="13" style="fill:var(--ink);fill-opacity:0.98"/>
  <rect x="171" y="182" width="13" height="13" style="fill:var(--ink);fill-opacity:0.95"/>
  <rect x="171" y="169" width="13" height="13" style="fill:var(--ink);fill-opacity:0.96"/>
  <rect x="171" y="156" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="171" y="143" width="13" height="13" style="fill:var(--ink);fill-opacity:1.00"/>
  <rect x="171" y="130" width="13" height="13" style="fill:var(--ink);fill-opacity:0.94"/>
  <rect x="171" y="117" width="13" height="13" style="fill:var(--ink);fill-opacity:0.90"/>
  <rect x="171" y="104" width="13" height="13" style="fill:var(--ink);fill-opacity:0.77"/>
  <rect x="171" y="91" width="13" height="13" style="fill:var(--ink);fill-opacity:0.20"/>
  <rect x="171" y="78" width="13" height="13" style="fill:var(--ink);fill-opacity:0.07"/>
  <rect x="171" y="65" width="13" height="13" style="fill:var(--ink);fill-opacity:0.08"/>
  <rect x="171" y="52" width="13" height="13" style="fill:var(--ink);fill-opacity:0.18"/>
  <rect x="171" y="39" width="13" height="13" style="fill:var(--ink);fill-opacity:0.46"/>
  <rect x="171" y="26" width="13" height="13" style="fill:var(--ink);fill-opacity:0.64"/>
  <rect x="171" y="26" width="338" height="338" class="f-plain"/>
  <circle cx="340" cy="195" r="13" style="fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:3 3"/>
  <text x="340" y="18" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Пн</text>
  <text x="163" y="199" text-anchor="end" class="f-mono f-muted" style="font-size:11px">У</text>
  <line x1="444" y1="378" x2="509" y2="378" style="stroke:var(--muted);stroke-width:1.5"/>
  <text x="476.5" y="392" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5′</text>
</svg>
<figcaption>Gaia DR3, усе крыніцы, 1 квадрат = 1 квадратная вуглавая хвіліна. Пункцірнае кола мае радыус 1′.</figcaption>
</figure>

Сапраўдны прагал паміж зоркамі выглядаў бы ў Gaia гэтак жа. Адрозніць адно ад другога дапамагае колер. Пыл паглынае сіняе святло значна мацней за інфрачырвонае, таму агляд у блізкім ІЧ павінен бачыць праз яго лепш. 2MASS здымае на даўжынях хваль ад 1,2 да 2,2 мікрона. У межах той жа паўхвіліны ў яго 7 зорак з 17 чаканых, гэта 41%. У межах 1 хвіліны 33 з 68.

Зоркі, якія 2MASS яшчэ бачыць, да таго ж чырвоныя. Медыяна колеру H−Ks у цэнтры 0,91 супраць 0,21 у полі вакол. Па законе паглынання Rieke і Lebofsky 1985 года гэта каля 11 зорных велічынь у паласе V. Зорка за воблакам у бачным святле прыкладна ў 25 000 разоў слабейшая. Самая чырвоная зорка дае каля 26 велічынь. І гэта толькі зоркі, якія прабіліся наскрозь, сярэдзіна воблака цямнейшая і 2MASS праз яе не бачыць. Alves з сааўтарамі падрабязна картаграфавалі гэта воблака ў 2001 годзе па значна глыбейшых інфрачырвоных здымках.

<figure class="fig">
<svg viewBox="0 0 680 276" role="img" aria-label="Шчыльнасць зорак вакол Barnard 68 у долях ад фону ў залежнасці ад адлегласці да цэнтра ў вуглавых хвілінах. Gaia DR3: 0–0.5′ 0%, 0.5–1′ 2%, 1–1.5′ 12%, 1.5–2′ 45%, 2–2.5′ 76%, 2.5–3′ 89%, 3–4′ 103%, 4–5′ 106%, 5–6′ 106%, 6–8′ 107%, 8–10′ 103%, 10–15′ 97%. 2MASS: 0–0.5′ 41%, 0.5–1′ 51%, 1–1.5′ 58%, 1.5–2′ 86%, 2–2.5′ 91%, 2.5–3′ 95%, 3–4′ 103%, 4–5′ 105%, 5–6′ 101%, 6–8′ 101%, 8–10′ 102%, 10–15′ 99%. У межах 0,5 вуглавой хвіліны ад цэнтра ў Gaia 0%, у 2MASS 41%. Абедзве выходзяць на фон прыкладна на 3 або 4 вуглавых хвілінах.">
  <line x1="70" y1="196.0" x2="650" y2="196.0" class="f-plain"/>
  <text x="64" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0%</text>
  <line x1="70" y1="158.5" x2="650" y2="158.5" class="f-plain"/>
  <text x="64" y="162.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25%</text>
  <line x1="70" y1="121.0" x2="650" y2="121.0" class="f-plain"/>
  <text x="64" y="125.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50%</text>
  <line x1="70" y1="83.5" x2="650" y2="83.5" class="f-plain"/>
  <text x="64" y="87.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75%</text>
  <line x1="70" y1="46.0" x2="650" y2="46.0" class="f-plain"/>
  <text x="64" y="50.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100%</text>
  <text x="70.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0′</text>
  <text x="108.7" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1′</text>
  <text x="147.3" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2′</text>
  <text x="186.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3′</text>
  <text x="224.7" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4′</text>
  <text x="263.3" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5′</text>
  <text x="302.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6′</text>
  <text x="379.3" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8′</text>
  <text x="456.7" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10′</text>
  <text x="650.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">15′</text>
  <text x="360" y="228" text-anchor="middle" class="f-label f-muted">адлегласць ад цэнтра, вуглавыя хвіліны</text>
  <path d="M79.7,196.0L99.0,193.4L118.3,177.3L137.7,129.0L157.0,82.4L176.3,62.0L205.3,41.4L244.0,37.0L282.7,36.8L340.7,35.6L418.0,40.9L553.3,49.8" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M79.7,134.4L99.0,119.7L118.3,109.7L137.7,66.5L157.0,60.0L176.3,53.5L205.3,41.6L244.0,38.5L282.7,44.5L340.7,44.6L418.0,42.5L553.3,47.3" class="f-line" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <circle cx="79.7" cy="196.0" r="2.5" class="f-accent"/>
  <circle cx="99.0" cy="193.4" r="2.5" class="f-accent"/>
  <circle cx="118.3" cy="177.3" r="2.5" class="f-accent"/>
  <circle cx="137.7" cy="129.0" r="2.5" class="f-accent"/>
  <circle cx="157.0" cy="82.4" r="2.5" class="f-accent"/>
  <circle cx="176.3" cy="62.0" r="2.5" class="f-accent"/>
  <circle cx="205.3" cy="41.4" r="2.5" class="f-accent"/>
  <circle cx="244.0" cy="37.0" r="2.5" class="f-accent"/>
  <circle cx="282.7" cy="36.8" r="2.5" class="f-accent"/>
  <circle cx="340.7" cy="35.6" r="2.5" class="f-accent"/>
  <circle cx="418.0" cy="40.9" r="2.5" class="f-accent"/>
  <circle cx="553.3" cy="49.8" r="2.5" class="f-accent"/>
  <circle cx="79.7" cy="134.4" r="2" class="f-ink"/>
  <circle cx="99.0" cy="119.7" r="2" class="f-ink"/>
  <circle cx="118.3" cy="109.7" r="2" class="f-ink"/>
  <circle cx="137.7" cy="66.5" r="2" class="f-ink"/>
  <circle cx="157.0" cy="60.0" r="2" class="f-ink"/>
  <circle cx="176.3" cy="53.5" r="2" class="f-ink"/>
  <circle cx="205.3" cy="41.6" r="2" class="f-ink"/>
  <circle cx="244.0" cy="38.5" r="2" class="f-ink"/>
  <circle cx="282.7" cy="44.5" r="2" class="f-ink"/>
  <circle cx="340.7" cy="44.6" r="2" class="f-ink"/>
  <circle cx="418.0" cy="42.5" r="2" class="f-ink"/>
  <circle cx="553.3" cy="47.3" r="2" class="f-ink"/>
  <text x="85.7" y="190.0" class="f-mono f-ink" style="font-size:11px">0%</text>
  <text x="87.7" y="148.4" class="f-mono f-ink" style="font-size:11px">41%</text>
  <line x1="70" y1="246" x2="92" y2="246" style="stroke:var(--accent);stroke-width:2"/>
  <text x="100" y="250" class="f-label f-muted">Gaia DR3, бачнае святло</text>
  <line x1="70" y1="264" x2="92" y2="264" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="100" y="268" class="f-label f-muted">2MASS, блізкі ІЧ</text>
</svg>
<figcaption>Фон лічыцца ў кольцы ад 6′ да 15′. Кропкі стаяць пасярэдзіне кожнага кольца.</figcaption>
</figure>

## Дзе яно

Я збіраўся ўзяць зоркі вакол Barnard 68 з добрымі паралаксамі і знайсці бліжэйшую пачырванелую. Не атрымалася. У межах 1,2 хвіліны ў Gaia 23 зоркі і ў 13 з іх ёсць паралакс. Мне патрэбныя зоркі перад воблакам, а ні пра адну з 13 нельга даказаць, што яна бліжэй за 1 кпк. Пры строгім адборы зорак пярэдняга плана ў межах 1,5 хвіліны варта чакаць усяго 0,18. Так што для такога маленькага воблака план быў няправільны з самага пачатку.

Тады я ад'ехаў далей. Barnard 68 гэта адно з маленькіх цёмных ядраў на краі значна большага воблака, туманнасці Люлька. Я палічыў усе зоркі Gaia ў прамавугольніку 9 на 8 градусаў вакол яе, гэта 47 мільёнаў зорак у 7200 клетках па 0,1 градуса. Клетка цёмная, калі ў ёй менш за 40% ад медыяны квадрата 2 на 2 градусы вакол яе. Светлая, калі больш за 90%. Атрымалася 5108 светлых клетак і 145 цёмных, самыя вялікія групы цёмных ляжаць на Barnard 59 і на шырокай частцы Люлькі. Потым я параўнаў цёмныя і светлыя клеткі па адлегласці. Для гэтага пакінуў зоркі з паралаксам больш за 1,5 mas і памылкай менш за 10%, гэта значыць бліжэй за прыкладна 670 пк.

Першы вынік быў бязглуздым. Бліжэй за 100 пк у светлых клетках выйшла 130 зорак на квадратны градус, а ў цёмных 9, у 14 разоў менш. Пыл не можа схаваць зорку, якая стаіць перад ім. Ды і 130 занадта шмат. На ўсім небе бліжэй за 100 пк каля 8 зорак на квадратны градус. Я нейкі час калупаўся ў адборы клетак, перш чым паглядзеў на самі зоркі. У прамавугольніку было 7526 "зорак бліжэй за 100 пк". 6678 з іх слабейшыя за G = 19 і ў 4513 дрэннае астраметрычнае рашэнне (RUWE больш за 1,4). У бок цэнтра Галактыкі зорак вельмі шмат, слабыя зоркі там атрымліваюць няправільныя паралаксы і ў шчыльных светлых клетках іх больш. Я выкінуў зоркі слабейшыя за 19 і з RUWE больш за 1,4. Адбор па якасці прапусціў я сам.

З адборам кожны бін адлегласці да 200 пк у цёмных клетках мае ад 0,77 да 1,09 шчыльнасці светлых. Зорак там у цёмных клетках усяго 61, так што гэта шумна. Далей за 200 пк ад 0,56 да 0,70. Па падліках пыл стаіць дзесьці бліжэй за 200 пк. Больш яны амаль нічога не кажуць.

## Прыступка

Gaia яшчэ і ацэньвае паглынанне A_G для большасці зорак ярчэйшых за G = 19. Канвеер `GSP-Phot` бярэ яго са спектра BP/RP нізкага разрознення разам з паралаксам. Абсалютным значэнням я не вельмі давяраю. Перад воблакам яны каля 0,5 велічыні. Для зорак на 100 пк гэта выглядае занадта шмат. Але змена відаць ясна. У цёмных клетках медыяна A_G ад 0,44 да 0,65 у кожным біне бліжэй за 160 пк, ад 4 да 9 зорак у біне. Далей за 160 пк яна ад 1,62 да 2,28. У светлых клетках яна расце павольна, прыкладна з 0,5 да 0,7 паміж 100 і 300 пк.

<figure class="fig">
<svg viewBox="0 0 680 318" role="img" aria-label="Паглынанне A_G з GSP-Phot Gaia DR3 у залежнасці ад адлегласці па паралаксе для 220 зорак у цёмных клетках туманнасці Люлька ад 80 да 400 пк, адна кропка на зорку. У большасці зорак бліжэй за 157 пк A_G менш за 1, у большасці далёкіх ад 1 да 3. Падабраная прыступка падымаецца з 0,52 да 1,95 на 157 пк, 95% інтэрвал бутстрэпу ляжыць ад 149 да 185 пк. Медыяна светлых клетак паказана пункцірам і павольна расце прыкладна з 0,4 на 80 пк да 0,8 на 400 пк.">
  <rect x="184.1" y="16" width="66.8" height="204" style="fill:var(--accent-wash)"/>
  <line x1="56" y1="220.0" x2="650" y2="220.0" class="f-plain"/>
  <text x="50" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="56" y1="186.0" x2="650" y2="186.0" class="f-plain"/>
  <text x="50" y="190.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="56" y1="152.0" x2="650" y2="152.0" class="f-plain"/>
  <text x="50" y="156.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="56" y1="118.0" x2="650" y2="118.0" class="f-plain"/>
  <text x="50" y="122.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3</text>
  <line x1="56" y1="84.0" x2="650" y2="84.0" class="f-plain"/>
  <text x="50" y="88.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="56" y1="50.0" x2="650" y2="50.0" class="f-plain"/>
  <text x="50" y="54.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">5</text>
  <line x1="56" y1="16.0" x2="650" y2="16.0" class="f-plain"/>
  <text x="50" y="20.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="56" y="12" class="f-label f-muted">A_G</text>
  <text x="93.1" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="185.9" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="278.8" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <text x="371.6" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">250</text>
  <text x="464.4" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <text x="557.2" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">350</text>
  <text x="650.0" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">400</text>
  <text x="353" y="252" text-anchor="middle" class="f-label f-muted">адлегласць, пк</text>
  <circle cx="603.2" cy="182.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="471.1" cy="187.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="309.9" cy="191.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="480.3" cy="197.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="621.0" cy="198.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="407.2" cy="198.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="601.2" cy="192.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="250.5" cy="200.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="646.5" cy="183.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="444.9" cy="200.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="529.3" cy="197.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="582.1" cy="191.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="503.7" cy="186.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="547.5" cy="190.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="571.9" cy="189.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="278.4" cy="200.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="445.1" cy="194.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="573.2" cy="195.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="640.9" cy="185.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="109.8" cy="202.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="311.0" cy="189.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="601.0" cy="192.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="593.9" cy="192.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="429.8" cy="119.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="382.9" cy="90.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="142.3" cy="202.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="314.8" cy="97.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="107.2" cy="200.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="146.2" cy="213.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="184.1" cy="199.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="547.0" cy="152.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="490.4" cy="115.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="559.2" cy="76.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="447.5" cy="42.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="383.4" cy="161.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="550.1" cy="94.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="509.7" cy="141.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="485.9" cy="151.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="148.1" cy="202.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="390.5" cy="126.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="543.3" cy="126.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="482.4" cy="116.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="343.7" cy="133.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="604.5" cy="151.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="558.5" cy="130.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="473.3" cy="149.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="145.1" cy="200.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="641.6" cy="75.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="170.0" cy="203.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="316.6" cy="74.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="499.5" cy="104.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="431.7" cy="165.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="331.3" cy="138.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="122.6" cy="203.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="601.4" cy="145.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="584.3" cy="140.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="204.1" cy="140.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="263.9" cy="160.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="457.0" cy="155.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="531.8" cy="133.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="402.4" cy="153.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="573.5" cy="114.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="452.9" cy="103.0" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="413.9" cy="167.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="499.3" cy="119.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="631.3" cy="150.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="411.3" cy="184.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="595.8" cy="145.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="250.0" cy="178.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="570.2" cy="129.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="399.0" cy="152.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="325.2" cy="150.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="352.1" cy="124.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="617.7" cy="162.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="406.1" cy="147.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="585.0" cy="150.0" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="608.0" cy="150.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="348.5" cy="157.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="405.0" cy="149.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="641.1" cy="148.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="399.8" cy="102.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="582.1" cy="111.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="357.6" cy="156.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="379.9" cy="141.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="429.3" cy="94.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="349.3" cy="146.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="446.2" cy="164.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="536.8" cy="112.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="599.7" cy="158.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="466.4" cy="162.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="505.4" cy="159.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="339.8" cy="151.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="387.7" cy="104.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="497.8" cy="141.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="408.1" cy="130.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="315.7" cy="141.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="479.4" cy="157.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="134.9" cy="203.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="233.8" cy="153.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="408.7" cy="175.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="201.9" cy="170.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="458.6" cy="146.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="568.3" cy="155.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="418.3" cy="156.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="575.6" cy="99.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="338.3" cy="138.0" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="201.5" cy="176.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="282.1" cy="142.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="192.6" cy="197.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="630.1" cy="123.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="336.7" cy="159.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="521.2" cy="163.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="198.7" cy="195.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="495.9" cy="174.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="123.9" cy="204.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="647.4" cy="121.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="284.3" cy="144.0" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="466.4" cy="154.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="635.0" cy="146.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="461.0" cy="153.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="134.1" cy="206.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="483.1" cy="153.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="605.5" cy="182.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="648.7" cy="137.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="484.1" cy="92.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="211.2" cy="147.0" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="366.6" cy="169.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="393.7" cy="167.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="636.3" cy="147.0" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="613.8" cy="148.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="477.9" cy="64.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="649.1" cy="163.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="438.4" cy="145.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="640.7" cy="154.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="509.1" cy="161.0" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="447.1" cy="31.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="356.3" cy="147.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="188.0" cy="198.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="205.1" cy="137.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="597.7" cy="130.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="552.2" cy="159.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="424.8" cy="177.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="624.6" cy="167.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="429.3" cy="169.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="234.2" cy="165.0" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="557.7" cy="88.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="458.6" cy="142.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="207.5" cy="169.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="377.1" cy="167.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="276.3" cy="148.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="496.9" cy="162.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="363.0" cy="101.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="263.2" cy="167.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="291.6" cy="169.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="562.0" cy="153.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="555.3" cy="156.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="604.0" cy="151.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="361.0" cy="197.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="507.6" cy="148.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="647.4" cy="150.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="457.3" cy="173.0" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="487.9" cy="189.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="591.9" cy="152.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="324.2" cy="173.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="111.7" cy="198.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="615.1" cy="159.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="588.0" cy="175.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="624.9" cy="117.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="263.7" cy="151.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="273.4" cy="160.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="559.2" cy="136.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="605.5" cy="159.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="596.0" cy="169.0" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="637.0" cy="153.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="321.1" cy="146.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="400.7" cy="158.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="536.6" cy="54.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="304.2" cy="137.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="530.5" cy="132.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="384.7" cy="193.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="479.0" cy="197.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="483.9" cy="210.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="632.7" cy="148.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="647.6" cy="151.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="301.4" cy="141.0" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="435.8" cy="200.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="326.8" cy="118.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="234.4" cy="170.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="429.5" cy="151.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="446.7" cy="195.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="358.9" cy="214.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="119.3" cy="201.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="638.7" cy="199.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="226.0" cy="218.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="398.3" cy="115.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="312.3" cy="198.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="258.9" cy="168.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="524.7" cy="189.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="336.3" cy="191.6" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="276.3" cy="201.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="511.2" cy="196.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="575.0" cy="123.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="564.1" cy="202.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="475.7" cy="191.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="252.4" cy="41.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="567.0" cy="154.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="257.6" cy="122.0" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="229.7" cy="164.5" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="508.4" cy="113.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="517.3" cy="145.4" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="596.0" cy="87.8" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="474.2" cy="201.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="400.9" cy="112.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="356.2" cy="142.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="177.4" cy="204.2" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="518.0" cy="191.3" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="558.5" cy="187.1" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="583.7" cy="183.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="72.5" cy="202.9" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="325.7" cy="195.7" r="2.3" class="f-accent" style="fill-opacity:0.55"/>
  <path d="M65.3,208.4L83.8,205.7L102.4,203.0L121.0,203.2L139.5,203.4L158.1,203.0L176.7,202.3L195.2,201.0L213.8,199.6L232.3,198.8L250.9,198.9L269.5,199.5L288.0,199.1L306.6,196.8L325.2,198.6L343.7,198.2L362.3,197.3L380.8,196.4L399.4,196.4L418.0,196.1L436.5,196.8L455.1,196.0L473.7,193.8L492.2,193.2L510.8,193.2L529.3,193.7L547.9,191.6L566.5,192.1L585.0,192.9L603.6,192.8L622.2,192.4L640.7,192.1" class="f-line" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <path d="M56,202.4H198.9V153.6H650" class="f-line" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="204.9" y="30.0" class="f-mono f-ink" style="font-size:11px">157 pc</text>
  <circle cx="67" cy="270" r="3" class="f-accent" style="fill-opacity:0.55"/>
  <text x="86" y="274" class="f-label f-muted">зорка ў цёмнай клетцы</text>
  <line x1="56" y1="288" x2="78" y2="288" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="86" y="292" class="f-label f-muted">падабраная прыступка</text>
  <line x1="56" y1="306" x2="78" y2="306" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="86" y="310" class="f-label f-muted">медыяна светлых клетак</text>
</svg>
<figcaption>Кропкі гэта зоркі цёмных клетак. Паласа паказвае 95% інтэрвал бутстрэпу для становішча прыступкі.</figcaption>
</figure>

Я падабраў адну прыступку па 220 зорках цёмных клетак паміж 80 і 400 пк. Яна прыпадае на 157 пк, паміж дзвюма зоркамі на 156,9 і 158,4 пк. A_G расце з 0,52 да 1,95. На 2000 выбарках бутстрэпу 95% прыступак ляжаць паміж 149 і 185 пк. На светлых клетках той жа падбор сапраўднай прыступкі не знаходзіць, лепшая падымаецца з 0,58 да 0,78 на 255 пк.

Lombardi з сааўтарамі ў 2006 годзе атрымалі для Люлькі каля 130 пк па паралаксах Hipparcos і Tycho, з вялікай хібнасцю. Alves і Franco ў 2007 годзе атрымалі 145 ± 16 пк. Dzib з сааўтарамі ў 2018 годзе вымералі адлегласць па маладых зорках унутры Barnard 59 па даных Gaia DR2 і атрымалі 163 ± 5 пк. Бліжэй за ўсё да майго спосабу праца Zucker з сааўтарамі 2020 года, паралаксы Gaia DR2 плюс фатаметрыя. У іх для той жа часткі Люлькі 180 пк. Значыць, мае 157 побач з Dzib і на 23 пк не дацягваюць да Zucker, хоць 180 усё яшчэ ўнутры майго інтэрвалу. Нічога новага тут няма. Зоркі на фоне цёмнага воблака лічыў яшчэ Max Wolf у 1923 годзе, а адлегласці вышэй гэта праца лепшая за маю. Але я не чакаў, што некалькіх запытаў да архіва і падгонкі адной прыступкі хопіць, каб трапіць у той жа дыяпазон.

## Чаго я не правяраў

Цёмныя клеткі выбраныя па падліках зорак той жа Gaia, а не па незалежнай карце пылу. Зоркі перад воблакам складаюць малую долю ўсіх, таму моцна зрушыць адбор не павінны. Але гэта дапушчэнне. A_G з `GSP-Phot` гэта мадэльная ацэнка са сваімі сістэматычнымі памылкамі і я выкарыстоўваю яе толькі як адносную меру. Бліжэй за 157 пк у цёмных клетках усяго 19 зорак з A_G, так што ўзровень "да" стаіць на вельмі малой колькасці кропак. Прыступку па асобных частках Люлькі я не падбіраў. Для Barnard 68 у мяне няма адлегласці ўвогуле, толькі доказ, што гэта пыл. А паглынанне ў яго цэнтры па 2MASS гэта ніжняя мяжа, бо ў самай цёмнай частцы зорак не відаць зусім.
