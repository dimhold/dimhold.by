---
title: "Почти половина скачиваний самых популярных пакетов npm приходится на пакеты с одним мейнтейнером. Я посмотрел, кто им платит"
description: "Я взял 4362 пакета npm с миллионом скачиваний в неделю на конец 2022 года и посчитал, кто может их публиковать, кто просит денег и сколько денег видно публично. 47% скачиваний дают пакеты с 1 мейнтейнером, денег просят 19% пакетов, а мой список слов нашёл только 13 README, где говорится о людях. Open Collective показывает 1,65 миллиона долларов за 2022 год, 16 на миллион скачиваний. 53% из них ушли 5 коллективам."
date: 2022-12-28
lang: ru
translationKey: free-package-economics
tags: ["dependencies", "open-data", "statistics"]
---
В январе автор colors и faker сломал оба пакета намеренно. faker 6.6.6 вышел без кода, а colors начал бесконечно печатать "LIBERTY LIBERTY LIBERTY". Это задело всех, у кого установка подтянула новую версию. Ещё в ноябре 2020 года он написал на GitHub, что бесплатной работы от него больше не будет. В тредах, которые я прочитал, спорили в основном о том, имел ли он на это право. У меня был другой вопрос и ответа на него не было. Кто поддерживает пакеты в моей папке node_modules и платит ли им кто-нибудь?

С версии 6.13 в 2019 году npm после установки печатает "N packages are looking for funding". Я всегда пролистывал эту строку. Поэтому решил посчитать, пока год не кончился.

## Что я взял

Список я взял из `npm-high-impact` 1.1.0 от ноября 2022 года. Его автор собрал пакеты, которые подходят под определение high impact из npm. Я взял из него часть с миллионом скачиваний в неделю и больше, это 4366 пакетов. Для каждого взял самую новую стабильную версию, опубликованную до 28 декабря 2022 года. Из этой версии я взял аккаунты npm с правом её публиковать и README из её тарбола. Так что README показывает то, что авторы писали в этом году. Скачивания я брал из API npm за период с 1 января по 27 декабря 2022 года. Для 4 пакетов с именами из 2 букв (yn, pn, rx, is) API отдаёт ноль. Осталось 4362, вместе у них 2,0 триллиона скачиваний.

До первого числа я записал, чего жду. Больше половины скачиваний дают пакеты с 1 или 2 мейнтейнерами. Меньше трети пакетов просят денег. А на Open Collective, где деньги, полученные проектом, видны публично, выходит меньше 1 доллара на миллион скачиваний.

## Кто их держит

У медианного пакета в списке 2 мейнтейнера. Ровно 1 мейнтейнер у 2086 пакетов, это 48% списка. На них приходится 47% всех скачиваний. Пакеты с 1 или 2 мейнтейнерами дают 65% скачиваний, так что первое ожидание подтвердилось.

<figure class="fig">
<svg viewBox="0 0 680 216" role="img" aria-label="4362 пакета npm с миллионом скачиваний в неделю и больше, сгруппированные по числу аккаунтов npm, которые могут публиковать версию, актуальную на 28 декабря 2022 года. 1 мейнтейнер: доля скачиваний 47%, доля пакетов 48%. 2: доля скачиваний 17%, доля пакетов 18%. от 3 до 5: доля скачиваний 25%, доля пакетов 23%. 6 и больше: доля скачиваний 10%, доля пакетов 11%.">
  <text x="16" y="33" class="f-mono f-ink" style="font-size:12px">1 мейнтейнер</text>
  <rect x="150" y="18" width="321.2" height="13" rx="2" class="f-accent"/>
  <text x="477.2" y="29" class="f-mono f-ink" style="font-size:12px">47%</text>
  <rect x="150" y="34" width="328.0" height="13" rx="2" class="f-box"/>
  <text x="484.0" y="45" class="f-mono f-muted" style="font-size:12px">48%</text>
  <text x="16" y="77" class="f-mono f-ink" style="font-size:12px">2</text>
  <rect x="150" y="62" width="116.2" height="13" rx="2" class="f-accent"/>
  <text x="272.2" y="73" class="f-mono f-ink" style="font-size:12px">17%</text>
  <rect x="150" y="78" width="123.0" height="13" rx="2" class="f-box"/>
  <text x="279.0" y="89" class="f-mono f-muted" style="font-size:12px">18%</text>
  <text x="16" y="121" class="f-mono f-ink" style="font-size:12px">от 3 до 5</text>
  <rect x="150" y="106" width="170.8" height="13" rx="2" class="f-accent"/>
  <text x="326.8" y="117" class="f-mono f-ink" style="font-size:12px">25%</text>
  <rect x="150" y="122" width="157.2" height="13" rx="2" class="f-box"/>
  <text x="313.2" y="133" class="f-mono f-muted" style="font-size:12px">23%</text>
  <text x="16" y="165" class="f-mono f-ink" style="font-size:12px">6 и больше</text>
  <rect x="150" y="150" width="68.3" height="13" rx="2" class="f-accent"/>
  <text x="224.3" y="161" class="f-mono f-ink" style="font-size:12px">10%</text>
  <rect x="150" y="166" width="75.2" height="13" rx="2" class="f-box"/>
  <text x="231.2" y="177" class="f-mono f-muted" style="font-size:12px">11%</text>
  <rect x="150" y="195" width="14" height="10" rx="2" class="f-accent"/>
  <text x="170" y="204" class="f-mono f-ink" style="font-size:11px">доля скачиваний</text>
  <rect x="370" y="195" width="14" height="10" rx="2" class="f-box"/>
  <text x="390" y="204" class="f-mono f-ink" style="font-size:11px">доля пакетов</text>
  <line x1="150" y1="8" x2="150" y2="190" class="f-plain"/>
</svg>
<figcaption>Скачивания с 1 января по 27 декабря 2022 года, вместе 2,0 триллиона. Аккаунт не всегда один человек.</figcaption>
</figure>

Потом я считал аккаунты, а не пакеты. Выбирал их жадно: сначала аккаунт, пакеты которого дают больше всего скачиваний, потом тот, который добавляет больше всего новых скачиваний и так далее. Пакет считается покрытым, когда выбран хотя бы один из его мейнтейнеров. 3 аккаунта покрывают четверть всех скачиваний, а 12 аккаунтов хватает на половину. Один аккаунт, sindresorhus, числится мейнтейнером у 274 пакетов с 14% всех скачиваний. На 222 из них он единственный. Среди них `has-flag` и `find-up`.

Аккаунт npm это не человек. 170 пакетов с 1 мейнтейнером принадлежат "types", боту, который публикует DefinitelyTyped. "fb" публикует пакеты React и Jest. Медианному пакету с 1 мейнтейнером 7 лет. 1579 таких пакетов старше 5 лет. Как минимум у 460 из этих старых пакетов в этом году вышла новая версия.

## Что они пишут

У 731 пакета в package.json есть поле funding. Именно его читают `npm fund` и строка после установки. Вместе со ссылками на спонсорство в README выходит 812 пакетов, 19% списка и 26% скачиваний. Второе ожидание подтвердилось. Чаще всего ссылаются на GitHub Sponsors, это 478 пакетов, на Open Collective 302. Ещё 205 README упоминают подписку Tidelift. Tidelift продаёт компаниям подписку, поэтому просьбой о деньгах я её не считал.

Я искал в README слова о людях, которые стоят за кодом: volunteers, free time, spare time, hobby project, not backed by a company. Мой список слов нашёл 13 пакетов из 4362. Когда я прочитал другие README, увидел, что список часть пропускает. ioredis, например, пишет, что открытый код это тяжело и отнимает много времени. Так что их не меньше 13 из 4362. Вот некоторые.

`core-js`, 2,1 миллиарда скачиваний в этом году, один мейнтейнер. Над текстом стоит заголовок "As advertising: the author is looking for a good job", а дальше:

> `core-js` isn't backed by a company, so the future of this project depends on you.

webpack:

> Most of the core team members, webpack contributors and contributors in the ecosystem do this open source work in their free time.

msw, созданный в 2018 году, 61 миллион скачиваний:

> Despite that, this library remains a hobby project maintained in spare time

В том же предложении сказано, что проект не может оплатить даже одному контрибьютору работу на полную ставку.

У `core-js` есть ещё скрипт postinstall, который печатает ту же просьбу в терминал. Я поставил пакет через npm 6.14 и просьба появилась. Через npm 8.19 её не было, потому что npm 7 и новее прячут вывод скриптов установки. Строку про funding напечатали оба.

## Сколько денег видно

Open Collective публикует бухгалтерию каждого коллектива. Я спросил у его API, сколько получил в 2022 году каждый коллектив, на который ссылаются эти пакеты.

Первая сумма вышла почти в 2 миллиона долларов и выглядела слишком хорошо. Потом я увидел в списке airbnb с 200 000 и salesforce с 44 000. Это фонды, которые дают деньги. Их логотипы стоят в списке спонсоров в README eslint, а моя регулярка брала любую ссылку на Open Collective. Я оставил только аккаунты с типом COLLECTIVE и убрал 3 ссылки, которые указывают на чужой проект в примере. После этого вышло 1,65 миллиона долларов на 75 коллективов. На них ссылаются 286 пакетов с 5% всех скачиваний.

Это 16 долларов на миллион скачиваний. Я ждал меньше 1, так что здесь ошибся больше чем в 10 раз.

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="75 коллективов Open Collective, на которые ссылаются 4362 самых скачиваемых пакета npm, по убыванию полученных в 2022 году долларов, вместе 1,65 миллиона. 5 крупнейших: babel 226 287, eslint 182 608, socketio 165 712, webpack 157 850, nest 142 825. Вместе они получили 53% денег. Нижние 38 коллективов вместе получили 23 824 долларов. core-js получил 11 377 долларов, на его коллектив ссылаются 3 пакета с 3,8 миллиарда скачиваний.">
  <line x1="70" y1="220.0" x2="660" y2="220.0" class="f-plain"/>
  <text x="64" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">$0</text>
  <line x1="70" y1="140.8" x2="660" y2="140.8" class="f-plain"/>
  <text x="64" y="144.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">$100 000</text>
  <line x1="70" y1="61.7" x2="660" y2="61.7" class="f-plain"/>
  <text x="64" y="65.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">$200 000</text>
  <text x="660" y="18" text-anchor="end" class="f-mono f-muted" style="font-size:11px">получено долларов в 2022</text>
  <rect x="70.8" y="40.9" width="6.3" height="179.1" class="f-accent"/>
  <rect x="78.7" y="75.4" width="6.3" height="144.6" class="f-accent"/>
  <rect x="86.5" y="88.8" width="6.3" height="131.2" class="f-accent"/>
  <rect x="94.4" y="95.0" width="6.3" height="125.0" class="f-accent"/>
  <rect x="102.3" y="106.9" width="6.3" height="113.1" class="f-accent"/>
  <rect x="110.1" y="148.4" width="6.3" height="71.6" class="f-box"/>
  <rect x="118.0" y="153.4" width="6.3" height="66.6" class="f-box"/>
  <rect x="125.9" y="177.1" width="6.3" height="42.9" class="f-box"/>
  <rect x="133.7" y="180.9" width="6.3" height="39.1" class="f-box"/>
  <rect x="141.6" y="183.7" width="6.3" height="36.3" class="f-box"/>
  <rect x="149.5" y="184.0" width="6.3" height="36.0" class="f-box"/>
  <rect x="157.3" y="188.0" width="6.3" height="32.0" class="f-box"/>
  <rect x="165.2" y="191.8" width="6.3" height="28.2" class="f-box"/>
  <rect x="173.1" y="198.1" width="6.3" height="21.9" class="f-box"/>
  <rect x="180.9" y="202.0" width="6.3" height="18.0" class="f-box"/>
  <rect x="188.8" y="203.5" width="6.3" height="16.5" class="f-box"/>
  <rect x="196.7" y="204.0" width="6.3" height="16.0" class="f-box"/>
  <rect x="204.5" y="204.5" width="6.3" height="15.5" class="f-box"/>
  <rect x="212.4" y="205.2" width="6.3" height="14.8" class="f-box"/>
  <rect x="220.3" y="205.3" width="6.3" height="14.7" class="f-box"/>
  <rect x="228.1" y="205.6" width="6.3" height="14.4" class="f-box"/>
  <rect x="236.0" y="206.1" width="6.3" height="13.9" class="f-box"/>
  <rect x="243.9" y="207.6" width="6.3" height="12.4" class="f-box"/>
  <rect x="251.7" y="209.4" width="6.3" height="10.6" class="f-box"/>
  <rect x="259.6" y="209.6" width="6.3" height="10.4" class="f-box"/>
  <rect x="267.5" y="210.1" width="6.3" height="9.9" class="f-box"/>
  <rect x="275.3" y="211.0" width="6.3" height="9.0" class="f-ink"/>
  <rect x="283.2" y="214.1" width="6.3" height="5.9" class="f-box"/>
  <rect x="291.1" y="214.3" width="6.3" height="5.7" class="f-box"/>
  <rect x="298.9" y="214.3" width="6.3" height="5.7" class="f-box"/>
  <rect x="306.8" y="214.8" width="6.3" height="5.2" class="f-box"/>
  <rect x="314.7" y="216.2" width="6.3" height="3.8" class="f-box"/>
  <rect x="322.5" y="217.0" width="6.3" height="3.0" class="f-box"/>
  <rect x="330.4" y="217.0" width="6.3" height="3.0" class="f-box"/>
  <rect x="338.3" y="217.2" width="6.3" height="2.8" class="f-box"/>
  <rect x="346.1" y="217.3" width="6.3" height="2.7" class="f-box"/>
  <rect x="354.0" y="217.5" width="6.3" height="2.5" class="f-box"/>
  <rect x="361.9" y="218.2" width="6.3" height="1.8" class="f-box"/>
  <rect x="369.7" y="218.2" width="6.3" height="1.8" class="f-box"/>
  <rect x="377.6" y="218.8" width="6.3" height="1.2" class="f-box"/>
  <rect x="385.5" y="218.8" width="6.3" height="1.2" class="f-box"/>
  <rect x="393.3" y="218.9" width="6.3" height="1.1" class="f-box"/>
  <rect x="401.2" y="218.9" width="6.3" height="1.1" class="f-box"/>
  <rect x="409.1" y="219.0" width="6.3" height="1.0" class="f-box"/>
  <rect x="416.9" y="219.0" width="6.3" height="1.0" class="f-box"/>
  <rect x="424.8" y="219.0" width="6.3" height="1.0" class="f-box"/>
  <rect x="432.7" y="219.1" width="6.3" height="0.9" class="f-box"/>
  <rect x="440.5" y="219.1" width="6.3" height="0.9" class="f-box"/>
  <rect x="448.4" y="219.2" width="6.3" height="0.8" class="f-box"/>
  <rect x="456.3" y="219.2" width="6.3" height="0.8" class="f-box"/>
  <rect x="464.1" y="219.3" width="6.3" height="0.7" class="f-box"/>
  <rect x="472.0" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="479.9" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="487.7" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="495.6" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="503.5" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="511.3" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="519.2" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="527.1" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="534.9" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="542.8" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="550.7" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="558.5" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="566.4" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="574.3" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="582.1" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="590.0" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="597.9" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="605.7" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="613.6" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="621.5" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="629.3" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="637.2" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="645.1" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="652.9" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <text x="119.3" y="88.8" class="f-mono f-ink" style="font-size:11px">первые 5: 53% всего</text>
  <text x="119.3" y="103.8" class="f-mono f-muted" style="font-size:11px">babel, eslint, socketio, webpack, nest</text>
  <line x1="278.5" y1="216.0" x2="278.5" y2="172.0" class="f-line"/>
  <text x="278.5" y="168.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">core-js $11 377</text>
  <line x1="361.1" y1="228" x2="660" y2="228" class="f-line"/>
  <line x1="361.1" y1="224" x2="361.1" y2="232" class="f-line"/>
  <line x1="660" y1="224" x2="660" y2="232" class="f-line"/>
  <text x="510.5" y="246" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">нижние 38 вместе: $23 824</text>
</svg>
<figcaption>Только аккаунты типа коллектив. Фонды и компании из списков спонсоров не считаются.</figcaption>
</figure>

5 крупнейших коллективов (babel, eslint, socketio, webpack, nest) получили 53% денег. 38 самых маленьких вместе получили 23 824 доллара за весь год, а 25 коллективов получили меньше 1000 долларов каждый. Коллектив `core-js` получил 11 377 долларов. На него ссылаются 3 пакета, у которых вместе 3,8 миллиарда скачиваний. Это около 3 долларов на миллион.

Пакетов с 1 мейнтейнером на этой картине почти нет. Только 3% их скачиваний приходится на пакеты, которые ссылаются хоть на какой-то коллектив. Денег вообще просят 481 из 2086, из них 386 через GitHub Sponsors. GitHub Sponsors суммы не публикует, поэтому для этих пакетов числа у меня нет.

## Что я не проверял

Деньги от работодателей. Некоторым мейнтейнерам за эту работу платит работодатель. Например, команда npm CLI в GitHub: её аккаунты darcyclarke и nlf тоже есть в списке. npm такие деньги не показывает, а в README упоминаний о них я не искал.

Суммы на GitHub Sponsors и Patreon не публичны, я считал только ссылки. Скачивания включают CI и зеркала, это не люди. Деньги коллектива идут на весь проект. Я делил их только на скачивания пакетов из моего списка, которые на него ссылаются, поэтому доллары на скачивание скорее завышены. MUI в сумму не попал: его README ссылается на адрес, который API не распознал.
