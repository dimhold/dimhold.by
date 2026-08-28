/* «Ката пячы» — the balance, measured rather than guessed.
 *
 * The game core is pure and takes its clock, its dice and its reduced-motion
 * flag from outside, so it can be played here without a browser: a fake clock
 * advanced one 60 Hz frame at a time, a seeded generator in place of
 * Math.random, and a bot at the button.
 *
 * The bot is deliberately not clever. It has no model of the swing to invert;
 * it does what a player does — asks, moment by moment, «if I jumped now, would
 * the bite land?» — and then presses, late or early, by a normally distributed
 * human amount. That amount is the axis the whole table is read along: a game
 * that only rewards a stopwatch is not a game, and one that cannot be lost by
 * a slow hand is not one either.
 *
 * The other axis is what the player did at the oven, which is the real
 * decision the game asks. Six buns out of one trough: spend the dough on the
 * pieces you bite first and the tail is a crumb you get five tries at, or feed
 * the tail and arrive with fewer tries at a mouthful you can hardly miss.
 *
 * Run: npm run kata:balance
 */
import { createCore, K, pieceX, BAKE_MS } from '../src/scripts/games/kata-piachy/mechanics.ts';

/* ---------------------------------------------------------- the clock --- */

/** 60 Hz, the rate the real frame loop runs at. */
const FRAME = 1000 / 60;
/** A round that has not ended by here is a bug, not a long game. */
const FRAME_CAP = 120_000;

/* ---------------------------------------------------------- the dice ---- */

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box–Muller. The hand is normal about the right moment, not uniform in it. */
function gauss(rng) {
  let u = 0;
  while (u === 0) u = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

/* ------------------------------------------------------ the strategies -- */

/* A plan is what the player intends at the oven: how big to pinch each of the
   six balls, and how brown to let it get before pulling it out. The core
   clamps anything the trough cannot pay for, which is the point of the last
   two rows. */

const GOLDEN = (K.RAW_UNTIL + K.GOLDEN_UNTIL) / 2; // 0.56 — the middle of the band
const RAW = 0.3;
const BURNT = 0.85;

const even = (size, frac) => Array.from({ length: 6 }, () => ({ size, frac }));

const STRATEGIES = {
  /* Six even loaves, each pulled out in the middle of the golden band. */
  'even-golden': even(16, GOLDEN),
  /* Five modest ones and the whole rest of the trough in the tail — which the
     oven caps at SIZE_MAX, so saving more than about thirty is saving nothing. */
  'save-tail': [
    { size: 14, frac: GOLDEN },
    { size: 14, frac: GOLDEN },
    { size: 14, frac: GOLDEN },
    { size: 14, frac: GOLDEN },
    { size: 14, frac: GOLDEN },
    { size: K.SIZE_MAX, frac: GOLDEN },
  ],
  /* Five big ones, as big as the trough will pay for; the tail gets what is
     scraped off the sides of it. */
  'spend-early': [
    { size: 21, frac: GOLDEN },
    { size: 21, frac: GOLDEN },
    { size: 21, frac: GOLDEN },
    { size: 21, frac: GOLDEN },
    { size: 21, frac: GOLDEN },
    { size: K.SIZE_MAX, frac: GOLDEN },
  ],
  /* Nothing but scraps: the trough is barely touched and nothing bites wide. */
  'all-scraps': even(K.SIZE_MIN, GOLDEN),
  /* Even loaves, pulled before they colour: heavy, calm, and narrow. */
  'all-raw': even(16, RAW),
  /* Even loaves, left too long: wide, weightless, and wild. */
  'all-burnt': even(16, BURNT),
};

/* ------------------------------------------------------------ one game -- */

/**
 * Play a single round to its end.
 *
 * `jitter` is the standard deviation, in milliseconds, of how late the bot's
 * finger is — applied to every press it makes, at the trough, at the oven and
 * on the pitchfork, resampled for each one.
 */
function play(plan, jitter, seed, stepped = false) {
  const dice = mulberry32(seed);
  const hand = mulberry32((seed ^ 0x9e3779b9) >>> 0);

  let t = 0;
  const out = { won: false, mine: 0, theirs: 0, tries: 0, stalled: false };

  /* — what the bot knows about the room — */
  let shoveUntil = -1;
  /* — what the bot is in the middle of doing — */
  let kneading = false;
  let releaseAt = 0;
  let ovenAt = Infinity;
  let pressAt = null;
  let done = false;

  const core = createCore({
    now: () => t,
    random: dice,
    stepped: () => stepped,
    emit(e) {
      switch (e.type) {
        case 'intoOven':
          /* The bun is in; decide now when to go back for it. */
          ovenAt = Math.max(t, t + BAKE_MS(e.size) * plan[e.index].frac + gauss(hand) * jitter);
          break;
        case 'bunDone':
          ovenAt = Infinity;
          break;
        case 'shove':
          /* The announcement is all the bot gets, and all a player gets: which
             way, and that it lasts SHOVE_HOLD. A shove announced after the bot
             has committed to a moment lands on it — the finger is already on
             its way down and there is no taking that back. */
          shoveUntil = t + K.SHOVE_HOLD;
          break;
        case 'tailPhase':
          out.tries = e.tries;
          break;
        case 'finish':
          out.won = e.won;
          out.mine = e.mine;
          out.theirs = e.theirs;
          done = true;
          break;
        default:
          break;
      }
    },
  });

  /** How long the finger has to stay down for a ball of this size. */
  const holdFor = (size) => Math.max(0, (size - K.SIZE_MIN) / K.KNEAD);

  /**
   * The aiming, and the only place a modelling choice is made in this file.
   *
   * There is no inverse of the swing here. The bot walks time forward in small
   * steps asking the question a player asks of every frame — «if I jumped
   * then, would the bite land?» — and takes the middle of the first stretch
   * where the answer is yes. The middle, not the leading edge: a player aims
   * at the moment the piece is over the fork, and is late or early about it by
   * a symmetric amount, which is what `jitter` then does to the answer.
   *
   * Two things it does not do, because a player cannot. It does not aim
   * *against* a shove — the twelve units it would be knocked sideways are not
   * something anybody compensates for mid-air — it simply refuses to jump into
   * one it has been shown, and waits for the far side of it. And it cannot
   * take a jump back once its finger is committed, so a shove announced after
   * it has chosen a moment is a shove it eats.
   */
  function aim(target) {
    const w = core.windowOf(target);
    const STEP = 4;
    const HORIZON = 6000;
    /* A stepped bite is judged where the cat stands, not at the top of a ride. */
    const lead = stepped ? 0 : K.RISE;
    let from = -1;
    let to = -1;
    let best = Infinity;
    let bestAt = 0;
    for (let dt = 0; dt <= HORIZON; dt += STEP) {
      const tp = t + dt;
      /* An announced shove is not a moment to jump in. */
      if (tp < shoveUntil) continue;
      const gap = Math.abs(pieceX(target, core.thetaAt(tp + lead)) - K.PIVOT_X);
      if (gap < best) {
        best = gap;
        bestAt = dt;
      }
      if (gap <= w) {
        if (from < 0) from = dt;
        to = dt;
      } else if (from >= 0) break;
    }
    /* If nothing in the next few swings can be hit, jump at the near miss —
       the piece is going to be lost either way and the game has to move on. */
    const ideal = from < 0 ? t + bestAt : t + (from + to) / 2;
    return Math.max(t, ideal + gauss(hand) * jitter);
  }

  /* The snapshot object is reused by the core, so this reference stays current:
     it always holds the state as of the last tick, which is what the bot's eyes
     would have seen at the start of this frame. */
  let view = core.tick();

  for (let f = 0; f < FRAME_CAP && !done; f += 1) {
    t += FRAME;
    const phase = core.phase;

    if (phase === 'idle') {
      core.start();
    } else if (phase === 'shape') {
      if (!kneading) {
        core.press();
        kneading = true;
        releaseAt = Math.max(t, t + holdFor(plan[view.making].size) + gauss(hand) * jitter);
      }
      if (t >= releaseAt) {
        core.release();
        kneading = false;
      }
    } else if (phase === 'bake') {
      kneading = false;
      if (t >= ovenAt) core.press();
    } else if (phase === 'swing') {
      if (pressAt === null) pressAt = aim(view.target);
      if (t >= pressAt) {
        core.press();
        pressAt = null;
      }
    } else {
      pressAt = null;
    }

    view = core.tick();
  }

  if (!done) out.stalled = true;
  return out;
}

/* ------------------------------------------------------------ the table -- */

const N = Number(process.env.KATA_N || 1000);
const JITTERS = [50, 100, 150];

function cell(name, jitter) {
  const plan = STRATEGIES[name];
  let wins = 0;
  let pieces = 0;
  let tries = 0;
  let stalled = 0;
  for (let s = 0; s < N; s += 1) {
    const r = play(plan, jitter, s + 1);
    if (r.won) wins += 1;
    pieces += r.mine;
    tries += r.tries;
    if (r.stalled) stalled += 1;
  }
  return { win: (wins / N) * 100, pieces: pieces / N, tries: tries / N, stalled };
}

const pad = (s, n) => String(s).padEnd(n);
const num = (v, n, d = 2) => v.toFixed(d).padStart(n);

console.log(`\n«Ката пячы» — balance, ${N} seeds per cell, 60 Hz fake clock.\n`);
console.log(`${pad('strategy', 14)}${JITTERS.map((j) => pad(`±${j} ms`, 24)).join('')}`);
console.log(`${pad('', 14)}${JITTERS.map(() => pad('win%   pieces  tries', 24)).join('')}`);
console.log('-'.repeat(14 + JITTERS.length * 24));

const table = {};
for (const name of Object.keys(STRATEGIES)) {
  table[name] = {};
  let row = pad(name, 14);
  for (const j of JITTERS) {
    const c = cell(name, j);
    table[name][j] = c;
    row += pad(`${num(c.win, 5, 1)}%  ${num(c.pieces, 5)}   ${num(c.tries, 5)}`, 24);
  }
  console.log(row);
}

/* Reduced motion is a different game — stepped, at half speed, on a grid
   anchored so the piece does stop over the pitchfork. It is measured because
   it was once unwinnable and nobody noticed. */
{
  let wins = 0;
  let pieces = 0;
  for (let s = 0; s < N; s += 1) {
    const r = play(STRATEGIES['save-tail'], 100, s + 1, true);
    if (r.won) wins += 1;
    pieces += r.mine;
  }
  console.log(
    `\nstepped (prefers-reduced-motion), save-tail at ±100 ms: ` +
      `${((wins / N) * 100).toFixed(1)}% won, ${(pieces / N).toFixed(2)} pieces`,
  );
}

/* --------------------------------------------------------- the assertions - */

/* The published spread, restated as a test: at ±100 ms the game runs «from
   about 50 % (spend the dough early, or bake nothing but scraps) to
   near-certain (save the dough for the tail)». These check this file against
   the shipped constants, not the other way round — if one fails, the port has
   drifted from v1 and the numbers are not the thing to touch. */

const within = (v, lo, hi) => v >= lo && v <= hi;

const checks = [
  ['save-tail at ±100 ms wins at least 85%', table['save-tail'][100].win >= 85, table['save-tail'][100].win],
  ['spend-early at ±100 ms wins 25–65%', within(table['spend-early'][100].win, 25, 65), table['spend-early'][100].win],
  ['all-scraps at ±100 ms wins 25–65%', within(table['all-scraps'][100].win, 25, 65), table['all-scraps'][100].win],
];

console.log('');
let ok = true;
for (const [what, pass, got] of checks) {
  console.log(`${pass ? 'ok  ' : 'FAIL'}  ${what} — got ${got.toFixed(1)}%`);
  if (!pass) ok = false;
}

/* Not a check, on purpose. Burning the whole batch is not a dough-wasting
   strategy and the constants do not punish it as one: BAKE_WINDOW.burnt widens
   every mouthful by a fifth, which buys back most of what the extra wildness
   costs. It ends up between the even bake and the spendthrift, and it is
   printed here so that stops being a surprise to anybody. */
console.log(`note  all-burnt at ±100 ms — ${table['all-burnt'][100].win.toFixed(1)}%, between even-golden and spend-early`);

const stalls = Object.values(table).reduce(
  (n, row) => n + Object.values(row).reduce((m, c) => m + c.stalled, 0),
  0,
);
if (stalls) {
  console.log(`FAIL  ${stalls} rounds never ended`);
  ok = false;
}

console.log('');
if (!ok) process.exitCode = 1;
