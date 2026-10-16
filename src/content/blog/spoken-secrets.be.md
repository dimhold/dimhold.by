---
title: "Сканер сакрэтаў знайшоў 2 сакрэты ў нататках і ніводнага ў расшыфроўцы Whisper той жа размовы"
description: "Я напісаў выдуманую размову з 11 прыватнымі пунктамі, запісаў яе ў выглядзе нататак і прагнаў вусную версію праз espeak-ng, MBROLA і Whisper base і small. У нататцы gitleaks 8.15.2 знайшоў ключ AWS і пароль. Разам з Presidio 2.2.31 інструменты злавілі 7 з 11 пунктаў. На 4 расшыфроўках сканеры сакрэтаў не знайшлі нічога. Whisper зламаў амаль усё, у чаго ёсць форма. Код ад дзвярэй, код ад банка, хворую спіну і заробак ён захаваў, а іх не адзначыў ніводзін інструмент ні ў адным дакуменце."
date: 2022-12-26
lang: be
translationKey: spoken-secrets
tags: ["machine-learning", "git", "text"]
---
З таго часу як у верасні выйшаў Whisper, я праганяю праз яго запісы сваіх званкоў. Расшыфроўкі збіраюцца ў тэчцы побач з нататкамі. Відавочным месцам для іх быў рэпазіторый git са сканерам сакрэтаў у хуку на каміт, гэтак жа як абараняюць код. Потым я зразумеў, што не маю ўяўлення, што сканер бачыць у расшыфроўцы: я запускаў яго толькі на кодзе.

Таму я гэта вымераў, але без сваіх сапраўдных званкоў. Цягнуць сапраўдныя размовы ў тэст пра іх уцечку мне не хацелася.

## Як я мераў

Я напісаў кароткую размову двух выдуманых людзей, 12 рэплік. У яе я заклаў 11 рэчаў, якія не павінны выйсці з пакоя: ключ доступу AWS, прачытаны па літарах, пароль ад базы на стэйджынгу, код ад дзвярэй офіса, код, які толькі што даслаў банк, тэлефон, email, нумар карткі, IBAN, адрас, хворую спіну калегі і заробак, пра які прасілі маўчаць. Імёнаў у ёй два, Anna і Marek.

Кожная рэпліка ёсць у двух варыянтах. Першы такі, як я набраў бы яе ў нататках падчас званка, напрыклад `DB_PASSWORD=PurpleOtter1987`. Другі такі, як яе вымавілі б: "the staging database password is still purple otter nineteen eighty seven". Вусны варыянт я агучыў `espeak-ng` 1.51 двума наборамі галасоў. Першы гэта звычайныя галасы espeak, другі MBROLA us1 і us2, на мой слых яны гучаць менш механічна. Расшыфроўваў Whisper з рэпазіторыя ў стане на 9 снежня, мадэлі `base` і `small` на CPU, fp32, мова зададзена англійская. Атрымалася 4 расшыфроўкі адной размовы. Кожную рэпліку я сінтэзаваў і расшыфроўваў асобна, таму радок N расшыфроўкі гэта заўсёды рэпліка N.

Для сакрэтаў я прагнаў па кожным дакуменце сёлетнія версіі: gitleaks 8.15.2, trufflehog 3.21.0 і `detect-secrets` 1.4.0. Для асабістых даных я запусціў Microsoft Presidio 2.2.31 з мадэллю spaCy `en_core_web_lg`. Паўторны прагон Whisper даў тыя ж 2 расшыфроўкі MBROLA літара ў літару. У расшыфроўках espeak змяніліся 3 радкі, бо там Whisper пераходзіў на сэмплаванне: гэтыя 3 радкі дэкадуюцца пры тэмпературы 0,4 і вышэй. Ніводная клетка табліцы ніжэй ад гэтага не змянілася.

## Нататкі

Тут інструменты зрабілі прыкладна тое, чаго я чакаў. gitleaks знайшоў ключ AWS па форме: `AKIA` і яшчэ 16 знакаў. Пароль ён знайшоў, бо той стаіць пасля `PASSWORD=` і яго энтрапія 3,51 ледзь перавышае парог правіла, 3,5. Так што крыху менш выпадковы пароль прайшоў бы. `detect-secrets` знайшоў толькі ключ. trufflehog не знайшоў нічога. Яго дэтэктару AWS патрэбны ідэнтыфікатар ключа разам з сакрэтам, а сакрэт на 40 знакаў у нататках падчас званка трапляецца рэдка. Presidio знайшоў тэлефон, email, картку, IBAN, горад і абодва імёны. Яшчэ ён вырашыў, што `DE89 3704 0044` гэта чалавек.

Разам 7 з 11 пунктаў злавіў хоць адзін інструмент. Код ад дзвярэй, код ад банка, спіну і заробак не злавіў ніхто. Ні ў аднаго з гэтых 4 інструментаў няма правіла для чатырохзначнага ліку, які хтосьці назваў. Я не вельмі разумею, як такое правіла выглядала б.

## Расшыфроўкі

На 4 расшыфроўках 3 сканеры сакрэтаў разам выдалі 0 знаходак.

Чаму так, відаць па радках. Whisper `small` на галасах MBROLA запісаў ключ як `a KQX7 or HM2 PLT-4WZ6NB`. `AKIA` больш няма, так што рэгулярцы няма за што зачапіцца. Пароль стаў "purple under 1987", пасля слова password няма `=`, таму агульнае правіла не спрацоўвае. Картка стала `for 1111 1111 1111 1111 1111`: першае "four" ператварылася ў прыназоўнік і з'явілася пятая група. Presidio правярае нумары картак алгарытмам Луна. Лічбы, што засталіся, праверку не праходзяць. Email стаў "hurrymail is in the dot calzcatexample.com". Marek стаў "Merck" на галасах MBROLA і "America's" на espeak. Presidio палічыў America геаграфічнай назвай. Anna ацалела адзін раз, унутры зламанага радка з email: espeak з `small` запісаў "Anna.Kaul's cat example.com". Толькі ў гэтай расшыфроўцы Presidio яе і знайшоў. У астатніх яна ператварылася ў "and", "in a" ці знікла зусім. У расшыфроўцы MBROLA `small` Presidio замест яе знайшоў чалавека на імя "hurrymail".

Я даволі доўга чытаў гэтыя радкі, перш чым убачыў заканамернасць. Я чакаў, што на расшыфроўках інструментам будзе цяжэй. Так і выйшла, але губляецца не абы-што.

<figure class="fig">
<svg viewBox="0 0 640 350" role="img" aria-label="Сетка: 11 прыватных пунктаў супраць 5 дакументаў (набраныя нататкі і 4 расшыфроўкі Whisper). У нататцы чытаюцца ўсе 11 значэнняў, інструменты заўважаюць 7. У расшыфроўках чытаюцца ад 4 да 5 значэнняў, заўважана ад 1 да 2. Код ад дзвярэй, код ад банка, спіна і заробак чытаюцца ва ўсіх 5 дакументах і не заўважаны ні ў адным.">
  <text x="211" y="18" text-anchor="middle" class="f-label f-muted">нататкі</text>
  <text x="211" y="32" text-anchor="middle" class="f-label f-muted">набраныя</text>
  <text x="297" y="18" text-anchor="middle" class="f-label f-muted">espeak</text>
  <text x="297" y="32" text-anchor="middle" class="f-label f-muted">base</text>
  <text x="383" y="18" text-anchor="middle" class="f-label f-muted">espeak</text>
  <text x="383" y="32" text-anchor="middle" class="f-label f-muted">small</text>
  <text x="469" y="18" text-anchor="middle" class="f-label f-muted">MBROLA</text>
  <text x="469" y="32" text-anchor="middle" class="f-label f-muted">base</text>
  <text x="555" y="18" text-anchor="middle" class="f-label f-muted">MBROLA</text>
  <text x="555" y="32" text-anchor="middle" class="f-label f-muted">small</text>
  <text x="12" y="46" class="f-label f-accent">сакрэты</text>
  <text x="12" y="66" class="f-mono f-ink" style="font-size:12px">ключ AWS</text>
  <rect x="200" y="54" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="62" r="4" class="f-accent"/>
  <rect x="286" y="54" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="54" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="54" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="54" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="88" class="f-mono f-ink" style="font-size:12px">пароль базы</text>
  <rect x="200" y="76" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="84" r="4" class="f-accent"/>
  <rect x="286" y="76" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="76" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="76" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="76" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="110" class="f-mono f-ink" style="font-size:12px">код ад дзвярэй</text>
  <rect x="200" y="98" width="22" height="16" rx="2" class="f-box"/>
  <rect x="286" y="98" width="22" height="16" rx="2" class="f-box"/>
  <rect x="372" y="98" width="22" height="16" rx="2" class="f-box"/>
  <rect x="458" y="98" width="22" height="16" rx="2" class="f-box"/>
  <rect x="544" y="98" width="22" height="16" rx="2" class="f-box"/>
  <text x="12" y="132" class="f-mono f-ink" style="font-size:12px">код ад банка</text>
  <rect x="200" y="120" width="22" height="16" rx="2" class="f-box"/>
  <rect x="286" y="120" width="22" height="16" rx="2" class="f-box"/>
  <rect x="372" y="120" width="22" height="16" rx="2" class="f-box"/>
  <rect x="458" y="120" width="22" height="16" rx="2" class="f-box"/>
  <rect x="544" y="120" width="22" height="16" rx="2" class="f-box"/>
  <text x="12" y="148" class="f-label f-accent">асабістае</text>
  <text x="12" y="168" class="f-mono f-ink" style="font-size:12px">тэлефон</text>
  <rect x="200" y="156" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="164" r="4" class="f-accent"/>
  <rect x="286" y="156" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="156" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="156" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="492" cy="164" r="4" class="f-accent"/>
  <rect x="544" y="156" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="578" cy="164" r="4" class="f-accent"/>
  <text x="12" y="190" class="f-mono f-ink" style="font-size:12px">email</text>
  <rect x="200" y="178" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="186" r="4" class="f-accent"/>
  <rect x="286" y="178" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="178" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="178" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="178" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="212" class="f-mono f-ink" style="font-size:12px">картка</text>
  <rect x="200" y="200" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="208" r="4" class="f-accent"/>
  <rect x="286" y="200" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="200" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="200" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="200" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="234" class="f-mono f-ink" style="font-size:12px">IBAN</text>
  <rect x="200" y="222" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="230" r="4" class="f-accent"/>
  <rect x="286" y="222" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="222" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="222" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="222" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="256" class="f-mono f-ink" style="font-size:12px">адрас</text>
  <rect x="200" y="244" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="252" r="4" class="f-accent"/>
  <rect x="286" y="244" width="22" height="16" rx="2" class="f-plain"/>
  <circle cx="320" cy="252" r="4" class="f-accent"/>
  <rect x="372" y="244" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="406" cy="252" r="4" class="f-accent"/>
  <rect x="458" y="244" width="22" height="16" rx="2" class="f-plain"/>
  <circle cx="492" cy="252" r="4" class="f-accent"/>
  <rect x="544" y="244" width="22" height="16" rx="2" class="f-plain"/>
  <circle cx="578" cy="252" r="4" class="f-accent"/>
  <text x="12" y="278" class="f-mono f-ink" style="font-size:12px">спіна калегі</text>
  <rect x="200" y="266" width="22" height="16" rx="2" class="f-box"/>
  <rect x="286" y="266" width="22" height="16" rx="2" class="f-box"/>
  <rect x="372" y="266" width="22" height="16" rx="2" class="f-box"/>
  <rect x="458" y="266" width="22" height="16" rx="2" class="f-box"/>
  <rect x="544" y="266" width="22" height="16" rx="2" class="f-box"/>
  <text x="12" y="300" class="f-mono f-ink" style="font-size:12px">заробак</text>
  <rect x="200" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="286" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="372" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="458" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="544" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="200" y="324" width="22" height="14" rx="2" class="f-box"/><text x="230" y="335" class="f-label f-muted">значэнне чытаецца</text>
  <circle cx="420" cy="331" r="4" class="f-accent"/><text x="432" y="335" class="f-label f-muted">інструмент заўважыў</text>
</svg>
<figcaption>Whisper захоўвае кароткія лікі і простыя словы і ламае тое, у чаго ёсць форма. Адрас лічыцца заўважаным, калі Presidio знайшоў горад.</figcaption>
</figure>

Whisper зламаў большую частку таго, што інструменты ўмеюць шукаць, бо ў такіх пунктаў ёсць форма: прэфікс, кантрольная сума, `@`. Тэлефон таксама ацалеў, але толькі на галасах MBROLA. Ва ўсіх расшыфроўках ацалелі код ад дзвярэй, код ад банка, спіна і заробак, гэта значыць якраз тое, чаго ніводзін інструмент не злавіў ні ў адным дакуменце. Гэта кароткія лікі і простыя словы. Whisper захоўвае лікі і сэнс, нават калі скажае словы вакол. У 1 расшыфроўцы радок пра дзверы стаў "The office norco is 4815". У расшыфроўках MBROLA чытэльнымі засталіся 5 з 11 пунктаў. Presidio адзначыў 1 з гэтых 5, тэлефон, з ацэнкай 0,4. Яшчэ ён адзначыў Springfield з адраса, які ператварыўся ў "14 ohms street".

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="3 пункты з размовы. Ключ AWS, прачытаны па літарах, выходзіць як a KQX7 or HM2 PLT-4WZ6NB, а правіла чакае AKIA і яшчэ 16 знакаў, супадзення няма. Нумар карткі выходзіць як for 1111 1111 1111 1111 1111, гэта не 16 лічбаў з праверкай Луна, супадзення няма. Код ад дзвярэй выходзіць як 4815, чытаецца без памылкі. Правіла для яго няма.">
  <text x="12" y="18" class="f-label f-muted">сказана</text>
  <text x="212" y="18" class="f-label f-muted">Whisper small, MBROLA</text>
  <text x="444" y="18" class="f-label f-muted">што трэба інструменту</text>
  <rect x="12" y="30" width="184" height="30" rx="3" class="f-plain"/>
  <text x="20" y="49" class="f-mono f-muted" style="font-size:11px">A K I A Q X 7 R H M ...</text>
  <line x1="196" y1="45" x2="208" y2="45" class="f-line"/>
  <rect x="212" y="30" width="216" height="30" rx="3" class="f-box"/>
  <text x="220" y="49" class="f-mono f-ink" style="font-size:11px">a KQX7 or HM2 PLT-4WZ6NB</text>
  <line x1="428" y1="45" x2="440" y2="45" class="f-line"/>
  <rect x="444" y="30" width="184" height="30" rx="3" class="f-plain"/>
  <text x="452" y="49" class="f-mono f-ink" style="font-size:11px">AKIA і яшчэ 16 знакаў</text>
  <text x="452" y="76" class="f-mono f-muted" style="font-size:11px">не супала</text>
  <rect x="12" y="92" width="184" height="30" rx="3" class="f-plain"/>
  <text x="20" y="111" class="f-mono f-muted" style="font-size:11px">four one one one, ...</text>
  <line x1="196" y1="107" x2="208" y2="107" class="f-line"/>
  <rect x="212" y="92" width="216" height="30" rx="3" class="f-box"/>
  <text x="220" y="111" class="f-mono f-ink" style="font-size:11px">for 1111 1111 1111 1111 1111</text>
  <line x1="428" y1="107" x2="440" y2="107" class="f-line"/>
  <rect x="444" y="92" width="184" height="30" rx="3" class="f-plain"/>
  <text x="452" y="111" class="f-mono f-ink" style="font-size:11px">16 лічбаў, праверка Луна</text>
  <text x="452" y="138" class="f-mono f-muted" style="font-size:11px">не супала</text>
  <rect x="12" y="154" width="184" height="30" rx="3" class="f-plain"/>
  <text x="20" y="173" class="f-mono f-muted" style="font-size:11px">four eight one five</text>
  <line x1="196" y1="169" x2="208" y2="169" class="f-line"/>
  <rect x="212" y="154" width="216" height="30" rx="3" class="f-box"/>
  <text x="220" y="173" class="f-mono f-ink" style="font-size:11px">4815</text>
  <line x1="428" y1="169" x2="440" y2="169" class="f-line"/>
  <rect x="444" y="154" width="184" height="30" rx="3" class="f-plain"/>
  <text x="452" y="173" class="f-mono f-ink" style="font-size:11px">правіла няма</text>
  <text x="452" y="200" class="f-mono f-accent" style="font-size:11px">чытаецца, не заўважаны</text>
</svg>
<figcaption>Тыя ж 3 рэплікі, галасы MBROLA, Whisper small. Інструменты шукаюць форму, а маўленне яе не захоўвае.</figcaption>
</figure>

Скажоныя пункты па-ранейшаму чытаюцца кожным, хто ведае каманду: "Merck is up until Friday. The doctor says it is his back again."

## Што вяртае `git rm`

Другая палова рашэння даўно вядомая. Я праверыў, як паводзіць сябе `git rm`, у асноўным для таго, каб мець права сказаць, што праверыў. Я закаміціў расшыфроўку, наступным камітам выдаліў яе праз `git rm` і паглядзеў. `git log -S'door'` знаходзіць абодва каміты. Файл чытаецца праз `HEAD~1` пасля `git gc --prune=now`. Свежы клон яго таксама мае, бо каміт, які яго дадаў, па-ранейшаму ў гісторыі. Каб прыбраць файл, трэба перапісаць гісторыю праз `git filter-repo` або BFG і спадзявацца, што ніхто не паспеў скланаваць. Старонка GitHub пра выдаленне канфідэнцыйных даных раіць тыя ж 2 інструменты і папярэджвае пра існыя клоны.

Так што расшыфроўкі не трапляюць ні ў адзін рэпазіторый. Тэчка ляжыць па-за ўсімі рэпазіторыямі. Сканер у хуку на каміт застаецца інструментам для кода.

## Чаго я не правяраў

Гэта 1 выдуманая размова з сінтэтычнымі галасамі. У сапраўдных званках ёсць шум і акцэнты. Людзі перабіваюць адно аднаго. З жывым голасам Whisper, хутчэй за ўсё, лягчэй разбірае імёны. Я не спрабаваў мадэлі `medium` і `large-v2`, якія могуць аднавіць ключ AWS або email. Я не спрабаваў рускую. Presidio працаваў са стандартнымі распазнавальнікамі. Уласны шаблон для кодаў ад дзвярэй злавіў бы частку з іх, але, хутчэй за ўсё, злавіў бы і любы чатырохзначны лік у размове. І я не спрабаваў моўную мадэль у ролі дэтэктара. Яна, магчыма, зразумела б "she asked us not to tell the team", але для гэтага ёй давялося б прачытаць расшыфроўку цалкам.
