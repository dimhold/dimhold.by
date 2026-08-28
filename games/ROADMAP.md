# Гульні — build order

**Decision taken 19 Aug 2026: all five games from the shortlist get built.**
This file is the commitment; `ADAPTATION.md` holds the design reasoning.

Build strictly in this order. Each one ships before the next starts — four
finished games beat five half-finished ones, and the order is chosen so that the
cheapest lessons are learned first.

| # | Гульня | Genre | Why here in the order |
| --- | --- | --- | --- |
| 1 | ~~**Ката пячы**~~ **shipped** | bake, then bite | Tier 1, state-listed, nobody has adapted it. First contact with the section's visual language happened on the cheapest game. See below. |
| 2 | **Лянок** (Horki) | call-and-response rhythm | Eight recorded stages = a game already written. Ends by weaving a real ornament through `ornament.js`, which welds the section to the rest of the site. |
| 3 | **Панначка** | shield / blow, one input | Visually the strongest thing in the corpus. Tiny mechanically, so it is where the section earns its look. |
| 4 | **Грахі** | turn-based, simulated opponents | The rule *is* the content: guilt reduces your right to punish. Cheap to build once the shared UI exists. |
| 5 | **Жаніцьба Цярэшкі** | social state machine | The flagship, and the only game an authority calls unique to Belarus. Last because it does not work without music. |

## 1. «Ката пячы» — shipped 27 Aug 2026 · rebuilt same day

Lives at `/games/kata-piachy/` in all three languages. **Rebuilt 27 Aug 2026**
from the v1 SVG sketch into a staged evening: a Canvas-2D cut-paper
(выцінанка) theatre lit by the печ, a skippable prologue, three invented —
and labelled as invented — villagers whose advice genuinely contradicts, a
verlet cord and live dough (both cosmetic; the bite is still judged
analytically), a synthesised score, and an epilogue that ends on Піліпаўка and
the documentary card. Design contract and build record: `KATA-REBUILD.md`.
Code: `src/scripts/games/kata-piachy/` (mechanics · engine · scene · physics ·
drama · sound · index), `src/components/games/KataPiachy.astro`, the `.kata`
block in `src/styles/global.css`, copy under `games.kata` in
`src/i18n/index.ts`, balance harness `scripts/kata-balance.mjs`
(`npm run kata:balance`).

**It is two acts, because the rite is.** The name is an instruction — *bake the
cat* — so the game bakes it first and only then hangs it up to be bitten. The
halves are one system rather than two minigames stitched together:

- One trough of dough, six buns, and the sixth is the tail. Rationing is the
  whole strategic problem, and the game says the tail is last so it is a plan
  rather than a trap.
- A bun's **size** is the width of the mouthful it will make later. A big loaf
  also browns more slowly, so it is easier to bake well — small buns are hard
  twice over.
- A bun's **bake** is what it weighs. Raw is heavy and slippery, burnt is crisp
  and wide but weightless. The cat's total weight sets how wildly the room can
  swing it, and it gets lighter with every piece bitten off — so the difficulty
  ramp is emergent from what the player baked.
- Every piece taken buys another attempt at the tail.

One button does all three jobs: hold to shape, press to pull out of the oven,
press to bite. Plays one-handed on a phone, works in silence, keeps a best line
in `localStorage`.

**Balance was measured, not guessed.** The module is driven headless against a
stub DOM and a fake clock, with a model-free aimer, over the cross-product of
baking strategies and human timing jitter. At ±100 ms the spread runs from about
50 % (spend the dough early, or bake nothing but scraps) to near-certain (save
the dough for the tail) — the choices at the oven are the difference.

**With `prefers-reduced-motion` the cat steps rather than swings**, at half
speed, on a grid of angles anchored so that one of them puts the piece exactly
over the pitchfork. Without that anchor a piece could be unhittable at every
stepped position — it was, before it was measured.

⚠️ **What we invented, and the page says so:** the baking is played here as a
game, and the record describes buns, not a contest over them. Every number —
the size of the trough, what a bun's size buys, what raw and burnt do to the
swing, how many attempts the tail allows — is ours.

No chant is recorded for this rite, so none is put in the player's mouth. The
only Belarusian in the game itself is the names of the six pieces — вуха, лапа,
лапа, бок, галава, хвост — which are the words for what they are, not a text
borrowed from anybody.

## Definition of done, per game

A game ships only when all of these are true.

- [ ] Plays with one hand, on a phone, in under five minutes.
- [ ] Works without sound. Sound is enrichment, never a dependency — except
      Цярэшка, which is allowed to require it.
- [ ] Belarusian game text is the real recorded text, not a paraphrase.
- [ ] A **source line** on the page: who recorded it, where, when.
- [ ] An **honesty line**: how shared this game is with the neighbours. Tier 3
      games say so out loud.
- [ ] Trilingual chrome (be/ru/en) around Belarusian game text.
- [ ] `prefers-reduced-motion` respected.
- [ ] No layout shift, no blocking JS, no framework.

## Rules the section holds itself to

1. **No invented rules.** Where the record is silent — «Круцёлка» has no win
   condition, «Грахі» has no throw formula — we choose, and the page says we
   chose.
2. **No claim the sources do not make.** "Unique to Belarus" is reserved for
   Жаніцьба Цярэшкі and Ката пячы. Everything else is *the Belarusian version*.
3. **Every game carries its citation.** If it cannot be sourced, it does not
   ship.

## Open, blocking nothing yet

- Audio for Цярэшка and Яшчар: **the recordings exist** — ЭТНАЎСЁ holds 43
  Цярэшка records plus 12 of its прыпеўкі, and four Яшчар records, many with
  audio *and notation*, including instrumental найгрышы from Лепельскі раён.
  Licensing is still unknown and must be settled before anything is planned
  around them. **Notation is the safer route**: a field-transcribed tune can be
  performed afresh for us, which avoids the rights in a specific recording.
- Section name and framing — proposal on the table is **«як гулялі ў Беларусі»**
  rather than "games unique to Belarus", for the reasons in `RESEARCH.md`.
- Route: `/games/` as a fourth nav pill, one page per game.

## After the five

`CATALOGUE.md` is the standing collection — every Belarusian game we can source,
borrowed ones included. It is a reference work in its own right and grows
independently of what gets built.
