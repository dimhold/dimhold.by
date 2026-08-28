/* «Ката пячы» — who speaks, and when.
 *
 * The three at the table disagree on purpose, so the only thing that makes
 * their disagreement legible is the order the mic goes round in. That is what
 * this module is: a set of rules about silence. It holds no DOM, starts no
 * timer and reads no clock but the one it is handed — the director feeds it
 * every core event and gets back at most one `Speech`, or nothing.
 *
 * Three constraints shape all of it.
 *
 * One: never two lines at once. The module owns its own throttle (`quietUntil`
 * runs to the end of the last bubble plus a breath), so the director can call
 * `onEvent` on everything without bookkeeping of its own.
 *
 * Two: never the same voice twice running. A pool with only one villager in it
 * is allowed to repeat; nothing else is.
 *
 * Three: react to fewer things than happen. Six buns get about four remarks,
 * five bites get about three, and the tail stretch gets none at all — the HUD
 * carries that one, and a bubble over it would be noise on top of the only
 * moment the game asks the player to concentrate.
 */
import type { KataAdvisor, KataCopy, KataLine } from '../../../i18n';
import type { AdvisorId, CoreEvent, Speech } from './types.ts';
import { K } from './mechanics.ts';

/* ------------------------------------------------------------- numbers --- */

/** Every line pool a villager owns. Derived, so a new pool in i18n shows up
 *  here as a type error rather than as silence. */
type PoolKey = Exclude<keyof KataAdvisor, 'name' | 'tag'>;

const ADVISORS: readonly AdvisorId[] = ['hanna', 'symon', 'alesik'];

/** A bun reads as generous past about seven tenths of the biggest ball the
 *  trough allows, and as a button below a third of it. Between the two nobody
 *  at the table has an opinion about the size, only about the bake. */
const BIG_BUN = 19;
const SMALL_BUN = 8;

/** Below one full ball's worth the trough is visibly being scraped, which is
 *  earlier than the core's own `doughOut` and is the moment worth saying. */
const DOUGH_LOW = K.SIZE_MAX;

/** Reading speed, measured in clauses: one clause or two. */
const CLAUSE_BREAK = 40;
const HOLD_SHORT = 1800;
const HOLD_LONG = 2600;
/** A glossed page has two lines in the bubble, so it needs longer. */
const HOLD_GLOSS = 400;
/** Between one bubble going down and the next being allowed up. */
const BREATH = 500;

/** Hands arrive every 2.6 s at worst; a remark on every one of them would be
 *  the loudest thing in the room. */
const SHOVE_COOL = 6000;
const BITE_COOL = 3500;

/** A queued second half of a disagreement is worth this long and no longer —
 *  after that the moment it answered is gone. */
const PAIR_LIFE = 4000;
/** The one-shot lines wait as long as they have to. */
const ONESHOT_LIFE = 9000;

/** How often Ганна and Сымон take the same bun in turn. */
const PAIR_CHANCE = 1 / 3;

/* ----------------------------------------------------------------- api --- */

export interface DramaOptions {
  now(): number;
  random(): number;
}

export interface Drama {
  /** Act I opens: the table takes sides. Once per round. */
  greeting(): Speech | null;
  /**
   * The sixth ball is about to be torn off — the one that becomes the tail.
   * The core has no event for it (it is the absence of a bun, not a bun), so
   * the director calls this when `making` reaches the last piece. Once per
   * round; if a bubble is still up the line is queued rather than dropped, and
   * comes back out of `followUp()`.
   */
  tailNext(): Speech | null;
  /** Every core event, unfiltered. At most one line comes back. */
  onEvent(e: CoreEvent): Speech | null;
  /**
   * Poll once each time a bubble finishes. Usually null; sometimes the other
   * half of an argument about the same bun, or a one-shot that had to wait.
   */
  followUp(): Speech | null;
  /**
   * After `finish`. One or two lines, in order, never all three. This is the
   * one call that ignores the throttle — the epilogue is a scene change, so
   * the director is expected to have cleared whatever bubble act II left up
   * before it plays these, and to space them by their own `hold`.
   */
  epilogue(won: boolean): Speech[];
  reset(): void;
}

export function createDrama(copy: KataCopy, opts: DramaOptions): Drama {
  const now = opts.now;
  const random = opts.random;

  /* — the throttle — */
  let bubbleUntil = 0;
  let quietUntil = 0;

  /* — the mic — */
  let lastWho: AdvisorId | null = null;
  const spokeAt: Record<AdvisorId, number> = { hanna: 0, symon: 0, alesik: 0 };
  /** Last line taken out of each (villager, pool), by its Belarusian text. */
  const lastSaid = new Map<string, string>();
  /** How often each pool has been drawn on, so the rarer one wins a tie. */
  const uses = new Map<PoolKey, number>();
  const poolUntil = new Map<PoolKey, number>();

  /* — what has already happened — */
  let greeted = false;
  let tailSaid = false;
  let doughLowSaid = false;
  let inTail = false;
  let lastBunSaid = -2;
  let bites = 0;
  /** Which bite each of the two reaction pools last answered. */
  const lastBiteSaid: Record<'playerHit' | 'playerMiss', number> = { playerHit: 0, playerMiss: 0 };
  let shoveTurn = false;

  /** A line owed to the room: the answer half of a pair, or a queued one-shot. */
  let pending: { who: AdvisorId | null; pool: PoolKey; until: number } | null = null;

  /* ------------------------------------------------------- the choosing --- */

  const linesOf = (who: AdvisorId, pool: PoolKey): readonly KataLine[] => copy.advisors[who][pool] ?? [];

  function holdFor(line: KataLine): number {
    const base = line.be.length > CLAUSE_BREAK ? HOLD_LONG : HOLD_SHORT;
    return base + (line.gloss ? HOLD_GLOSS : 0);
  }

  /** A line out of a pool that is not the one this villager last said out of
   *  it. `keep` narrows the pool first (the shove lines are held back from the
   *  general chatter); if nothing survives the filter the whole pool is used. */
  function pickLine(who: AdvisorId, pool: PoolKey, keep?: (l: KataLine) => boolean): KataLine | null {
    const all = linesOf(who, pool);
    if (all.length === 0) return null;
    const narrowed = keep ? all.filter(keep) : all;
    const src = narrowed.length > 0 ? narrowed : all;
    const prev = lastSaid.get(who + ':' + pool);
    const fresh = src.length > 1 ? src.filter((l) => l.be !== prev) : src;
    const from = fresh.length > 0 ? fresh : src;
    return from[Math.min(from.length - 1, Math.floor(random() * from.length))];
  }

  /** Whoever has been quiet longest and has something to say here. */
  function choose(pool: PoolKey, exclude?: AdvisorId): AdvisorId | null {
    const able = ADVISORS.filter((w) => w !== exclude && linesOf(w, pool).length > 0);
    if (able.length === 0) return null;
    let cand = able.filter((w) => w !== lastWho);
    if (cand.length === 0) cand = able;
    cand.sort((a, b) => spokeAt[a] - spokeAt[b]);
    /* Least-recent by default, but not so reliably that the room turns into a
       rota the player can predict. */
    if (cand.length > 1 && random() < 0.4) return cand[1];
    return cand[0];
  }

  /** The only place a Speech is made. Callers do the gating; this one just
   *  commits — it always speaks if the pool has anything in it. */
  function say(who: AdvisorId, pool: PoolKey, at: number, line?: KataLine | null): Speech | null {
    const l = line ?? pickLine(who, pool);
    if (!l) return null;
    lastSaid.set(who + ':' + pool, l.be);
    uses.set(pool, (uses.get(pool) ?? 0) + 1);
    lastWho = who;
    spokeAt[who] = at;
    const hold = holdFor(l);
    bubbleUntil = at + hold;
    quietUntil = bubbleUntil + BREATH;
    return { who, be: l.be, gloss: l.gloss, hold };
  }

  const free = (at: number, pool?: PoolKey) => at >= quietUntil && (!pool || at >= (poolUntil.get(pool) ?? 0));

  function queue(who: AdvisorId | null, pool: PoolKey, life: number, at: number) {
    /* One thing owed at a time. A one-shot outranks a pairing: the pairing is
       colour, the one-shot is information the player needs. */
    if (pending && pending.until > at && life <= PAIR_LIFE) return;
    pending = { who, pool, until: at + life };
  }

  /** Ганна and Сымон on the same bun, one after the other. The disagreement is
   *  the whole reason both of them are at the table. */
  function maybePair(who: AdvisorId, pool: PoolKey, at: number) {
    if (who !== 'hanna' && who !== 'symon') return;
    if (random() >= PAIR_CHANCE) return;
    const other: AdvisorId = who === 'hanna' ? 'symon' : 'hanna';
    if (linesOf(other, pool).length === 0) return;
    queue(other, pool, PAIR_LIFE, at);
  }

  /* --------------------------------------------------------------- act I --- */

  function greeting(): Speech | null {
    if (greeted) return null;
    const at = now();
    greeted = true;
    const who = choose('greeting');
    if (!who) return null;
    const s = say(who, 'greeting', at);
    if (s) maybePair(who, 'greeting', at);
    return s;
  }

  function fireDoughLow(at: number): Speech | null {
    if (doughLowSaid) return null;
    if (!free(at)) {
      doughLowSaid = true;
      queue(null, 'doughLow', ONESHOT_LIFE, at);
      return null;
    }
    doughLowSaid = true;
    const who = choose('doughLow');
    return who ? say(who, 'doughLow', at) : null;
  }

  function tailNext(): Speech | null {
    if (tailSaid) return null;
    const at = now();
    tailSaid = true;
    if (!free(at)) {
      /* The last ball is the tail and the player has to be told before they
         pinch it off, so this one waits rather than being lost. */
      queue(null, 'tailNext', ONESHOT_LIFE, at);
      return null;
    }
    const who = choose('tailNext');
    return who ? say(who, 'tailNext', at) : null;
  }

  /** Which pool a finished bun belongs to. The bake always qualifies; the size
   *  only at the ends of its range. Whichever has been heard less wins. */
  function poolForBun(size: number, bake: PoolKey): PoolKey {
    const cands: PoolKey[] = [bake];
    if (size >= BIG_BUN) cands.push('bigBun');
    else if (size <= SMALL_BUN) cands.push('smallBun');
    if (cands.length === 1) return cands[0];
    const a = uses.get(cands[0]) ?? 0;
    const b = uses.get(cands[1]) ?? 0;
    if (a === b) return cands[Math.floor(random() * 2) % 2];
    return a < b ? cands[0] : cands[1];
  }

  function onBun(index: number, size: number, bake: PoolKey, doughLeft: number, at: number): Speech | null {
    /* The trough running dry outranks any opinion about the bun that emptied
       it, and counts as this bun's remark so the two never stack. */
    if (!doughLowSaid && index > 0 && doughLeft <= DOUGH_LOW) {
      lastBunSaid = index;
      return fireDoughLow(at);
    }

    /* The first bun and the tail always get an answer; between them, about
       every other one. Six remarks in a row would be a lecture. */
    const must = index === 0 || index === K.TAIL;
    if (!must && index - lastBunSaid < 2) return null;
    if (!free(at)) return null;

    const pool = poolForBun(size, bake);
    const who = choose(pool);
    if (!who) return null;
    const s = say(who, pool, at);
    if (!s) return null;
    lastBunSaid = index;
    if (pool === 'bigBun' || pool === 'smallBun') maybePair(who, pool, at);
    return s;
  }

  /* -------------------------------------------------------------- act II --- */

  function onSwingStart(at: number): Speech | null {
    if (!free(at, 'swing')) return null;
    const who = choose('swing');
    if (!who) return null;
    poolUntil.set('swing', at + SHOVE_COOL);
    return say(who, 'swing', at, pickLine(who, 'swing'));
  }

  /** Announced hands, out of the dedicated `shove` pool. Алесік owns the shove
   *  itself («Я штурхну!») and Сымон the answer to it (wait it out) — they take
   *  turns, because hearing the same one every time turns a warning into
   *  wallpaper — and once in a while Ганна gets a word in about grip. */
  function onShove(at: number): Speech | null {
    if (!free(at, 'shove')) return null;
    shoveTurn = !shoveTurn;
    let who: AdvisorId = shoveTurn ? 'alesik' : 'symon';
    if (who === lastWho) who = who === 'alesik' ? 'symon' : 'alesik';
    if (lastWho !== 'hanna' && random() < 0.15) who = 'hanna';
    poolUntil.set('shove', at + SHOVE_COOL);
    return say(who, 'shove', at, pickLine(who, 'shove'));
  }

  function onBite(hit: boolean, tail: boolean, at: number): Speech | null {
    /* The tail stretch belongs to the HUD. Anything in a bubble over it is a
       villager talking across the only shot that decides the game. */
    if (inTail || tail) return null;
    bites += 1;
    /* Each pool answers at most every other bite, counted separately: a run of
       hits and a run of misses are two different things to have an opinion
       about, and there are only five bites in a round to have one on. */
    const pool = hit ? 'playerHit' : 'playerMiss';
    const last = lastBiteSaid[pool];
    if (last > 0 && bites - last < 2) return null;
    if (!free(at, pool)) return null;
    const who = choose(pool);
    if (!who) return null;
    const s = say(who, pool, at);
    if (!s) return null;
    lastBiteSaid[pool] = bites;
    poolUntil.set(pool, at + BITE_COOL);
    return s;
  }

  /* ------------------------------------------------------------- wiring --- */

  function onEvent(e: CoreEvent): Speech | null {
    const at = now();
    switch (e.type) {
      case 'bunDone':
        return onBun(e.index, e.bun.size, e.bun.bake, e.doughLeft, at);
      case 'doughOut':
        return fireDoughLow(at);
      case 'swingStart':
        return onSwingStart(at);
      case 'shove':
        return onShove(at);
      case 'tailPhase':
        inTail = true;
        return null;
      case 'bite':
        return onBite(e.hit, e.tail, at);
      default:
        /* started, intoOven, hung, jump, pieceLost, tailMiss, finish: the HUD
           and the scene say all of these better than a villager could. */
        return null;
    }
  }

  function followUp(): Speech | null {
    if (!pending) return null;
    const at = now();
    if (at < bubbleUntil) return null;
    const p = pending;
    if (at > p.until) {
      pending = null;
      return null;
    }
    pending = null;
    const who = p.who ?? choose(p.pool);
    return who ? say(who, p.pool, at) : null;
  }

  function epilogue(won: boolean): Speech[] {
    const at = now();
    const pool: PoolKey = won ? 'win' : 'lose';
    /* A win is the boy's moment and a loss is the women's; either way two
       voices, so the room sounds like a room and not like a verdict. */
    const order: AdvisorId[] = won ? ['alesik', 'hanna', 'symon'] : ['hanna', 'symon', 'alesik'];
    const first = random() < 0.6 ? order[0] : order[1];
    const rest = order.filter((w) => w !== first);
    const second = rest[Math.floor(random() * rest.length) % rest.length];

    const out: Speech[] = [];
    const a = say(first, pool, at);
    if (a) out.push(a);
    const b = say(second, pool, at + (a ? a.hold : 0));
    if (b) out.push(b);
    return out;
  }

  function reset() {
    bubbleUntil = 0;
    quietUntil = 0;
    lastWho = null;
    spokeAt.hanna = 0;
    spokeAt.symon = 0;
    spokeAt.alesik = 0;
    lastSaid.clear();
    uses.clear();
    poolUntil.clear();
    greeted = false;
    tailSaid = false;
    doughLowSaid = false;
    inTail = false;
    lastBunSaid = -2;
    bites = 0;
    lastBiteSaid.playerHit = 0;
    lastBiteSaid.playerMiss = 0;
    shoveTurn = false;
    pending = null;
  }

  return { greeting, tailNext, onEvent, followUp, epilogue, reset };
}
