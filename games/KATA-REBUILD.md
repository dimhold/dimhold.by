# «Ката пячы» — the rebuild. Contract for everyone working on it.

**Decision, 27 Aug 2026:** the shipped v1 (`src/scripts/games/kata-piachy.ts`)
keeps its measured mechanics but gets a completely new body: an immersive
"вечар перад Піліпаўкай" staged as a **выцінанка (cut-paper) shadow theatre**
drawn on Canvas 2D, with live dough, a physical cord, villagers who argue about
how the cat must be made, and a documentary epilogue. This file is the contract:
module boundaries, APIs, quality bars. The orchestrator owns this file and
`src/scripts/games/kata-piachy/types.ts`; workers read them and do not edit
them — propose changes in your report instead.

## Non-negotiables (from the section's rules and from the game's owner)

1. **The measured mechanics survive byte-for-byte.** Every constant and every
   formula in v1 (`kata-piachy.ts`) was balanced headless; the rebuild ports
   them into `mechanics.ts` unchanged. Physics (rope, dough) is *cosmetic
   only*: the bite is still judged by the analytic `theta()`/`pieceX()` math,
   never by where the verlet rope happens to be.
2. **Never boring, always a visible goal.** The player must at every moment see
   what they are trying to do and why. The prologue is skippable with one tap.
   A full round stays under five minutes. Playable one-handed on a phone.
3. **Maximally authentic, honestly labelled.** What the record gives: buns, the
   hanging, the pitchfork, the shoving, the tail, 27 November, Skirmantava,
   State List 33АК000117, the fast starting next morning. Everything else —
   numbers, the baking-as-game, the named villagers, their lines — is ours and
   the page says so. No chant is recorded, so none is sung. Belarusian game
   text stays Belarusian in all three languages; the chrome translates.
4. **Site rules hold:** no framework (hand-rolled Canvas 2D is fine), no
   blocking JS, works in silence, `prefers-reduced-motion` respected, no layout
   shift, server-rendered no-JS fallback, trilingual (be/ru/en).

## The experience, beat by beat

0. **Пралог** (~8 s, tap-to-skip, auto-skips on replay): night, snow, the hata
   from outside, one warm window; a title card — «27 лістапада · Скірмантава»;
   the door opens and the camera moves inside. Sets place and time, nothing
   else.
1. **Акт I — пячом.** The trough, the board, the oven; three villagers around
   the table give advice while you shape and bake the six buns. Their advice
   **genuinely contradicts** — variant traditions really disagree, and each
   advisor is partially right (big buns bite wide but eat the trough; raw is
   heavy and calms the cord but bites narrow…). The real optimum (save dough
   for the tail) stays discoverable; advice teaches the system, it never
   commands. The dough is alive: the ball wobbles and swells under the held
   finger, flour puffs, the oven glows.
2. **Перавес.** The cat is hung from the beam; the room dims to the fire, the
   crowd gathers; camera pans from the oven up to the beam. ~2 s, no input.
3. **Акт II — кусаем.** The v1 swing/jump/shove game, staged: the cord is a
   verlet rope (driven by the analytic angle), the cat's pieces lag and settle,
   shoves are visible hands from named villagers with different habits, the
   player rides the pitchfork with anticipation/squash/recoil, bites get
   freeze-frames and crumb particles. HUD always names the current piece and
   the standing goal: «адкусі хвост».
4. **Эпілог.** Win or lose, then the calendar truth: tomorrow Піліпаўка begins
   and takes both meat and games with it. Then a quiet documentary card: the
   State List entry, the Redźka family, «Сваякі» and «Весялуха», every year
   since 1993 — and the honesty line that the named advisors are invented.

## File layout

```
src/scripts/games/kata-piachy/     ← new module (replaces kata-piachy.ts at integration)
  types.ts      shared contract (ORCHESTRATOR-OWNED, read-only for workers)
  mechanics.ts  pure headless game core, v1 math verbatim, event-emitting
  engine.ts     canvas loop, layers, camera, light, particles, DPR/resize
  scene.ts      the выцінанка art: every drawable, every pose
  physics.ts    verlet cord + live dough blob (cosmetic)
  drama.ts      beats, advisors, who says what when
  sound.ts      synthesised score and foley (no audio files)
  index.ts      the director: wires core+engine+drama+DOM, owns phases
scripts/kata-balance.mjs           ← headless balance harness (rebuilt)
src/pages/dev/kata-scene.astro     ← dev-only visual harness, DELETED before ship
```

`src/scripts/site.ts` keeps importing `./games/kata-piachy` — once the old
`kata-piachy.ts` file is deleted the same specifier resolves to the directory's
`index.ts`. Until integration day both exist and the *file* wins; do not delete
the file before `index.ts` is complete.

## Module contracts (details in types.ts — read it)

- **mechanics.ts** exposes `createCore(opts)` where opts inject `now()`,
  `random()`, `stepped()` and an `emit(event)` sink. The core knows nothing of
  DOM, canvas or copy. Per-frame it returns a `CoreFrame` snapshot; discrete
  things (bun done, shove announced, bite resolved, finish) are events. All v1
  constants live here, exported, with their v1 values.
- **engine.ts + scene.ts** consume a `SceneState` and draw one frame. The
  engine owns the raf loop, camera easing, light flicker, particle pools,
  offscreen-canvas caching of static layers, devicePixelRatio (cap 2), resize.
  The scene owns every path: hata interior, печ, дзяжа, бэлька with cut-paper
  stars, the cat piece by piece, the crowd, the player on the pitchfork.
  Canvas paints its own full background (night interior) — it does not
  inherit the site theme inside the frame.
- **physics.ts** exposes `createRope()` (pivot-driven verlet chain whose tip is
  pulled toward the analytic angle; the cat hangs off it with lag and settle)
  and `createDough()` (a radial blob that swells with `grow()`, dents under
  `poke()`, jiggles on release). Both are pure state + `step(dt)`.
- **drama.ts** decides *which* copy line fires *when*: prologue beats, advisor
  reactions to core events (with cooldowns so they never spam), epilogue
  sequence. It emits `{who, text}` speech objects; rendering is DOM.
- **sound.ts** is entirely synthesised: ambient beds (fire, wind, crowd
  murmur) plus cues (knead, poke, oven door, bake-done per doneness, hang,
  jump, bite, crumb, miss, shove warning, win, lose, advisor blip). Off by
  default, toggle persisted, everything guarded so silence is first-class.
- **index.ts** is the only module that touches the DOM: HUD, speech bubbles,
  buttons, keyboard/pointer input, visibility handling, localStorage best-line,
  analytics `track()` calls, reduced-motion switch, and the mapping
  CoreFrame → SceneState.

## Units

Mechanics stay in v1 scene units (the 320×230 world: PIVOT_X 160, piece
offsets, mouth windows, shove units). The new logical stage is 720×480;
`CORE_SCALE = 2.25` maps core x-coordinates onto it, uniformly, so nothing in
the balance changes. The beam pivot sits at (360, 54) in stage units.

## Orchestrator rulings taken during the build

- **Handedness:** positive θ leans the cord toward **−x**, as both v1's SVG
  `rotate` and `mechanics.pieceX` agree. The rope's `xSign: -1` default is
  correct; any straight-cord fallback in scene.ts must use `ax = -sin(θ)`.
  A mirrored fallback is a bug, not a style.
- **`CoreProbe`** (`thetaAt`, `windowOf`) lives in mechanics.ts as an additive
  extension of `Core`; types.ts stays as published.
- **The scene draws the two лапы at core dy 122/124** (v1: 116/118) so they
  clear the body silhouette. Drawing-side only — the bite is still judged on
  mechanics' OFFSETS; near the anchor angle the visual error is under one core
  unit. Do not "fix" the mismatch in either direction.
- **`all-burnt` is a middling strategy (~75 %), not a wasteful one** — that is
  what v1's constants always said; the published "~50 %" pair is spend-early
  and all-scraps. The balance harness asserts accordingly.

## Reduced motion

The v1 contract survives: stepped cord on an anchored grid at half speed, bite
judged where the cord stands, stepped browning gauge. Visually: no flicker, no
particles, no camera easing (cuts instead), prologue replaced by its title
card. The stepped maths lives in mechanics.ts exactly as in v1.

## Quality bars (what "done" means)

- The scene reads as **cut paper in firelight**, not clipart: layered warm
  darks, rim-lit edges, visible paper grain in the light pools, выцінанка
  patterns where the record of the craft would put them. If a screenshot could
  pass for a school SVG, it is not done.
- 60 fps on a mid phone; static layers cached offscreen; zero allocations in
  the frame loop's steady state.
- The balance harness reproduces v1's published spread (±100 ms jitter:
  ~50 % for dough-wasting strategies → near-certain for save-the-tail).
- Astro `npm run build` passes clean; no console errors; keyboard and screen
  reader paths work (status line stays `role="status"`).

## Who is building what (orchestrated, Opus workers)

Wave 1 — parallel, no shared files:
- **A. mechanics + harness** → `mechanics.ts`, `scripts/kata-balance.mjs`
- **B. copy + i18n** → `src/i18n/index.ts` (KataCopy interface + be/ru/en)
- **C. art + engine** → `engine.ts`, `scene.ts`, dev harness page

Wave 2 — after review: **D.** physics.ts · **E.** drama.ts + sound.ts ·
**F.** index.ts + Astro component + CSS (integration).

Wave 3: reduced-motion audit, fallback SVG poster, dev-page removal, balance
re-run, build + visual review by the orchestrator.
