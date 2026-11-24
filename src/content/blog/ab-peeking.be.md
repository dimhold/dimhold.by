---
title: "Штодзённыя праверкі A/A-тэста далі 22% памылковых вынікаў, лішні дзень чакання пакінуў 12%"
description: "Я змадэляваў 400 000 A/A-тэстаў, дзе p глядзяць кожны вечар 14 дзён. Спыненне пры першым p < 0,05 дае 22,0% памылковых вынікаў, лішні дзень чакання пакідае 12,1%, дададзеныя пасля тэрміну тыдні даводзяць да 11,3%. Інтэграванне 1969 года сыходзіцца з сімуляцыяй. 26,1% Эвана Мілера выходзяць дакладна, але толькі з дакладным бінаміяльным тэстам."
date: 2016-01-30
lang: be
translationKey: ab-peeking
tags: ["statistics", "numbers"]
---

Эксперымент 36 скончыў першы дзень са 127 заказамі ў групе A і 91 у групе B, p = 0,012. B прадае на 28% горш. На другі дзень было 233 супраць 193, p = 0,047, гэта значыць, вынік пацвердзіўся. Праз 14 дзён у тым жа эксперыменце было 1578 заказаў супраць 1568. Абедзве групы ўзятыя з `binomial` з аднолькавай канверсіяй 5%, так што шукаць там не было чаго.

Пакуль ідзе тэст, я кожны дзень адкрываю p. Што спыняцца па ім нельга, я ведаю, звычайна тут даюць спасылку на "How Not To Run an A/B Test" Эвана Мілера 2010 года. Але калі розніца з'явілася рана, я чакаю яшчэ дзень. Яна нікуды не дзелася, значыць, я праверыў. Што дае гэты лішні дзень, я ні разу не мераў. Эксперымент 36 такую праверку прайшоў бы.

Тэма старая. Паўторныя праверкі разлічылі Армітыдж, Макферсан і Роў у 1969 годзе, потым Покак у 1977 і О'Браен з Флемінгам у 1979 прапанавалі парогі з папраўкай. У снежні Джахары, Пекеліс і Уолш выклалі на arXiv артыкул пра p-значэнні, якія застаюцца слушнымі, калі б на іх ні паглядзелі. Мне былі патрэбныя лікі для маіх уласных звычак.

## Што я лічыў

Ёсць 2 групы па 2250 наведвальнікаў у дзень, канверсія 5%, тэрмін 14 дзён. Усяго 31 500 наведвальнікаў на групу, гэтага хапае, каб заўважыць рост з 5% да 5,5% з верагоднасцю каля 80%. Кожны вечар скрыпт робіць двухбаковы z-тэст для 2 доляў з парогам 0,05. Ён мадэлюе 400 000 эксперыментаў без розніцы і яшчэ 400 000, дзе B лепшая на 10%. Python 3.5.1, numpy 1.10.4, `RandomState`, зерне гэта дата артыкула.

Да прагону я запісаў свой прагноз: 22% памылковых вынікаў пры штодзённых праверках і ад 10 да 12%, калі значнасць мусіць пратрымацца 2 дні запар.

Сімуляцыі, якую няма з чым зверыць, я не веру, таму першы лік палічаны яшчэ і рэкурсіўным інтэграваннем, якое звычайна прыпісваюць артыкулу 1969 года (формулу я ведаю, самога артыкула не чытаў). Для 14 праверак яно дае 21,96%. Змадэляванае нармальнае блуканне дало 22,01%, змадэляваныя заказы 22,00%.

## Першыя 40 эксперыментаў

<figure class="fig">
<svg viewBox="0 0 680 300" role="img" aria-label="Лініі z па днях для 40 змадэляваных A/A-тэстаў за 14 дзён і паласа значнасці ад -1,96 да 1,96. 10 ліній хоць раз выходзяць з паласы, усе ўніз, а на 14-ы дзень звонку застаюцца 3. Эксперымент 36 звонку ў першы і другі дзень і заканчвае каля нуля.">
  <text x="38.0" y="274.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-4</text>
  <text x="38.0" y="201.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-2</text>
  <text x="38.0" y="128.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="38.0" y="56.2" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="50" y1="124.8" x2="590" y2="124.8" class="f-plain"/>
  <line x1="50" y1="53.6" x2="590" y2="53.6" style="stroke:var(--ink);stroke-width:1;stroke-dasharray:5 4"/>
  <text x="600.0" y="57.6" text-anchor="start" class="f-mono f-ink" style="font-size:11px">p = 0,05</text>
  <line x1="50" y1="195.9" x2="590" y2="195.9" style="stroke:var(--ink);stroke-width:1;stroke-dasharray:5 4"/>
  <text x="600.0" y="199.9" text-anchor="start" class="f-mono f-ink" style="font-size:11px">p = 0,05</text>
  <polyline points="50.0,96.6 91.5,102.2 133.1,141.8 174.6,147.0 216.2,161.2 257.7,148.9 299.2,165.6 340.8,155.9 382.3,137.8 423.8,148.0 465.4,146.9 506.9,146.0 548.5,141.8 590.0,127.4" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,174.3 91.5,124.8 133.1,124.8 174.6,108.3 216.2,87.2 257.7,82.9 299.2,95.7 340.8,101.4 382.3,97.6 423.8,107.1 465.4,114.8 506.9,122.6 548.5,107.7 590.0,116.6" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,127.2 91.5,154.9 133.1,144.7 174.6,132.2 216.2,111.5 257.7,110.6 299.2,94.8 340.8,96.7 382.3,95.9 423.8,97.4 465.4,86.8 506.9,83.4 548.5,65.2 590.0,67.9" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,175.9 91.5,116.2 133.1,117.8 174.6,109.2 216.2,115.1 257.7,94.2 299.2,93.6 340.8,85.2 382.3,96.4 423.8,76.4 465.4,82.4 506.9,85.5 548.5,76.7 590.0,87.5" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,71.1 91.5,101.7 133.1,95.6 174.6,94.3 216.2,88.6 257.7,87.8 299.2,101.0 340.8,99.8 382.3,99.5 423.8,97.7 465.4,93.1 506.9,108.9 548.5,124.8 590.0,120.8" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,110.5 91.5,119.6 133.1,120.5 174.6,141.8 216.2,151.1 257.7,138.8 299.2,162.0 340.8,178.1 382.3,178.3 423.8,167.0 465.4,170.3 506.9,171.9 548.5,172.9 590.0,181.1" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,122.1 91.5,124.8 133.1,156.9 174.6,121.0 216.2,133.7 257.7,143.0 299.2,111.5 340.8,128.3 382.3,136.4 423.8,141.4 465.4,169.8 506.9,171.4 548.5,180.1 590.0,192.2" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,171.2 91.5,159.3 133.1,133.3 174.6,121.1 216.2,101.7 257.7,109.8 299.2,116.5 340.8,111.0 382.3,87.3 423.8,79.8 465.4,86.3 506.9,91.4 548.5,93.9 590.0,93.7" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,127.2 91.5,88.2 133.1,114.7 174.6,112.2 216.2,109.0 257.7,146.1 299.2,144.5 340.8,130.9 382.3,133.1 423.8,143.7 465.4,148.0 506.9,162.2 548.5,153.9 590.0,152.1" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,163.5 91.5,141.9 133.1,124.8 174.6,105.3 216.2,110.5 257.7,140.8 299.2,148.2 340.8,124.8 382.3,124.8 423.8,120.8 465.4,115.0 506.9,111.2 548.5,107.6 590.0,104.8" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,109.0 91.5,131.9 133.1,134.8 174.6,122.3 216.2,142.5 257.7,170.9 299.2,168.6 340.8,140.4 382.3,118.2 423.8,124.8 465.4,123.3 506.9,119.1 548.5,111.8 590.0,111.0" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,96.3 91.5,131.6 133.1,101.0 174.6,88.2 216.2,97.4 257.7,115.8 299.2,147.9 340.8,163.0 382.3,170.9 423.8,152.2 465.4,140.5 506.9,126.9 548.5,138.5 590.0,141.9" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,186.1 91.5,175.6 133.1,163.4 174.6,169.8 216.2,159.2 257.7,157.1 299.2,144.5 340.8,134.4 382.3,136.4 423.8,132.6 465.4,145.0 506.9,134.1 548.5,130.3 590.0,142.0" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,132.1 91.5,111.2 133.1,106.2 174.6,99.9 216.2,107.1 257.7,90.8 299.2,95.0 340.8,97.3 382.3,92.4 423.8,110.9 465.4,104.1 506.9,95.0 548.5,97.5 590.0,113.6" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,122.3 91.5,91.6 133.1,86.5 174.6,98.0 216.2,107.3 257.7,105.8 299.2,92.4 340.8,114.4 382.3,124.0 423.8,139.5 465.4,147.6 506.9,158.6 548.5,158.1 590.0,149.0" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,88.3 91.5,88.6 133.1,98.5 174.6,84.3 216.2,81.7 257.7,84.0 299.2,87.8 340.8,104.5 382.3,90.6 423.8,80.5 465.4,79.7 506.9,93.1 548.5,108.9 590.0,112.1" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,132.4 91.5,163.8 133.1,142.2 174.6,128.5 216.2,142.7 257.7,138.0 299.2,138.8 340.8,155.6 382.3,152.9 423.8,157.0 465.4,142.0 506.9,162.1 548.5,159.9 590.0,161.9" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,165.8 91.5,124.8 133.1,123.3 174.6,105.0 216.2,112.6 257.7,87.3 299.2,97.6 340.8,100.2 382.3,111.5 423.8,122.4 465.4,92.6 506.9,108.2 548.5,106.1 590.0,98.8" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,70.5 91.5,138.8 133.1,121.9 174.6,126.0 216.2,100.1 257.7,108.3 299.2,99.1 340.8,107.0 382.3,112.2 423.8,111.3 465.4,124.0 506.9,121.2 548.5,130.3 590.0,144.1" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,127.3 91.5,126.6 133.1,110.5 174.6,81.3 216.2,90.2 257.7,91.1 299.2,90.3 340.8,95.1 382.3,102.4 423.8,109.1 465.4,100.2 506.9,104.8 548.5,102.2 590.0,108.9" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,177.8 91.5,154.3 133.1,153.6 174.6,139.2 216.2,143.3 257.7,117.5 299.2,122.9 340.8,109.5 382.3,102.0 423.8,100.1 465.4,99.0 506.9,97.9 548.5,82.9 590.0,76.6" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,152.8 91.5,144.1 133.1,146.5 174.6,147.1 216.2,119.2 257.7,131.9 299.2,129.5 340.8,118.6 382.3,117.3 423.8,121.6 465.4,108.9 506.9,82.2 548.5,92.9 590.0,90.7" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,140.2 91.5,115.6 133.1,88.0 174.6,118.4 216.2,153.1 257.7,147.5 299.2,134.4 340.8,131.1 382.3,116.3 423.8,129.6 465.4,120.2 506.9,108.7 548.5,97.6 590.0,97.3" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,162.3 91.5,184.9 133.1,187.3 174.6,150.0 216.2,165.5 257.7,176.1 299.2,170.7 340.8,169.4 382.3,181.1 423.8,161.8 465.4,159.3 506.9,158.7 548.5,156.7 590.0,152.4" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,107.8 91.5,123.0 133.1,137.5 174.6,127.2 216.2,107.2 257.7,82.5 299.2,55.0 340.8,62.0 382.3,61.7 423.8,69.5 465.4,71.9 506.9,65.6 548.5,80.3 590.0,63.9" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,127.4 91.5,83.2 133.1,119.0 174.6,107.2 216.2,87.8 257.7,88.6 299.2,88.6 340.8,107.1 382.3,99.8 423.8,100.2 465.4,100.6 506.9,91.7 548.5,99.2 590.0,92.0" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,163.5 91.5,123.0 133.1,135.2 174.6,90.3 216.2,90.7 257.7,117.6 299.2,138.9 340.8,126.5 382.3,144.6 423.8,144.3 465.4,134.5 506.9,120.5 548.5,104.2 590.0,108.3" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,144.9 91.5,114.3 133.1,102.3 174.6,116.2 216.2,91.9 257.7,102.4 299.2,94.7 340.8,77.5 382.3,88.5 423.8,86.4 465.4,106.9 506.9,106.9 548.5,84.3 590.0,101.7" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,122.3 91.5,147.6 133.1,149.3 174.6,175.5 216.2,177.3 257.7,164.8 299.2,188.4 340.8,181.4 382.3,159.7 423.8,148.4 465.4,157.8 506.9,144.9 548.5,124.8 590.0,145.5" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,73.9 91.5,89.6 133.1,106.2 174.6,97.4 216.2,119.2 257.7,134.9 299.2,127.6 340.8,109.0 382.3,124.8 423.8,120.0 465.4,118.8 506.9,121.9 548.5,114.3 590.0,115.4" style="fill:none;stroke:var(--muted);stroke-width:0.8;opacity:0.45"/>
  <polyline points="50.0,160.8 91.5,128.2 133.1,151.6 174.6,164.1 216.2,171.9 257.7,186.0 299.2,192.9 340.8,205.8 382.3,194.6 423.8,176.0 465.4,182.7 506.9,195.7 548.5,195.8 590.0,201.9" style="fill:none;stroke:var(--accent);stroke-width:1.1;opacity:0.75"/>
  <polyline points="50.0,136.7 91.5,114.5 133.1,169.2 174.6,153.4 216.2,161.7 257.7,194.9 299.2,213.7 340.8,206.9 382.3,199.8 423.8,203.3 465.4,179.3 506.9,194.3 548.5,209.5 590.0,195.0" style="fill:none;stroke:var(--accent);stroke-width:1.1;opacity:0.75"/>
  <polyline points="50.0,139.3 91.5,196.0 133.1,197.7 174.6,205.4 216.2,186.4 257.7,178.8 299.2,193.9 340.8,205.8 382.3,177.0 423.8,177.6 465.4,175.8 506.9,184.2 548.5,184.8 590.0,176.0" style="fill:none;stroke:var(--accent);stroke-width:1.1;opacity:0.75"/>
  <polyline points="50.0,124.8 91.5,126.5 133.1,159.8 174.6,165.0 216.2,150.8 257.7,155.4 299.2,177.2 340.8,192.3 382.3,212.1 423.8,220.5 465.4,233.8 506.9,258.7 548.5,256.8 590.0,258.7" style="fill:none;stroke:var(--accent);stroke-width:1.1;opacity:0.75"/>
  <polyline points="50.0,69.0 91.5,119.6 133.1,124.8 174.6,126.0 216.2,150.0 257.7,170.5 299.2,146.9 340.8,170.7 382.3,186.7 423.8,200.1 465.4,179.5 506.9,185.2 548.5,187.1 590.0,185.6" style="fill:none;stroke:var(--accent);stroke-width:1.1;opacity:0.75"/>
  <polyline points="50.0,148.0 91.5,181.5 133.1,184.6 174.6,196.0 216.2,214.7 257.7,202.4 299.2,195.3 340.8,174.3 382.3,194.2 423.8,184.6 465.4,187.3 506.9,194.0 548.5,179.2 590.0,179.4" style="fill:none;stroke:var(--accent);stroke-width:1.1;opacity:0.75"/>
  <polyline points="50.0,195.6 91.5,190.7 133.1,159.9 174.6,194.1 216.2,166.2 257.7,168.6 299.2,204.9 340.8,179.1 382.3,181.9 423.8,178.9 465.4,175.5 506.9,182.1 548.5,184.7 590.0,168.4" style="fill:none;stroke:var(--accent);stroke-width:1.1;opacity:0.75"/>
  <polyline points="50.0,111.4 91.5,137.6 133.1,191.7 174.6,221.0 216.2,225.4 257.7,236.4 299.2,252.3 340.8,227.2 382.3,224.5 423.8,205.4 465.4,202.2 506.9,193.5 548.5,203.2 590.0,211.5" style="fill:none;stroke:var(--accent);stroke-width:1.1;opacity:0.75"/>
  <polyline points="50.0,169.8 91.5,183.3 133.1,194.5 174.6,192.2 216.2,194.2 257.7,186.9 299.2,189.8 340.8,213.6 382.3,211.3 423.8,234.9 465.4,213.1 506.9,213.0 548.5,192.2 590.0,183.9" style="fill:none;stroke:var(--accent);stroke-width:1.1;opacity:0.75"/>
  <polyline points="50.0,215.5 91.5,196.9 133.1,170.5 174.6,164.5 216.2,152.6 257.7,169.3 299.2,157.6 340.8,123.9 382.3,127.3 423.8,142.1 465.4,135.3 506.9,132.7 548.5,140.7 590.0,131.4" style="fill:none;stroke:var(--ink);stroke-width:2.4"/>
  <circle cx="340.8" cy="205.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="299.2" cy="213.7" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="91.5" cy="196.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="382.3" cy="212.1" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="423.8" cy="200.1" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="174.6" cy="196.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="299.2" cy="204.9" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="174.6" cy="221.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="50.0" cy="215.5" r="3.2" style="fill:var(--ink);stroke:none"/>
  <circle cx="340.8" cy="213.6" r="3.2" style="fill:var(--accent);stroke:none"/>
  <text x="52.0" y="233.5" text-anchor="start" class="f-mono f-ink" style="font-size:11px">№ 36</text>
  <text x="50.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="91.5" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="133.1" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <text x="174.6" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="216.2" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="257.7" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="299.2" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="340.8" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <text x="382.3" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">9</text>
  <text x="423.8" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <text x="465.4" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <text x="506.9" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <text x="548.5" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <text x="590.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">14</text>
  <text x="604.0" y="288.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">дзень</text>
  <text x="10.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">z, B супраць A</text>
</svg>
<figcaption>Першыя 40 A/A-тэстаў прагону. Кропка стаіць на першым значным дні, тоўстая лінія гэта эксперымент 36. Розніцы паміж A і B няма ні ў адным.</figcaption>
</figure>

10 з першых 40 былі значныя хаця б у адзін з вечароў, а на 14-ы дзень значныя 3 з іх, хоць чакаць трэба было 2. Усе 10 пайшлі ўніз. Я западозрыў пераблытаны знак у кодзе, бо 10 з 10 у адзін бок бывае ў адным выпадку з 512. Заўважыў я гэта, ужо паглядзеўшы на малюнак, так што і гэтыя 512 часткова падглядванне. Вялікі прагон кажа, што знак правільны. На 400 000 эксперыментаў B памылкова выйграе ў 10,98% выпадкаў і памылкова прайграе ў 11,02%, проста такімі былі першыя 40.

Памылковы вынік прыходзіць рана. 22,7% усіх памылковых з'яўляюцца ў першы дзень, 48,6% у першыя 3 дні. Раннія да таго ж выглядаюць самавіта. Медыянная розніца, якую тэст паказвае ў першы дзень, 30%, а ў чатырнаццаты 7%. На малой выбарцы невялікая розніца значнай стаць не можа, таму значнай аказваецца вялікая. Потым яна знікае. Першая серыя значнасці, калі яна пачалася да 14-га дня, у 53% выпадкаў доўжыцца адзін дзень. З эксперыментаў, якія хоць раз перайшлі парог, на 14-ы дзень значныя толькі 22,8%.

<figure class="fig">
<svg viewBox="0 0 680 266" role="img" aria-label="Слупкі: доля ўсіх памылковых вынікаў штодзённага правіла па дні першага значнага p. 1: 22,7%; 2: 15,1%; 3: 10,8%; 4: 8,7%; 5: 7,1%; 6: 5,9%; 7: 5,2%; 8: 4,5%; 9: 4,2%; 10: 3,7%; 11: 3,3%; 12: 3,2%; 13: 2,9%; 14: 2,6%. Над слупком медыяна розніцы паміж групамі, якую тэст паказвае ў гэты дзень, ад 30% у першы дзень да 7% у чатырнаццаты.">
  <line x1="50" y1="220.0" x2="660" y2="220.0" class="f-plain"/>
  <text x="42.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="45" y1="184.8" x2="50" y2="184.8" class="f-plain"/>
  <text x="42.0" y="188.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">5</text>
  <line x1="45" y1="149.6" x2="50" y2="149.6" class="f-plain"/>
  <text x="42.0" y="153.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="45" y1="114.4" x2="50" y2="114.4" class="f-plain"/>
  <text x="42.0" y="118.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">15</text>
  <line x1="45" y1="79.2" x2="50" y2="79.2" class="f-plain"/>
  <text x="42.0" y="83.2" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="45" y1="44.0" x2="50" y2="44.0" class="f-plain"/>
  <text x="42.0" y="48.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25</text>
  <rect x="56.0" y="60.5" width="31.6" height="159.5" style="fill:var(--accent);stroke:none"/>
  <text x="71.8" y="54.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">30%</text>
  <text x="71.8" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="99.6" y="113.8" width="31.6" height="106.2" style="fill:var(--accent);stroke:none"/>
  <text x="115.4" y="107.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">21%</text>
  <text x="115.4" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <rect x="143.1" y="143.6" width="31.6" height="76.4" style="fill:var(--accent);stroke:none"/>
  <text x="158.9" y="137.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">17%</text>
  <text x="158.9" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <rect x="186.7" y="159.1" width="31.6" height="60.9" style="fill:var(--accent);stroke:none"/>
  <text x="202.5" y="153.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">14%</text>
  <text x="202.5" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <rect x="230.3" y="169.7" width="31.6" height="50.3" style="fill:var(--accent);stroke:none"/>
  <text x="246.1" y="163.7" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">13%</text>
  <text x="246.1" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="273.9" y="178.8" width="31.6" height="41.2" style="fill:var(--accent);stroke:none"/>
  <text x="289.6" y="172.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">11%</text>
  <text x="289.6" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <rect x="317.4" y="183.2" width="31.6" height="36.8" style="fill:var(--accent);stroke:none"/>
  <text x="333.2" y="177.2" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">10%</text>
  <text x="333.2" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <rect x="361.0" y="188.2" width="31.6" height="31.8" style="fill:var(--accent);stroke:none"/>
  <text x="376.8" y="182.2" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">10%</text>
  <text x="376.8" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <rect x="404.6" y="190.4" width="31.6" height="29.6" style="fill:var(--accent);stroke:none"/>
  <text x="420.4" y="184.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">9%</text>
  <text x="420.4" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">9</text>
  <rect x="448.1" y="193.7" width="31.6" height="26.3" style="fill:var(--accent);stroke:none"/>
  <text x="463.9" y="187.7" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">9%</text>
  <text x="463.9" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <rect x="491.7" y="196.6" width="31.6" height="23.4" style="fill:var(--accent);stroke:none"/>
  <text x="507.5" y="190.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">8%</text>
  <text x="507.5" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <rect x="535.3" y="197.4" width="31.6" height="22.6" style="fill:var(--accent);stroke:none"/>
  <text x="551.1" y="191.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">8%</text>
  <text x="551.1" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <rect x="578.9" y="199.6" width="31.6" height="20.4" style="fill:var(--accent);stroke:none"/>
  <text x="594.6" y="193.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">8%</text>
  <text x="594.6" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <rect x="622.4" y="201.4" width="31.6" height="18.6" style="fill:var(--accent);stroke:none"/>
  <text x="638.2" y="195.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">7%</text>
  <text x="638.2" y="237.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">14</text>
  <text x="355.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">дзень</text>
  <text x="10.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">% памылковых вынікаў</text>
  <text x="660.0" y="20.0" text-anchor="end" class="f-label f-ink" style="font-size:10px">над слупком: медыяна розніцы</text>
</svg>
<figcaption>У які дзень з'яўляецца памылковы вынік, % ад усіх памылковых. Лік над слупком гэта медыяна розніцы B і A у гэты дзень без уліку знака.</figcaption>
</figure>

Таму лішні дзень і падобны да праверкі. Амаль палову памылковых вынікаў ён сапраўды прыбірае, але астатнія праз яго праходзяць.

## Хатнія правілы супраць кніжных

| правіла | памылковых у A/A | знайшлі B пры +10% | дзён у сярэднім | паказаны рост, медыяна |
|---|---|---|---|---|
| адна праверка на 14-ы дзень | 5,0% | 80,3% | 14,0 | 10,9% |
| стоп пры першым p < 0,05 | 22,0% | 87,3% | 6,6 | 13,9% |
| 2 дні запар | 12,1% | 81,5% | 8,3 | 13,1% |
| 3 дні запар | 7,8% | 75,9% | 9,4 | 12,9% |
| кожны дзень, але не раней за 7-ы | 12,3% | 85,9% | 9,1 | 11,3% |
| кожны дзень, p < 0,01 | 5,5% | 68,7% | 9,4 | 14,3% |
| Покак, 14 праверак | 5,0% | 67,2% | 9,6 | 14,3% |
| О'Браен і Флемінг, 14 праверак | 5,0% | 78,6% | 10,6 | 12,0% |
| яшчэ тыдзень, да 3 разоў | 11,3% | 99,5% | 15,9 | 10,1% |

Апошнія 3 слупкі датычаць эксперыментаў, дзе B сапраўды лепшая на 10%. Цэлы тыдзень цярпення дае 12,3%, практычна столькі ж, колькі адзін лішні дзень. З другога радка відаць і тое, навошта так робяць. Сапраўдны эфект такое правіла знаходзіць часцей за сумленны тэст і спраўляецца за 6,6 дня замест 14. Але рост яно паказвае 13,9%, а насамрэч ён 10%.

Правіла "яшчэ тыдзень" я раней бараніў бы. Дачакаліся 14-га дня, значнасці няма, дадалі тыдзень і паглядзелі зноў. Да тэрміну ніхто не падглядвае. Адзін дададзены тыдзень дае 7,7% памылковых вынікаў, да 3 тыдняў ужо 11,3%. 99,5% у гэтым радку проста купленыя трафікам. Нават калі дадаваць тыдзень толькі пры p паміж 0,05 і 0,1, атрымліваецца 6,0%.

З парогаў з папраўкай Покак патрабуе p < 0,0089 кожны вечар і губляе 13 пунктаў магутнасці. Простае правіла p < 0,01 трапляе амаль туды ж. Гэта супадае з заўвагай Мілера, што пасля 10 падглядванняў 1% азначае 5%. Сам я ўзяў бы О'Браена і Флемінга. На 5-ы дзень трэба p < 0,0004, на 14-ы p < 0,035, гэта значыць, спыніцца рана амаль нельга. Магутнасць 78,6% супраць 80,3%, а калі B сапраўды лепшая, тэст у сярэднім займае 10,6 дня. Плаціць даводзіцца тым, што ўвесь расклад праверак прызначаюць загадзя.

## Больш праверак, больш трафіку

<figure class="fig">
<svg viewBox="0 0 680 276" role="img" aria-label="Доля памылковых вынікаў у залежнасці ад колькасці праверак праз роўныя прамежкі з парогам p &lt; 0,05, паводле інтэгравання. 1: 5,0%; 2: 8,3%; 3: 10,7%; 5: 14,2%; 10: 19,3%; 14: 22,0%; 20: 24,8%; 50: 32,0%; 100: 37,4%; 336: 46,0%; 1000: 53,0%.">
  <line x1="50" y1="230.0" x2="640" y2="230.0" class="f-plain"/>
  <text x="42.0" y="234.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50" y1="197.3" x2="640" y2="197.3" class="f-plain"/>
  <text x="42.0" y="201.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="50" y1="164.7" x2="640" y2="164.7" class="f-plain"/>
  <text x="42.0" y="168.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="50" y1="132.0" x2="640" y2="132.0" class="f-plain"/>
  <text x="42.0" y="136.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">30</text>
  <line x1="50" y1="99.3" x2="640" y2="99.3" class="f-plain"/>
  <text x="42.0" y="103.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="50" y1="66.7" x2="640" y2="66.7" class="f-plain"/>
  <text x="42.0" y="70.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="50" y1="34.0" x2="640" y2="34.0" class="f-plain"/>
  <text x="42.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <polyline points="50.0,213.7 109.2,202.8 143.8,195.0 187.5,183.7 246.7,166.8 275.4,158.2 305.9,149.0 384.1,125.3 443.3,108.0 546.8,79.7 640.0,56.9" style="fill:none;stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="50.0" cy="213.7" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="109.2" cy="202.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="143.8" cy="195.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="187.5" cy="183.7" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="246.7" cy="166.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="275.4" cy="158.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="305.9" cy="149.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="384.1" cy="125.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="443.3" cy="108.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="546.8" cy="79.7" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="640.0" cy="56.9" r="3.2" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="246.7" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <text x="443.3" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="640.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <text x="58.0" y="191.7" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1: 5,0%</text>
  <text x="283.4" y="184.2" text-anchor="start" class="f-mono f-ink" style="font-size:11px">14 разоў, штодня: 22,0%</text>
  <text x="536.8" y="56.7" text-anchor="end" class="f-mono f-ink" style="font-size:11px">336 разоў, штогадзіны: 46,0%</text>
  <text x="345.0" y="266.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">праверак, лагарыфмічная шкала</text>
  <text x="10.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">памылковых вынікаў, %</text>
</svg>
<figcaption>Верагоднасць хаця б аднаго памылковага выніку ў A/A-тэсце ў залежнасці ад колькасці праверак, ад 1 да 1000. Кропкі атрыманы інтэграваннем, сімуляцыя адрозніваецца ад кожнай не больш чым на 1,2 стандартнай памылкі.</figcaption>
</figure>

Тыя ж 14 дзён з графікам, які абнаўляецца раз на гадзіну, гэта 336 праверак і 46,0%. 1000 праверак даюць 53,0%, на гэтым маё інтэграванне сканчаецца. Паводле тэорыі доля ўрэшце даходзіць да 100%, толькі павольна.

Больш наведвальнікаў не дапамагае. Што 100 у дзень на групу, што 10 000, выходзіць каля 22%. Пры 10 атрымліваецца 15,8%. У першы дзень на групу прыпадае паўзаказа, z-тэст амаль ніколі не спрацоўвае і я спісаў усё на гэтую адну пустую праверку. Але нармальнае блуканне без першай праверкі дае 19,4%. Па днях тэст спрацоўвае ў 0,1% эксперыментаў у першы дзень, у 1,2% у другі, у 2,8% у трэці, далей ад 4 да 5%. Без першых 3 праверак блуканне дае 15,9%, гэта значыць, пустых дзён 3.

## 26,1% у Мілера

У Мілера ёсць лік для манеты: канверсія 50%, праверка пасля кожнага назірання, 150 назіранняў, 26,1% памылковых вынікаў. Яго можна палічыць без выпадковасці, перабраўшы шляхі манеты ў цэлых ліках. Звычайны z-тэст даў 39,4%. На 4-м назіранні ў 4 аднолькавых вынікаў z = 2,00, тэст ужо спыняецца, такое бывае ў 12,5% выпадкаў. Калі пачынаць праверкі з 30-га назірання, выходзіць 24,2%. З папраўкай на непарыўнасць і праверкамі з самага пачатку 25,5%. Дакладны бінаміяльны тэст даў 26,1%. Ці так лічыў ён сам, я не ведаю, але і ўсе 5 парогаў з яго табліцы падглядванняў супалі з маімі, калі апошнюю праверку падглядваннем не лічыць. Я думаў, што выбар тэста тут дробязь, але паміж z-тэстам і яго лікам 13 пунктаў.

## Чаго я не правяраў

Усё гэта сімуляцыя. У сапраўдным трафіку ёсць выхадныя і людзі, якія вяртаюцца, а канверсія кожны дзень розная. Я ўзяў адзін памер эфекту і адзін план, 14 праверак. Баесаўскіх правілаў і метаду Джахары з сааўтарамі тут няма. Хатнія правілы ўзятыя з галавы, даных пра тое, як часта імі карыстаюцца, у мяне няма.
