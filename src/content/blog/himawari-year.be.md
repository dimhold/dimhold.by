---
title: "Год світанкаў Himawari за 30 секунд. Адзін кадр называе дату з памылкай не больш за дзень у 335 выпадках з 358"
description: "Я ўзяў 365 кадраў світання Himawari-9, па адным у дзень у 21:00 UTC, і ўклаў год Зямлі ў 30 секунд. Мяжа дня і ночы гойдаецца з сезонамі і ссоўваецца ўслед за ўраўненнем часу, таму я паспрабаваў чытаць дату па адным кадры. З сапраўдным часам здымкі кожнага радка памылка была не больш за дзень для 335 кадраў з 358: кадр у 21:00 гэта разгортка даўжынёй 9 хвілін. Промахі стаяць там, дзе аналема перасякае сама сябе, у красавіку і жніўні, і ў чэрвені."
date: 2026-10-04
lang: be
translationKey: himawari-year
tags: ["open-data", "time"]
---
Мне хацелася вокладкі, якая тлумачыць сябе сама. Год Зямлі за 30 секунд, па адным здымку ў дзень з аднаго спадарожніка ў адну і тую ж хвіліну. Тады рухаецца толькі тое, што мяняецца. Himawari-9 вісіць над 140,7 градуса ўсходняй даўжыні, а NICT захоўвае яго поўныя дыскі маленькімі файламі PNG. Выглядала як праца на вечар. Самым цяжкім, думаў я, будзе спампаваць.

Поўдзень гэта відавочны час і заадно нудны: амаль увесь дыск асветлены кожны дзень і рухаюцца толькі аблокі. Я ўзяў 21:00 UTC. Пад спадарожнікам гэта прыкладна 06:23 па мясцовым сярэднім часе, таму мяжа дня і ночы праходзіць праз дыск. У [NASA Earth Observatory](https://science.nasa.gov/earth/earth-observatory/seeing-equinoxes-and-solstices-from-space-52248/) ёсць 4 здымкі Meteosat, зробленыя так жа, па адным на кожнае сонцастаянне і раўнадзенства. У снежні мяжа нахіленая ў адзін бок, у чэрвені ў другі. Мне хацелася ўсіх дзён паміж імі. Як сабраць з кадраў Himawari анімацыю, Чарлі Лойд [апісаў](https://gist.github.com/celoyd/b92d0de6fae1f18791ef) яшчэ ў 2015 годзе, так што сам ролік гэта старая ідэя.

## Год

Акно з 1 кастрычніка 2025 па 30 верасня 2026. Я запытаў у NICT 730 кадраў, 550 на 550 пікселяў, у натуральных колерах. 365 з іх на 21:00 UTC і 365 на 03:00 UTC для версіі ў поўдзень. Прыйшло 723. Усе 7 адсутных гэта кадры світання і сервер адказвае на іх 403. У копіі сырых даных Himawari у NOAA на 21:00 гэтых дат таксама пуста, значыць спадарожнік гэтыя кадры не запісаў. У роліку на такі дзень застаецца папярэдні кадр.

Пры 12 кадрах у секунду 365 кадраў гэта 30,4 секунды. Відэа сабраў ffmpeg 6.1.1, GIF сабраў gifsicle 1.94.

<figure class="fig">
<video controls muted loop playsinline preload="none" poster="/media/himawari-year/poster-21utc.jpg" src="/media/himawari-year/year-21utc.mp4" width="550" height="550" aria-label="Год поўных дыскаў Himawari-9 на світанні, па адным кадры ў дзень. Мяжа дня і ночы гойдаецца ўверх і ўніз з сезонамі і ссоўваецца ўбок." style="display:block;width:100%;max-width:550px;height:auto;margin:0 auto;background:#000"></video>
<figcaption>Па адным кадры ў дзень у 21:00 UTC, з 1 кастрычніка 2025 па 30 верасня 2026, 12 кадраў у секунду. У тыя 7 дзён, калі кадра няма, застаецца папярэдні.</figcaption>
</figure>

Калі я паглядзеў яго першы раз, мяжа гойдалася як маятнік і яшчэ ссоўвалася ўбок: увосень улева, узімку ўправа. Гойданне я чакаў. Зрух убок я спачатку растлумачыць не змог. Праз яго я задаў іншае пытанне. Калі мяжа за год ходзіць у 2 напрамках, можа, аднаго кадра хопіць, каб сказаць, які гэта дзень.

## Дата па адным кадры

Аналема гэта вядомая фатаграфія. Калі здымаць сонца з аднаго месца ў адзін і той жа час па гадзінніку ўвесь год, яно малюе ў небе васьмёрку. Уверх і ўніз гэта сезон. Убок гэта ўраўненне часу. Сонца абганяе гадзіннік на 16 хвілін у пачатку лістапада і адстае на 14 хвілін у сярэдзіне лютага. Да гэтага прагону я не чакаў убачыць яе на здымку метэаспадарожніка.

Метад просты. Python 3.12, numpy 2.5.3, scipy 1.18.1, Pillow 12.3.0, skyfield 1.55 з эфемерыдамі DE421. У кожным радку кадра я знаходжу самы заходні асветлены піксель. Асветлены значыць яркасць 3 з 255 ці больш пасля згладжвання 5 на 5. Радкі, дзе гэтая кропка ляжыць на краі дыска, адкідаюцца. Геастацыянарная праекцыя ператварае кожны піксель мяжы ў шырату і даўжыню. Потым для кожнай з 365 дат я лічу, дзе было сонца ў 21:00 UTC. З гэтага атрымліваецца, наколькі яно ніжэй за гарызонт у кожнай кропцы мяжы. Правільная дата тая, пры якой сонца для ўсіх кропак мяжы стаіць на адным і тым жа вугле пад гарызонтам. Гэты вугал я браў па другой палове кадраў. Цотныя дні чытаюцца са значэннем з няцотных і наадварот.

Першая версія чытала большасць дат з памылкай ад 2 да 4 дзён, то раней, то пазней. З памылкай не больш за дзень трапілі толькі 20 кадраў з 358.

## Кадр доўжыцца 9 хвілін

Спачатку я вырашыў, што ў праекцыі сталая памылка. Таму даў праграме падабраць 2 дадатковыя лікі: зрух па часе і яго змену з поўначы на поўдзень. Падгонка хацела, каб кадр пачынаўся раней за 21:00 і ўпіралася ў край любога дыяпазону, які я дазваляў. Спадарожнік не можа здымаць раней, чым пачынаецца яго расклад. Потым я ўбачыў, што зрух і вугал сонца на мяжы проста кампенсавалі адзін аднаго. Блізкай да сапраўднай разгорткі выйшла толькі гэтая змена.

Адказ ляжаў у сырых файлах. NOAA захоўвае зыходныя даныя Himawari, 10 сегментаў на поўны дыск. У загалоўку кожнага сегмента запісаны час пачатку і канца. Я спампоўваў толькі першыя 300 КБ кожнага. Паўночны край здымаецца ў 21:00:21, экватар прыкладна ў 21:05:05, паўднёвы край у 21:09:40, і так на ўсіх 3 датах, якія я праверыў, з дакладнасцю да секунды. Я лічыў "кадр у 21:00" адным момантам, а загалоўкі паказваюць разгортку даўжынёй 9 хвілін 19 секунд. За 5 хвілін сонца сыходзіць на 1,25 градуса на захад. На экватары малюнка гэта каля 7 пікселяў. Памылка яшчэ і расце з поўначы на поўдзень, так што мяжа атрымлівае няправільную форму. Гэтага хапае, каб пошук аддаў перавагу даце за 2 ці 3 дні ад сапраўднай.

З сапраўдным часам кожнага радка вынік такі. 241 кадр з 358 дае дакладную дату, у 335 памылка не больш за дзень, у 353 не больш за 3 дні. Без зруху ўбок, па адным нахіле мяжы, з памылкай не больш за дзень 191.

<figure class="fig">
<svg viewBox="0 0 640 268" role="img" aria-label="Тры палосы па 365 дзён, 358 з іх з кадрам, з кастрычніка 2025 па верасень 2026, колер па памылцы даты, прачытанай па адным кадры. Толькі нахіл: 191 з памылкай не больш за дзень. Нахіл і зрух, калі лічыць кадр адным момантам: 20. З сапраўдным часам здымкі кожнага радка: 335, промахі каля 14 красавіка, 30 жніўня і ў чэрвені.">
  <text x="20" y="22" class="f-label f-ink">толькі нахіл</text>
  <text x="20" y="35" class="f-label f-muted">191 з 358 з памылкай да дня</text>
  <rect x="20.00" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="21.64" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="23.29" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="24.93" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="26.58" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="28.22" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="29.86" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="31.51" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="33.15" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="34.79" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="36.44" y="42" width="1.69" height="26" class="f-plain"/>
  <rect x="38.08" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="39.73" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="41.37" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="43.01" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="44.66" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="46.30" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="47.95" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="49.59" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="51.23" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="52.88" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="54.52" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="56.16" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="57.81" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="59.45" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="61.10" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="62.74" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="64.38" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="66.03" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="67.67" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="69.32" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="70.96" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="72.60" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="74.25" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="75.89" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="77.53" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="79.18" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="80.82" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="82.47" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="84.11" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="85.75" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="87.40" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="89.04" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="90.68" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="92.33" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="93.97" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="95.62" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="97.26" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="98.90" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="100.55" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="102.19" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="103.84" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="105.48" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="107.12" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="108.77" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="110.41" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="112.05" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="113.70" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="115.34" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="116.99" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="118.63" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="120.27" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="121.92" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="123.56" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="125.21" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="126.85" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="128.49" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="130.14" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="131.78" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="133.42" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="135.07" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="136.71" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="138.36" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="140.00" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="141.64" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="143.29" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="144.93" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="146.58" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="148.22" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="149.86" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="151.51" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="153.15" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="154.79" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="156.44" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="158.08" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="159.73" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="161.37" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="163.01" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="164.66" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="166.30" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="167.95" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="169.59" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="171.23" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="172.88" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="174.52" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="176.16" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="177.81" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="179.45" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="181.10" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="182.74" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="184.38" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="186.03" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="187.67" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="189.32" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="190.96" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="192.60" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="194.25" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="195.89" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="197.53" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="199.18" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="200.82" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="202.47" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="204.11" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="205.75" y="42" width="1.69" height="26" class="f-plain"/>
  <rect x="207.40" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="209.04" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="210.68" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="212.33" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="213.97" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="215.62" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="217.26" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="218.90" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="220.55" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="222.19" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="223.84" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="225.48" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="227.12" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="228.77" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="230.41" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="232.05" y="42" width="1.69" height="26" class="f-plain"/>
  <rect x="233.70" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="235.34" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="236.99" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="238.63" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="240.27" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="241.92" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="243.56" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="245.21" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="246.85" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="248.49" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="250.14" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="251.78" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="253.42" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="255.07" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="256.71" y="42" width="1.69" height="26" class="f-plain"/>
  <rect x="258.36" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="260.00" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="261.64" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="263.29" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="264.93" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="266.58" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="268.22" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="269.86" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="271.51" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="273.15" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="274.79" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="276.44" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="278.08" y="42" width="1.69" height="26" class="f-plain"/>
  <rect x="279.73" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="281.37" y="42" width="1.69" height="26" class="f-plain"/>
  <rect x="283.01" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="284.66" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="286.30" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="287.95" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="289.59" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="291.23" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="292.88" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="294.52" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="296.16" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="297.81" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="299.45" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="301.10" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="302.74" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="304.38" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="306.03" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="307.67" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="309.32" y="42" width="1.69" height="26" class="f-plain"/>
  <rect x="310.96" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="312.60" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="314.25" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="315.89" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="317.53" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="319.18" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="320.82" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="322.47" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="324.11" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="325.75" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="327.40" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="329.04" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="330.68" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="332.33" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="333.97" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="335.62" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="337.26" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="338.90" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="340.55" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="342.19" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="343.84" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="345.48" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="347.12" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="348.77" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="350.41" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="352.05" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="353.70" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="355.34" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="356.99" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="358.63" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="360.27" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="361.92" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="363.56" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="365.21" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="366.85" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="368.49" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="370.14" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="371.78" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="373.42" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="375.07" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="376.71" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="378.36" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="380.00" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="381.64" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="383.29" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="384.93" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="386.58" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="388.22" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="389.86" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="391.51" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="393.15" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="394.79" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="396.44" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="398.08" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="399.73" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="401.37" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="403.01" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="404.66" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="406.30" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="407.95" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="409.59" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="411.23" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="412.88" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="414.52" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="416.16" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="417.81" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="419.45" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="421.10" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="422.74" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="424.38" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="426.03" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="427.67" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="429.32" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="430.96" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="432.60" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="434.25" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="435.89" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="437.53" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="439.18" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="440.82" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="442.47" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="444.11" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="445.75" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="447.40" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="449.04" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="450.68" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="452.33" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="453.97" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="455.62" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="457.26" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="458.90" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="460.55" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="462.19" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="463.84" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="465.48" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="467.12" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="468.77" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="470.41" y="42" width="1.69" height="26" class="f-muted"/>
  <rect x="472.05" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="473.70" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="475.34" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="476.99" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="478.63" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="480.27" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="481.92" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="483.56" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="485.21" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="486.85" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="488.49" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="490.14" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="491.78" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="493.42" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="495.07" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="496.71" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="498.36" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="500.00" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="501.64" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="503.29" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="504.93" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="506.58" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="508.22" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="509.86" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="511.51" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="513.15" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="514.79" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="516.44" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="518.08" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="519.73" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="521.37" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="523.01" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="524.66" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="526.30" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="527.95" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="529.59" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="531.23" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="532.88" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="534.52" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="536.16" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="537.81" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="539.45" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="541.10" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="542.74" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="544.38" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="546.03" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="547.67" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="549.32" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="550.96" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="552.60" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="554.25" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="555.89" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="557.53" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="559.18" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="560.82" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="562.47" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="564.11" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="565.75" y="42" width="1.69" height="26" class="f-accent"/>
  <rect x="567.40" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="569.04" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="570.68" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="572.33" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="573.97" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="575.62" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="577.26" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="578.90" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="580.55" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="582.19" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="583.84" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="585.48" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="587.12" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="588.77" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="590.41" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="592.05" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="593.70" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="595.34" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="596.99" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="598.63" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="600.27" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="601.92" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="603.56" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="605.21" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="606.85" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="608.49" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="610.14" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="611.78" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="613.42" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="615.07" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="616.71" y="42" width="1.69" height="26" class="f-ink"/>
  <rect x="618.36" y="42" width="1.69" height="26" class="f-accent"/>
  <text x="20" y="94" class="f-label f-ink">нахіл і зрух, кадр як адзін момант</text>
  <text x="20" y="107" class="f-label f-muted">20 з 358 з памылкай да дня</text>
  <rect x="20.00" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="21.64" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="23.29" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="24.93" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="26.58" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="28.22" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="29.86" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="31.51" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="33.15" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="34.79" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="36.44" y="114" width="1.69" height="26" class="f-plain"/>
  <rect x="38.08" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="39.73" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="41.37" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="43.01" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="44.66" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="46.30" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="47.95" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="49.59" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="51.23" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="52.88" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="54.52" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="56.16" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="57.81" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="59.45" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="61.10" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="62.74" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="64.38" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="66.03" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="67.67" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="69.32" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="70.96" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="72.60" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="74.25" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="75.89" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="77.53" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="79.18" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="80.82" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="82.47" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="84.11" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="85.75" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="87.40" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="89.04" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="90.68" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="92.33" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="93.97" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="95.62" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="97.26" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="98.90" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="100.55" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="102.19" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="103.84" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="105.48" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="107.12" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="108.77" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="110.41" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="112.05" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="113.70" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="115.34" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="116.99" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="118.63" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="120.27" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="121.92" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="123.56" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="125.21" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="126.85" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="128.49" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="130.14" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="131.78" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="133.42" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="135.07" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="136.71" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="138.36" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="140.00" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="141.64" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="143.29" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="144.93" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="146.58" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="148.22" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="149.86" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="151.51" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="153.15" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="154.79" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="156.44" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="158.08" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="159.73" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="161.37" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="163.01" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="164.66" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="166.30" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="167.95" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="169.59" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="171.23" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="172.88" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="174.52" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="176.16" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="177.81" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="179.45" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="181.10" y="114" width="1.69" height="26" class="f-accent"/>
  <rect x="182.74" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="184.38" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="186.03" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="187.67" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="189.32" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="190.96" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="192.60" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="194.25" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="195.89" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="197.53" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="199.18" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="200.82" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="202.47" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="204.11" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="205.75" y="114" width="1.69" height="26" class="f-plain"/>
  <rect x="207.40" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="209.04" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="210.68" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="212.33" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="213.97" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="215.62" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="217.26" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="218.90" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="220.55" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="222.19" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="223.84" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="225.48" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="227.12" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="228.77" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="230.41" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="232.05" y="114" width="1.69" height="26" class="f-plain"/>
  <rect x="233.70" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="235.34" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="236.99" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="238.63" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="240.27" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="241.92" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="243.56" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="245.21" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="246.85" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="248.49" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="250.14" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="251.78" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="253.42" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="255.07" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="256.71" y="114" width="1.69" height="26" class="f-plain"/>
  <rect x="258.36" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="260.00" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="261.64" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="263.29" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="264.93" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="266.58" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="268.22" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="269.86" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="271.51" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="273.15" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="274.79" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="276.44" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="278.08" y="114" width="1.69" height="26" class="f-plain"/>
  <rect x="279.73" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="281.37" y="114" width="1.69" height="26" class="f-plain"/>
  <rect x="283.01" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="284.66" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="286.30" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="287.95" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="289.59" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="291.23" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="292.88" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="294.52" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="296.16" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="297.81" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="299.45" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="301.10" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="302.74" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="304.38" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="306.03" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="307.67" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="309.32" y="114" width="1.69" height="26" class="f-plain"/>
  <rect x="310.96" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="312.60" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="314.25" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="315.89" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="317.53" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="319.18" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="320.82" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="322.47" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="324.11" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="325.75" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="327.40" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="329.04" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="330.68" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="332.33" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="333.97" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="335.62" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="337.26" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="338.90" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="340.55" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="342.19" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="343.84" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="345.48" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="347.12" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="348.77" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="350.41" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="352.05" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="353.70" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="355.34" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="356.99" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="358.63" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="360.27" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="361.92" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="363.56" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="365.21" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="366.85" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="368.49" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="370.14" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="371.78" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="373.42" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="375.07" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="376.71" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="378.36" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="380.00" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="381.64" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="383.29" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="384.93" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="386.58" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="388.22" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="389.86" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="391.51" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="393.15" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="394.79" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="396.44" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="398.08" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="399.73" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="401.37" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="403.01" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="404.66" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="406.30" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="407.95" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="409.59" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="411.23" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="412.88" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="414.52" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="416.16" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="417.81" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="419.45" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="421.10" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="422.74" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="424.38" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="426.03" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="427.67" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="429.32" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="430.96" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="432.60" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="434.25" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="435.89" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="437.53" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="439.18" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="440.82" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="442.47" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="444.11" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="445.75" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="447.40" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="449.04" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="450.68" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="452.33" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="453.97" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="455.62" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="457.26" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="458.90" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="460.55" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="462.19" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="463.84" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="465.48" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="467.12" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="468.77" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="470.41" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="472.05" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="473.70" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="475.34" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="476.99" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="478.63" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="480.27" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="481.92" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="483.56" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="485.21" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="486.85" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="488.49" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="490.14" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="491.78" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="493.42" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="495.07" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="496.71" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="498.36" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="500.00" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="501.64" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="503.29" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="504.93" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="506.58" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="508.22" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="509.86" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="511.51" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="513.15" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="514.79" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="516.44" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="518.08" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="519.73" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="521.37" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="523.01" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="524.66" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="526.30" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="527.95" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="529.59" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="531.23" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="532.88" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="534.52" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="536.16" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="537.81" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="539.45" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="541.10" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="542.74" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="544.38" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="546.03" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="547.67" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="549.32" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="550.96" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="552.60" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="554.25" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="555.89" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="557.53" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="559.18" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="560.82" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="562.47" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="564.11" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="565.75" y="114" width="1.69" height="26" class="f-ink"/>
  <rect x="567.40" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="569.04" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="570.68" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="572.33" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="573.97" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="575.62" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="577.26" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="578.90" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="580.55" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="582.19" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="583.84" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="585.48" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="587.12" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="588.77" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="590.41" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="592.05" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="593.70" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="595.34" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="596.99" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="598.63" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="600.27" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="601.92" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="603.56" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="605.21" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="606.85" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="608.49" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="610.14" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="611.78" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="613.42" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="615.07" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="616.71" y="114" width="1.69" height="26" class="f-muted"/>
  <rect x="618.36" y="114" width="1.69" height="26" class="f-muted"/>
  <text x="20" y="166" class="f-label f-ink">нахіл і зрух, сапраўдны час кожнага радка</text>
  <text x="20" y="179" class="f-label f-muted">335 з 358 з памылкай да дня</text>
  <rect x="20.00" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="21.64" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="23.29" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="24.93" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="26.58" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="28.22" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="29.86" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="31.51" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="33.15" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="34.79" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="36.44" y="186" width="1.69" height="26" class="f-plain"/>
  <rect x="38.08" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="39.73" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="41.37" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="43.01" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="44.66" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="46.30" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="47.95" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="49.59" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="51.23" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="52.88" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="54.52" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="56.16" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="57.81" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="59.45" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="61.10" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="62.74" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="64.38" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="66.03" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="67.67" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="69.32" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="70.96" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="72.60" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="74.25" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="75.89" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="77.53" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="79.18" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="80.82" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="82.47" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="84.11" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="85.75" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="87.40" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="89.04" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="90.68" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="92.33" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="93.97" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="95.62" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="97.26" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="98.90" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="100.55" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="102.19" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="103.84" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="105.48" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="107.12" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="108.77" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="110.41" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="112.05" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="113.70" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="115.34" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="116.99" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="118.63" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="120.27" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="121.92" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="123.56" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="125.21" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="126.85" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="128.49" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="130.14" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="131.78" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="133.42" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="135.07" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="136.71" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="138.36" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="140.00" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="141.64" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="143.29" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="144.93" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="146.58" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="148.22" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="149.86" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="151.51" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="153.15" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="154.79" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="156.44" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="158.08" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="159.73" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="161.37" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="163.01" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="164.66" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="166.30" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="167.95" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="169.59" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="171.23" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="172.88" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="174.52" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="176.16" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="177.81" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="179.45" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="181.10" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="182.74" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="184.38" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="186.03" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="187.67" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="189.32" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="190.96" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="192.60" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="194.25" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="195.89" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="197.53" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="199.18" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="200.82" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="202.47" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="204.11" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="205.75" y="186" width="1.69" height="26" class="f-plain"/>
  <rect x="207.40" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="209.04" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="210.68" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="212.33" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="213.97" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="215.62" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="217.26" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="218.90" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="220.55" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="222.19" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="223.84" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="225.48" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="227.12" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="228.77" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="230.41" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="232.05" y="186" width="1.69" height="26" class="f-plain"/>
  <rect x="233.70" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="235.34" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="236.99" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="238.63" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="240.27" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="241.92" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="243.56" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="245.21" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="246.85" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="248.49" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="250.14" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="251.78" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="253.42" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="255.07" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="256.71" y="186" width="1.69" height="26" class="f-plain"/>
  <rect x="258.36" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="260.00" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="261.64" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="263.29" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="264.93" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="266.58" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="268.22" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="269.86" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="271.51" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="273.15" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="274.79" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="276.44" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="278.08" y="186" width="1.69" height="26" class="f-plain"/>
  <rect x="279.73" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="281.37" y="186" width="1.69" height="26" class="f-plain"/>
  <rect x="283.01" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="284.66" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="286.30" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="287.95" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="289.59" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="291.23" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="292.88" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="294.52" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="296.16" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="297.81" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="299.45" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="301.10" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="302.74" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="304.38" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="306.03" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="307.67" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="309.32" y="186" width="1.69" height="26" class="f-plain"/>
  <rect x="310.96" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="312.60" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="314.25" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="315.89" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="317.53" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="319.18" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="320.82" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="322.47" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="324.11" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="325.75" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="327.40" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="329.04" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="330.68" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="332.33" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="333.97" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="335.62" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="337.26" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="338.90" y="186" width="1.69" height="26" class="f-ink"/>
  <rect x="340.55" y="186" width="1.69" height="26" class="f-ink"/>
  <rect x="342.19" y="186" width="1.69" height="26" class="f-ink"/>
  <rect x="343.84" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="345.48" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="347.12" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="348.77" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="350.41" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="352.05" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="353.70" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="355.34" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="356.99" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="358.63" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="360.27" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="361.92" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="363.56" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="365.21" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="366.85" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="368.49" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="370.14" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="371.78" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="373.42" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="375.07" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="376.71" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="378.36" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="380.00" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="381.64" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="383.29" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="384.93" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="386.58" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="388.22" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="389.86" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="391.51" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="393.15" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="394.79" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="396.44" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="398.08" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="399.73" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="401.37" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="403.01" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="404.66" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="406.30" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="407.95" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="409.59" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="411.23" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="412.88" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="414.52" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="416.16" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="417.81" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="419.45" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="421.10" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="422.74" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="424.38" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="426.03" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="427.67" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="429.32" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="430.96" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="432.60" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="434.25" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="435.89" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="437.53" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="439.18" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="440.82" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="442.47" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="444.11" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="445.75" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="447.40" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="449.04" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="450.68" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="452.33" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="453.97" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="455.62" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="457.26" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="458.90" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="460.55" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="462.19" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="463.84" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="465.48" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="467.12" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="468.77" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="470.41" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="472.05" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="473.70" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="475.34" y="186" width="1.69" height="26" class="f-muted"/>
  <rect x="476.99" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="478.63" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="480.27" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="481.92" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="483.56" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="485.21" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="486.85" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="488.49" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="490.14" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="491.78" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="493.42" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="495.07" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="496.71" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="498.36" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="500.00" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="501.64" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="503.29" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="504.93" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="506.58" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="508.22" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="509.86" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="511.51" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="513.15" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="514.79" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="516.44" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="518.08" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="519.73" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="521.37" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="523.01" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="524.66" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="526.30" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="527.95" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="529.59" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="531.23" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="532.88" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="534.52" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="536.16" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="537.81" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="539.45" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="541.10" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="542.74" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="544.38" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="546.03" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="547.67" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="549.32" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="550.96" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="552.60" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="554.25" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="555.89" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="557.53" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="559.18" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="560.82" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="562.47" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="564.11" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="565.75" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="567.40" y="186" width="1.69" height="26" class="f-ink"/>
  <rect x="569.04" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="570.68" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="572.33" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="573.97" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="575.62" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="577.26" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="578.90" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="580.55" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="582.19" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="583.84" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="585.48" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="587.12" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="588.77" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="590.41" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="592.05" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="593.70" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="595.34" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="596.99" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="598.63" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="600.27" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="601.92" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="603.56" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="605.21" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="606.85" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="608.49" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="610.14" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="611.78" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="613.42" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="615.07" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="616.71" y="186" width="1.69" height="26" class="f-accent"/>
  <rect x="618.36" y="186" width="1.69" height="26" class="f-accent"/>
  <line x1="20.0" y1="216" x2="20.0" y2="222" class="f-line"/>
  <text x="22.0" y="234" class="f-label f-muted">кас</text>
  <line x1="71.0" y1="216" x2="71.0" y2="222" class="f-line"/>
  <text x="73.0" y="234" class="f-label f-muted">ліс</text>
  <line x1="120.3" y1="216" x2="120.3" y2="222" class="f-line"/>
  <text x="122.3" y="234" class="f-label f-muted">сне</text>
  <line x1="171.2" y1="216" x2="171.2" y2="222" class="f-line"/>
  <text x="173.2" y="234" class="f-label f-muted">сту</text>
  <line x1="222.2" y1="216" x2="222.2" y2="222" class="f-line"/>
  <text x="224.2" y="234" class="f-label f-muted">лют</text>
  <line x1="268.2" y1="216" x2="268.2" y2="222" class="f-line"/>
  <text x="270.2" y="234" class="f-label f-muted">сак</text>
  <line x1="319.2" y1="216" x2="319.2" y2="222" class="f-line"/>
  <text x="321.2" y="234" class="f-label f-muted">кра</text>
  <line x1="368.5" y1="216" x2="368.5" y2="222" class="f-line"/>
  <text x="370.5" y="234" class="f-label f-muted">мая</text>
  <line x1="419.5" y1="216" x2="419.5" y2="222" class="f-line"/>
  <text x="421.5" y="234" class="f-label f-muted">чэр</text>
  <line x1="468.8" y1="216" x2="468.8" y2="222" class="f-line"/>
  <text x="470.8" y="234" class="f-label f-muted">ліп</text>
  <line x1="519.7" y1="216" x2="519.7" y2="222" class="f-line"/>
  <text x="521.7" y="234" class="f-label f-muted">жні</text>
  <line x1="570.7" y1="216" x2="570.7" y2="222" class="f-line"/>
  <text x="572.7" y="234" class="f-label f-muted">вер</text>
  <rect x="20" y="249" width="10" height="10" class="f-accent"/>
  <text x="36" y="258" class="f-label f-muted">памылка да дня</text>
  <rect x="152.39999999999998" y="249" width="10" height="10" class="f-muted"/>
  <text x="168.39999999999998" y="258" class="f-label f-muted">2-4 дні</text>
  <rect x="238.59999999999997" y="249" width="10" height="10" class="f-ink"/>
  <text x="254.59999999999997" y="258" class="f-label f-muted">больш за 4</text>
  <rect x="344.59999999999997" y="249" width="10" height="10" class="f-plain"/>
  <text x="360.59999999999997" y="258" class="f-label f-muted">кадра няма</text>
</svg>
<figcaption>Адны і тыя ж 358 кадраў, прачытаныя 3 спосабамі. Без часу разгорткі большасць дзён чытаецца з памылкай ад 2 да 4 дзён. З ім промахі стаяць там, дзе іх прадказвае астраномія: на скрыжаванні васьмёркі і ў чэрвені, калі і нахіл і зрух мяняюцца павольна.</figcaption>
</figure>

## Дзе не атрымліваецца

Промахі не выпадковыя і гэта мне падабаецца больш за трапленні. 4 кадры памыляюцца на месяцы: 13, 14 і 15 красавіка прачытаныя як 27 ці 28 жніўня, а 30 жніўня як 12 красавіка. Гэта кропка, дзе васьмёрка перасякае сама сябе. 14 красавіка і 28 жніўня сонца стаіць над 9,6 і 9,5 градуса паўночнай шыраты. Па гадзінніку гэтыя 2 даты разыходзяцца менш чым на хвіліну, так што ў кадры розніцы няма.

Другое слабое месца гэта чэрвень. У снежні з памылкай не больш за дзень 30 кадраў з 31, у чэрвені толькі 16 з 30 і найгоршы промах 4 дні. На абодвух сонцастаяннях нахіл перастае мяняцца. Каля снежаньскага сонцастаяння ўраўненне часу яшчэ мяняецца прыкладна на 30 секунд за дзень і гэта ратуе чытанне, у чэрвені прыкладна на 13.

Калі я пабудаваў вымераны нахіл у залежнасці ад вымеранага зруху для кожнага кадра, без аніякага астранамічнага календара, васьмёрка намалявалася сама. Нахіл ідзе за схіленнем сонца з карэляцыяй 0,9995. Зрух ідзе за ўраўненнем часу амаль гэтак жа шчыльна, 0,998. На хвіліну ўраўнення часу прыпадае каля 1,31 пікселя зруху.

<figure class="fig">
<svg viewBox="0 0 640 428" role="img" aria-label="Кропкавая дыяграма 358 кадраў світання з кастрычніка 2025 па верасень 2026. Па гарызанталі месца, дзе мяжа дня і ночы перасякае экватар, ад 209 да 251 пікселя. Па вертыкалі нахіл мяжы, ад мінус 25 да плюс 22 градусаў. Кропкі малююць васьмёрку. Яе петлі сыходзяцца каля 14 красавіка і 28 жніўня, там жа стаяць 4 кадры, прачытаныя з памылкай на месяцы.">
  <text x="12" y="16" class="f-label f-muted">нахіл мяжы, градусы</text>
  <line x1="60" y1="314.2" x2="600" y2="314.2" class="f-plain"/>
  <text x="52" y="318.2" text-anchor="end" class="f-label f-muted">-20</text>
  <line x1="60" y1="251.9" x2="600" y2="251.9" class="f-plain"/>
  <text x="52" y="255.9" text-anchor="end" class="f-label f-muted">-10</text>
  <line x1="60" y1="189.7" x2="600" y2="189.7" class="f-plain"/>
  <text x="52" y="193.7" text-anchor="end" class="f-label f-muted">0</text>
  <line x1="60" y1="127.4" x2="600" y2="127.4" class="f-plain"/>
  <text x="52" y="131.4" text-anchor="end" class="f-label f-muted">10</text>
  <line x1="60" y1="65.1" x2="600" y2="65.1" class="f-plain"/>
  <text x="52" y="69.1" text-anchor="end" class="f-label f-muted">20</text>
  <line x1="114.0" y1="34" x2="114.0" y2="364" class="f-plain"/>
  <text x="114.0" y="380" text-anchor="middle" class="f-label f-muted">210</text>
  <line x1="222.0" y1="34" x2="222.0" y2="364" class="f-plain"/>
  <text x="222.0" y="380" text-anchor="middle" class="f-label f-muted">220</text>
  <line x1="330.0" y1="34" x2="330.0" y2="364" class="f-plain"/>
  <text x="330.0" y="380" text-anchor="middle" class="f-label f-muted">230</text>
  <line x1="438.0" y1="34" x2="438.0" y2="364" class="f-plain"/>
  <text x="438.0" y="380" text-anchor="middle" class="f-label f-muted">240</text>
  <line x1="546.0" y1="34" x2="546.0" y2="364" class="f-plain"/>
  <text x="546.0" y="380" text-anchor="middle" class="f-label f-muted">250</text>
  <text x="330" y="398" text-anchor="middle" class="f-label f-muted">дзе мяжа перасякае экватар, у пікселях ад левага краю</text>
  <path d="M204.2 224.4 L194.2 229.3 L177.3 225.8 L172.8 225.8 L174.8 230.4 L171.3 237.2 L156.2 236.8 L150.7 237.2 L144.6 236.5 L156.9 243.8 M148.5 245.2 L143.4 251.6 L143.5 250.9 L142.5 256.6 L137.5 256.7 L131.8 257.6 L143.3 263.6 L130.9 267.1 L124.0 266.9 L122.7 268.1 L129.6 274.4 L126.9 275.4 L118.4 276.6 L112.5 275.3 L118.9 278.5 L100.2 275.8 L104.8 277.6 L117.5 281.2 L111.2 284.1 L117.4 288.9 L112.0 291.0 L106.2 288.1 L114.2 288.2 L127.0 294.3 L113.6 298.1 L107.8 304.4 L103.1 292.5 L112.3 302.7 L107.1 300.2 L118.6 307.6 L115.0 309.1 L116.9 305.9 L111.7 311.9 L113.0 314.5 L121.8 311.2 L128.0 313.4 L138.1 312.2 L136.7 314.1 L148.2 316.3 L153.2 317.3 L151.0 317.6 L154.1 320.0 L156.3 316.3 L168.4 316.5 L166.8 320.8 L176.6 324.5 L161.0 328.1 L169.5 328.7 L181.8 325.8 L192.4 336.0 L189.5 331.6 L184.6 330.4 L194.6 336.4 L190.6 335.3 L207.9 334.3 L197.9 339.2 L228.4 338.3 L234.1 338.8 L231.9 337.4 L248.9 333.4 L263.4 338.2 L248.7 336.6 L260.3 341.8 L280.6 340.5 L278.8 339.5 L286.0 340.1 L282.8 342.8 L297.0 346.3 L304.9 343.9 L306.7 342.7 L314.9 342.3 L318.5 347.3 L320.8 341.3 L326.1 346.9 L339.0 345.3 L356.1 341.5 L352.8 339.3 L372.2 339.8 L372.0 340.6 L378.4 342.1 L395.0 342.7 L407.2 345.7 L406.1 341.4 L414.1 343.0 L418.8 340.7 L413.0 336.0 L439.6 340.9 L438.7 341.4 L437.6 344.6 L449.1 345.9 L455.0 346.0 L454.6 335.6 L464.0 329.6 L471.0 326.7 L471.9 326.5 L482.7 333.1 L482.7 335.3 L485.4 334.2 L496.5 326.5 L500.7 327.0 L497.3 328.3 L511.5 330.1 M518.2 318.4 L516.3 318.7 L516.5 317.5 L518.7 307.1 L516.2 310.9 L515.3 310.4 L522.7 308.1 L533.7 311.8 L526.1 308.0 L528.7 305.0 L524.1 299.3 L527.7 297.8 L532.7 299.1 L537.3 292.4 L535.5 296.1 M539.6 292.4 L541.4 284.3 L546.1 286.9 L557.0 280.8 L549.7 276.8 L547.6 276.3 L543.3 279.5 L546.3 276.9 L548.9 274.0 L542.5 270.4 L540.2 264.7 L545.4 263.4 L543.0 263.8 L541.0 262.2 M533.5 258.5 L532.8 252.0 L530.0 249.8 L530.0 253.5 L526.2 257.1 L517.6 248.5 L528.5 243.7 L517.5 246.5 L516.5 243.5 L503.9 240.3 L498.2 241.1 L507.7 235.4 M501.2 223.5 M474.8 219.8 L492.5 222.2 L464.6 220.4 L457.9 218.0 L460.9 210.5 L458.7 206.9 L457.4 209.8 L459.0 204.9 L455.2 204.0 L451.3 199.0 L445.7 201.3 L434.5 199.5 L442.9 188.6 L432.0 193.1 L428.9 188.9 L418.3 187.7 M421.3 180.9 L414.1 178.0 L410.4 174.4 L401.3 170.2 L404.5 170.7 L404.4 165.3 L389.8 163.8 L385.4 163.7 L389.5 161.1 L381.6 160.4 L374.7 159.0 L374.1 157.0 L373.8 148.6 L362.6 148.3 L366.0 148.5 L361.9 148.3 L352.6 142.2 L351.1 140.5 L352.4 144.1 L351.4 140.8 L344.6 140.5 L337.1 130.3 L328.9 133.0 L324.8 126.3 L324.8 124.0 L315.7 122.7 L324.7 119.6 L312.2 119.4 L318.9 116.0 L307.1 115.4 L308.7 113.4 L309.3 110.0 L314.1 114.5 L307.8 107.2 L300.9 105.5 L302.0 106.6 L300.4 97.9 L294.6 99.9 L297.9 97.7 L290.9 97.7 L291.0 92.6 L286.6 93.1 L293.7 89.6 L295.0 91.9 L295.7 94.2 L291.9 92.0 L294.8 88.3 L289.6 86.0 L290.9 85.3 L284.7 82.9 L289.6 80.4 L281.9 78.9 L287.0 80.2 L293.6 76.7 L289.3 73.2 L288.2 74.1 L284.2 72.0 L301.1 67.9 L301.9 69.0 L290.7 66.4 L306.7 64.9 L301.6 65.5 L308.4 61.8 L295.7 63.1 L303.1 64.1 L307.8 65.8 L302.9 60.0 L303.1 58.4 L301.7 58.2 L303.4 53.2 L301.6 54.7 L313.9 57.2 L318.1 55.9 L328.4 61.4 L334.5 61.7 L329.4 56.6 L333.5 57.4 L332.0 55.1 L334.9 56.5 L335.8 56.1 L336.3 59.4 L343.4 55.3 L346.3 55.9 L356.0 57.0 L358.0 57.9 L366.4 59.9 L358.8 52.1 L356.7 53.4 L360.4 53.4 L366.7 55.6 L374.7 53.5 L373.6 54.0 L373.4 55.3 L377.0 53.8 L380.5 52.6 L383.3 54.0 L390.9 56.1 L389.6 57.5 L391.3 56.1 L398.0 57.5 L410.8 57.4 L409.4 63.8 L406.5 64.0 L397.9 57.7 L406.4 59.6 L407.2 64.1 L421.3 64.8 L411.2 63.9 L422.0 63.0 L418.6 68.4 L412.0 66.6 L420.9 68.1 L427.4 69.4 L425.0 69.9 L430.0 72.2 L422.7 71.4 L429.6 72.2 L417.9 69.9 L417.2 71.0 L432.7 81.7 L432.5 78.9 L428.9 79.9 L423.6 80.0 L430.0 82.9 L431.5 83.7 L423.8 87.1 L424.0 82.0 L424.6 89.8 L427.1 91.3 L430.2 91.2 L427.0 96.2 L430.5 98.2 L428.2 92.7 L423.0 102.8 L420.2 103.0 L421.2 107.1 L420.7 107.3 L409.7 106.5 L413.3 107.7 L407.7 111.6 L405.2 113.3 L398.7 109.9 L391.2 109.7 L389.5 116.2 L389.0 116.7 L388.4 120.9 L381.9 120.3 L378.0 123.2 L375.9 124.3 L378.9 131.8 L368.6 135.5 L359.2 129.6 L360.4 132.3 L357.1 135.5 L346.9 137.8 L340.3 143.2 L345.8 144.3 L339.2 146.6 L333.7 148.6 L325.8 148.0 L326.5 151.2 L322.6 156.6 L310.4 157.0 L312.0 161.3 L303.6 158.9 L306.8 161.7 L296.1 166.1 L293.1 168.4 L289.3 169.7 L287.5 177.0 L279.0 177.9 L273.1 184.4 L264.3 180.9 L264.0 184.3 L257.7 181.2 L257.5 184.2 L254.9 192.0 L246.4 195.1 L239.7 194.7 L232.9 197.5 L227.2 204.0 L219.8 206.3 L212.7 204.7 L212.9 207.7 L201.1 210.9 L199.8 215.4 L190.7 214.4 L188.7 222.2" class="f-line"/>
  <circle cx="204.2" cy="224.4" r="1.6" class="f-muted"/>
  <circle cx="194.2" cy="229.3" r="1.6" class="f-muted"/>
  <circle cx="177.3" cy="225.8" r="1.6" class="f-muted"/>
  <circle cx="172.8" cy="225.8" r="1.6" class="f-muted"/>
  <circle cx="174.8" cy="230.4" r="1.6" class="f-muted"/>
  <circle cx="171.3" cy="237.2" r="1.6" class="f-muted"/>
  <circle cx="156.2" cy="236.8" r="1.6" class="f-muted"/>
  <circle cx="150.7" cy="237.2" r="1.6" class="f-muted"/>
  <circle cx="144.6" cy="236.5" r="1.6" class="f-muted"/>
  <circle cx="156.9" cy="243.8" r="1.6" class="f-muted"/>
  <circle cx="148.5" cy="245.2" r="1.6" class="f-muted"/>
  <circle cx="143.4" cy="251.6" r="1.6" class="f-muted"/>
  <circle cx="143.5" cy="250.9" r="1.6" class="f-muted"/>
  <circle cx="142.5" cy="256.6" r="1.6" class="f-muted"/>
  <circle cx="137.5" cy="256.7" r="1.6" class="f-muted"/>
  <circle cx="131.8" cy="257.6" r="1.6" class="f-muted"/>
  <circle cx="143.3" cy="263.6" r="1.6" class="f-muted"/>
  <circle cx="130.9" cy="267.1" r="1.6" class="f-muted"/>
  <circle cx="124.0" cy="266.9" r="1.6" class="f-muted"/>
  <circle cx="122.7" cy="268.1" r="1.6" class="f-muted"/>
  <circle cx="129.6" cy="274.4" r="1.6" class="f-muted"/>
  <circle cx="126.9" cy="275.4" r="1.6" class="f-muted"/>
  <circle cx="118.4" cy="276.6" r="1.6" class="f-muted"/>
  <circle cx="112.5" cy="275.3" r="1.6" class="f-muted"/>
  <circle cx="118.9" cy="278.5" r="1.6" class="f-muted"/>
  <circle cx="100.2" cy="275.8" r="1.6" class="f-muted"/>
  <circle cx="104.8" cy="277.6" r="1.6" class="f-muted"/>
  <circle cx="117.5" cy="281.2" r="1.6" class="f-muted"/>
  <circle cx="111.2" cy="284.1" r="1.6" class="f-muted"/>
  <circle cx="117.4" cy="288.9" r="1.6" class="f-muted"/>
  <circle cx="112.0" cy="291.0" r="1.6" class="f-muted"/>
  <circle cx="106.2" cy="288.1" r="1.6" class="f-muted"/>
  <circle cx="114.2" cy="288.2" r="1.6" class="f-muted"/>
  <circle cx="127.0" cy="294.3" r="1.6" class="f-muted"/>
  <circle cx="113.6" cy="298.1" r="1.6" class="f-muted"/>
  <circle cx="107.8" cy="304.4" r="1.6" class="f-muted"/>
  <circle cx="103.1" cy="292.5" r="1.6" class="f-muted"/>
  <circle cx="112.3" cy="302.7" r="1.6" class="f-muted"/>
  <circle cx="107.1" cy="300.2" r="1.6" class="f-muted"/>
  <circle cx="118.6" cy="307.6" r="1.6" class="f-muted"/>
  <circle cx="115.0" cy="309.1" r="1.6" class="f-muted"/>
  <circle cx="116.9" cy="305.9" r="1.6" class="f-muted"/>
  <circle cx="111.7" cy="311.9" r="1.6" class="f-muted"/>
  <circle cx="113.0" cy="314.5" r="1.6" class="f-muted"/>
  <circle cx="121.8" cy="311.2" r="1.6" class="f-muted"/>
  <circle cx="128.0" cy="313.4" r="1.6" class="f-muted"/>
  <circle cx="138.1" cy="312.2" r="1.6" class="f-muted"/>
  <circle cx="136.7" cy="314.1" r="1.6" class="f-muted"/>
  <circle cx="148.2" cy="316.3" r="1.6" class="f-muted"/>
  <circle cx="153.2" cy="317.3" r="1.6" class="f-muted"/>
  <circle cx="151.0" cy="317.6" r="1.6" class="f-muted"/>
  <circle cx="154.1" cy="320.0" r="1.6" class="f-muted"/>
  <circle cx="156.3" cy="316.3" r="1.6" class="f-muted"/>
  <circle cx="168.4" cy="316.5" r="1.6" class="f-muted"/>
  <circle cx="166.8" cy="320.8" r="1.6" class="f-muted"/>
  <circle cx="176.6" cy="324.5" r="1.6" class="f-muted"/>
  <circle cx="161.0" cy="328.1" r="1.6" class="f-muted"/>
  <circle cx="169.5" cy="328.7" r="1.6" class="f-muted"/>
  <circle cx="181.8" cy="325.8" r="1.6" class="f-muted"/>
  <circle cx="192.4" cy="336.0" r="1.6" class="f-muted"/>
  <circle cx="189.5" cy="331.6" r="1.6" class="f-muted"/>
  <circle cx="184.6" cy="330.4" r="1.6" class="f-muted"/>
  <circle cx="194.6" cy="336.4" r="1.6" class="f-muted"/>
  <circle cx="190.6" cy="335.3" r="1.6" class="f-muted"/>
  <circle cx="207.9" cy="334.3" r="1.6" class="f-muted"/>
  <circle cx="197.9" cy="339.2" r="1.6" class="f-muted"/>
  <circle cx="228.4" cy="338.3" r="1.6" class="f-muted"/>
  <circle cx="234.1" cy="338.8" r="1.6" class="f-muted"/>
  <circle cx="231.9" cy="337.4" r="1.6" class="f-muted"/>
  <circle cx="248.9" cy="333.4" r="1.6" class="f-muted"/>
  <circle cx="248.7" cy="336.6" r="1.6" class="f-muted"/>
  <circle cx="260.3" cy="341.8" r="1.6" class="f-muted"/>
  <circle cx="280.6" cy="340.5" r="1.6" class="f-muted"/>
  <circle cx="278.8" cy="339.5" r="1.6" class="f-muted"/>
  <circle cx="286.0" cy="340.1" r="1.6" class="f-muted"/>
  <circle cx="282.8" cy="342.8" r="1.6" class="f-muted"/>
  <circle cx="297.0" cy="346.3" r="1.6" class="f-muted"/>
  <circle cx="304.9" cy="343.9" r="1.6" class="f-muted"/>
  <circle cx="306.7" cy="342.7" r="1.6" class="f-muted"/>
  <circle cx="314.9" cy="342.3" r="1.6" class="f-muted"/>
  <circle cx="318.5" cy="347.3" r="1.6" class="f-muted"/>
  <circle cx="320.8" cy="341.3" r="1.6" class="f-muted"/>
  <circle cx="326.1" cy="346.9" r="1.6" class="f-muted"/>
  <circle cx="339.0" cy="345.3" r="1.6" class="f-muted"/>
  <circle cx="356.1" cy="341.5" r="1.6" class="f-muted"/>
  <circle cx="352.8" cy="339.3" r="1.6" class="f-muted"/>
  <circle cx="372.2" cy="339.8" r="1.6" class="f-muted"/>
  <circle cx="372.0" cy="340.6" r="1.6" class="f-muted"/>
  <circle cx="378.4" cy="342.1" r="1.6" class="f-muted"/>
  <circle cx="395.0" cy="342.7" r="1.6" class="f-muted"/>
  <circle cx="406.1" cy="341.4" r="1.6" class="f-muted"/>
  <circle cx="414.1" cy="343.0" r="1.6" class="f-muted"/>
  <circle cx="418.8" cy="340.7" r="1.6" class="f-muted"/>
  <circle cx="413.0" cy="336.0" r="1.6" class="f-muted"/>
  <circle cx="438.7" cy="341.4" r="1.6" class="f-muted"/>
  <circle cx="437.6" cy="344.6" r="1.6" class="f-muted"/>
  <circle cx="449.1" cy="345.9" r="1.6" class="f-muted"/>
  <circle cx="455.0" cy="346.0" r="1.6" class="f-muted"/>
  <circle cx="454.6" cy="335.6" r="1.6" class="f-muted"/>
  <circle cx="464.0" cy="329.6" r="1.6" class="f-muted"/>
  <circle cx="471.0" cy="326.7" r="1.6" class="f-muted"/>
  <circle cx="471.9" cy="326.5" r="1.6" class="f-muted"/>
  <circle cx="482.7" cy="333.1" r="1.6" class="f-muted"/>
  <circle cx="482.7" cy="335.3" r="1.6" class="f-muted"/>
  <circle cx="485.4" cy="334.2" r="1.6" class="f-muted"/>
  <circle cx="496.5" cy="326.5" r="1.6" class="f-muted"/>
  <circle cx="500.7" cy="327.0" r="1.6" class="f-muted"/>
  <circle cx="497.3" cy="328.3" r="1.6" class="f-muted"/>
  <circle cx="511.5" cy="330.1" r="1.6" class="f-muted"/>
  <circle cx="518.2" cy="318.4" r="1.6" class="f-muted"/>
  <circle cx="516.3" cy="318.7" r="1.6" class="f-muted"/>
  <circle cx="516.5" cy="317.5" r="1.6" class="f-muted"/>
  <circle cx="518.7" cy="307.1" r="1.6" class="f-muted"/>
  <circle cx="516.2" cy="310.9" r="1.6" class="f-muted"/>
  <circle cx="515.3" cy="310.4" r="1.6" class="f-muted"/>
  <circle cx="522.7" cy="308.1" r="1.6" class="f-muted"/>
  <circle cx="533.7" cy="311.8" r="1.6" class="f-muted"/>
  <circle cx="526.1" cy="308.0" r="1.6" class="f-muted"/>
  <circle cx="528.7" cy="305.0" r="1.6" class="f-muted"/>
  <circle cx="524.1" cy="299.3" r="1.6" class="f-muted"/>
  <circle cx="527.7" cy="297.8" r="1.6" class="f-muted"/>
  <circle cx="532.7" cy="299.1" r="1.6" class="f-muted"/>
  <circle cx="537.3" cy="292.4" r="1.6" class="f-muted"/>
  <circle cx="535.5" cy="296.1" r="1.6" class="f-muted"/>
  <circle cx="539.6" cy="292.4" r="1.6" class="f-muted"/>
  <circle cx="541.4" cy="284.3" r="1.6" class="f-muted"/>
  <circle cx="546.1" cy="286.9" r="1.6" class="f-muted"/>
  <circle cx="557.0" cy="280.8" r="1.6" class="f-muted"/>
  <circle cx="549.7" cy="276.8" r="1.6" class="f-muted"/>
  <circle cx="547.6" cy="276.3" r="1.6" class="f-muted"/>
  <circle cx="543.3" cy="279.5" r="1.6" class="f-muted"/>
  <circle cx="546.3" cy="276.9" r="1.6" class="f-muted"/>
  <circle cx="548.9" cy="274.0" r="1.6" class="f-muted"/>
  <circle cx="542.5" cy="270.4" r="1.6" class="f-muted"/>
  <circle cx="540.2" cy="264.7" r="1.6" class="f-muted"/>
  <circle cx="545.4" cy="263.4" r="1.6" class="f-muted"/>
  <circle cx="543.0" cy="263.8" r="1.6" class="f-muted"/>
  <circle cx="541.0" cy="262.2" r="1.6" class="f-muted"/>
  <circle cx="533.5" cy="258.5" r="1.6" class="f-muted"/>
  <circle cx="532.8" cy="252.0" r="1.6" class="f-muted"/>
  <circle cx="530.0" cy="249.8" r="1.6" class="f-muted"/>
  <circle cx="530.0" cy="253.5" r="1.6" class="f-muted"/>
  <circle cx="526.2" cy="257.1" r="1.6" class="f-muted"/>
  <circle cx="517.6" cy="248.5" r="1.6" class="f-muted"/>
  <circle cx="528.5" cy="243.7" r="1.6" class="f-muted"/>
  <circle cx="517.5" cy="246.5" r="1.6" class="f-muted"/>
  <circle cx="516.5" cy="243.5" r="1.6" class="f-muted"/>
  <circle cx="503.9" cy="240.3" r="1.6" class="f-muted"/>
  <circle cx="498.2" cy="241.1" r="1.6" class="f-muted"/>
  <circle cx="507.7" cy="235.4" r="1.6" class="f-muted"/>
  <circle cx="501.2" cy="223.5" r="1.6" class="f-muted"/>
  <circle cx="474.8" cy="219.8" r="1.6" class="f-muted"/>
  <circle cx="492.5" cy="222.2" r="1.6" class="f-muted"/>
  <circle cx="464.6" cy="220.4" r="1.6" class="f-muted"/>
  <circle cx="457.9" cy="218.0" r="1.6" class="f-muted"/>
  <circle cx="460.9" cy="210.5" r="1.6" class="f-muted"/>
  <circle cx="458.7" cy="206.9" r="1.6" class="f-muted"/>
  <circle cx="457.4" cy="209.8" r="1.6" class="f-muted"/>
  <circle cx="459.0" cy="204.9" r="1.6" class="f-muted"/>
  <circle cx="455.2" cy="204.0" r="1.6" class="f-muted"/>
  <circle cx="451.3" cy="199.0" r="1.6" class="f-muted"/>
  <circle cx="445.7" cy="201.3" r="1.6" class="f-muted"/>
  <circle cx="434.5" cy="199.5" r="1.6" class="f-muted"/>
  <circle cx="442.9" cy="188.6" r="1.6" class="f-muted"/>
  <circle cx="432.0" cy="193.1" r="1.6" class="f-muted"/>
  <circle cx="428.9" cy="188.9" r="1.6" class="f-muted"/>
  <circle cx="418.3" cy="187.7" r="1.6" class="f-muted"/>
  <circle cx="421.3" cy="180.9" r="1.6" class="f-muted"/>
  <circle cx="414.1" cy="178.0" r="1.6" class="f-muted"/>
  <circle cx="410.4" cy="174.4" r="1.6" class="f-muted"/>
  <circle cx="401.3" cy="170.2" r="1.6" class="f-muted"/>
  <circle cx="404.5" cy="170.7" r="1.6" class="f-muted"/>
  <circle cx="404.4" cy="165.3" r="1.6" class="f-muted"/>
  <circle cx="389.8" cy="163.8" r="1.6" class="f-muted"/>
  <circle cx="385.4" cy="163.7" r="1.6" class="f-muted"/>
  <circle cx="389.5" cy="161.1" r="1.6" class="f-muted"/>
  <circle cx="381.6" cy="160.4" r="1.6" class="f-muted"/>
  <circle cx="374.7" cy="159.0" r="1.6" class="f-muted"/>
  <circle cx="374.1" cy="157.0" r="1.6" class="f-muted"/>
  <circle cx="373.8" cy="148.6" r="1.6" class="f-muted"/>
  <circle cx="362.6" cy="148.3" r="1.6" class="f-muted"/>
  <circle cx="366.0" cy="148.5" r="1.6" class="f-muted"/>
  <circle cx="361.9" cy="148.3" r="1.6" class="f-muted"/>
  <circle cx="352.6" cy="142.2" r="1.6" class="f-muted"/>
  <circle cx="344.6" cy="140.5" r="1.6" class="f-muted"/>
  <circle cx="337.1" cy="130.3" r="1.6" class="f-muted"/>
  <circle cx="328.9" cy="133.0" r="1.6" class="f-muted"/>
  <circle cx="324.8" cy="126.3" r="1.6" class="f-muted"/>
  <circle cx="324.8" cy="124.0" r="1.6" class="f-muted"/>
  <circle cx="315.7" cy="122.7" r="1.6" class="f-muted"/>
  <circle cx="324.7" cy="119.6" r="1.6" class="f-muted"/>
  <circle cx="312.2" cy="119.4" r="1.6" class="f-muted"/>
  <circle cx="318.9" cy="116.0" r="1.6" class="f-muted"/>
  <circle cx="307.1" cy="115.4" r="1.6" class="f-muted"/>
  <circle cx="308.7" cy="113.4" r="1.6" class="f-muted"/>
  <circle cx="309.3" cy="110.0" r="1.6" class="f-muted"/>
  <circle cx="314.1" cy="114.5" r="1.6" class="f-muted"/>
  <circle cx="307.8" cy="107.2" r="1.6" class="f-muted"/>
  <circle cx="300.9" cy="105.5" r="1.6" class="f-muted"/>
  <circle cx="302.0" cy="106.6" r="1.6" class="f-muted"/>
  <circle cx="300.4" cy="97.9" r="1.6" class="f-muted"/>
  <circle cx="294.6" cy="99.9" r="1.6" class="f-muted"/>
  <circle cx="297.9" cy="97.7" r="1.6" class="f-muted"/>
  <circle cx="290.9" cy="97.7" r="1.6" class="f-muted"/>
  <circle cx="291.0" cy="92.6" r="1.6" class="f-muted"/>
  <circle cx="286.6" cy="93.1" r="1.6" class="f-muted"/>
  <circle cx="293.7" cy="89.6" r="1.6" class="f-muted"/>
  <circle cx="295.0" cy="91.9" r="1.6" class="f-muted"/>
  <circle cx="295.7" cy="94.2" r="1.6" class="f-muted"/>
  <circle cx="291.9" cy="92.0" r="1.6" class="f-muted"/>
  <circle cx="294.8" cy="88.3" r="1.6" class="f-muted"/>
  <circle cx="289.6" cy="86.0" r="1.6" class="f-muted"/>
  <circle cx="290.9" cy="85.3" r="1.6" class="f-muted"/>
  <circle cx="284.7" cy="82.9" r="1.6" class="f-muted"/>
  <circle cx="289.6" cy="80.4" r="1.6" class="f-muted"/>
  <circle cx="281.9" cy="78.9" r="1.6" class="f-muted"/>
  <circle cx="287.0" cy="80.2" r="1.6" class="f-muted"/>
  <circle cx="293.6" cy="76.7" r="1.6" class="f-muted"/>
  <circle cx="289.3" cy="73.2" r="1.6" class="f-muted"/>
  <circle cx="288.2" cy="74.1" r="1.6" class="f-muted"/>
  <circle cx="284.2" cy="72.0" r="1.6" class="f-muted"/>
  <circle cx="301.1" cy="67.9" r="1.6" class="f-muted"/>
  <circle cx="301.9" cy="69.0" r="1.6" class="f-muted"/>
  <circle cx="290.7" cy="66.4" r="1.6" class="f-muted"/>
  <circle cx="306.7" cy="64.9" r="1.6" class="f-muted"/>
  <circle cx="301.6" cy="65.5" r="1.6" class="f-muted"/>
  <circle cx="308.4" cy="61.8" r="1.6" class="f-muted"/>
  <circle cx="295.7" cy="63.1" r="1.6" class="f-muted"/>
  <circle cx="303.1" cy="64.1" r="1.6" class="f-muted"/>
  <circle cx="307.8" cy="65.8" r="1.6" class="f-muted"/>
  <circle cx="302.9" cy="60.0" r="1.6" class="f-muted"/>
  <circle cx="303.1" cy="58.4" r="1.6" class="f-muted"/>
  <circle cx="301.7" cy="58.2" r="1.6" class="f-muted"/>
  <circle cx="303.4" cy="53.2" r="1.6" class="f-muted"/>
  <circle cx="329.4" cy="56.6" r="1.6" class="f-muted"/>
  <circle cx="332.0" cy="55.1" r="1.6" class="f-muted"/>
  <circle cx="336.3" cy="59.4" r="1.6" class="f-muted"/>
  <circle cx="356.7" cy="53.4" r="1.6" class="f-muted"/>
  <circle cx="360.4" cy="53.4" r="1.6" class="f-muted"/>
  <circle cx="366.7" cy="55.6" r="1.6" class="f-muted"/>
  <circle cx="374.7" cy="53.5" r="1.6" class="f-muted"/>
  <circle cx="373.6" cy="54.0" r="1.6" class="f-muted"/>
  <circle cx="373.4" cy="55.3" r="1.6" class="f-muted"/>
  <circle cx="377.0" cy="53.8" r="1.6" class="f-muted"/>
  <circle cx="380.5" cy="52.6" r="1.6" class="f-muted"/>
  <circle cx="383.3" cy="54.0" r="1.6" class="f-muted"/>
  <circle cx="389.6" cy="57.5" r="1.6" class="f-muted"/>
  <circle cx="391.3" cy="56.1" r="1.6" class="f-muted"/>
  <circle cx="398.0" cy="57.5" r="1.6" class="f-muted"/>
  <circle cx="409.4" cy="63.8" r="1.6" class="f-muted"/>
  <circle cx="406.5" cy="64.0" r="1.6" class="f-muted"/>
  <circle cx="397.9" cy="57.7" r="1.6" class="f-muted"/>
  <circle cx="406.4" cy="59.6" r="1.6" class="f-muted"/>
  <circle cx="407.2" cy="64.1" r="1.6" class="f-muted"/>
  <circle cx="421.3" cy="64.8" r="1.6" class="f-muted"/>
  <circle cx="411.2" cy="63.9" r="1.6" class="f-muted"/>
  <circle cx="422.0" cy="63.0" r="1.6" class="f-muted"/>
  <circle cx="418.6" cy="68.4" r="1.6" class="f-muted"/>
  <circle cx="412.0" cy="66.6" r="1.6" class="f-muted"/>
  <circle cx="420.9" cy="68.1" r="1.6" class="f-muted"/>
  <circle cx="427.4" cy="69.4" r="1.6" class="f-muted"/>
  <circle cx="425.0" cy="69.9" r="1.6" class="f-muted"/>
  <circle cx="430.0" cy="72.2" r="1.6" class="f-muted"/>
  <circle cx="422.7" cy="71.4" r="1.6" class="f-muted"/>
  <circle cx="429.6" cy="72.2" r="1.6" class="f-muted"/>
  <circle cx="417.9" cy="69.9" r="1.6" class="f-muted"/>
  <circle cx="417.2" cy="71.0" r="1.6" class="f-muted"/>
  <circle cx="432.7" cy="81.7" r="1.6" class="f-muted"/>
  <circle cx="432.5" cy="78.9" r="1.6" class="f-muted"/>
  <circle cx="428.9" cy="79.9" r="1.6" class="f-muted"/>
  <circle cx="423.6" cy="80.0" r="1.6" class="f-muted"/>
  <circle cx="430.0" cy="82.9" r="1.6" class="f-muted"/>
  <circle cx="431.5" cy="83.7" r="1.6" class="f-muted"/>
  <circle cx="423.8" cy="87.1" r="1.6" class="f-muted"/>
  <circle cx="424.0" cy="82.0" r="1.6" class="f-muted"/>
  <circle cx="424.6" cy="89.8" r="1.6" class="f-muted"/>
  <circle cx="427.1" cy="91.3" r="1.6" class="f-muted"/>
  <circle cx="430.2" cy="91.2" r="1.6" class="f-muted"/>
  <circle cx="427.0" cy="96.2" r="1.6" class="f-muted"/>
  <circle cx="430.5" cy="98.2" r="1.6" class="f-muted"/>
  <circle cx="428.2" cy="92.7" r="1.6" class="f-muted"/>
  <circle cx="423.0" cy="102.8" r="1.6" class="f-muted"/>
  <circle cx="420.2" cy="103.0" r="1.6" class="f-muted"/>
  <circle cx="421.2" cy="107.1" r="1.6" class="f-muted"/>
  <circle cx="420.7" cy="107.3" r="1.6" class="f-muted"/>
  <circle cx="409.7" cy="106.5" r="1.6" class="f-muted"/>
  <circle cx="413.3" cy="107.7" r="1.6" class="f-muted"/>
  <circle cx="407.7" cy="111.6" r="1.6" class="f-muted"/>
  <circle cx="405.2" cy="113.3" r="1.6" class="f-muted"/>
  <circle cx="398.7" cy="109.9" r="1.6" class="f-muted"/>
  <circle cx="391.2" cy="109.7" r="1.6" class="f-muted"/>
  <circle cx="389.5" cy="116.2" r="1.6" class="f-muted"/>
  <circle cx="389.0" cy="116.7" r="1.6" class="f-muted"/>
  <circle cx="388.4" cy="120.9" r="1.6" class="f-muted"/>
  <circle cx="381.9" cy="120.3" r="1.6" class="f-muted"/>
  <circle cx="378.0" cy="123.2" r="1.6" class="f-muted"/>
  <circle cx="375.9" cy="124.3" r="1.6" class="f-muted"/>
  <circle cx="378.9" cy="131.8" r="1.6" class="f-muted"/>
  <circle cx="368.6" cy="135.5" r="1.6" class="f-muted"/>
  <circle cx="359.2" cy="129.6" r="1.6" class="f-muted"/>
  <circle cx="360.4" cy="132.3" r="1.6" class="f-muted"/>
  <circle cx="357.1" cy="135.5" r="1.6" class="f-muted"/>
  <circle cx="346.9" cy="137.8" r="1.6" class="f-muted"/>
  <circle cx="340.3" cy="143.2" r="1.6" class="f-muted"/>
  <circle cx="339.2" cy="146.6" r="1.6" class="f-muted"/>
  <circle cx="333.7" cy="148.6" r="1.6" class="f-muted"/>
  <circle cx="325.8" cy="148.0" r="1.6" class="f-muted"/>
  <circle cx="326.5" cy="151.2" r="1.6" class="f-muted"/>
  <circle cx="322.6" cy="156.6" r="1.6" class="f-muted"/>
  <circle cx="310.4" cy="157.0" r="1.6" class="f-muted"/>
  <circle cx="312.0" cy="161.3" r="1.6" class="f-muted"/>
  <circle cx="303.6" cy="158.9" r="1.6" class="f-muted"/>
  <circle cx="306.8" cy="161.7" r="1.6" class="f-muted"/>
  <circle cx="296.1" cy="166.1" r="1.6" class="f-muted"/>
  <circle cx="293.1" cy="168.4" r="1.6" class="f-muted"/>
  <circle cx="289.3" cy="169.7" r="1.6" class="f-muted"/>
  <circle cx="287.5" cy="177.0" r="1.6" class="f-muted"/>
  <circle cx="279.0" cy="177.9" r="1.6" class="f-muted"/>
  <circle cx="273.1" cy="184.4" r="1.6" class="f-muted"/>
  <circle cx="264.3" cy="180.9" r="1.6" class="f-muted"/>
  <circle cx="264.0" cy="184.3" r="1.6" class="f-muted"/>
  <circle cx="257.7" cy="181.2" r="1.6" class="f-muted"/>
  <circle cx="257.5" cy="184.2" r="1.6" class="f-muted"/>
  <circle cx="254.9" cy="192.0" r="1.6" class="f-muted"/>
  <circle cx="246.4" cy="195.1" r="1.6" class="f-muted"/>
  <circle cx="239.7" cy="194.7" r="1.6" class="f-muted"/>
  <circle cx="232.9" cy="197.5" r="1.6" class="f-muted"/>
  <circle cx="227.2" cy="204.0" r="1.6" class="f-muted"/>
  <circle cx="219.8" cy="206.3" r="1.6" class="f-muted"/>
  <circle cx="212.7" cy="204.7" r="1.6" class="f-muted"/>
  <circle cx="212.9" cy="207.7" r="1.6" class="f-muted"/>
  <circle cx="201.1" cy="210.9" r="1.6" class="f-muted"/>
  <circle cx="199.8" cy="215.4" r="1.6" class="f-muted"/>
  <circle cx="190.7" cy="214.4" r="1.6" class="f-muted"/>
  <circle cx="188.7" cy="222.2" r="1.6" class="f-muted"/>
  <circle cx="263.4" cy="338.2" r="3.2" class="f-accent"/>
  <circle cx="407.2" cy="345.7" r="3.2" class="f-accent"/>
  <circle cx="439.6" cy="340.9" r="3.2" class="f-accent"/>
  <circle cx="351.1" cy="140.5" r="3.2" class="f-accent"/>
  <circle cx="352.4" cy="144.1" r="3.2" class="f-accent"/>
  <circle cx="351.4" cy="140.8" r="3.2" class="f-accent"/>
  <circle cx="301.6" cy="54.7" r="3.2" class="f-accent"/>
  <circle cx="313.9" cy="57.2" r="3.2" class="f-accent"/>
  <circle cx="318.1" cy="55.9" r="3.2" class="f-accent"/>
  <circle cx="328.4" cy="61.4" r="3.2" class="f-accent"/>
  <circle cx="334.5" cy="61.7" r="3.2" class="f-accent"/>
  <circle cx="333.5" cy="57.4" r="3.2" class="f-accent"/>
  <circle cx="334.9" cy="56.5" r="3.2" class="f-accent"/>
  <circle cx="335.8" cy="56.1" r="3.2" class="f-accent"/>
  <circle cx="343.4" cy="55.3" r="3.2" class="f-accent"/>
  <circle cx="346.3" cy="55.9" r="3.2" class="f-accent"/>
  <circle cx="356.0" cy="57.0" r="3.2" class="f-accent"/>
  <circle cx="358.0" cy="57.9" r="3.2" class="f-accent"/>
  <circle cx="366.4" cy="59.9" r="3.2" class="f-accent"/>
  <circle cx="358.8" cy="52.1" r="3.2" class="f-accent"/>
  <circle cx="390.9" cy="56.1" r="3.2" class="f-accent"/>
  <circle cx="410.8" cy="57.4" r="3.2" class="f-accent"/>
  <circle cx="345.8" cy="144.3" r="3.2" class="f-accent"/>
  <text x="318.5" y="365.3" text-anchor="middle" class="f-label f-ink">22 сне</text>
  <text x="358.8" y="42.1" text-anchor="middle" class="f-label f-ink">21 чэр</text>
  <text x="92.2" y="279.8" text-anchor="end" class="f-label f-ink">27 кас</text>
  <text x="565.0" y="284.8" text-anchor="start" class="f-label f-ink">11 лют</text>
  <text x="366.4" y="130.1" class="f-label f-ink">14 кра = 28 жні</text>
  <circle cx="66" cy="414" r="3.2" class="f-accent"/>
  <text x="76" y="418" class="f-label f-muted">прачытаны з памылкай больш за дзень</text>
</svg>
<figcaption>Адна кропка на адзін кадр світання, 21:00 UTC. Нічога тут не ўзята з астранамічнага календара: нахіл і зрух вымераныя на малюнках. Нахіл гэта сезон, зрух убок гэта ўраўненне часу. Там, дзе петлі перасякаюцца, кадр сярэдзіны красавіка і кадр канца жніўня выглядаюць аднолькава.</figcaption>
</figure>

## Сама вокладка

Потым я рыхтаваў яе да публікацыі. У выглядзе GIF год світанкаў важыць 50,6 МБ, год поўдняў 79,7 МБ. X абмяжоўвае анімаваны GIF да 15 МБ і раіць не больш за 350 кадраў, а ў годзе 365 дзён. MP4 з H.264 пры CRF 28 важыць 3,1 МБ для світання і 7,7 МБ для поўдня. Версія світання меншая, верагодна таму, што значная частка кожнага дыска цёмная. На чым менавіта эканоміць кодэк, я не правяраў.

## Чаго я не правяраў

Парог 3 з 255 аказаўся лепшым з 3, што я спрабаваў. Пры 6 трапленняў застаецца 304 з 358, пры 12 усяго 163, так што метад трымаецца на самым цёмным краі прыцемкаў. Вугал сонца на мяжы адкалібраваны па сапраўдных датах другой паловы кадраў, таму гэта не сляпы тэст. Я ўзяў адзін год аднаго спадарожніка, кадры памерам 550 пікселяў. А ці прымусіць ролік кагосьці спыніцца, гартаючы стужку, пакуль сказаць не магу, ён яшчэ не выкладзены.
