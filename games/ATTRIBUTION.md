# Sources, rights and how they may be used

Research-stage note. Third-party texts are held locally in `games/sources/` **for
study only**. This file records what each one is, who holds rights, and what we
are allowed to do with it.

## The line we hold

1. **`games/sources/` is gitignored.** Nothing downloaded here goes into the
   repository, and therefore nothing is republished. Studying a text locally is
   not the same as redistributing it, and the difference is the `.gitignore`
   entry — do not remove it.
2. **`games/` is never built into the site.** Astro ships only `src/` and
   `public/`. Even committed research files never reach a visitor.
3. **What may be committed:** our own summaries, one-line rule descriptions,
   catalogue rows, entry numbers and titles. **Bibliographic index data — an
   entry number and a game name — is fact, not expression.**
4. **What may not be committed or published:** running text from the scholarly
   editions, the commentary and apparatus, and **song texts**. Folklore texts are
   traditional, but a scholarly edition's selection, transcription, commentary
   and arrangement are a protected authorial work.
5. **Every game that ships on the site carries its citation** — collector, place,
   year, and a link. That is a condition of the section, stated in `ROADMAP.md`,
   and it is also simply how this material should be treated.

## Held locally

| File | Work | Rights | Required citation |
| --- | --- | --- | --- |
| `bnt-1972/` (72 pages) | *Дзіцячы фальклор*, Беларуская народная творчасць series, Мінск: Навука і тэхніка, 1972. Compiled by **Г. А. Барташэвіч**. Games at nos. **940–1117**. | Copyrighted scholarly edition. Read online at [knihi-online.com](https://knihi-online.com/dziciacy-falklor-piesni-bielaruskaja-narodnaja-tvorcasc.html). | «Дзіцячы фальклор» / склад. Г. А. Барташэвіч. — Мінск: Навука і тэхніка, 1972. — БНТ. № entry. |
| `bnt-1972-games-index.json` | Index we derived: entry number → title, 178 rows | **Our own derived index of factual data.** Safe to commit and publish. | as above, for the underlying edition |
| `lib-gorki-gulni.html` | «Беларускія народныя гульні» project of the Horki central library, 52 games | Public web page | [lib-gorki.mogilev.by](https://lib-gorki.mogilev.by/index.php/gulni-bel/1460-gulni) |
| `sad29polotsk-gulni.html` | Polack card index — Палатно, Вузельчык | Public web page | [sad29polotsk.schools.by](https://sad29polotsk.schools.by/pages/belaruskja-guln) |
| `hotlib-belaruskiya-gulni.pdf` | Belarusian games booklet | Unclear provenance — **verify before citing** | [hotlib.by](https://hotlib.by/caitdeti/pdf/belaryskiya_gulni.pdf) |

## To fetch, still

- **Лозка, *Беларускі фальклор*** — the surviving home of his classification.
- **Verbum / БелЭн, «Беларускія народныя гульні»** — reports 400+ games known.
- **ethnoby.org** — village-level records; the most promising unmined source.
- ⚠️ **Чатовіч, *Веснік ПДУ*, сер. A, №1, 2019, с. 136–145** — the Яшчар article
  with the full recorded song texts. `elib.psu.by` **refuses TLS from this
  machine**; needs downloading by hand:
  `https://elib.psu.by/bitstream/123456789/23297/3/136-145.pdf`

## Not to be mirrored at all

**Лозка А. Ю. «Гульні, забавы, ігрышчы»**, БНТ, 1996 / 2000 / 2003 — the largest
Belarusian games collection ever published, 534 pp. Not online, in copyright, and
in print. If we need it, we buy it.
