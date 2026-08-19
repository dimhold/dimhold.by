# Catalogue of Belarusian games

The standing collection. **Everything goes in — borrowed, pan-Slavic and
Soviet-era games included**, each marked for what it is. The point is coverage
with provenance, not a shortlist; the judgement calls live in `RESEARCH.md`.

🚧 **In progress.** Held so far: the **BNT 1972 index, 178 entries** (bottom of
this file) and the **Horki set, 52 games**. Still to mine: `ethnoby.org`, the
БелЭн article (which reports **400+** Belarusian folk games known), the 1991
Юнацтва book, Раманаў вып. VIII and Шэйн III, and the regional library indexes.

## Columns

- **Марка** — 🟩 uniqueness claim exists · 🟦 strongly localised, no claim ·
  ⬜ pan-Slavic with a Belarusian text · 🟥 imported or Soviet-era ·
  ❓ name attested, rules not recorded
- **Крыніца** — where it was recorded, and the link

---

## Horki regional set

52 games from the Horki central library's «Беларускія народныя гульні» project.
Source for every row: [lib-gorki.mogilev.by](https://lib-gorki.mogilev.by/index.php/gulni-bel/1460-gulni),
archived locally at `sources/lib-gorki-gulni.html`.

| Гульня | Пра што | Марка |
| --- | --- | --- |
| Лянок | The full flax chain interrogated stage by stage: браць → малаціць → рассцілаць → мяць → ткаць → бяліць → кроіць → шыць | ⬜ type shared, **the most complete chain recorded** |
| Браднік | Blindfolded drag-net fisherman; the "fish" call «Глыбока!»/«Мелка!» to steer him, a catch is identified by voice | 🟦 |
| Мяцёлка | Twig besoms and a lump of ice on the ice; everyone sweeps at once toward their own hole | 🟦 |
| Кулькі | Two-man beam-pushing contest ⚠️ **not** a ball game | 🟦 |
| Свінка | Ring of sticks in hollows, a central pit «хлеў», a wooden pig driven at the players | 🟦 localised Магілёўшчына / Міншчына / Віцебшчына |
| Золата | A hidden object must be carried to the leader while others intercept | ⬜ |
| Шуляк | Kite and chicks: a chain behind the leader, dialogue, then the snatch | ⬜ |
| Ліскі | Circle; one calls another, both run opposite ways for the free place | ⬜ in the Horki set and, as **«Ходзіць ліска ля ваконца»**, in the hotlib booklet; **not in BNT 1972** |
| Мароз | Freeze tag; the hotlib booklet has it as **«Замарожаныя»** | ⬜ |
| Журавель | Animal-mimicry game | ⬜ ✅ settled — БелЭн lists it; absent from BNT 1972 |
| Гусі ляцяць | The leader names things; you react only if it flies | ⬜ ✅ **BNT 996** |
| Млын | Circle game, players as the **sails of a windmill** ⚠️ **not** nine men's morris | ⬜ |
| Явар | Passing through a gate of two players, the caught join the gate, ending in tug-of-war | ⬜ |
| Грушка | A child is the pear tree; the ring sings its growth, then closes in | ⬜ |
| Што робіш? | Everyone gets a trade, all swap, then you must name your **original** one | ⬜ excellent work lexicon |
| У мядзведзя на бару | Berry-picking until the bear wakes | ⬜ |
| Жмуркі | Blind man's buff | ⬜ |
| Пацяг | Two chains of linked arms pull against each other | ⬜ |
| Цуркі | The gilli-danda stick game | ⬜ |
| У казіны рог | Teams bat a ball across a line; the loser retreats to where it stopped | 🟦 named for a live Belarusian idiom |
| Купалінка · Яблынка · Сонейка · Вогнішча · Ведзьма · Гарэлыш · Маша · Вожык і мышы · Падсечка · Качка · Кольцы · Вядун · Маялка · Кашка · Рэшата · Куры · Сляпы музыка · Ноч і дзень · Ляскаўкі · Барада · Хапанка · Паляванне на лісаў · Вартаўнік · Сценка · Пеўні · Верабейкі · Падхват · Зачэп · Вілюшкі · Гарачае месца · Метка | Rules on the source page; not yet transcribed | — to be filed |

---

## ЭТНАЎСЁ (ethnoby.org) — field recordings, and the answer to the audio question

A mediateka of Belarusian ethnography: 27,234 locations, 583 themes, 1,770
collectors. It is client-rendered, so it does not answer to a plain fetch — the
theme index has to be read out of the tag cloud, where each theme carries its own
id and record count. Extracted list: `ethnoby-game-themes.json`.

**43 game and rite themes, 2,023 records between them.** The ones that matter:

| Тэма | id | Records |
| --- | --- | --- |
| гульні | 570506699 | 44 |
| **жаніцьба Цярэшкі** | 584152169 | **43** |
| карагоды | 595950751 | 43 |
| **прыпеўкі да «Жаніцьбы Цярэшкі»** | 667845772 | **12** |
| напевы карагодна-гульнявыя | 764488427 | 6 |
| ката пячы гульня | 1402231325 | 2 |
| цягнуць каляду на дуба | 998244123 | 2 |
| масленіца · купалле · валачобнікі · калядоўшчыкі | — | 131 · 52 · 64 · 40 |

Theme pages live at `https://ethnoby.org/temy/<id>`, records at
`https://ethnoby.org/falklor/<id>`. Record index extracted to
`sources/ethnoby-records.json`.

### Яшчар — four field records, with notation

The **гульні** theme holds four Яшчар records, each carrying *тэкст, аўдыё,
ноты* — text, audio **and musical notation** — from **в. Кураполле** and another
Pastavy-district village, **в. Жыцькава** (Барысаўскі раён) and **в. Карабы**
(Ашмянскі раён).

Two of these corroborate the variant analysis in `RESEARCH.md` from the primary
material: the Ашмяны record is the golden-chair form, and the Барысаў one carries
the **«ладу, ладу»** refrain — the accretion that is absent from Pastavy, which
is precisely the argument for the Pastavy variants being the archaic ones.

### Жаніцьба Цярэшкі — the flagship is documented in depth

**18 records in its own theme, 36 under прыпеўкі**, from **Лепельскі, Докшыцкі,
Мёрскі, Полацкі, Ушацкі, Лагойскі** districts — the exact districts Lozka names
as where the ritual is best developed. Most carry audio; several carry notation.

Critically, there are **найгрышы** — instrumental recordings, one specifically
titled as Жаніцьба Цярэшкі from **в. Навасёлкі, Лепельскі раён**, and another
unlocalised. This is the closest thing yet to an answer for the open audio
question in `ROADMAP.md`: **the music exists, is recorded, and is notated.**

⚠️ **Existing is not the same as licensed.** Nothing here says these recordings
may be reused on a website. Before any of it is planned into a build, the terms
have to be established with the mediateka and with the collectors. Notation is
the safer path: a tune transcribed in the field can be **performed afresh** for
us, which sidesteps the rights in a particular recording.

⚠️ The «ката пячы гульня» theme reports 2 records but its page did not yield them
to the same extraction — worth a second look by hand.

---

## Беларуская Энцыклапедыя — the scale of the corpus, and its typology

Article «Беларускія народныя гульні», БелЭн т. 2, с. 466, via
[verbum.by](https://verbum.by/belen/%D0%91%D0%95%D0%9B%D0%90%D0%A0%D0%A3%D0%A1%D0%9A%D0%86%D0%AF%20%D0%9D%D0%90%D0%A0%D0%9E%D0%94%D0%9D%D0%AB%D0%AF%20%D0%93%D0%A3%D0%9B%D0%AC%D0%9D%D0%86).

**«Вядома больш за 400 беларускіх народных гульняў»** — and the article adds that
they have no fixed rules and vary from region to region. That figure sets the
target for this catalogue: at roughly 250 names collected so far, we are past the
halfway mark of what the encyclopedia says exists.

Its typology, which is coarser than Lozka's but independent of it:

| Category | Games it names |
| --- | --- |
| From hunting, by animal mimicry | Крук/шуляк · Мядзведзь · Пастух і воўк · Гусі · Каза · **Журавель** |
| From work processes | Гарох · **Лянок** · Каноплі · Рэдзька · Млын |
| Calendar | spring games · Kalyady games · Kupalle (fire-jumping, rolling in the rye, seeking the fern flower) · harvest rites |
| Wedding | ritual contests within the wedding |
| Children's | Хованкі · Вецер · Лось · Хлеб пячы · Грушка |
| Sport | wrestling forms and strength contests |

**Two things worth recording.**

**«Журавель» is settled.** The encyclopedia lists it among the animal-mimicry
games, which puts it above "modern compilations only". Final standing: attested
by БелЭн and by two modern sets, **absent from BNT 1972**. Real, but the primary
record for it is thin.

**The article makes no comparative claims at all** — nothing about Russian,
Ukrainian, Polish or Lithuanian parallels, in either direction. That is the
pattern throughout: Belarusian reference works describe the corpus without
asserting exclusivity, which is why "unique to Belarus" cannot be sourced from
them. Silence is not a claim.

---

## The hotlib booklet — 14 games

Compiled from Lozka. Modern pedagogical presentation, so treat it as a pointer to
the primary collections rather than as evidence in itself. Archived locally at
`sources/hotlib-belaruskiya-gulni.pdf`; text at `sources/hotlib-extracted.txt`.

Лянок · Кошка і мышка · Агароднік · Лавіць куры · Каляда · Казёл · Мядзведзь ·
Журавель · Прэла-гарэла · Замарожаныя · Заінька · Ходзіць ліска ля ваконца ·
Гарлачык · Фарбы · «Чый круг, каля снапа хутчэй зьбярэцца»

Notes:

- **Журавель** — was ❓ in this catalogue, attested only as a dance and song.
  Now attested as a *game* in two modern compilations (this booklet and the Horki
  set) but **still absent from BNT 1972**. Standing: real in current practice,
  unproven in the primary record.
- **Замарожаныя** — freeze-tag; probably what circulates elsewhere as «Мароз».
- **Лавіць куры** matches **BNT 1005**, **Гарлачык** matches **BNT 1044–1047**,
  **Прэла-гарэла**, **Агароднік** and **Кошка і мышка** are the standard
  pan-Slavic types.

### The booklet's own bibliography — and what it settles

It cites its sources as **Лозка А. Ю. «Гульні, забавы, ігрышчы». — Мінск:
Беларуская навука, 1996. — 534 с.** and the fourth edition of the БНТ series
(склад. К. П. Кабашнікаў і інш., Мінск: Вышэйшая школа, 1996, 856 с.).

That is a **second, independent confirmation** of the bibliographic correction in
`RESEARCH.md`: the Lozka games volume is «Гульні, забавы, ігрышчы», 1996, 534
pages — there is no «Беларускія народныя гульні, 2003» by him.

---

## Ritual games on the State List

| Гульня | Пра што | Марка | Крыніца |
| --- | --- | --- | --- |
| Жаніцьба Цярэшкі | Kalyady mock-wedding; a свацця pairs the youth off to sung couplets | 🟩 Lozka: *«унікальная асаблівасць Беларусі»* | State List **23БК000061**, Лепельскі р-н |
| Ката пячы | A cat built of buns is hung up; you ride a pitchfork and jump to bite a piece; the tail wins | 🟩 | State List **33АК000117**, Скірмантава |
| Калядныя цары | Costumed "tsars" perform a folk play house to house | 🟩 | UNESCO 2009 · State List **63БК000053** |
| Яшчар | A boy in reversed clothing at the centre; girls redeem their wreaths with tasks | 🟩 *for the Huta tradition only* | Minkult resolution **31 / 10.05.2018** |
| Пахаванне Дзеда | Maslenitsa comic funeral of a straw doll ⚠️ bawdy | 🟩 | State List, Гарадоцкі р-н |
| Стрылка · Цягнуць Каляду на дуба · Куры (Клічаўскі р-н ❓ rules unretrievable) | Calendar rites with game structure | 🟩 | State List |

---

## Craft-anchored

| Гульня | Пра што | Марка | Крыніца |
| --- | --- | --- | --- |
| Палатно | The linked line **is** a bolt of cloth; it winds into a spiral round the «матка» while a «кравец» steals children off the end | 🟦 | [sad29polotsk.schools.by](https://sad29polotsk.schools.by/pages/belaruskja-guln) |
| Вузельчык | Two belts stretched into a needle's eye; the line threads through singing a needle-riddle; the last child ties the knot | 🟦 | same |
| Каноплі (Раманаў form) | A «дзедзька» with a **чапяла** gathers a plaited chain, then coughs and drives them off with the pot-hook | 🟦 | Раманаў VIII 557–558 · BNT 1033 |
| Круцёлка | A bored pine trunk pinned to its stump so it revolves; boys ride the ends ⚠️ no win condition recorded | 🟦 | BNT 1103 |

---

## Notable Tier 2 not yet in the tables above

Азярод · Гуські · Мянькі · Грахі · У казу · Калаўрот · Панначка · Да Вільні едуць ·
Гула · Була · Пікер · Апука · Паленты · Крэглі · У пупы · Дзядуля-ражок ·
Скукуйда · Гуж · Жаніцьба коміна — described in `RESEARCH.md`.

## 🟥 Imported or Soviet-era — keep, but always labelled

Штандар, стой! (German *Stand hier!* via Russian «Штандер», BNT 1080) · У пяць
дзевак (1082) · Гарадкі (Soviet mass sport by 1923; BNT 1061) · Лапта (by 1957;
the Belarusian game is **Апука**; BNT 1057, 1078) · Пасадка бульбы (PE relay in
folk dress) · Міхасік (modern pedagogical adaptation — musical chairs in лапці) ·
Дзікуны і рускія (1087) · Піянеры (1088)

⚠️ Note the nuance: several of these **are** in BNT 1972, because the volume
honestly recorded what children were actually playing in 1972, Soviet imports
included. Presence in BNT proves currency, not folk antiquity. That is exactly
why they need the label rather than exclusion. **«Міхасік» is not in the index at
all** — which is the strongest evidence yet that it is a later pedagogical
invention.

## ❓ Name attested, rules not recorded — do not invent

Дучкі (⚠️ **дучка** is both the marble and the pit — and the same word names the
eye-hole in the upper stone of the **жорны**) · Куры · Клёк (the word is real in
Homieĺ dialect; no Belarusian rules text exists — what circulates online is
Russian «Пекарь»)

---

## Archived sources

Held in `sources/`, with the URL recorded so anything can be re-consulted:

| File | What |
| --- | --- |
| `lib-gorki-gulni.html` | Horki library set, 52 games |
| `sad29polotsk-gulni.html` | Polack card index — Палатно, Вузельчык |
| `hotlib-belaruskiya-gulni.pdf` | Belarusian games booklet |

| `bnt-1972/` | *Дзіцячы фальклор* (1972), 72 pages, read locally |

`sources/` is **gitignored** — the texts are studied here and never
redistributed. What gets committed is our own summaries plus the derived index,
which is factual bibliographic data. Rights and required citations for each item
are in `ATTRIBUTION.md`.

⚠️ `elib.psu.by` (the Chatovich article on Яшчар, with the recorded song texts)
refuses TLS from this machine — **needs downloading by hand**:
`https://elib.psu.by/bitstream/123456789/23297/3/136-145.pdf`

⚠️ **Лозка, «Гульні, забавы, ігрышчы»** (534 pp., the largest collection ever
published) is not online and stays that way. If we need it, we buy it.

---

## BNT *Дзіцячы фальклор* (1972) — the games index

178 entries, nos. **940–1117**, from the volume compiled by Г. А. Барташэвіч.
Index derived locally; the volume itself is linked, not mirrored — see
`ATTRIBUTION.md`. Titles as printed, including the volume's own variant
spellings and its several entries for one game.

**940–944 — carahod and calendar games**

  940 Яшчар · 941 Шастак · 942 Грушка · 943 Ігрушка · 944 Гусі

**945–953 — wolf, shepherd and sheep — all **chase** games**

  945 Воўк · 946 Пасу, пасу авечачкі · 947 Воўк і авечкі · 948 Воўк і авечкі · 949 Пастух і авечкі · 950 Воўк · 951 Авечачка · 952 Авечка · 953 У ваўкі і авечкі

**954–966 — kite / raven / hawk and the brood**

  954 У коршуна · 955 У крука · 956 У ворана · 957 Шуляк · 958 Груган · 959 У каршуна · 960 Арол · 961 Гусі · 962 У гусі · 963 У гусі · 964 У гусі · 965 Гусак (Воўк і гусі) · 966 У шчуку

**967–974 — radish and turnip pulling**

  967 Рэдзька · 968 У рэдзьку · 969 У дзеда і бабу · 970 У рэдзьку · 971 У рэпку · 972 Рэдзька · 973 Рэдзька · 974 У рэпу

**975–990 — blindfold, guessing and hidden-object**

  975 Слепа бабулечка · 976 Маша · 977 Адгадай хто? · 978 Сляпы музыка · 979 У сляпца · 980 У жутку · 981 Ляскаўкі · 982 Гарбуз гнілы · 983 Почта · 984 У сяло · 985 Неба · 986 У краскі · 987 У вугалькі · 988 У вугалькі · 989 Вугалькі · 990 У чорта і матку

**991–999 — hidden token, gates and passing through**

  991 Золата · 992 У золата · 993 У Мазаля · 994 Князь-князевіч · 995 Курнаціца · 996 Гусі ляцяць · 997 Зелена · 998 Явар · 999 Залатыя варата

**1000–1017 — bear, hen, and the blind-man cluster**

  1000 У мядзведзя на бару · 1001 У мядзведзя на бару · 1002 У Бабу Ягу · 1003 Баба Ёшка · 1004 Слепа кура (У куры) · 1005 Лавіць куры · 1006 Куры · 1007 У жмуркі · 1008 Жмуркі · 1009 Кулюкушкі · 1010 У палачку-булавачку · 1011 Палачка-шукалачка · 1012 Палачка-баровачка (Прыбіты) · 1013 Татарская палачка · 1014 Жмуркі · 1015 Сляпец · 1016 Скукуйда · 1017 Калім-бам-ба

**1018–1035 — tag, chase and catching**

  1018 У здагонкі · 1019 Шчыткі-быткі · 1020 Рагадан · 1021 Барада · 1022 Гуж · 1023 Блін гарыць · 1024 Стралец · 1025 Мальчык-пальчык · 1026 Пінкі · 1027 Харты і зайцы · 1028 У зайца · 1029 У зайца · 1030 У рыбака і рыбку · 1031 Мурашачка · 1032 Проса · 1033 У каноплі · 1034 Ноч і дзень · 1035 У ката і мышку

**1036–1047 — craft and household mimicry**

  1036 У ружу · 1037 Гулачка · 1038 Удавец · 1039 У гарэлыша · 1040 Мост · 1041 У дзяцей · 1042 У рэшата · 1043 Шавец · 1044 У гарлачыкі · 1045 Гладышкі · 1046 Гарлачыкі · 1047 Гладышкі

**1048–1075 — stick, ball and target games**

  1048 У колічкі · 1049 У свінню · 1050 Ганяць свінку · 1051 У булу · 1052 У пікера · 1053 У куля · 1054 У казіны рог · 1055 Катанне кулі · 1056 Качаць скрытулку · 1057 У лапту ці шпуляк · 1058 У салаўя · 1059 Кукушка · 1060 У перагона · 1061 У гарадкі · 1062 У пыжа · 1063 У крэглы · 1064 У кеглі · 1065 У крэглі · 1066 У косці · 1067 У цуркі · 1068 У чыжыка · 1069 У транпыжа · 1070 Транпыж · 1071 Вільна · 1072 У масла · 1073 У шлякі · 1074 У яркі · 1075 У кісценя

**1076–1088 — ball, throwing — and the imported layer**

  1076 Грахі · 1077 Цар · 1078 У лапту · 1079 У мяч — у выбівала · 1080 Штандар, стой! · 1081 У казла · 1082 У пяць дзевак · 1083 У сабачку · 1084 Гульня 3 мячом · 1085 Гульня з мячыкам · 1086 Гульня са скакалкай · 1087 Дзікуны і рускія · 1088 Піянеры, піянеры, дайце нам важатага!

**1089–1117 — herdsmen's, forfeit and skill games**

  1089 У пекла · 1090 У лыкі · 1091 У пераскочкі · 1092 Белку трасці · 1093 У чакерду · 1094 Кавалькі · 1095 Шашка ганяць · 1096 У шыла · 1097 У каваля · 1098 У пытку · 1099 Маршалкі · 1100 У караля · 1101 У казу · 1102 Пастарнак · 1103 Круцёлка · 1104 Солана — молана · 1105 Рыжыкі саліць · 1106 У каменьчыкі · 1107 У караля · 1108 У касцяшкі · 1109 Мак · 1110 У вужа · 1111 Гарнушак · 1112 У караля · 1113 У копны, у кучы · 1114 Прарок · 1115 У фігуры · 1116 У ката · 1117 У гнілога бурака
