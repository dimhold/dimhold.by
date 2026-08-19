# Гульні — build order

**Decision taken 19 Aug 2026: all five games from the shortlist get built.**
This file is the commitment; `ADAPTATION.md` holds the design reasoning.

Build strictly in this order. Each one ships before the next starts — four
finished games beat five half-finished ones, and the order is chosen so that the
cheapest lessons are learned first.

| # | Гульня | Genre | Why here in the order |
| --- | --- | --- | --- |
| 1 | **Ката пячы** | timing / aim | Tier 1, state-listed, nobody has adapted it, and the simplest of the five to make *good*. First contact with the section's visual language happens on the cheapest game. |
| 2 | **Лянок** (Horki) | call-and-response rhythm | Eight recorded stages = a game already written. Ends by weaving a real ornament through `ornament.js`, which welds the section to the rest of the site. |
| 3 | **Панначка** | shield / blow, one input | Visually the strongest thing in the corpus. Tiny mechanically, so it is where the section earns its look. |
| 4 | **Грахі** | turn-based, simulated opponents | The rule *is* the content: guilt reduces your right to punish. Cheap to build once the shared UI exists. |
| 5 | **Жаніцьба Цярэшкі** | social state machine | The flagship, and the only game an authority calls unique to Belarus. Last because it does not work without music. |

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
