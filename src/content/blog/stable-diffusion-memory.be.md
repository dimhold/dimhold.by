---
title: "Stable Diffusion просіць 10 ГБ відэапамяці, а вагі займаюць з іх 4"
description: "README Stable Diffusion просіць GPU мінімум на 10 ГБ, а вагі ў float32 займаюць 4,26 ГБ. На CPU з PyTorch 1.12.1 я памераў, куды сыходзіць астатняе: адзін слой увагі на 512x512 будуе 2 ГіБ матрыц ацэнак, цыкл па галовах зводзіць гэта да 387 МіБ з тым жа выхадам біт у біт, а каманда txt2img па змаўчанні на паперы набірае каля 10 ГіБ."
date: 2022-08-27
lang: be
translationKey: stable-diffusion-memory
tags: ["machine-learning", "performance"]
---
У панядзелак CompVis выклалі вагі Stable Diffusion. У іх README напісана, што ў мадэлі "860M UNet and 123M text encoder" і што яна "runs on a GPU with at least 10GB VRAM". Я перамножыў у галаве. Прыкладна мільярд лікаў па 4 байты гэта 4 ГБ. Астатнія 6 з 10 я лічыў запасам для CUDA і звычкай акругляць уверх.

Гэта і была ўся мая мадэль відэапамяці: вагі плюс трохі зверху. Я ніколі яе не правяраў, бо ўсё, што я запускаў раней, змяшчалася куды заўгодна. На машыне, дзе я раблю гэтыя доследы, відэакарты няма зусім. Там 4 ядры AMD EPYC і крыху менш за 5 ГіБ, якія я магу аддаць аднаму працэсу. Гэта аказалася зручна: працэс, які просіць зашмат, адразу забіваюць, а не даюць яму тармазіць. Усё ніжэй лічылася на PyTorch 1.12.1 на CPU ў float32.

## Лічу вагі

У файлах `CompVis/stable-diffusion-v1-4` толькі ў UNet ляжыць 859,5 мільёна лікаў. Разам з тэкставым энкодарам і VAE, часткай, якая ператварае вынік у пікселі, выходзіць 1,07 мільярда. Гэта 4,26 ГБ у float32 і 2,13 ГБ у палавіннай дакладнасці. Вагі я ацаніў правільна. Толькі тлумачыла гэтая ацэнка менш за палову з 10.

Адзін UNet у float32 займае 3,2 ГіБ. Загрузка падняла памяць працэсу да 3,76 ГіБ разам з файлавым кэшам. Пакуль у мяне не было чыстых лікаў, я доўга разбіраўся з забойствамі працэсаў, якія нічым не тлумачыліся. Потым знайшоў, што ў маёй карыстальніцкай сесіі свая столь у 5 ГіБ і ў яе ж лічыцца ўсё астатняе, што ў мяне адкрыта.

## Куды сыходзіць астатняе

Адказ ляжыць у `ldm/modules/attention.py`. UNet глядзіць на малюнак праз слаі ўвагі. Першы з іх працуе на 1/8 памеру малюнка: на 512x512 ён бачыць 64 на 64, гэта значыць 4096 пазіцый. Кожная пазіцыя параўноўваецца з кожнай, атрымліваецца матрыца 4096 на 4096 лікаў. Галоў 8, а сэмплер ганяе промпт і пусты промпт разам, таму такіх матрыц 16. Код лічыць іх усе адным `einsum`, а потым `softmax` робіць другі тэнзар таго ж памеру.

<figure class="fig">
<svg viewBox="0 0 680 260" role="img" aria-label="Адзін слой увагі на 512x512, промпт і пусты промпт, 8 галоў. усе галовы адразу: 16 + 16 матрыц па 64 МіБ = 2 ГіБ, замер звыш базы +2241 МіБ. па адной галаве: 1 + 1 матрыца па 64 МіБ = 128 МіБ, замер звыш базы +387 МіБ.">
  <text x="10" y="18" class="f-label f-muted">Адзін слой увагі на 512x512, промпт і пусты промпт, 8 галоў</text>
  <text x="20" y="50" class="f-mono f-ink" style="font-size:13px">усе галовы адразу</text>
  <text x="20" y="74" class="f-label f-muted">ацэнкі</text>
  <rect x="20" y="82" width="26" height="26" class="f-box"/>
  <rect x="50" y="82" width="26" height="26" class="f-box"/>
  <rect x="80" y="82" width="26" height="26" class="f-box"/>
  <rect x="110" y="82" width="26" height="26" class="f-box"/>
  <rect x="20" y="112" width="26" height="26" class="f-box"/>
  <rect x="50" y="112" width="26" height="26" class="f-box"/>
  <rect x="80" y="112" width="26" height="26" class="f-box"/>
  <rect x="110" y="112" width="26" height="26" class="f-box"/>
  <rect x="20" y="142" width="26" height="26" class="f-box"/>
  <rect x="50" y="142" width="26" height="26" class="f-box"/>
  <rect x="80" y="142" width="26" height="26" class="f-box"/>
  <rect x="110" y="142" width="26" height="26" class="f-box"/>
  <rect x="20" y="172" width="26" height="26" class="f-box"/>
  <rect x="50" y="172" width="26" height="26" class="f-box"/>
  <rect x="80" y="172" width="26" height="26" class="f-box"/>
  <rect x="110" y="172" width="26" height="26" class="f-box"/>
  <text x="170" y="74" class="f-label f-muted">пасля softmax</text>
  <rect x="170" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="200" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="230" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="260" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="170" y="112" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="200" y="112" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="230" y="112" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="260" y="112" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="170" y="142" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="200" y="142" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="230" y="142" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="260" y="142" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="170" y="172" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="200" y="172" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="230" y="172" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="260" y="172" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <text x="20" y="218" class="f-label f-ink">16 + 16 матрыц па 64 МіБ = 2 ГіБ</text>
  <text x="20" y="240" class="f-mono f-ink" style="font-size:13px">замер звыш базы: +2241 МіБ</text>
  <line x1="340" y1="40" x2="340" y2="250" class="f-line f-muted" opacity="0.4"/>
  <text x="370" y="50" class="f-mono f-ink" style="font-size:13px">па адной галаве</text>
  <text x="370" y="74" class="f-label f-muted">ацэнкі</text>
  <rect x="370" y="82" width="26" height="26" class="f-box"/>
  <text x="520" y="74" class="f-label f-muted">пасля softmax</text>
  <rect x="520" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <text x="370" y="140" class="f-label f-muted">4096 x 4096, 64 МіБ</text>
  <text x="370" y="218" class="f-label f-ink">1 + 1 матрыца па 64 МіБ = 128 МіБ</text>
  <text x="370" y="240" class="f-mono f-ink" style="font-size:13px">замер звыш базы: +387 МіБ</text>
</svg>
<figcaption>Кожны квадрат гэта адна матрыца 4096 на 4096 лікаў float32, 64 МіБ. Код CompVis будуе ўсе 16 адразу і softmax дадае яшчэ 16. Цыкл па галовах трымае 2 за раз і дае той жа вынік біт у біт.</figcaption>
</figure>

16 матрыц па 64 МіБ даюць 1 ГіБ у float32, а разам з копіяй пасля softmax 2 ГіБ, гэта значыць 2048 МіБ. Я выняў гэты блок з UNet і запусціў асобна, з сапраўднымі вагамі. Памяць вырасла на 2241 МіБ звыш базы, так што 2 тэнзары тлумачаць 91% росту. Астатняе прыпадае на іншыя тэнзары блока. Потым я перапісаў тую ж матэматыку цыклам па галовах, па адной матрыцы за раз. Цыкл заняў 387 МіБ. Паўторны прагон даў 405. Выхады супалі біт у біт.

Я чакаў, што цыкл будзе даражэйшы па часе. За 3 прагоны кожнага варыянта ён заняў ад 2,04 да 2,16 секунды, а ўсе галовы адразу ад 1,85 да 2,19. На гэтым CPU розніца тоне ў шуме. На карце можа выйсці інакш, але на любой карце, дзе не хапае памяці, я б на такі абмен пайшоў.

Матрыца расце з квадратам колькасці пазіцый. Вось гэтага я не адчуваў, пакуль не ўбачыў. На 640x640 аднаму слою трэба 2,4 ГіБ, а на 768x768 ужо 5,1 ГіБ, яшчэ без копіі пасля softmax. З усімі галовамі адразу абодва прагоны забіла на ліміце ў 4 ГіБ. Па адной галаве яны занялі 795 МіБ і 1390 МіБ.

<figure class="fig">
<svg viewBox="0 0 680 290" role="img" aria-label="Памяць звыш базы на першым блоку ўвагі, float32, ліміт 4 ГіБ. 512x512: усе галовы адразу +2241 МіБ. па адной галаве +387 МіБ. 640x640: усе галовы адразу забіты на ліміце 4 ГіБ, адны ацэнкі 2,4 ГіБ. па адной галаве +795 МіБ. 768x768: усе галовы адразу забіты на ліміце 4 ГіБ, адны ацэнкі 5,1 ГіБ. па адной галаве +1390 МіБ.">
  <text x="10" y="18" class="f-label f-muted">Памяць звыш базы на першым блоку ўвагі, float32, ліміт 4 ГіБ</text>
  <text x="108" y="70" text-anchor="end" class="f-mono f-ink" style="font-size:13px">512x512</text>
  <rect x="120" y="46" width="264.8" height="18" class="f-box f-accent"/>
  <text x="390.8" y="59" class="f-label f-ink">усе галовы адразу +2241 МіБ</text>
  <rect x="120" y="70" width="45.7" height="18" class="f-box"/>
  <text x="171.7" y="83" class="f-label f-ink">па адной галаве +387 МіБ</text>
  <text x="108" y="142" text-anchor="end" class="f-mono f-ink" style="font-size:13px">640x640</text>
  <rect x="120" y="118" width="484.1" height="18" class="f-box f-plain" style="stroke-dasharray:4 3"/>
  <text x="128" y="131" class="f-label f-ink">усе галовы адразу: забіты на ліміце 4 ГіБ</text>
  <text x="596.1" y="131" text-anchor="end" class="f-label f-muted">адны ацэнкі 2,4 ГіБ</text>
  <rect x="120" y="142" width="94.0" height="18" class="f-box"/>
  <text x="220.0" y="155" class="f-label f-ink">па адной галаве +795 МіБ</text>
  <text x="108" y="214" text-anchor="end" class="f-mono f-ink" style="font-size:13px">768x768</text>
  <rect x="120" y="190" width="484.1" height="18" class="f-box f-plain" style="stroke-dasharray:4 3"/>
  <text x="128" y="203" class="f-label f-ink">усе галовы адразу: забіты на ліміце 4 ГіБ</text>
  <text x="596.1" y="203" text-anchor="end" class="f-label f-muted">адны ацэнкі 5,1 ГіБ</text>
  <rect x="120" y="214" width="164.3" height="18" class="f-box"/>
  <text x="290.3" y="227" class="f-label f-ink">па адной галаве +1390 МіБ</text>
  <line x1="604.1" y1="40" x2="604.1" y2="246" class="f-line f-muted" style="stroke-dasharray:2 3"/>
  <line x1="120" y1="252" x2="640" y2="252" class="f-line f-muted"/>
  <line x1="120.0" y1="248" x2="120.0" y2="252" class="f-line f-muted"/><text x="120.0" y="266" text-anchor="middle" class="f-label f-muted">0</text>
  <line x1="238.2" y1="248" x2="238.2" y2="252" class="f-line f-muted"/><text x="238.2" y="266" text-anchor="middle" class="f-label f-muted">1000</text>
  <line x1="356.4" y1="248" x2="356.4" y2="252" class="f-line f-muted"/><text x="356.4" y="266" text-anchor="middle" class="f-label f-muted">2000</text>
  <line x1="474.5" y1="248" x2="474.5" y2="252" class="f-line f-muted"/><text x="474.5" y="266" text-anchor="middle" class="f-label f-muted">3000</text>
  <line x1="592.7" y1="248" x2="592.7" y2="252" class="f-line f-muted"/><text x="592.7" y="266" text-anchor="middle" class="f-label f-muted">4000</text>
  <text x="640" y="282" text-anchor="end" class="f-label f-muted">МіБ</text>
</svg>
<figcaption>3 прагоны на слупок, 4 ядры CPU, PyTorch 1.12.1. Усе прагоны з усімі галовамі адразу вышэй за 512x512 забітыя на ліміце 4 ГіБ. Шэрым падпісаны памер матрыцы ацэнак для гэтага памеру, без копіі пасля softmax.</figcaption>
</figure>

## Каманда па змаўчанні

`scripts/txt2img.py` па змаўчанні робіць 3 малюнкі за раз, а сэмплер падвойвае гэта дзеля пустога промпта, так што UNet бачыць батч 6. Вагі ён трымае ў float32 і працуе пад `autocast`. Запыты і ключы выходзяць з лінейных слаёў у палавіннай дакладнасці, значыць і ацэнкі таксама. `softmax` стаіць у спісе аперацый, якія autocast вяртае ў float32. На адзін слой пры 512x512 у мяне выходзіць 1,5 ГіБ ацэнак у палавіннай дакладнасці і 3 ГіБ пасля softmax. Першы тэнзар код трымае жывым, пакуль працуе з другім. Наступны `einsum` ідзе праз `bmm`, які autocast прыводзіць да палавіннай дакладнасці, так што гэта яшчэ адна копія на 1,5 ГіБ. Разам 6 ГіБ на адзін слой, побач з 3,97 ГіБ вагаў.

Гэта блізка да 10 ГіБ, што нечакана добра сыходзіцца з README. На карце я гэтага не запускаў, так што гэта маё прачытанне кода, але памыліцца яно можа ў абодва бакі. Autocast можа яшчэ трымаць палавінныя копіі вагаў, якія ён прывёў, а колькі бярэ кантэкст CUDA, я не ведаю. Таму большую частку з 10 ГБ я адношу на рахунак батча 6 пад autocast па змаўчанні, а меншую на рахунак самой мадэлі.

## Адзін малюнак цалкам

Напрыканцы я зрабіў адзін малюнак, каб пабачыць, што часткі працуюць разам. Узяў промпт "a photograph of an astronaut riding a horse", 50 крокаў сэмплера PLMS і ўвагу па адной галаве. Промпт і пусты промпт ішлі праз UNet адным батчам з 2, як у кодзе CompVis. Кожная з 3 частак працавала асобным працэсам, так што ў памяці разам яны не былі ніколі. Працэс UNet дайшоў да 3,76 ГіБ. Ужо на загрузцы было 3,70, так што 51 праход сэмплера дадаў зверху толькі 64 МіБ. Астатнія 2 трымаліся ніжэй за 1,7 ГіБ.

На 4 ядрах усё разам заняло 16 хвілін, звычайны крок ішоў 17,4 секунды. Астранаўт на месцы, конь таксама. Колькі тая ж праца ідзе на карце, сказаць не магу: свайго ліку ў мяне няма.

На паперы ніжняя мяжа для 512x512 цяпер значна ніжэй за 10 ГБ. Гэта каля 2 ГіБ вагаў у палавіннай дакладнасці і каля 0,1 ГіБ ацэнак адной галавы, калі лічыць усе копіі, якія робіць autocast. Перш чым паверыць, я хацеў бы пабачыць гэта на сапраўднай карце.

## Чаго я не правяраў

- Нічога тут не запускалася на GPU. Ні кантэкст CUDA, ні хуткасць на карце я не мераў.
- 10 ГіБ для каманды па змаўчанні ўзятыя з кода і задакументаваных правілаў autocast, а не з прагону.
- Кожны замер часу тут зроблены за 3 прагоны ці менш, на машыне, дзе ішла і іншая праца.
- Усе галовы адразу я мераў толькі на першым блоку ўвагі. Цэлы UNet я ганяў толькі з увагай па адной галаве. У тым прагоне працаваў код UNet з diffusers, а не мой цыкл.
- У VAE ёсць свая ўвага на 64 на 64 і асобна я яе не глядзеў.
