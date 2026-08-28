export type Lang = 'en' | 'ru' | 'be';

export interface WorkItem {
  title: string;
  tag: string;
  meta: string;
  href: string;
  linkLabel: string;
  body: string[];
}

/** A tap target on the hero picture: one of the three who live in it. */
export interface HeroSpot {
  key: 'me' | 'bird' | 'dog';
  /** Accessible name for the marker button. */
  label: string;
  name: string;
  text: string;
  /** Label on the play button; the recording is optional and may be missing. */
  listen: string;
}

export interface RecordEntry {
  years: string;
  title: string;
  note: string;
}

export type ShelfStatus = 'alive' | 'wip' | 'shipped' | 'dead' | 'exp';

export interface ProjectCard {
  name: string;
  tagline: string;
  years: string;
  status: ShelfStatus;
  /** Omitted for projects with nothing public to point at. */
  href?: string;
  linkLabel?: string;
  body: string[];
  stack: string[];
}

export interface ShelfItem {
  name: string;
  years: string;
  note: string;
  status: ShelfStatus;
  href?: string;
}

/** A game is either playable or still on the roadmap; there is no third state. */
export type GameStatus = 'live' | 'planned';

export interface GameCard {
  slug: string;
  /** The Belarusian name, in every language. The games are their own words. */
  name: string;
  gloss: string;
  status: GameStatus;
  /** Only a playable game has a page to point at. */
  href?: string;
}

/** One bun on the cat. The name stays Belarusian; the gloss follows the page. */
export interface KataPiece {
  be: string;
  gloss: string;
}

/**
 * One spoken line. The villagers speak Belarusian on every page — the `be`
 * strings are identical in all three blocks — and the gloss follows the page
 * language ('' when the page is already Belarusian).
 */
export interface KataLine {
  be: string;
  gloss: string;
}

/**
 * A villager at the table. All three are invented, they disagree on purpose,
 * and every mechanical claim any of them makes is true of the actual game.
 * Pools are arrays so the drama module can vary what gets said.
 */
export interface KataAdvisor {
  /** Display name in the page language. */
  name: string;
  /** One word for what this one is: generous, thrifty, the boy. */
  tag: string;
  /** Act I: the table takes sides before the first ball is torn off. */
  greeting: KataLine[];
  /** Act I reactions, fired off core events as the buns are made. */
  bigBun: KataLine[];
  smallBun: KataLine[];
  raw: KataLine[];
  golden: KataLine[];
  burnt: KataLine[];
  doughLow: KataLine[];
  tailNext: KataLine[];
  /** Act II: chatter and taunts while the cord swings. */
  swing: KataLine[];
  /** Act II: the announced shove — the threat, or the coaching against it. */
  shove: KataLine[];
  playerHit: KataLine[];
  playerMiss: KataLine[];
  /** The epilogue, from each of them. */
  win: KataLine[];
  lose: KataLine[];
}

export interface KataCopy {
  name: string;
  gloss: string;
  title: string;
  description: string;
  kicker: string;
  lede: string;
  howLabel: string;
  how: string[];
  start: string;
  again: string;
  jump: string;
  soundOn: string;
  soundOff: string;
  /** The two stage sizes, like a player: the page column, or the window. */
  viewWide: string;
  viewNormal: string;
  /** The two halves of the rite, and the labels around them. */
  actBake: string;
  actBite: string;
  dough: string;
  weight: string;
  bakes: { raw: string; golden: string; burnt: string };
  yours: string;
  rivals: string;
  tries: string;
  shove: string;
  sceneAlt: string;
  bestLabel: string;
  bestWon: string;
  bestNone: string;
  pieces: KataPiece[];
  /** The title card before the door opens, and the one tap that skips it. */
  prologue: {
    /** Title-card lines: the same date and place the kicker carries. */
    card: string[];
    /** One sentence of scene-setting, and nothing else. */
    scene: string;
    skip: string;
  };
  /** The standing goal, shown through both acts, and what each act asks for. */
  goal: {
    standing: string;
    bake: string;
    bite: string;
  };
  /** `{piece}`, `{bake}` and `{n}` are filled in by the game. */
  msg: {
    idle: string;
    shape: string;
    bake: string;
    baked: string;
    tailNext: string;
    doughOut: string;
    hung: string;
    ready: string;
    hit: string;
    miss: string;
    tail: string;
    tailMiss: string;
    win: string;
    lose: string;
  };
  /** The three at the table. Keys are the `AdvisorId` the game's types define. */
  advisors: {
    hanna: KataAdvisor;
    symon: KataAdvisor;
    alesik: KataAdvisor;
  };
  /** After the last bite: the outcome, the calendar, and the record itself. */
  epilogue: {
    win: string;
    lose: string;
    /** Tomorrow the fast begins and takes the games with it. */
    calendar: string;
    docLabel: string;
    /** Two or three short facts off the State List entry. */
    facts: string[];
    /** Says plainly that the three villagers are ours, not the record's. */
    invented: string;
  };
  sourceLabel: string;
  source: string;
  honestyLabel: string;
  honesty: string;
  calendarLabel: string;
  calendar: string;
  choicesLabel: string;
  choices: string;
  back: string;
}

/**
 * The same person in three scripts. The site is read in Russian and Belarusian
 * too, and a page whose title and heading are Latin gives a Cyrillic search
 * nothing to match. So each language names him in its own script, and the
 * other spellings are stated once so the three pages are visibly one person.
 */
export interface Identity {
  /** As the heading and the titles say it on this language's pages. */
  name: string;
  /** With the patronymic. The full legal form, stated once, in the footer. */
  full: string;
  /** Label in front of the other spellings. */
  alsoLabel: string;
  /** The same name in the other scripts. */
  also: string[];
}

export interface Dictionary {
  lang: Lang;
  path: string;
  identity: Identity;
  metaTitle: string;
  metaDescription: string;
  langLabel: string;
  skipLink: string;
  lampLabel: string;
  nav: {
    blog: string;
    projects: string;
    games: string;
    papers: string;
  };
  blog: {
    label: string;
    all: string;
    title: string;
    description: string;
    min: string;
  };
  hero: {
    greeting: string;
    role: string;
    chips: string[];
    lead: string;
    lead2: string;
    ctaEmail: string;
    ctaAdlega: string;
    photoAlt: string;
    hint: string;
    spots: HeroSpot[];
    spotClose: string;
  };
  work: {
    label: string;
    items: WorkItem[];
  };
  shelf: {
    label: string;
    all: string;
    statuses: Record<ShelfStatus, string>;
    items: ShelfItem[];
  };
  projects: {
    label: string;
    title: string;
    description: string;
    lede: string;
    activeLabel: string;
    archiveLabel: string;
    archiveNote: string;
    stackLabel: string;
    items: ProjectCard[];
  };
  games: {
    label: string;
    title: string;
    description: string;
    lede: string;
    framing: string;
    rulesLabel: string;
    rules: string[];
    statuses: Record<GameStatus, string>;
    play: string;
    soon: string;
    items: GameCard[];
    kata: KataCopy;
  };
  toy: {
    title: string;
    target: string;
    growth: string;
    churn: string;
    button: string;
    note: string;
    months: string;
  };
  record: {
    label: string;
    entries: RecordEntry[];
    stack: string;
  };
  contact: {
    label: string;
    lede: string;
    email: string;
  };
  leaf: {
    /** Accessible name for the tear-off calendar. */
    label: string;
    caption: string;
  };
  /** Accessible name for the social icon row. */
  socialsLabel: string;
  consent: {
    /** Accessible name for the cookie notice. */
    label: string;
    text: string;
    /** Link out to Google's own account of what it does with the data. */
    more: string;
    accept: string;
    decline: string;
  };
  notFound: {
    title: string;
    text: string;
    home: string;
  };
}

export const en: Dictionary = {
  lang: 'en',
  path: '/',
  identity: {
    name: 'Dmitriy Semenkevich',
    full: 'Dmitriy Semenkevich',
    alsoLabel: 'also written',
    also: ['Дмитрий Семенкевич', 'Дзмітрый Семянкевіч'],
  },
  metaTitle: 'Dmitriy Semenkevich — full-stack engineer & founder',
  metaDescription:
    'Fifteen years of production software: payments infrastructure, a trade-in platform in 16,000 stores. Co-founder of Adlega, an AI CFO for SaaS founders.',
  langLabel: 'Language',
  skipLink: 'Skip to content',
  lampLabel: 'Toggle the lamp',
  nav: {
    blog: 'writing',
    projects: 'my projects',
    games: 'games',
    papers: 'papers',
  },
  blog: {
    label: 'Writing',
    all: 'all essays →',
    title: 'Writing — Dmitriy Semenkevich',
    description:
      'Essays and build logs by Dmitriy Semenkevich: AI products that don’t guess, financial engines, web experiments.',
    min: 'min read',
  },
  hero: {
    greeting: 'hi, I’m',
    role: 'Full-stack engineer · Co-founder of Adlega',
    chips: ['engineer · 15 years', 'co-founder @ Adlega'],
    lead: 'Fifteen years building software where a wrong number costs real money: payments, a device trade-in platform in 16,000 stores — and now Adlega, an AI CFO with one rule: the AI never does the math.',
    lead2:
      'Between releases I poke at the digital world — experiments, new tools, pop-science rabbit holes. This site is my workshop.',
    ctaEmail: 'Write me',
    ctaAdlega: 'See Adlega',
    photoAlt:
      'A felt-and-clay figurine of Dmitriy: a laptop on his lap, a yellow canary on his shoulder, a grey dog sitting beside him',
    hint: 'it comes alive now and then. the marks tell you who is who.',
    spots: [
      {
        key: 'me',
        label: 'About me, Dmitriy',
        name: 'And this is me',
        text: 'I am from Belarus, so even the figurine is carved the way our old dolls are, and the ornament behind it is a different Belarusian pattern every single day. Thank you for stopping by the workshop — come along, the digital world still has plenty left to find.',
        listen: 'hear my voice',
      },
      {
        key: 'bird',
        label: 'About the canary',
        name: 'My canary',
        text: 'A kenar, and an absurdly good singer. He is the reason I get to catch my breath between whatever Zoom has already planned.',
        listen: 'hear him sing',
      },
      {
        key: 'dog',
        label: 'About Zoom, the dog',
        name: 'Zoom',
        text: 'My Weimaraner, and the most relentlessly energetic creature I know. He loves people, he loves hunting, and he trains my nerves daily. He turns up frogs, hedgehogs, hares and brand-new adventures faster than I can ship — which is, more or less, the pace he expects from me.',
        listen: 'hear him bark',
      },
    ],
    spotClose: 'Close',
  },
  work: {
    label: 'Building now',
    items: [
      {
        title: 'Adlega',
        tag: 'an AI CFO for SaaS founders',
        meta: 'co-founder · 2024 —',
        href: 'https://adlega.com',
        linkLabel: 'adlega.com',
        body: [
          'Describe your business in a chat and get a working financial model: revenue, burn, runway, what-if scenarios. Minutes instead of weeks in a spreadsheet.',
          'The design decision that defines the product: the AI never does the math. Agents interview the founder, fill the model, explain any number and run goal-seek — “how do I triple my MRR?” — but every figure comes from a deterministic engine, tested to stay within 0.5% of the hand-built Excel model it replaced.',
        ],
      },
    ],
  },
  shelf: {
    label: 'The shelf',
    all: 'all projects →',
    statuses: {
      alive: 'alive',
      wip: 'in progress',
      shipped: 'shipped',
      dead: 'dead',
      exp: 'experiment',
    },
    items: [
      {
        name: 'whotop',
        years: '2026 —',
        note: 'Terminal tool that tells look-alike processes apart and names the ports they hold.',
        status: 'alive',
        href: 'https://github.com/dimhold/whotop',
      },
      {
        name: 'Belun',
        years: '2025 —',
        note: '90+ browser utilities; no servers, no accounts, files never leave your machine.',
        status: 'alive',
        href: 'https://belun.app',
      },
      {
        name: 'Rando4.me',
        years: '2014 – 2024',
        note: 'Co-founded; a mobile app that ran for a decade. It never became a business, the lessons stayed.',
        status: 'dead',
      },
    ],
  },
  projects: {
    label: 'My projects',
    title: 'My projects — Dmitriy Semenkevich',
    description:
      'The projects I run today: Adlega, an AI CFO for SaaS founders; Belun, a browser toolbox that never uploads your files; whotop, which tells look-alike processes apart; and this workshop of a site.',
    lede: 'Everything that is running right now — why it exists, and what it is built on. Work that finished its run is on the shelf below, dead ends included.',
    activeLabel: 'Running now',
    archiveLabel: 'The shelf',
    archiveNote: 'Older work, kept honest — including the parts that died.',
    stackLabel: 'built with',
    items: [
      {
        name: 'Adlega',
        tagline: 'an AI CFO for SaaS founders',
        years: '2024 —',
        status: 'alive',
        href: 'https://adlega.com',
        linkLabel: 'adlega.com',
        body: [
          'Describe your business in a chat and get a working financial model: revenue, burn, runway, what-if scenarios. Minutes instead of weeks in a spreadsheet.',
          'The design decision that defines the product: the AI never does the math. Agents interview the founder, fill the model, explain any number and run goal-seek — “how do I triple my MRR?” — but every figure comes from a deterministic engine, tested to stay within 0.5% of the hand-built Excel model it replaced.',
          'I co-founded it and build it end to end: the agents, the engine, and the interface the model lives in.',
        ],
        stack: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'LLM agents'],
      },
      {
        name: 'Belun',
        tagline: 'a browser toolbox that never uploads your files',
        years: '2025 —',
        status: 'alive',
        href: 'https://belun.app',
        linkLabel: 'belun.app',
        body: [
          '90+ small tools that live entirely in a browser tab: convert, compress, clean up, inspect. No servers, no accounts, no uploads — files never leave your machine.',
          'It started as a private pile of scripts I kept rewriting from memory. Collecting them into one page is what made them worth keeping.',
        ],
        stack: ['TypeScript', 'WebAssembly', 'Web Workers', 'static hosting'],
      },
      {
        name: 'whotop',
        tagline: 'what is this process, and which port is it holding?',
        years: '2026 —',
        status: 'alive',
        href: 'https://github.com/dimhold/whotop',
        linkLabel: 'github.com/dimhold/whotop',
        body: [
          'A terminal tool that reads the process table and the socket table together, then reads what is actually in each command line. A screen full of identical node rows becomes an agent session, two dev servers told apart by the project they run in, and the orphan that has been sitting on your port since you switched branches an hour ago.',
          'It exists because I killed the wrong node. Six of them, all mine, all called node, and the list said nothing about which was which. Every fact I needed was already there — the command line, the working directory, the parent that had exited — the operating system just never puts them next to the pid.',
          'It refuses to guess quietly: --explain names the rule behind every label, and says what the platform flatly refused to disclose. Then it will kill by port or by pid, after showing you exactly what it resolved.',
        ],
        stack: ['TypeScript', 'Node.js', 'zero runtime dependencies'],
      },
      {
        name: 'dimhold.by',
        tagline: 'this workshop, in three languages',
        years: '2025 —',
        status: 'wip',
        href: '/blog/',
        linkLabel: 'build log',
        body: [
          'The site you are reading. A static workshop in English, Russian and Belarusian, holding the essays, the toys and the experiments that belong nowhere else.',
          'Built to stay fast and nearly free: no framework shipped to the page, images and clips prepared ahead of time, everything served as flat files.',
        ],
        stack: ['Astro', 'TypeScript', 'hand-written CSS', 'GitHub Pages'],
      },
    ],
  },
  games: {
    label: 'Games',
    title: 'Games — how Belarus played',
    description:
      'Belarusian folk games, adapted for a browser. Each one names who recorded it, where and when, and says plainly how much of it is shared with the neighbours.',
    lede: 'Belarusian folk games you can actually play here. Not “games only Belarus has” — there are almost none of those, and the Belarusian ethnographers are the ones who say so — but how Belarus played: the particular words, the particular implement, the particular place in the farming year.',
    framing:
      'The corpus is distinctive in its vocabulary, its song text, its implement and its calendar, and largely shared in mechanics with Russia, Ukraine and Poland. That turns out to be the better story, and it has the advantage of being true.',
    rulesLabel: 'What this section holds itself to',
    rules: [
      'Every game names who recorded it, where and when.',
      'No claim the sources do not make. “Unique to Belarus” is reserved for the handful of games where the record actually says it.',
      'No invented rules. Where the record is silent and a number had to be chosen, the page says we chose it.',
    ],
    statuses: { live: 'playable', planned: 'in the works' },
    play: 'play →',
    soon: 'not built yet',
    items: [
      {
        slug: 'kata-piachy',
        name: '«Ката пячы»',
        gloss:
          'A cat modelled out of buns hangs from the ceiling. You ride up on a pitchfork and jump to bite a piece off it while everybody shoves you. Whoever bites the tail wins.',
        status: 'live',
        href: '/games/kata-piachy/',
      },
      {
        slug: 'lianok',
        name: '«Лянок»',
        gloss:
          'The whole flax chain in eight stages — pulling, threshing, retting, braking, weaving, bleaching, cutting, sewing — answered back on the beat. The cloth you finish with is a real ornament.',
        status: 'planned',
      },
      {
        slug: 'pannachka',
        name: '«Панначка»',
        gloss:
          'A ring of girls, each carrying a lit candle, each trying to blow out a neighbour’s flame while shielding her own. It does not end in elimination: the last flame goes round and relights the rest.',
        status: 'planned',
      },
      {
        slug: 'hrahi',
        name: '«Грахі»',
        gloss:
          'A ball rolled along a row of holes. Miss and a sin drops into your own hole; hit and it drops into your victim’s. And the players carrying sins get fewer throws — guilt reduces your right to punish.',
        status: 'planned',
      },
      {
        slug: 'zanicba-cyareski',
        name: '«Жаніцьба Цярэшкі»',
        gloss:
          'The Kalyady mock-wedding, and the one game an authority calls unique to Belarus. You are the свацця, pairing the room off couple by couple; the songs are the state transitions.',
        status: 'planned',
      },
    ],
    kata: {
      name: '«Ката пячы»',
      gloss: 'baking the cat',
      title: '«Ката пячы» — a Belarusian folk game you can play',
      description:
        'On 27 November in Skirmantava a cat is modelled out of buns, hung from the ceiling and bitten at from a pitchfork; whoever bites the tail wins. Here you bake it first — and the cat you bake is the cat you have to bite.',
      kicker: '27 November · аг. Скірмантава · State List 33АК000117',
      lede: 'On the eve of the fast a cat is modelled out of buns and hung from the ceiling on a cord. One after another the players ride up on a pitchfork and jump to bite a piece off it, while everybody around does their best to shove them. Whoever bites the tail has won. The baking comes first, and it decides the rest: the cat you bake is the cat you then have to bite.',
      howLabel: 'How it is played here',
      how: [
        'Hold to pinch dough off the trough. A big bun is a wide mouthful later; a small one is a hard one — and a small bun browns faster, so it is easier to burn.',
        'There is one trough for all six buns, and the sixth is the tail, the piece that decides the game. Leave it something.',
        'Press when the loaf turns golden. Raw is heavy and slippery, burnt is crisp and wide but light as air.',
        'Then the cat is hung and you bite. A heavy cat swings lazily, a light one goes wild — and it gets lighter with every piece taken off it.',
      ],
      start: 'Knead',
      again: 'Again',
      jump: 'Hold to shape the bun, press to pull it out, press to bite',
      soundOn: 'sound on',
      soundOff: 'sound off',
      viewWide: 'wide stage',
      viewNormal: 'usual stage',
      actBake: 'baking',
      actBite: 'biting',
      dough: 'trough',
      weight: 'weight',
      bakes: { raw: 'raw', golden: 'golden', burnt: 'burnt' },
      yours: 'yours',
      rivals: 'theirs',
      tries: 'attempts',
      shove: 'a shove!',
      sceneAlt:
        'A cat modelled out of buns hangs by a cord from the ceiling beam, with a boy on a pitchfork below it, an oven and a dough trough beside them, and the rest of the room around.',
      bestLabel: 'best so far',
      bestWon: 'took the tail',
      bestNone: 'nothing yet',
      pieces: [
        { be: 'вуха', gloss: 'the ear' },
        { be: 'лапа', gloss: 'a paw' },
        { be: 'лапа', gloss: 'the other paw' },
        { be: 'бок', gloss: 'the side' },
        { be: 'галава', gloss: 'the head' },
        { be: 'хвост', gloss: 'the tail' },
      ],
      prologue: {
        card: ['27 November', 'аг. Скірмантава'],
        scene:
          'Winter, evening, the last one before the fast. One window is lit, and inside it the kneading has already started.',
        skip: 'skip',
      },
      goal: {
        standing: 'bite off the tail',
        bake: 'six buns out of one trough; the sixth is the tail',
        bite: 'every piece you take is one more try at the tail',
      },
      msg: {
        idle: 'The trough is full and the oven is hot. Six buns make a cat.',
        shape: 'Hold, and the ball grows. This one is {piece}.',
        bake: 'Into the oven. Press when it goes golden.',
        baked: '{piece} — {bake}.',
        tailNext: 'The last one is the tail, and it decides the game. Dough left: {n}.',
        doughOut: 'The trough is scraped out — whatever is left has to be the bun.',
        hung: 'The cat is baked and hung. Now bite it.',
        ready: 'Bite off {piece}.',
        hit: 'Yours — {piece}. The cat is lighter now, and faster.',
        miss: 'Missed, and {piece} went to somebody else.',
        tail: 'Only the tail is left, and the cord is swinging its fastest. {n} attempts.',
        tailMiss: 'Missed. {n} left.',
        win: 'You bit the tail. The game is yours.',
        lose: 'The tail went to somebody else. Next 27 November, then.',
      },
      advisors: {
        hanna: {
          name: 'Hanna',
          tag: 'generous',
          greeting: [
            { be: 'Кладзі больш. Малы кот — малая радасць.', gloss: 'Put more in. A small cat is a small joy.' },
            { be: 'Не шкадуй цеста, і будзе што кусаць.', gloss: 'Don’t spare the dough and there will be something to bite.' },
          ],
          bigBun: [
            { be: 'Вось гэта булка. Пад такую і рот шырэй.', gloss: 'Now that’s a bun. A mouth opens wider for one of those.' },
            { be: 'Правільна. Чым большая, тым лягчэй у яе трапіць.', gloss: 'Right. The bigger it is, the easier to catch.' },
            { be: 'І пячэцца спакайней — вялікае не так хутка гарыць.', gloss: 'And it bakes calmer — big doesn’t burn so fast.' },
          ],
          smallBun: [
            { be: 'Гэта не булка, гэта гузік.', gloss: 'That’s not a bun, that’s a button.' },
            { be: 'Малую і спаліць лягчэй, і ўкусіць вузка. Навошта табе двойчы кепска?', gloss: 'A small one burns easier and bites narrower. Why do you want it bad twice over?' },
            { be: 'Шкадуеш цеста? Яно ж не срэбра.', gloss: 'Sparing the dough? It isn’t silver.' },
          ],
          raw: [
            { be: 'Сыраватая. Затое цяжкая — кот павісне спакойна.', gloss: 'A bit raw. Heavy, though — the cat will hang quiet.' },
            { be: 'Недапечаная. Вузка кусаць будзе, але вага ў ёй ёсць.', gloss: 'Underdone. Narrow to bite, but there is weight in it.' },
          ],
          golden: [
            { be: 'Залатая. Такую і паказаць не сорамна.', gloss: 'Golden. Nothing to be ashamed of there.' },
            { be: 'Во, у самы раз. Кладзі на стол.', gloss: 'There, just right. Put it on the table.' },
          ],
          burnt: [
            { be: 'Спаліў. Ну хоць шырокая — хрумсткае кусаецца лёгка.', gloss: 'Burnt it. Well, at least it is wide — crisp bites easy.' },
            { be: 'Чорная і лёгкая, як папера. Кот з такіх будзе скакаць.', gloss: 'Black and light as paper. A cat of those will jump.' },
          ],
          doughLow: [
            { be: 'Дно відаць. Ну затое пяць булак як булкі.', gloss: 'I can see the bottom. Five proper buns, at least.' },
            { be: 'Цеста мала. Хай сабе малы хвост — хвост ёсць хвост.', gloss: 'Little dough left. Let the tail be small — a tail is a tail.' },
          ],
          tailNext: [
            { be: 'Апошні — хвост. Што ў дзяжы, тое і будзе.', gloss: 'The last one is the tail. Whatever is in the trough, that is what it gets.' },
            { be: 'Хвост. Дай яму ўсё, што засталося, — больш узяць няма адкуль.', gloss: 'The tail. Give it everything left — there is nowhere else to take it from.' },
          ],
          swing: [
            { be: 'Рот наперад! Не бокам!', gloss: 'Mouth forward! Not sideways!' },
            { be: 'Хапай большы кавалак, не дзяўбі па крошцы.', gloss: 'Take a big bite, don’t peck at crumbs.' },
            { be: 'Ну чаго чакаеш? Ён сам да рота не прыйдзе.', gloss: 'What are you waiting for? It won’t come to your mouth by itself.' },
          ],
          shove: [
            { be: 'Штурхаюць! Трымайся за вілы.', gloss: 'They’re shoving! Hold on to the pitchfork.' },
            { be: 'Шырокі кавалак і штуршка не баіцца.', gloss: 'A wide piece isn’t afraid of a shove.' },
          ],
          playerHit: [
            { be: 'Во! Я ж казала — шырокая булка, шырокі ўкус.', gloss: 'There! I said it — a wide bun, a wide bite.' },
            { be: 'Твой кавалак. І яшчэ адна спроба на хвост.', gloss: 'Yours. And one more try at the tail.' },
          ],
          playerMiss: [
            { be: 'Малавата было. Кажу ж — не шкадуй цеста.', gloss: 'Too little there. I keep saying: don’t spare the dough.' },
            { be: 'Міма. Нічога, кот цяпер лягчэйшы.', gloss: 'Missed. Never mind, the cat is lighter now.' },
          ],
          win: [
            { be: 'Во як трэба. Хвост твой, і размовы скончаны.', gloss: 'That’s how. The tail is yours and the argument is over.' },
            { be: 'Малайчына. Сядай, зараз есці будзем.', gloss: 'Well done. Sit down, we are eating now.' },
          ],
          lose: [
            { be: 'Шкада. Блізка ж быў.', gloss: 'A pity. It was close.' },
            { be: 'Ну, чужы хвост таксама хвост. На той год адкусіш.', gloss: 'Well, somebody’s tail is still a tail. You’ll take it next year.' },
          ],
        },
        symon: {
          name: 'Symon',
          tag: 'thrifty',
          greeting: [
            { be: 'Дзяжа адна, а булак шэсць. Лічы адразу.', gloss: 'One trough, six buns. Count it now.' },
            { be: 'Спачатку падумай, потым адрывай.', gloss: 'Think first, tear after.' },
          ],
          bigBun: [
            { be: 'Куды столькі? Гэта ж ты з хваста адарваў.', gloss: 'What do you need all that for? You just tore it off the tail.' },
            { be: 'Вялікая, вядома. А чым потым хвост лепім?', gloss: 'Big, sure. And what do we shape the tail out of?' },
          ],
          smallBun: [
            { be: 'Во. Малую і рабі — на хвост застанецца.', gloss: 'There. Make it small and there will be some left for the tail.' },
            { be: 'Разумна. Толькі малая гарыць хутка — не адыходзь ад печы.', gloss: 'Sensible. Only a small one burns fast — don’t leave the oven.' },
          ],
          raw: [
            { be: 'Ранавата выняў. Цяжкая, ды ўкус ад яе вузкі.', gloss: 'Out too early. Heavy, but the bite off it is narrow.' },
            { be: 'Сырое. Кот павісне цяжкі і спакойны — а кусаць нязручна.', gloss: 'Raw. The cat will hang heavy and calm — and be awkward to bite.' },
          ],
          golden: [
            { be: 'Во так. Залатая — і вага ёсць, і рот шырокі.', gloss: 'That’s it. Golden — it has weight and it has width.' },
            { be: 'Правільна вынуў. Больш нічога і не трэба.', gloss: 'Pulled at the right moment. Nothing more is needed.' },
          ],
          burnt: [
            { be: 'Перадзяржаў. Лёгкая, як вугаль, — цяпер кот пойдзе ў разнос.', gloss: 'Held it too long. Light as coal — now the cat will go wild.' },
            { be: 'Спаліў. Кусаць шырэй, ды гайданне будзе шалёнае.', gloss: 'Burnt. Wider to bite, but the swing will be mad.' },
          ],
          doughLow: [
            { be: 'Вось табе і дно дзяжы. А хвост яшчэ наперадзе.', gloss: 'There is the bottom of the trough for you. And the tail still to come.' },
            { be: 'Мала засталося. Далей толькі скрабі.', gloss: 'Little left. From here you are scraping.' },
          ],
          tailNext: [
            { be: 'Хвост. Усё, што ў дзяжы, — яму. Другога разу не будзе.', gloss: 'The tail. Everything in the trough goes to it. There is no second go.' },
            { be: 'Апошні кавалак вырашае гульню. Мераць ужо няма чаго.', gloss: 'The last piece decides the game. Nothing left to measure out.' },
          ],
          swing: [
            { be: 'Не спяшайся. Вяроўка сама вернецца.', gloss: 'No hurry. The cord comes back on its own.' },
            { be: 'Кожны ўзяты кавалак — яшчэ адна спроба на хвост.', gloss: 'Every piece you take is one more try at the tail.' },
          ],
          shove: [
            { be: 'Чакай, не скачы на штуршок. Перачакай яго.', gloss: 'Wait — don’t jump into the shove. Sit it out.' },
            { be: 'Замахнуліся. Пастой, хай пройдзе.', gloss: 'They’re winding up. Stand still, let it pass.' },
          ],
          playerHit: [
            { be: 'Добра. Спроба на хвост дадалася.', gloss: 'Good. One more try at the tail.' },
            { be: 'Узяў. Толькі памятай: кот цяпер лягчэйшы і хутчэйшы.', gloss: 'Taken. Only remember: the cat is lighter now, and faster.' },
          ],
          playerMiss: [
            { be: 'Раней трэба было. Ён ужо адыходзіў.', gloss: 'Should have gone sooner. It was already leaving.' },
            { be: 'Міма. Кавалак пайшоў іншаму, а кот усё роўна палягчэў.', gloss: 'Missed. The piece went to somebody else, and the cat got lighter anyway.' },
          ],
          win: [
            { be: 'Ну вось. А ты не хацеў лічыць.', gloss: 'There you are. And you didn’t want to count.' },
            { be: 'Хвост твой. Значыць, у дзяжы засталося акурат столькі, колькі трэба.', gloss: 'The tail is yours. So there was exactly enough left in the trough.' },
          ],
          lose: [
            { be: 'Не хапіла. Кажу ж — апошні кавалак вырашае.', gloss: 'Not enough. I keep saying: the last piece decides it.' },
            { be: 'Шкада. Ну хоць паглядзелі, як яно бывае.', gloss: 'A pity. Well, at least we watched how it goes.' },
          ],
        },
        alesik: {
          name: 'Alesik',
          tag: 'youngest',
          greeting: [
            { be: 'Я ў печ гляджу! Скажу, калі счарнее.', gloss: 'I’m watching the oven! I’ll say when it goes black.' },
            { be: 'А давайце спалім хоць адну. Ну хоць адну!', gloss: 'Let’s burn one. Just one, come on!' },
          ],
          bigBun: [
            { be: 'Вялікая! Такая доўга пячэцца — я пачакаю.', gloss: 'Big one! That will bake a long time — I’ll wait.' },
            { be: 'Ого. Пакуль яна счырванее, я тры разы збегаю.', gloss: 'Whoa. I can run out three times before that browns.' },
          ],
          smallBun: [
            { be: 'Малая счарнее ў момант. Не адыходзь!', gloss: 'A small one goes black in a blink. Don’t leave it!' },
            { be: 'Гэткая згарыць хутчэй за ўсіх. Здорава!', gloss: 'That will burn faster than any of them. Brilliant!' },
          ],
          raw: [
            { be: 'Рана! Яна ж яшчэ цеста. Цяжкая будзе — кот павісне як мех.', gloss: 'Too early! It’s still dough. It will be heavy — the cat will hang like a sack.' },
            { be: 'Сырая. Нудна. Вяроўка з ёй ледзь варушыцца.', gloss: 'Raw. Boring. The cord hardly moves with that on it.' },
          ],
          golden: [
            { be: 'Залатая... ну добра. Хоць адну ж дайце спаліць.', gloss: 'Golden... fine. Let me burn at least one, though.' },
            { be: 'Во, акурат. Толькі ж не цікава.', gloss: 'There, just right. Not interesting, though.' },
          ],
          burnt: [
            { be: 'Чорная! Цяпер кот скакаць будзе!', gloss: 'Black! Now the cat will jump!' },
            { be: 'Вугаль! Лёгкі, як пух, — вяроўка з розуму сыдзе.', gloss: 'Coal! Light as fluff — the cord will lose its mind.' },
            { be: 'Хрумсціць! І рот пад яе шырэйшы.', gloss: 'It crunches! And the mouth goes wider for it.' },
          ],
          doughLow: [
            { be: 'Цеста мала — значыць, апошняя згарыць у момант!', gloss: 'Little dough left — so the last one will burn in a blink!' },
            { be: 'Ужо дно? А я і не наеўся.', gloss: 'The bottom already? I didn’t even get full.' },
          ],
          tailNext: [
            { be: 'Хвост! Спаліце хвост — ён шырокі будзе, сам у рот трапіць!', gloss: 'The tail! Burn the tail — it will be wide, it will fall in your mouth by itself!' },
            { be: 'Апошні. Толькі не выцягвайце рана, сыры хвост вузкі.', gloss: 'The last one. Only don’t pull it early, a raw tail bites narrow.' },
          ],
          swing: [
            { be: 'Скачы! Ну скачы ўжо!', gloss: 'Jump! Come on, jump!' },
            { be: 'Глядзі, як лётае! Гэта таму, што лёгкі.', gloss: 'Look at it fly! That’s because it’s light.' },
          ],
          shove: [
            { be: 'Я штурхну! Я моцна штурхну!', gloss: 'I’ll shove! I’ll shove hard!' },
            { be: 'Зараз штурхнём! Трымайся, калі можаш!', gloss: 'Here comes a shove! Hold on if you can!' },
            { be: 'Гэта я! Гэта я цяпер штурхаю!', gloss: 'It’s me! It’s me shoving this time!' },
          ],
          playerHit: [
            { be: 'Адкусіў! Цяпер яшчэ хутчэй пойдзе!', gloss: 'Bit it off! Now it will go faster still!' },
            { be: 'Во! Яшчэ адну спробу зарабіў.', gloss: 'There! One more try earned.' },
          ],
          playerMiss: [
            { be: 'Міма-а! Я ж штурхнуў.', gloss: 'Mi-issed! That was me shoving.' },
            { be: 'Не туды! Ён жа ў той бок ляцеў.', gloss: 'Wrong way! It was going the other way.' },
          ],
          win: [
            { be: 'Хвост! Хвост адкусіў! Я ж казаў!', gloss: 'The tail! He bit the tail! I said so!' },
            { be: 'А заўтра можна яшчэ? ...Не, заўтра нельга.', gloss: 'Can we do it again tomorrow? ...No. Not tomorrow.' },
          ],
          lose: [
            { be: 'Э-эх. А я хацеў, каб згарэла ўсё.', gloss: 'Aww. And I wanted the whole thing burnt.' },
            { be: 'Не адкусіў. Ну хоць кот лётаў добра.', gloss: 'Didn’t get it. The cat flew nicely, though.' },
          ],
        },
      },
      epilogue: {
        win: 'The tail is yours. The cat is eaten to the last crumb, and the room goes quiet.',
        lose: 'The tail went to somebody else. The cat is eaten all the same, to the last crumb.',
        calendar:
          'Tomorrow morning Piĺipaŭka begins. The fast takes meat, and games along with it, all the way to Kalady.',
        docLabel: 'What is actually on the record',
        facts: [
          'The rite «Ката пячы» — State List of Historical and Cultural Values, 33АК000117, inscribed 2017.',
          'аг. Скірмантава, Dziaržynsk district.',
          'Carried by the Redźka family through «Сваякі» and «Весялуха» — every year since 1993.',
        ],
        invented:
          'Hanna, Symon and Alesik are ours. The list names the rite, not these people: the names, the arguing and every piece of advice are invented here.',
      },
      sourceLabel: 'Source',
      source:
        'State List of Historical and Cultural Values of the Republic of Belarus, 33АК000117, inscribed 2017: the rite «Ката пячы» of аг. Скірмантава, Dziaržynsk district. Carried by the Redźka family through the village ensembles «Сваякі» and «Весялуха», and held every year since 1993.',
      honestyLabel: 'How Belarusian it is',
      honesty:
        'One of the few games in the whole corpus with a uniqueness claim actually behind it: no Russian, Ukrainian or Polish equivalent turned up under any name. But what the state list protects is one village’s rite rather than a nationwide game — what is documented is Skirmantava’s, and that is how it is presented here.',
      calendarLabel: 'Why 27 November',
      calendar:
        'The eve of Piĺipaŭka. The food is deliberately fatty because the fast begins the next morning, and it bans meat — and games along with it.',
      choicesLabel: 'What we chose ourselves',
      choices:
        'From the record: the cat is baked out of buns, it is hung from the ceiling, you ride up on a pitchfork, the others shove, and the tail decides it. Everything with a number on it is ours — how much dough the trough holds, what a bun’s size is worth in the biting, what raw and burnt do to the swing, how many attempts the tail allows. The baking half is played here as a game of its own, which the record does not describe; it describes the buns, not a contest over them. So are the three at the table: Hanna, Symon and Alesik are invented, and their advice contradicts itself on purpose — because variant traditions really do disagree, not because one of the three is right.',
      back: 'all games',
    },
  },
  toy: {
    title: 'try the philosophy →',
    target: 'goal: ×3 MRR in 24 months',
    growth: 'growth, %/mo',
    churn: 'churn, %/mo',
    button: 'goal-seek',
    note: 'not one of these numbers was computed by AI — a deterministic engine, like in Adlega.',
    months: 'mo',
  },
  record: {
    label: 'The record',
    entries: [
      {
        years: '2024 —',
        title: 'Adlega · co-founder',
        note: 'An AI CFO for SaaS founders. The product end to end: agents, deterministic engine, model UI.',
      },
      {
        years: '2022 —',
        title: 'Independent consultant',
        note: 'High-load payments (Modulr), enterprise and government systems.',
      },
      {
        years: '2014 – 2022',
        title: 'HYLA Mobile, an Assurant company · senior full-stack',
        note: 'Device trade-in platform running in 16,000+ stores. Led the monolith-to-microservices split; Gatling load testing.',
      },
      {
        years: '2013 – 2014',
        title: 'First startup & freelance',
        note: 'Co-founded a mobile startup. HTML5 video players, map rendering, small backends that ran for years untouched.',
      },
      {
        years: '2007 – 2012',
        title: 'BSUIR',
        note: 'Engineer’s degree in software engineering.',
      },
    ],
    stack:
      'Java · Spring · TypeScript · Angular · React · Node.js · PostgreSQL · Kafka · AWS · LLM agents',
  },
  socialsLabel: 'Elsewhere',
  leaf: {
    label: 'Tear-off calendar: a Belarusian word for today',
    caption: 'a Belarusian word a day',
  },
  contact: {
    label: 'Say hello',
    lede: 'Consulting, product feedback, interesting problems — the inbox is open.',
    email: 'dimhold@gmail.com',
  },
  consent: {
    label: 'Cookie notice',
    text: 'I count visits with Google Analytics — how many people come, and which pages get read. No advertising, no profiling, nothing sold on. Until you agree, nothing is written to your device.',
    more: 'What Google does with it',
    accept: 'Allow',
    decline: 'No thanks',
  },
  notFound: {
    title: 'Page not found',
    text: 'Nothing lives at this address.',
    home: 'Back to the front page',
  },
};

export const ru: Dictionary = {
  lang: 'ru',
  path: '/ru/',
  identity: {
    name: 'Дмитрий Семенкевич',
    full: 'Дмитрий Дмитриевич Семенкевич',
    alsoLabel: 'он же',
    also: ['Dmitriy Semenkevich', 'Дзмітрый Семянкевіч'],
  },
  metaTitle: 'Дмитрий Семенкевич (Dmitriy Semenkevich) — ИИ-архитектор и сооснователь Adlega',
  metaDescription:
    'Пятнадцать лет продакшен-разработки: платёжная инфраструктура, trade-in-платформа в 16 000 магазинов. Сооснователь Adlega — ИИ-финдиректора для SaaS-фаундеров.',
  langLabel: 'Язык',
  skipLink: 'К содержанию',
  lampLabel: 'Переключить лампу',
  nav: {
    blog: 'блог',
    projects: 'мои проекты',
    games: 'игры',
    papers: 'работы',
  },
  blog: {
    label: 'Статьи',
    all: 'все статьи →',
    title: 'Статьи — Дмитрий Семенкевич',
    description:
      'Статьи и билд-логи Дмитрия Семенкевича: ИИ-продукты, которые не угадывают, финансовые движки, веб-эксперименты.',
    min: 'мин чтения',
  },
  hero: {
    greeting: 'привет, я',
    role: 'Фулстек-инженер · Сооснователь Adlega',
    chips: ['инженер · 15 лет', 'сооснователь Adlega'],
    lead: 'Пятнадцать лет строю софт, в котором неверная цифра стоит настоящих денег: платежи, trade-in-платформа в 16 000 магазинов — а теперь Adlega, ИИ-финдиректор с одним правилом: ИИ никогда не считает сам.',
    lead2:
      'Между релизами копаюсь в цифровом мире: эксперименты, новые инструменты, науч-поп. Этот сайт — моя мастерская.',
    ctaEmail: 'Написать мне',
    ctaAdlega: 'Смотреть Adlega',
    photoAlt:
      'Фигурка Дмитрия из фетра и глины: ноутбук на коленях, жёлтая канарейка на плече, рядом сидит серая собака',
    hint: 'иногда оживает. метки расскажут, кто есть кто.',
    spots: [
      {
        key: 'me',
        label: 'Обо мне, Дмитрии',
        name: 'А это я',
        text: 'Я родом из Беларуси — поэтому и фигурка вырезана в духе наших старых кукол, а на фоне каждый день новый белорусский орнамент. Спасибо, что заглянули в мастерскую. Пойдёмте искать новые открытия в цифровом мире вместе.',
        listen: 'послушать мой голос',
      },
      {
        key: 'bird',
        label: 'О канарейке',
        name: 'Моя птица',
        text: 'Кенар, и поёт он невероятно красиво. Благодаря ему я успеваю перевести дух между тем, что Зум уже придумал.',
        listen: 'послушать, как поёт',
      },
      {
        key: 'dog',
        label: 'О собаке Зуме',
        name: 'Зум',
        text: 'Мой веймаранер и самое неутомимое существо из всех, кого я знаю. Любит людей, любит охоту и ежедневно тренирует мои нервы. Лягушек, ежей, зайцев и новые приключения он находит быстрее, чем я выкатываю релизы, — примерно такого темпа он ждёт и от меня.',
        listen: 'послушать, как лает',
      },
    ],
    spotClose: 'Закрыть',
  },
  work: {
    label: 'Сейчас строю',
    items: [
      {
        title: 'Adlega',
        tag: 'ИИ-финдиректор для SaaS-фаундеров',
        meta: 'сооснователь · 2024 —',
        href: 'https://adlega.com',
        linkLabel: 'adlega.com',
        body: [
          'Опишите бизнес в чате — получите рабочую финансовую модель: выручка, burn, runway, сценарии «что если». Минуты вместо недель в таблицах.',
          'Ключевое проектное решение: ИИ никогда не считает сам. Агенты интервьюируют фаундера, заполняют модель, объясняют любую цифру, гоняют goal-seek — «как утроить MRR?» — но каждое значение выдаёт детерминированный движок, который мы держим в пределах 0,5 % от собранной вручную Excel-модели, которую он заменил.',
        ],
      },
    ],
  },
  shelf: {
    label: 'Полка проектов',
    all: 'все проекты →',
    statuses: {
      alive: 'живой',
      wip: 'в работе',
      shipped: 'сдан',
      dead: 'умер',
      exp: 'эксперимент',
    },
    items: [
      {
        name: 'whotop',
        years: '2026 —',
        note: 'Утилита в терминале: различает процессы-двойники и показывает, кто держит порт.',
        status: 'alive',
        href: 'https://github.com/dimhold/whotop',
      },
      {
        name: 'Belun',
        years: '2025 —',
        note: '90+ браузерных утилит; без серверов и аккаунтов, файлы не покидают компьютер.',
        status: 'alive',
        href: 'https://belun.app',
      },
      {
        name: 'Rando4.me',
        years: '2014 – 2024',
        note: 'Сооснователь; мобильное приложение, прожившее десять лет. Бизнесом не стало, уроки остались.',
        status: 'dead',
      },
    ],
  },
  projects: {
    label: 'Мои проекты',
    title: 'Мои проекты — Дмитрий Семенкевич',
    description:
      'Проекты, которые я веду сейчас: Adlega — ИИ-финдиректор для SaaS-фаундеров, Belun — браузерный набор инструментов без загрузок на сервер, whotop — утилита, различающая процессы-двойники, и этот сайт-мастерская.',
    lede: 'Всё, что работает прямо сейчас: зачем оно существует и на чём собрано. То, что своё уже отработало, лежит ниже на полке — вместе с тупиками.',
    activeLabel: 'Работают сейчас',
    archiveLabel: 'Полка проектов',
    archiveNote: 'Что было раньше — честно, вместе с тем, что умерло.',
    stackLabel: 'собрано на',
    items: [
      {
        name: 'Adlega',
        tagline: 'ИИ-финдиректор для SaaS-фаундеров',
        years: '2024 —',
        status: 'alive',
        href: 'https://adlega.com',
        linkLabel: 'adlega.com',
        body: [
          'Опишите бизнес в чате — получите рабочую финансовую модель: выручка, burn, runway, сценарии «что если». Минуты вместо недель в таблицах.',
          'Ключевое проектное решение: ИИ никогда не считает сам. Агенты интервьюируют фаундера, заполняют модель, объясняют любую цифру, гоняют goal-seek — «как утроить MRR?» — но каждое значение выдаёт детерминированный движок, который мы держим в пределах 0,5 % от собранной вручную Excel-модели, которую он заменил.',
          'Я сооснователь и делаю продукт целиком: агентов, движок и интерфейс, в котором живёт модель.',
        ],
        stack: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'LLM-агенты'],
      },
      {
        name: 'Belun',
        tagline: 'браузерный набор инструментов, который ничего не выгружает',
        years: '2025 —',
        status: 'alive',
        href: 'https://belun.app',
        linkLabel: 'belun.app',
        body: [
          '90+ небольших инструментов, которые работают целиком во вкладке браузера: конвертировать, сжать, почистить, заглянуть внутрь. Без серверов, без аккаунтов, без загрузок — файлы не покидают ваш компьютер.',
          'Начиналось как личная стопка скриптов, которые я раз за разом писал заново. Собрал их в одну страницу — и они стали нужны не только мне.',
        ],
        stack: ['TypeScript', 'WebAssembly', 'Web Workers', 'статический хостинг'],
      },
      {
        name: 'whotop',
        tagline: 'что это за процесс и какой порт он держит?',
        years: '2026 —',
        status: 'alive',
        href: 'https://github.com/dimhold/whotop',
        linkLabel: 'github.com/dimhold/whotop',
        body: [
          'Утилита в терминале, которая читает таблицу процессов и таблицу сокетов вместе, а потом читает, что на самом деле написано в каждой командной строке. Экран одинаковых строк node превращается в сессию агента, два dev-сервера, различённые по проектам, и сироту, которая держит ваш порт с тех пор, как час назад вы переключили ветку.',
          'Всё началось с того, что я убил не тот node. Их было шесть, все мои, все назывались node, и список ничего не говорил о том, кто есть кто. Нужные факты лежали рядом — командная строка, рабочий каталог, давно вышедший родитель, — просто система не кладёт их рядом с pid.',
          'Она не гадает молча: --explain называет правило за каждой подписью и говорит, что именно платформа отказалась раскрыть. А потом убьёт по порту или по pid — показав сначала, что именно она нашла.',
        ],
        stack: ['TypeScript', 'Node.js', 'ноль зависимостей в рантайме'],
      },
      {
        name: 'dimhold.by',
        tagline: 'эта мастерская, на трёх языках',
        years: '2025 —',
        status: 'wip',
        href: '/ru/blog/',
        linkLabel: 'билд-лог',
        body: [
          'Сайт, который вы читаете. Статическая мастерская на английском, русском и белорусском: статьи, игрушки и эксперименты, которым больше негде жить.',
          'Сделан так, чтобы оставаться быстрым и почти бесплатным: на страницу не уезжает фреймворк, картинки и ролики подготовлены заранее, всё отдаётся плоскими файлами.',
        ],
        stack: ['Astro', 'TypeScript', 'CSS руками', 'GitHub Pages'],
      },
    ],
  },
  games: {
    label: 'Игры',
    title: 'Игры — как играли в Беларуси',
    description:
      'Белорусские народные игры, перенесённые в браузер. У каждой названы тот, кто её записал, место и год — и честно сказано, насколько она общая с соседями.',
    lede: 'Белорусские народные игры, в которые здесь можно сыграть. Не «игры, которые есть только у нас» — таких почти нет, и говорят об этом сами белорусские этнографы, — а как играли в Беларуси: свои слова, свой инвентарь, своё место в земледельческом году.',
    framing:
      'Корпус самобытен лексикой, песенным текстом, инвентарём и календарём — и по механике в основном общий с Россией, Украиной и Польшей. История от этого только выигрывает, и у неё есть преимущество: она правдива.',
    rulesLabel: 'Правила, которых держится раздел',
    rules: [
      'У каждой игры названы тот, кто её записал, место и год.',
      'Никаких утверждений, которых нет в источниках. «Только в Беларуси» оставлено для тех немногих игр, где это действительно записано.',
      'Никаких выдуманных правил. Там, где запись молчит и цифру пришлось выбрать, страница говорит, что выбрали её мы.',
    ],
    statuses: { live: 'можно играть', planned: 'в работе' },
    play: 'играть →',
    soon: 'ещё не сделана',
    items: [
      {
        slug: 'kata-piachy',
        name: '«Ката пячы»',
        gloss:
          'Кота лепят из булок и подвешивают к потолку. Ты въезжаешь наверх на вилах и прыгаешь, чтобы откусить кусок, пока тебя толкают со всех сторон. Кто откусит хвост — тот выиграл.',
        status: 'live',
        href: '/ru/games/kata-piachy/',
      },
      {
        slug: 'lianok',
        name: '«Лянок»',
        gloss:
          'Вся льняная цепочка в восьми стадиях — брать, молотить, расстилать, мять, ткать, белить, кроить, шить — с ответом в такт. А полотно, которым всё кончается, окажется настоящим орнаментом.',
        status: 'planned',
      },
      {
        slug: 'pannachka',
        name: '«Панначка»',
        gloss:
          'Круг девушек, у каждой зажжённая свеча: задуть соседкину и закрыть свою. Кончается не выбыванием — последний огонёк обходит круг и зажигает остальные заново.',
        status: 'planned',
      },
      {
        slug: 'hrahi',
        name: '«Грахі»',
        gloss:
          'Мяч катят вдоль ряда лунок. Промах — грех падает в твою лунку, попадание — в лунку жертвы. И у того, кто носит грехи, бросков меньше: вина уменьшает право наказывать.',
        status: 'planned',
      },
      {
        slug: 'zanicba-cyareski',
        name: '«Жаніцьба Цярэшкі»',
        gloss:
          'Колядная игра в свадьбу — единственная игра, которую авторитет называет уникально белорусской. Ты сваття и сводишь пары одну за другой; песни здесь и есть переходы состояний.',
        status: 'planned',
      },
    ],
    kata: {
      name: '«Ката пячы»',
      gloss: 'печь кота',
      title: '«Ката пячы» — белорусская народная игра, в которую можно сыграть',
      description:
        '27 ноября в Скирмантове кота лепят из булок, подвешивают к потолку и кусают с вил; кто откусит хвост — тот выиграл. Здесь его сначала пекут — и какого кота испёк, такого и кусаешь.',
      kicker: '27 лістапада · аг. Скірмантава · Дзяржаўны спіс 33АК000117',
      lede: 'Накануне поста кота лепят из булок и подвешивают к потолку на верёвке. Один за другим игроки въезжают наверх на вилах и прыгают, чтобы откусить кусок, а все вокруг изо всех сил стараются их спихнуть. Кто откусит хвост — тот выиграл. Печь приходится первым делом, и это решает всё остальное: какого кота испёк, такого и кусать.',
      howLabel: 'Как в это играют здесь',
      how: [
        'Держите — от дежи отщипывается ком. Большая булка — широкий укус потом, маленькая — трудный; и маленькая румянится быстрее, так что сжечь её легче.',
        'Дежа одна на все шесть булок, а шестая — хвост, тот самый кусок, который решает игру. Оставьте ему теста.',
        'Отпустите в печь и нажмите, когда бохан станет золотым. Сырой — тяжёлый и скользкий, подгорелый — хрусткий и широкий, но лёгкий как пух.',
        'Потом кота подвешивают, и вы кусаете. Тяжёлый кот качается лениво, лёгкий идёт вразнос — и с каждым откушенным куском он легчает.',
      ],
      start: 'Месить',
      again: 'Ещё раз',
      jump: 'Держать — лепить, нажать — вынуть из печи, нажать — укусить',
      soundOn: 'звук включён',
      soundOff: 'звук выключен',
      viewWide: 'широкая сцена',
      viewNormal: 'обычная сцена',
      actBake: 'печём',
      actBite: 'кусаем',
      dough: 'дежа',
      weight: 'вес кота',
      bakes: { raw: 'сырой', golden: 'золотой', burnt: 'подгорелый' },
      yours: 'у тебя',
      rivals: 'у остальных',
      tries: 'попыток',
      shove: 'толкают!',
      sceneAlt:
        'Кот, слепленный из булок, висит на верёвке под потолочной балкой; под ним парень на вилах, рядом печь и дежа с тестом, вокруг — остальные.',
      bestLabel: 'лучший результат',
      bestWon: 'взял хвост',
      bestNone: 'пока пусто',
      pieces: [
        { be: 'вуха', gloss: 'ухо' },
        { be: 'лапа', gloss: 'лапу' },
        { be: 'лапа', gloss: 'вторую лапу' },
        { be: 'бок', gloss: 'бок' },
        { be: 'галава', gloss: 'голову' },
        { be: 'хвост', gloss: 'хвост' },
      ],
      prologue: {
        card: ['27 лістапада', 'аг. Скірмантава'],
        scene: 'Зима, вечер, последний перед постом. В одном окне горит свет — там уже месят тесто.',
        skip: 'пропустить',
      },
      goal: {
        standing: 'откуси хвост',
        bake: 'шесть булок из одной дежи; шестая — хвост',
        bite: 'каждый взятый кусок — ещё одна попытка на хвост',
      },
      msg: {
        idle: 'Дежа полна, печь горяча. Из шести булок выйдет кот.',
        shape: 'Держите — ком растёт. Этот пойдёт на {piece}.',
        bake: 'В печь. Нажмите, когда станет золотым.',
        baked: '{piece} — {bake}.',
        tailNext: 'Последний — хвост, он и решает игру. Теста осталось: {n}.',
        doughOut: 'Дежа выскреблена — что осталось, то и бохан.',
        hung: 'Кот испечён и висит. Теперь кусать.',
        ready: 'Откусить {piece}.',
        hit: 'Твой — {piece}. Кот стал легче, а значит быстрее.',
        miss: 'Мимо, и {piece} досталась другому.',
        tail: 'Остался только хвост, и верёвка раскачана сильнее всего. Попыток: {n}.',
        tailMiss: 'Мимо. Осталось {n}.',
        win: 'Ты откусил хвост. Игра твоя.',
        lose: 'Хвост достался другому. Значит, до следующего 27 ноября.',
      },
      advisors: {
        hanna: {
          name: 'Ганна',
          tag: 'щедрая',
          greeting: [
            { be: 'Кладзі больш. Малы кот — малая радасць.', gloss: 'Клади больше. Маленький кот — маленькая радость.' },
            { be: 'Не шкадуй цеста, і будзе што кусаць.', gloss: 'Не жалей теста — будет что кусать.' },
          ],
          bigBun: [
            { be: 'Вось гэта булка. Пад такую і рот шырэй.', gloss: 'Вот это булка. Под такую и рот шире.' },
            { be: 'Правільна. Чым большая, тым лягчэй у яе трапіць.', gloss: 'Правильно. Чем больше, тем легче в неё попасть.' },
            { be: 'І пячэцца спакайней — вялікае не так хутка гарыць.', gloss: 'И печётся спокойнее — большое не так быстро горит.' },
          ],
          smallBun: [
            { be: 'Гэта не булка, гэта гузік.', gloss: 'Это не булка, это пуговица.' },
            { be: 'Малую і спаліць лягчэй, і ўкусіць вузка. Навошта табе двойчы кепска?', gloss: 'Маленькую и сжечь легче, и укус от неё узкий. Зачем тебе дважды плохо?' },
            { be: 'Шкадуеш цеста? Яно ж не срэбра.', gloss: 'Жалеешь теста? Оно же не серебро.' },
          ],
          raw: [
            { be: 'Сыраватая. Затое цяжкая — кот павісне спакойна.', gloss: 'Сыровата. Зато тяжёлая — кот повиснет спокойно.' },
            { be: 'Недапечаная. Вузка кусаць будзе, але вага ў ёй ёсць.', gloss: 'Недопечённая. Кусать будет узко, но вес в ней есть.' },
          ],
          golden: [
            { be: 'Залатая. Такую і паказаць не сорамна.', gloss: 'Золотая. Такую и показать не стыдно.' },
            { be: 'Во, у самы раз. Кладзі на стол.', gloss: 'Во, в самый раз. Клади на стол.' },
          ],
          burnt: [
            { be: 'Спаліў. Ну хоць шырокая — хрумсткае кусаецца лёгка.', gloss: 'Сжёг. Ну хоть широкая — хрусткое кусается легко.' },
            { be: 'Чорная і лёгкая, як папера. Кот з такіх будзе скакаць.', gloss: 'Чёрная и лёгкая, как бумага. Кот из таких будет скакать.' },
          ],
          doughLow: [
            { be: 'Дно відаць. Ну затое пяць булак як булкі.', gloss: 'Дно видно. Ну зато пять булок как булки.' },
            { be: 'Цеста мала. Хай сабе малы хвост — хвост ёсць хвост.', gloss: 'Теста мало. Пусть маленький хвост — хвост есть хвост.' },
          ],
          tailNext: [
            { be: 'Апошні — хвост. Што ў дзяжы, тое і будзе.', gloss: 'Последний — хвост. Что в деже, то и будет.' },
            { be: 'Хвост. Дай яму ўсё, што засталося, — больш узяць няма адкуль.', gloss: 'Хвост. Отдай ему всё, что осталось, — взять больше неоткуда.' },
          ],
          swing: [
            { be: 'Рот наперад! Не бокам!', gloss: 'Рот вперёд! Не боком!' },
            { be: 'Хапай большы кавалак, не дзяўбі па крошцы.', gloss: 'Хватай кусок побольше, не клюй по крошке.' },
            { be: 'Ну чаго чакаеш? Ён сам да рота не прыйдзе.', gloss: 'Ну чего ждёшь? Он сам ко рту не придёт.' },
          ],
          shove: [
            { be: 'Штурхаюць! Трымайся за вілы.', gloss: 'Толкают! Держись за вилы.' },
            { be: 'Шырокі кавалак і штуршка не баіцца.', gloss: 'Широкий кусок и толчка не боится.' },
          ],
          playerHit: [
            { be: 'Во! Я ж казала — шырокая булка, шырокі ўкус.', gloss: 'Во! Я же говорила — широкая булка, широкий укус.' },
            { be: 'Твой кавалак. І яшчэ адна спроба на хвост.', gloss: 'Твой кусок. И ещё одна попытка на хвост.' },
          ],
          playerMiss: [
            { be: 'Малавата было. Кажу ж — не шкадуй цеста.', gloss: 'Маловато было. Говорю же — не жалей теста.' },
            { be: 'Міма. Нічога, кот цяпер лягчэйшы.', gloss: 'Мимо. Ничего, кот теперь легче.' },
          ],
          win: [
            { be: 'Во як трэба. Хвост твой, і размовы скончаны.', gloss: 'Вот как надо. Хвост твой, и разговор окончен.' },
            { be: 'Малайчына. Сядай, зараз есці будзем.', gloss: 'Молодец. Садись, сейчас есть будем.' },
          ],
          lose: [
            { be: 'Шкада. Блізка ж быў.', gloss: 'Жалко. Близко же был.' },
            { be: 'Ну, чужы хвост таксама хвост. На той год адкусіш.', gloss: 'Ну, чужой хвост тоже хвост. На тот год откусишь.' },
          ],
        },
        symon: {
          name: 'Сымон',
          tag: 'бережливый',
          greeting: [
            { be: 'Дзяжа адна, а булак шэсць. Лічы адразу.', gloss: 'Дежа одна, а булок шесть. Считай сразу.' },
            { be: 'Спачатку падумай, потым адрывай.', gloss: 'Сначала подумай, потом отрывай.' },
          ],
          bigBun: [
            { be: 'Куды столькі? Гэта ж ты з хваста адарваў.', gloss: 'Куда столько? Ты же это от хвоста оторвал.' },
            { be: 'Вялікая, вядома. А чым потым хвост лепім?', gloss: 'Большая, конечно. А из чего потом хвост лепим?' },
          ],
          smallBun: [
            { be: 'Во. Малую і рабі — на хвост застанецца.', gloss: 'Во. Маленькую и делай — на хвост останется.' },
            { be: 'Разумна. Толькі малая гарыць хутка — не адыходзь ад печы.', gloss: 'Разумно. Только маленькая горит быстро — не отходи от печи.' },
          ],
          raw: [
            { be: 'Ранавата выняў. Цяжкая, ды ўкус ад яе вузкі.', gloss: 'Рановато вынул. Тяжёлая, да укус от неё узкий.' },
            { be: 'Сырое. Кот павісне цяжкі і спакойны — а кусаць нязручна.', gloss: 'Сырое. Кот повиснет тяжёлый и спокойный — а кусать неудобно.' },
          ],
          golden: [
            { be: 'Во так. Залатая — і вага ёсць, і рот шырокі.', gloss: 'Вот так. Золотая — и вес есть, и рот широкий.' },
            { be: 'Правільна вынуў. Больш нічога і не трэба.', gloss: 'Правильно вынул. Больше ничего и не надо.' },
          ],
          burnt: [
            { be: 'Перадзяржаў. Лёгкая, як вугаль, — цяпер кот пойдзе ў разнос.', gloss: 'Передержал. Лёгкая, как уголь, — теперь кота разнесёт.' },
            { be: 'Спаліў. Кусаць шырэй, ды гайданне будзе шалёнае.', gloss: 'Сжёг. Кусать шире, да качка будет бешеная.' },
          ],
          doughLow: [
            { be: 'Вось табе і дно дзяжы. А хвост яшчэ наперадзе.', gloss: 'Вот тебе и дно дежи. А хвост ещё впереди.' },
            { be: 'Мала засталося. Далей толькі скрабі.', gloss: 'Мало осталось. Дальше только скреби.' },
          ],
          tailNext: [
            { be: 'Хвост. Усё, што ў дзяжы, — яму. Другога разу не будзе.', gloss: 'Хвост. Всё, что в деже, — ему. Второго раза не будет.' },
            { be: 'Апошні кавалак вырашае гульню. Мераць ужо няма чаго.', gloss: 'Последний кусок решает игру. Мерить уже нечего.' },
          ],
          swing: [
            { be: 'Не спяшайся. Вяроўка сама вернецца.', gloss: 'Не спеши. Верёвка сама вернётся.' },
            { be: 'Кожны ўзяты кавалак — яшчэ адна спроба на хвост.', gloss: 'Каждый взятый кусок — ещё одна попытка на хвост.' },
          ],
          shove: [
            { be: 'Чакай, не скачы на штуршок. Перачакай яго.', gloss: 'Погоди, не прыгай на толчок. Пережди его.' },
            { be: 'Замахнуліся. Пастой, хай пройдзе.', gloss: 'Замахнулись. Постой, пусть пройдёт.' },
          ],
          playerHit: [
            { be: 'Добра. Спроба на хвост дадалася.', gloss: 'Хорошо. Попытка на хвост прибавилась.' },
            { be: 'Узяў. Толькі памятай: кот цяпер лягчэйшы і хутчэйшы.', gloss: 'Взял. Только помни: кот теперь легче и быстрее.' },
          ],
          playerMiss: [
            { be: 'Раней трэба было. Ён ужо адыходзіў.', gloss: 'Раньше надо было. Он уже отходил.' },
            { be: 'Міма. Кавалак пайшоў іншаму, а кот усё роўна палягчэў.', gloss: 'Мимо. Кусок ушёл другому, а кот всё равно полегчал.' },
          ],
          win: [
            { be: 'Ну вось. А ты не хацеў лічыць.', gloss: 'Ну вот. А ты не хотел считать.' },
            { be: 'Хвост твой. Значыць, у дзяжы засталося акурат столькі, колькі трэба.', gloss: 'Хвост твой. Значит, в деже осталось ровно столько, сколько нужно.' },
          ],
          lose: [
            { be: 'Не хапіла. Кажу ж — апошні кавалак вырашае.', gloss: 'Не хватило. Говорю же — последний кусок решает.' },
            { be: 'Шкада. Ну хоць паглядзелі, як яно бывае.', gloss: 'Жалко. Ну хоть посмотрели, как оно бывает.' },
          ],
        },
        alesik: {
          name: 'Алесік',
          tag: 'младший',
          greeting: [
            { be: 'Я ў печ гляджу! Скажу, калі счарнее.', gloss: 'Я в печь смотрю! Скажу, когда почернеет.' },
            { be: 'А давайце спалім хоць адну. Ну хоць адну!', gloss: 'А давайте сожжём хоть одну. Ну хоть одну!' },
          ],
          bigBun: [
            { be: 'Вялікая! Такая доўга пячэцца — я пачакаю.', gloss: 'Большая! Такая долго печётся — я подожду.' },
            { be: 'Ого. Пакуль яна счырванее, я тры разы збегаю.', gloss: 'Ого. Пока она зарумянится, я три раза сбегаю.' },
          ],
          smallBun: [
            { be: 'Малая счарнее ў момант. Не адыходзь!', gloss: 'Маленькая почернеет мигом. Не отходи!' },
            { be: 'Гэткая згарыць хутчэй за ўсіх. Здорава!', gloss: 'Такая сгорит быстрее всех. Здорово!' },
          ],
          raw: [
            { be: 'Рана! Яна ж яшчэ цеста. Цяжкая будзе — кот павісне як мех.', gloss: 'Рано! Она же ещё тесто. Тяжёлая будет — кот повиснет как мешок.' },
            { be: 'Сырая. Нудна. Вяроўка з ёй ледзь варушыцца.', gloss: 'Сырая. Скучно. Верёвка с ней еле шевелится.' },
          ],
          golden: [
            { be: 'Залатая... ну добра. Хоць адну ж дайце спаліць.', gloss: 'Золотая... ну ладно. Хоть одну-то дайте сжечь.' },
            { be: 'Во, акурат. Толькі ж не цікава.', gloss: 'Во, в самый раз. Только неинтересно же.' },
          ],
          burnt: [
            { be: 'Чорная! Цяпер кот скакаць будзе!', gloss: 'Чёрная! Теперь кот скакать будет!' },
            { be: 'Вугаль! Лёгкі, як пух, — вяроўка з розуму сыдзе.', gloss: 'Уголь! Лёгкий, как пух, — верёвка с ума сойдёт.' },
            { be: 'Хрумсціць! І рот пад яе шырэйшы.', gloss: 'Хрустит! И рот под неё шире.' },
          ],
          doughLow: [
            { be: 'Цеста мала — значыць, апошняя згарыць у момант!', gloss: 'Теста мало — значит, последняя сгорит мигом!' },
            { be: 'Ужо дно? А я і не наеўся.', gloss: 'Уже дно? А я и не наелся.' },
          ],
          tailNext: [
            { be: 'Хвост! Спаліце хвост — ён шырокі будзе, сам у рот трапіць!', gloss: 'Хвост! Сожгите хвост — он широкий будет, сам в рот попадёт!' },
            { be: 'Апошні. Толькі не выцягвайце рана, сыры хвост вузкі.', gloss: 'Последний. Только не вынимайте рано, сырой хвост узкий.' },
          ],
          swing: [
            { be: 'Скачы! Ну скачы ўжо!', gloss: 'Прыгай! Ну прыгай уже!' },
            { be: 'Глядзі, як лётае! Гэта таму, што лёгкі.', gloss: 'Смотри, как летает! Это потому, что лёгкий.' },
          ],
          shove: [
            { be: 'Я штурхну! Я моцна штурхну!', gloss: 'Я толкну! Я сильно толкну!' },
            { be: 'Зараз штурхнём! Трымайся, калі можаш!', gloss: 'Сейчас толкнём! Держись, если можешь!' },
            { be: 'Гэта я! Гэта я цяпер штурхаю!', gloss: 'Это я! Это я сейчас толкаю!' },
          ],
          playerHit: [
            { be: 'Адкусіў! Цяпер яшчэ хутчэй пойдзе!', gloss: 'Откусил! Теперь ещё быстрее пойдёт!' },
            { be: 'Во! Яшчэ адну спробу зарабіў.', gloss: 'Во! Ещё одну попытку заработал.' },
          ],
          playerMiss: [
            { be: 'Міма-а! Я ж штурхнуў.', gloss: 'Ми-имо! Я же толкнул.' },
            { be: 'Не туды! Ён жа ў той бок ляцеў.', gloss: 'Не туда! Он же в другую сторону летел.' },
          ],
          win: [
            { be: 'Хвост! Хвост адкусіў! Я ж казаў!', gloss: 'Хвост! Хвост откусил! Я же говорил!' },
            { be: 'А заўтра можна яшчэ? ...Не, заўтра нельга.', gloss: 'А завтра можно ещё? ...Нет, завтра нельзя.' },
          ],
          lose: [
            { be: 'Э-эх. А я хацеў, каб згарэла ўсё.', gloss: 'Э-эх. А я хотел, чтоб всё сгорело.' },
            { be: 'Не адкусіў. Ну хоць кот лётаў добра.', gloss: 'Не откусил. Ну хоть кот летал хорошо.' },
          ],
        },
      },
      epilogue: {
        win: 'Хвост твой. Кота съели до последней крошки, и в хате становится тихо.',
        lose: 'Хвост достался другому. Кота всё равно съели — до последней крошки.',
        calendar:
          'А завтра с утра Филипповка. Пост забирает мясо, а вместе с ним и игры — до самых Колядок.',
        docLabel: 'Что здесь записано на самом деле',
        facts: [
          'Обряд «Ката пячы» — Государственный список историко-культурных ценностей, 33АК000117, внесён в 2017 году.',
          'аг. Скірмантава, Дзержинский район.',
          'Ведёт род Радьков через коллективы «Сваякі» и «Весялуха» — каждый год с 1993-го.',
        ],
        invented:
          'Ганна, Сымон и Алесик — наши. Список называет обряд, а не этих людей: имена, споры и все советы придуманы здесь.',
      },
      sourceLabel: 'Источник',
      source:
        'Государственный список историко-культурных ценностей Республики Беларусь, 33АК000117, внесено в 2017 году: обряд «Ката пячы» аг. Скірмантава Дзержинского района. Его ведёт род Радьков через коллективы «Сваякі» и «Весялуха», каждый год начиная с 1993-го.',
      honestyLabel: 'Насколько она белорусская',
      honesty:
        'Одна из немногих игр корпуса, за которой действительно стоит заявка на уникальность: ни русского, ни украинского, ни польского аналога не нашлось ни под каким названием. Но список охраняет обряд одной деревни, а не общенациональную игру, — записано скирмантовское, и так оно здесь и подано.',
      calendarLabel: 'Почему 27 ноября',
      calendar:
        'Канун Филипповки. Еда нарочно жирная: пост начинается на следующее утро и запрещает мясо — а вместе с ним и игры.',
      choicesLabel: 'Что выбрали мы сами',
      choices:
        'Из записи: кота пекут из булок, подвешивают к потолку, въезжают на вилах, остальные толкают, а решает хвост. Всё, при чём стоит цифра, — наше: сколько теста в деже, что даёт размер булки при укусе, что делают с качкой сырое и подгорелое, сколько попыток даёт хвост. Первая половина, выпечка, играется здесь как отдельная игра, которой в записи нет: там есть булки, но не состязание за них. Наши и трое за столом: Ганна, Сымон и Алесик выдуманы, и советы их нарочно противоречат друг другу — потому что варианты традиции и правда расходятся, а не потому, что кто-то из троих прав.',
      back: 'все игры',
    },
  },
  toy: {
    title: 'потрогайте философию →',
    target: 'цель: ×3 MRR за 24 месяца',
    growth: 'рост, %/мес',
    churn: 'отток, %/мес',
    button: 'goal-seek',
    note: 'ни одну из этих цифр не считал ИИ — детерминированный движок, как в Adlega.',
    months: 'мес',
  },
  record: {
    label: 'Путь',
    entries: [
      {
        years: '2024 —',
        title: 'Adlega · сооснователь',
        note: 'ИИ-финдиректор для SaaS-фаундеров. Продукт целиком: агенты, детерминированный движок, интерфейс модели.',
      },
      {
        years: '2022 —',
        title: 'Независимый консультант',
        note: 'Высоконагруженные платежи (Modulr), корпоративные и государственные системы.',
      },
      {
        years: '2014 – 2022',
        title: 'HYLA Mobile, компания Assurant · senior full-stack',
        note: 'Trade-in-платформа в 16 000+ магазинов. Вёл распил монолита на микросервисы; нагрузочное тестирование на Gatling.',
      },
      {
        years: '2013 – 2014',
        title: 'Первый стартап и фриланс',
        note: 'Сооснователь мобильного стартапа. HTML5-видеоплееры, рендеринг карт, небольшие бэкенды, годами работавшие без присмотра.',
      },
      {
        years: '2007 – 2012',
        title: 'БГУИР',
        note: 'Диплом инженера-программиста.',
      },
    ],
    stack:
      'Java · Spring · TypeScript · Angular · React · Node.js · PostgreSQL · Kafka · AWS · LLM-агенты',
  },
  socialsLabel: 'Я в сети',
  leaf: {
    label: 'Отрывной календарь: белорусское слово дня',
    caption: 'белорусское слово на каждый день',
  },
  contact: {
    label: 'Скажите привет',
    lede: 'Консалтинг, фидбек по продукту, интересные задачи — почта открыта.',
    email: 'dimhold@gmail.com',
  },
  consent: {
    label: 'Про куки',
    text: 'Я считаю визиты через Google Analytics — сколько людей заходит и какие страницы читают. Ни рекламы, ни профилирования, никакой продажи данных. Пока вы не согласитесь, на ваше устройство ничего не записывается.',
    more: 'Что с этим делает Google',
    accept: 'Разрешить',
    decline: 'Не надо',
  },
  notFound: {
    title: 'Страница не найдена',
    text: 'По этому адресу ничего нет.',
    home: 'На главную',
  },
};

export const be: Dictionary = {
  lang: 'be',
  path: '/be/',
  identity: {
    name: 'Дзмітрый Семянкевіч',
    full: 'Дзмітрый Дзмітрыевіч Семянкевіч',
    alsoLabel: 'ён жа',
    also: ['Dmitriy Semenkevich', 'Дмитрий Семенкевич', 'Дзмітрый Семенкевіч'],
  },
  metaTitle: 'Дзмітрый Семянкевіч (Dmitriy Semenkevich) — ШІ-архітэктар і сузаснавальнік Adlega',
  metaDescription:
    'Пятнаццаць гадоў прадакшен-распрацоўкі: плацёжная інфраструктура, trade-in-платформа ў 16 000 крамах. Сузаснавальнік Adlega — ШІ-фіндырэктара для SaaS-заснавальнікаў.',
  langLabel: 'Мова',
  skipLink: 'Да зместу',
  lampLabel: 'Пераключыць лямпу',
  nav: {
    blog: 'блог',
    projects: 'мае праекты',
    games: 'гульні',
    papers: 'працы',
  },
  blog: {
    label: 'Артыкулы',
    all: 'усе артыкулы →',
    title: 'Артыкулы — Дзмітрый Семянкевіч',
    description:
      'Артыкулы і білд-логі Дзмітрыя Семянкевіча: ШІ-прадукты, якія не гадаюць, фінансавыя рухавікі, веб-эксперыменты.',
    min: 'хв чытання',
  },
  hero: {
    greeting: 'прывітанне, я',
    role: 'Фулстэк-інжынер · Сузаснавальнік Adlega',
    chips: ['інжынер · 15 гадоў', 'сузаснавальнік Adlega'],
    lead: 'Пятнаццаць гадоў будую софт, у якім няправільная лічба каштуе сапраўдных грошай: плацяжы, trade-in-платформа ў 16 000 крамах — а цяпер Adlega, ШІ-фіндырэктар з адным правілам: ШІ ніколі не лічыць сам.',
    lead2:
      'Паміж рэлізамі корпаюся ў лічбавым свеце: эксперыменты, новыя інструменты, навук-поп. Гэты сайт — мая майстэрня.',
    ctaEmail: 'Напісаць мне',
    ctaAdlega: 'Глядзець Adlega',
    photoAlt:
      'Фігурка Дзмітрыя з фетру і гліны: ноўтбук на каленях, жоўтая канарэйка на плячы, побач сядзіць шэры сабака',
    hint: 'часам ажывае. меткі раскажуць, хто ёсць хто.',
    spots: [
      {
        key: 'me',
        label: 'Пра мяне, Дзмітрыя',
        name: 'А гэта я',
        text: 'Я родам з Беларусі — таму і фігурка выразаная ў духу нашых старых лялек, а на фоне кожны дзень новы беларускі арнамент. Дзякуй, што зазірнулі ў майстэрню. Хадзем шукаць новыя адкрыцці ў лічбавым свеце разам.',
        listen: 'паслухаць мой голас',
      },
      {
        key: 'bird',
        label: 'Пра канарэйку',
        name: 'Мая птушка',
        text: 'Кенар, і спявае ён неверагодна прыгожа. Дзякуючы яму я паспяваю перавесці дух паміж тым, што Зум ужо прыдумаў.',
        listen: 'паслухаць, як спявае',
      },
      {
        key: 'dog',
        label: 'Пра сабаку Зума',
        name: 'Зум',
        text: 'Мой веймаранер і самае нястомнае стварэнне з усіх, каго я ведаю. Любіць людзей, любіць паляванне і штодня трэніруе мае нервы. Жаб, вожыкаў, зайцоў і новыя прыгоды ён знаходзіць хутчэй, чым я выкатваю рэлізы, — прыкладна такога тэмпу ён чакае і ад мяне.',
        listen: 'паслухаць, як брэша',
      },
    ],
    spotClose: 'Зачыніць',
  },
  work: {
    label: 'Зараз будую',
    items: [
      {
        title: 'Adlega',
        tag: 'ШІ-фіндырэктар для SaaS-заснавальнікаў',
        meta: 'сузаснавальнік · 2024 —',
        href: 'https://adlega.com',
        linkLabel: 'adlega.com',
        body: [
          'Апішыце бізнес у чаце — атрымайце працоўную фінансавую мадэль: выручка, burn, runway, сцэнарыі «што калі». Хвіліны замест тыдняў у табліцах.',
          'Ключавое праектнае рашэнне: ШІ ніколі не лічыць сам. Агенты інтэрв’юіруюць заснавальніка, запаўняюць мадэль, тлумачаць любую лічбу, ганяюць goal-seek — «як патроіць MRR?» — але кожнае значэнне выдае дэтэрмінаваны рухавік, які мы трымаем у межах 0,5 % ад сабранай уручную Excel-мадэлі, якую ён замяніў.',
        ],
      },
    ],
  },
  shelf: {
    label: 'Паліца праектаў',
    all: 'усе праекты →',
    statuses: {
      alive: 'жывы',
      wip: 'у працы',
      shipped: 'здадзены',
      dead: 'памёр',
      exp: 'эксперымент',
    },
    items: [
      {
        name: 'whotop',
        years: '2026 —',
        note: 'Утыліта ў тэрмінале: адрознівае працэсы-двайнікі і паказвае, хто трымае порт.',
        status: 'alive',
        href: 'https://github.com/dimhold/whotop',
      },
      {
        name: 'Belun',
        years: '2025 —',
        note: '90+ браўзерных утыліт; без сервераў і акаўнтаў, файлы не пакідаюць камп’ютар.',
        status: 'alive',
        href: 'https://belun.app',
      },
      {
        name: 'Rando4.me',
        years: '2014 – 2024',
        note: 'Сузаснавальнік; мабільная праграма, якая пражыла дзесяць гадоў. Бізнесам не стала, урокі засталіся.',
        status: 'dead',
      },
    ],
  },
  projects: {
    label: 'Мае праекты',
    title: 'Мае праекты — Дзмітрый Семянкевіч',
    description:
      'Праекты, якія я вяду цяпер: Adlega — ШІ-фіндырэктар для SaaS-заснавальнікаў, Belun — браўзерны набор інструментаў без выгрузкі на сервер, whotop — утыліта, якая адрознівае працэсы-двайнікі, і гэты сайт-майстэрня.',
    lede: 'Усё, што працуе проста зараз: навошта яно існуе і на чым сабрана. Тое, што сваё ўжо адпрацавала, ляжыць ніжэй на паліцы — разам з тупікамі.',
    activeLabel: 'Працуюць зараз',
    archiveLabel: 'Паліца праектаў',
    archiveNote: 'Што было раней — сумленна, разам з тым, што памерла.',
    stackLabel: 'сабрана на',
    items: [
      {
        name: 'Adlega',
        tagline: 'ШІ-фіндырэктар для SaaS-заснавальнікаў',
        years: '2024 —',
        status: 'alive',
        href: 'https://adlega.com',
        linkLabel: 'adlega.com',
        body: [
          'Апішыце бізнес у чаце — атрымайце працоўную фінансавую мадэль: выручка, burn, runway, сцэнарыі «што калі». Хвіліны замест тыдняў у табліцах.',
          'Ключавое праектнае рашэнне: ШІ ніколі не лічыць сам. Агенты інтэрв’юіруюць заснавальніка, запаўняюць мадэль, тлумачаць любую лічбу, ганяюць goal-seek — «як патроіць MRR?» — але кожнае значэнне выдае дэтэрмінаваны рухавік, які мы трымаем у межах 0,5 % ад сабранай уручную Excel-мадэлі, якую ён замяніў.',
          'Я сузаснавальнік і раблю прадукт цалкам: агентаў, рухавік і інтэрфейс, у якім жыве мадэль.',
        ],
        stack: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'LLM-агенты'],
      },
      {
        name: 'Belun',
        tagline: 'браўзерны набор інструментаў, які нічога не выгружае',
        years: '2025 —',
        status: 'alive',
        href: 'https://belun.app',
        linkLabel: 'belun.app',
        body: [
          '90+ невялікіх інструментаў, якія працуюць цалкам ва ўкладцы браўзера: сканвертаваць, сціснуць, пачысціць, зазірнуць унутр. Без сервераў, без акаўнтаў, без выгрузак — файлы не пакідаюць ваш камп’ютар.',
          'Пачыналася як асабістая стопка скрыптоў, якія я раз за разам пісаў нанова. Сабраў іх у адну старонку — і яны спатрэбіліся не толькі мне.',
        ],
        stack: ['TypeScript', 'WebAssembly', 'Web Workers', 'статычны хостынг'],
      },
      {
        name: 'whotop',
        tagline: 'што гэта за працэс і які порт ён трымае?',
        years: '2026 —',
        status: 'alive',
        href: 'https://github.com/dimhold/whotop',
        linkLabel: 'github.com/dimhold/whotop',
        body: [
          'Утыліта ў тэрмінале, якая чытае табліцу працэсаў і табліцу сокетаў разам, а потым чытае, што насамрэч напісана ў кожным камандным радку. Экран аднолькавых радкоў node ператвараецца ў сесію агента, два dev-серверы, адрозненыя па праектах, і сірату, якая трымае ваш порт з таго часу, як гадзіну таму вы пераключылі галінку.',
          'Усё пачалося з таго, што я забіў не той node. Іх было шэсць, усе мае, усе зваліся node, і спіс нічога не казаў пра тое, хто ёсць хто. Патрэбныя факты ляжалі побач — камандны радок, рабочы каталог, даўно выйшлы бацька, — проста сістэма не кладзе іх побач з pid.',
          'Яна не гадае моўчкі: --explain называе правіла за кожным подпісам і кажа, што менавіта платформа адмовілася раскрыць. А потым заб’е па порце або па pid — паказаўшы спярша, што менавіта яна знайшла.',
        ],
        stack: ['TypeScript', 'Node.js', 'нуль залежнасцяў у рантайме'],
      },
      {
        name: 'dimhold.by',
        tagline: 'гэтая майстэрня, на трох мовах',
        years: '2025 —',
        status: 'wip',
        href: '/be/blog/',
        linkLabel: 'білд-лог',
        body: [
          'Сайт, які вы чытаеце. Статычная майстэрня на англійскай, рускай і беларускай: артыкулы, цацкі і эксперыменты, якім больш няма дзе жыць.',
          'Зроблены так, каб заставацца хуткім і амаль бясплатным: на старонку не з’язджае фрэймворк, карцінкі і ролікі падрыхтаваны загадзя, усё аддаецца плоскімі файламі.',
        ],
        stack: ['Astro', 'TypeScript', 'CSS рукамі', 'GitHub Pages'],
      },
    ],
  },
  games: {
    label: 'Гульні',
    title: 'Гульні — як гулялі ў Беларусі',
    description:
      'Беларускія народныя гульні, перанесеныя ў браўзер. У кожнай названы той, хто яе запісаў, месца і год — і сумленна сказана, наколькі яна агульная з суседзямі.',
    lede: 'Беларускія народныя гульні, у якія тут можна згуляць. Не «гульні, якія ёсць толькі ў нас» — такіх амаль няма, і кажуць пра гэта самі беларускія этнографы, — а як гулялі ў Беларусі: свае словы, свой начынне, сваё месца ў земляробчым годзе.',
    framing:
      'Корпус адметны лексікай, песенным тэкстам, начыннем і календаром — а па механіцы ў асноўным агульны з Расіяй, Украінай і Польшчай. Гісторыя ад гэтага толькі выйграе, і ў яе ёсць перавага: яна праўдзівая.',
    rulesLabel: 'Правілы, якіх трымаецца раздзел',
    rules: [
      'У кожнай гульні названы той, хто яе запісаў, месца і год.',
      'Ніякіх сцвярджэнняў, якіх няма ў крыніцах. «Толькі ў Беларусі» пакінута для тых нямногіх гульняў, дзе гэта сапраўды запісана.',
      'Ніякіх выдуманых правілаў. Там, дзе запіс маўчыць і лічбу давялося выбраць, старонка кажа, што выбралі яе мы.',
    ],
    statuses: { live: 'можна гуляць', planned: 'у працы' },
    play: 'гуляць →',
    soon: 'яшчэ не зроблена',
    items: [
      {
        slug: 'kata-piachy',
        name: '«Ката пячы»',
        gloss:
          'Ката лепяць з булак і падвешваюць да столі. Ты ўзнімаешся наверх на вілах і скачаш, каб адкусіць кавалак, пакуль цябе штурхаюць з усіх бакоў. Хто адкусіць хвост — той выйграў.',
        status: 'live',
        href: '/be/games/kata-piachy/',
      },
      {
        slug: 'lianok',
        name: '«Лянок»',
        gloss:
          'Уся ільняная чарада ў васьмі стадыях — браць, малаціць, рассцілаць, мяць, ткаць, беліць, кроіць, шыць — з адказам у такт. А палатно, якім усё канчаецца, апынецца сапраўдным арнаментам.',
        status: 'planned',
      },
      {
        slug: 'pannachka',
        name: '«Панначка»',
        gloss:
          'Круг дзяўчат, у кожнай запаленая свечка: задзьмуць суседчыну і засланіць сваю. Канчаецца не выбываннем — апошні аганёк абыходзіць кола і запальвае астатнія нанова.',
        status: 'planned',
      },
      {
        slug: 'hrahi',
        name: '«Грахі»',
        gloss:
          'Мяч коцяць уздоўж рада ямак. Промах — грэх падае ў тваю ямку, пацэліў — у ямку ахвяры. І ў таго, хто носіць грахі, кідкоў меней: віна памяншае права караць.',
        status: 'planned',
      },
      {
        slug: 'zanicba-cyareski',
        name: '«Жаніцьба Цярэшкі»',
        gloss:
          'Калядная гульня ў вяселле — адзіная гульня, якую аўтарытэт называе ўнікальна беларускай. Ты свацця і зводзіш пары адну за адной; песні тут і ёсць пераходы станаў.',
        status: 'planned',
      },
    ],
    kata: {
      name: '«Ката пячы»',
      gloss: 'ігрышча',
      title: '«Ката пячы» — беларуская народная гульня, у якую можна згуляць',
      description:
        '27 лістапада ў Скірмантаве ката лепяць з булак, падвешваюць да столі і кусаюць з вілаў; хто адкусіць хвост — той выйграў. Тут яго спачатку пякуць — і якога ката спёк, такога і кусаеш.',
      kicker: '27 лістапада · аг. Скірмантава · Дзяржаўны спіс 33АК000117',
      lede: 'Напярэдадні посту ката лепяць з булак і падвешваюць да столі на вяроўцы. Адзін за адным гульцы ўзнімаюцца наверх на вілах і скачуць, каб адкусіць кавалак, а ўсе навокал з усіх сіл стараюцца іх спіхнуць. Хто адкусіць хвост — той выйграў. Пячы даводзіцца найперш, і гэта вырашае ўсё астатняе: якога ката спёк, такога і кусаць.',
      howLabel: 'Як у гэта гуляюць тут',
      how: [
        'Трымайце — ад дзяжы адшчыпваецца камяк. Вялікая булка — шырокі ўкус потым, малая — цяжкі; ды і малая румяніцца хутчэй, дык спаліць яе прасцей.',
        'Дзяжа адна на ўсе шэсць булак, а шостая — хвост, той самы кавалак, які вырашае гульню. Пакіньце яму цеста.',
        'Адпусціце ў печ і націсніце, калі бохан стане залатым. Сыры — цяжкі і слізкі, падгарэлы — хрумсткі і шырокі, але лёгкі як пух.',
        'Потым ката падвешваюць, і вы кусаеце. Цяжкі кот гайдаецца ляніва, лёгкі ідзе ў разнос — і з кожным адкушаным кавалкам ён лягчэе.',
      ],
      start: 'Месіць',
      again: 'Яшчэ раз',
      jump: 'Трымаць — лепіць, націснуць — выняць з печы, націснуць — укусіць',
      soundOn: 'гук уключаны',
      soundOff: 'гук выключаны',
      viewWide: 'шырокая сцэна',
      viewNormal: 'звычайная сцэна',
      actBake: 'пячом',
      actBite: 'кусаем',
      dough: 'дзяжа',
      weight: 'вага ката',
      bakes: { raw: 'сыры', golden: 'залаты', burnt: 'падгарэлы' },
      yours: 'у цябе',
      rivals: 'у астатніх',
      tries: 'спроб',
      shove: 'штурхаюць!',
      sceneAlt:
        'Кот, злеплены з булак, вісіць на вяроўцы пад столевай бэлькай; пад ім хлопец на вілах, побач печ і дзяжа з цестам, навокал — астатнія.',
      bestLabel: 'найлепшы вынік',
      bestWon: 'узяў хвост',
      bestNone: 'пакуль пуста',
      pieces: [
        { be: 'вуха', gloss: 'вуха' },
        { be: 'лапа', gloss: 'лапу' },
        { be: 'лапа', gloss: 'другую лапу' },
        { be: 'бок', gloss: 'бок' },
        { be: 'галава', gloss: 'галаву' },
        { be: 'хвост', gloss: 'хвост' },
      ],
      prologue: {
        card: ['27 лістапада', 'аг. Скірмантава'],
        scene: 'Зіма, вечар, апошні перад постам. У адным акне гарыць святло — там ужо месяць цеста.',
        skip: 'прапусціць',
      },
      goal: {
        standing: 'адкусі хвост',
        bake: 'шэсць булак з адной дзяжы; шостая — хвост',
        bite: 'кожны ўзяты кавалак — яшчэ адна спроба на хвост',
      },
      msg: {
        idle: 'Дзяжа поўная, печ гарачая. З шасці булак выйдзе кот.',
        shape: 'Трымайце — камяк расце. Гэты пойдзе на {piece}.',
        bake: 'У печ. Націсніце, калі стане залатым.',
        baked: '{piece} — {bake}.',
        tailNext: 'Апошні — хвост, ён і вырашае гульню. Цеста засталося: {n}.',
        doughOut: 'Дзяжа выскрабена — што засталося, тое і бохан.',
        hung: 'Кот спечаны і вісіць. Цяпер кусаць.',
        ready: 'Адкусіць {piece}.',
        hit: 'Твой — {piece}. Кот стаў лягчэйшы, а значыць хутчэйшы.',
        miss: 'Міма, і {piece} дасталася іншаму.',
        tail: 'Застаўся толькі хвост, і вяроўка разгайданая найдужэй. Спроб: {n}.',
        tailMiss: 'Міма. Засталося {n}.',
        win: 'Ты адкусіў хвост. Гульня твая.',
        lose: 'Хвост дастаўся іншаму. Значыць, да наступнага 27 лістапада.',
      },
      advisors: {
        hanna: {
          name: 'Ганна',
          tag: 'шчодрая',
          greeting: [
            { be: 'Кладзі больш. Малы кот — малая радасць.', gloss: '' },
            { be: 'Не шкадуй цеста, і будзе што кусаць.', gloss: '' },
          ],
          bigBun: [
            { be: 'Вось гэта булка. Пад такую і рот шырэй.', gloss: '' },
            { be: 'Правільна. Чым большая, тым лягчэй у яе трапіць.', gloss: '' },
            { be: 'І пячэцца спакайней — вялікае не так хутка гарыць.', gloss: '' },
          ],
          smallBun: [
            { be: 'Гэта не булка, гэта гузік.', gloss: '' },
            { be: 'Малую і спаліць лягчэй, і ўкусіць вузка. Навошта табе двойчы кепска?', gloss: '' },
            { be: 'Шкадуеш цеста? Яно ж не срэбра.', gloss: '' },
          ],
          raw: [
            { be: 'Сыраватая. Затое цяжкая — кот павісне спакойна.', gloss: '' },
            { be: 'Недапечаная. Вузка кусаць будзе, але вага ў ёй ёсць.', gloss: '' },
          ],
          golden: [
            { be: 'Залатая. Такую і паказаць не сорамна.', gloss: '' },
            { be: 'Во, у самы раз. Кладзі на стол.', gloss: '' },
          ],
          burnt: [
            { be: 'Спаліў. Ну хоць шырокая — хрумсткае кусаецца лёгка.', gloss: '' },
            { be: 'Чорная і лёгкая, як папера. Кот з такіх будзе скакаць.', gloss: '' },
          ],
          doughLow: [
            { be: 'Дно відаць. Ну затое пяць булак як булкі.', gloss: '' },
            { be: 'Цеста мала. Хай сабе малы хвост — хвост ёсць хвост.', gloss: '' },
          ],
          tailNext: [
            { be: 'Апошні — хвост. Што ў дзяжы, тое і будзе.', gloss: '' },
            { be: 'Хвост. Дай яму ўсё, што засталося, — больш узяць няма адкуль.', gloss: '' },
          ],
          swing: [
            { be: 'Рот наперад! Не бокам!', gloss: '' },
            { be: 'Хапай большы кавалак, не дзяўбі па крошцы.', gloss: '' },
            { be: 'Ну чаго чакаеш? Ён сам да рота не прыйдзе.', gloss: '' },
          ],
          shove: [
            { be: 'Штурхаюць! Трымайся за вілы.', gloss: '' },
            { be: 'Шырокі кавалак і штуршка не баіцца.', gloss: '' },
          ],
          playerHit: [
            { be: 'Во! Я ж казала — шырокая булка, шырокі ўкус.', gloss: '' },
            { be: 'Твой кавалак. І яшчэ адна спроба на хвост.', gloss: '' },
          ],
          playerMiss: [
            { be: 'Малавата было. Кажу ж — не шкадуй цеста.', gloss: '' },
            { be: 'Міма. Нічога, кот цяпер лягчэйшы.', gloss: '' },
          ],
          win: [
            { be: 'Во як трэба. Хвост твой, і размовы скончаны.', gloss: '' },
            { be: 'Малайчына. Сядай, зараз есці будзем.', gloss: '' },
          ],
          lose: [
            { be: 'Шкада. Блізка ж быў.', gloss: '' },
            { be: 'Ну, чужы хвост таксама хвост. На той год адкусіш.', gloss: '' },
          ],
        },
        symon: {
          name: 'Сымон',
          tag: 'ашчадны',
          greeting: [
            { be: 'Дзяжа адна, а булак шэсць. Лічы адразу.', gloss: '' },
            { be: 'Спачатку падумай, потым адрывай.', gloss: '' },
          ],
          bigBun: [
            { be: 'Куды столькі? Гэта ж ты з хваста адарваў.', gloss: '' },
            { be: 'Вялікая, вядома. А чым потым хвост лепім?', gloss: '' },
          ],
          smallBun: [
            { be: 'Во. Малую і рабі — на хвост застанецца.', gloss: '' },
            { be: 'Разумна. Толькі малая гарыць хутка — не адыходзь ад печы.', gloss: '' },
          ],
          raw: [
            { be: 'Ранавата выняў. Цяжкая, ды ўкус ад яе вузкі.', gloss: '' },
            { be: 'Сырое. Кот павісне цяжкі і спакойны — а кусаць нязручна.', gloss: '' },
          ],
          golden: [
            { be: 'Во так. Залатая — і вага ёсць, і рот шырокі.', gloss: '' },
            { be: 'Правільна вынуў. Больш нічога і не трэба.', gloss: '' },
          ],
          burnt: [
            { be: 'Перадзяржаў. Лёгкая, як вугаль, — цяпер кот пойдзе ў разнос.', gloss: '' },
            { be: 'Спаліў. Кусаць шырэй, ды гайданне будзе шалёнае.', gloss: '' },
          ],
          doughLow: [
            { be: 'Вось табе і дно дзяжы. А хвост яшчэ наперадзе.', gloss: '' },
            { be: 'Мала засталося. Далей толькі скрабі.', gloss: '' },
          ],
          tailNext: [
            { be: 'Хвост. Усё, што ў дзяжы, — яму. Другога разу не будзе.', gloss: '' },
            { be: 'Апошні кавалак вырашае гульню. Мераць ужо няма чаго.', gloss: '' },
          ],
          swing: [
            { be: 'Не спяшайся. Вяроўка сама вернецца.', gloss: '' },
            { be: 'Кожны ўзяты кавалак — яшчэ адна спроба на хвост.', gloss: '' },
          ],
          shove: [
            { be: 'Чакай, не скачы на штуршок. Перачакай яго.', gloss: '' },
            { be: 'Замахнуліся. Пастой, хай пройдзе.', gloss: '' },
          ],
          playerHit: [
            { be: 'Добра. Спроба на хвост дадалася.', gloss: '' },
            { be: 'Узяў. Толькі памятай: кот цяпер лягчэйшы і хутчэйшы.', gloss: '' },
          ],
          playerMiss: [
            { be: 'Раней трэба было. Ён ужо адыходзіў.', gloss: '' },
            { be: 'Міма. Кавалак пайшоў іншаму, а кот усё роўна палягчэў.', gloss: '' },
          ],
          win: [
            { be: 'Ну вось. А ты не хацеў лічыць.', gloss: '' },
            { be: 'Хвост твой. Значыць, у дзяжы засталося акурат столькі, колькі трэба.', gloss: '' },
          ],
          lose: [
            { be: 'Не хапіла. Кажу ж — апошні кавалак вырашае.', gloss: '' },
            { be: 'Шкада. Ну хоць паглядзелі, як яно бывае.', gloss: '' },
          ],
        },
        alesik: {
          name: 'Алесік',
          tag: 'малы',
          greeting: [
            { be: 'Я ў печ гляджу! Скажу, калі счарнее.', gloss: '' },
            { be: 'А давайце спалім хоць адну. Ну хоць адну!', gloss: '' },
          ],
          bigBun: [
            { be: 'Вялікая! Такая доўга пячэцца — я пачакаю.', gloss: '' },
            { be: 'Ого. Пакуль яна счырванее, я тры разы збегаю.', gloss: '' },
          ],
          smallBun: [
            { be: 'Малая счарнее ў момант. Не адыходзь!', gloss: '' },
            { be: 'Гэткая згарыць хутчэй за ўсіх. Здорава!', gloss: '' },
          ],
          raw: [
            { be: 'Рана! Яна ж яшчэ цеста. Цяжкая будзе — кот павісне як мех.', gloss: '' },
            { be: 'Сырая. Нудна. Вяроўка з ёй ледзь варушыцца.', gloss: '' },
          ],
          golden: [
            { be: 'Залатая... ну добра. Хоць адну ж дайце спаліць.', gloss: '' },
            { be: 'Во, акурат. Толькі ж не цікава.', gloss: '' },
          ],
          burnt: [
            { be: 'Чорная! Цяпер кот скакаць будзе!', gloss: '' },
            { be: 'Вугаль! Лёгкі, як пух, — вяроўка з розуму сыдзе.', gloss: '' },
            { be: 'Хрумсціць! І рот пад яе шырэйшы.', gloss: '' },
          ],
          doughLow: [
            { be: 'Цеста мала — значыць, апошняя згарыць у момант!', gloss: '' },
            { be: 'Ужо дно? А я і не наеўся.', gloss: '' },
          ],
          tailNext: [
            { be: 'Хвост! Спаліце хвост — ён шырокі будзе, сам у рот трапіць!', gloss: '' },
            { be: 'Апошні. Толькі не выцягвайце рана, сыры хвост вузкі.', gloss: '' },
          ],
          swing: [
            { be: 'Скачы! Ну скачы ўжо!', gloss: '' },
            { be: 'Глядзі, як лётае! Гэта таму, што лёгкі.', gloss: '' },
          ],
          shove: [
            { be: 'Я штурхну! Я моцна штурхну!', gloss: '' },
            { be: 'Зараз штурхнём! Трымайся, калі можаш!', gloss: '' },
            { be: 'Гэта я! Гэта я цяпер штурхаю!', gloss: '' },
          ],
          playerHit: [
            { be: 'Адкусіў! Цяпер яшчэ хутчэй пойдзе!', gloss: '' },
            { be: 'Во! Яшчэ адну спробу зарабіў.', gloss: '' },
          ],
          playerMiss: [
            { be: 'Міма-а! Я ж штурхнуў.', gloss: '' },
            { be: 'Не туды! Ён жа ў той бок ляцеў.', gloss: '' },
          ],
          win: [
            { be: 'Хвост! Хвост адкусіў! Я ж казаў!', gloss: '' },
            { be: 'А заўтра можна яшчэ? ...Не, заўтра нельга.', gloss: '' },
          ],
          lose: [
            { be: 'Э-эх. А я хацеў, каб згарэла ўсё.', gloss: '' },
            { be: 'Не адкусіў. Ну хоць кот лётаў добра.', gloss: '' },
          ],
        },
      },
      epilogue: {
        win: 'Хвост твой. Ката з’елі да апошняй крошкі, і ў хаце робіцца ціха.',
        lose: 'Хвост дастаўся іншаму. Ката ўсё роўна з’елі — да апошняй крошкі.',
        calendar:
          'А заўтра з раніцы Піліпаўка. Пост забірае мяса, а разам з ім і гульні — да самых Каляд.',
        docLabel: 'Што тут запісана насамрэч',
        facts: [
          'Ігрышча «Ката пячы» — Дзяржаўны спіс гісторыка-культурных каштоўнасцей, 33АК000117, унесена ў 2017 годзе.',
          'аг. Скірмантава, Дзяржынскі раён.',
          'Вядзе род Радзькаў праз калектывы «Сваякі» і «Весялуха» — штогод з 1993-га.',
        ],
        invented:
          'Ганна, Сымон і Алесік — нашы. Спіс называе абрад, а не гэтых людзей: імёны, спрэчкі і ўсе парады прыдуманы тут.',
      },
      sourceLabel: 'Крыніца',
      source:
        'Дзяржаўны спіс гісторыка-культурных каштоўнасцей Рэспублікі Беларусь, 33АК000117, унесена ў 2017 годзе: ігрышча «Ката пячы» аг. Скірмантава Дзяржынскага раёна. Яго вядзе род Радзькаў праз калектывы «Сваякі» і «Весялуха», штогод пачынаючы з 1993-га.',
      honestyLabel: 'Наколькі яна беларуская',
      honesty:
        'Адна з нямногіх гульняў корпусу, за якой сапраўды стаіць заяўка на ўнікальнасць: ні рускага, ні ўкраінскага, ні польскага адпаведніка не знайшлося ні пад якою назвай. Але спіс ахоўвае абрад адной вёскі, а не агульнанацыянальную гульню, — запісана скірмантаўскае, і так яно тут і пададзена.',
      calendarLabel: 'Чаму 27 лістапада',
      calendar:
        'Напярэдадні Піліпаўкі. Ежа знарок тлустая: пост пачынаецца назаўтра раніцай і забараняе мяса — а разам з ім і гульні.',
      choicesLabel: 'Што выбралі мы самі',
      choices:
        'З запісу: ката пякуць з булак, падвешваюць да столі, узнімаюцца на вілах, астатнія штурхаюць, а вырашае хвост. Усё, пры чым стаіць лічба, — наша: колькі цеста ў дзяжы, што дае памер булкі пры ўкусе, што робяць з гайданнем сырое і падгарэлае, колькі спробаў дае хвост. Першая палова, выпечка, гуляецца тут як асобная гульня, якой у запісе няма: там ёсць булкі, але не спаборніцтва за іх. Нашы і трое за сталом: Ганна, Сымон і Алесік прыдуманыя, і іх парады знарок супярэчаць адна адной — бо варыянты традыцыі сапраўды разыходзяцца, а не таму, што нехта з траіх мае рацыю.',
      back: 'усе гульні',
    },
  },
  toy: {
    title: 'краніце філасофію →',
    target: 'мэта: ×3 MRR за 24 месяцы',
    growth: 'рост, %/мес',
    churn: 'адток, %/мес',
    button: 'goal-seek',
    note: 'ніводную з гэтых лічбаў не лічыў ШІ — дэтэрмінаваны рухавік, як у Adlega.',
    months: 'мес',
  },
  record: {
    label: 'Шлях',
    entries: [
      {
        years: '2024 —',
        title: 'Adlega · сузаснавальнік',
        note: 'ШІ-фіндырэктар для SaaS-заснавальнікаў. Прадукт цалкам: агенты, дэтэрмінаваны рухавік, інтэрфейс мадэлі.',
      },
      {
        years: '2022 —',
        title: 'Незалежны кансультант',
        note: 'Высоканагружаныя плацяжы (Modulr), карпаратыўныя і дзяржаўныя сістэмы.',
      },
      {
        years: '2014 – 2022',
        title: 'HYLA Mobile, кампанія Assurant · senior full-stack',
        note: 'Trade-in-платформа ў 16 000+ крамах. Вёў распіл маналіта на мікрасэрвісы; нагрузачнае тэсціраванне на Gatling.',
      },
      {
        years: '2013 – 2014',
        title: 'Першы стартап і фрыланс',
        note: 'Сузаснавальнік мабільнага стартапа. HTML5-відэаплэеры, рэндэрынг картаў, невялікія бэкенды, што гадамі працавалі без нагляду.',
      },
      {
        years: '2007 – 2012',
        title: 'БДУІР',
        note: 'Дыплом інжынера-праграміста.',
      },
    ],
    stack:
      'Java · Spring · TypeScript · Angular · React · Node.js · PostgreSQL · Kafka · AWS · LLM-агенты',
  },
  socialsLabel: 'Я ў сетцы',
  leaf: {
    label: 'Адрыўны каляндар: беларускае слова дня',
    caption: 'беларускае слова на кожны дзень',
  },
  contact: {
    label: 'Скажыце прывітанне',
    lede: 'Кансалтынг, фідбэк па прадукце, цікавыя задачы — пошта адкрытая.',
    email: 'dimhold@gmail.com',
  },
  consent: {
    label: 'Пра кукі',
    text: 'Я лічу візіты праз Google Analytics — колькі людзей заходзіць і якія старонкі чытаюць. Ні рэкламы, ні прафілявання, ніякага продажу даных. Пакуль вы не пагодзіцеся, на вашу прыладу нічога не запісваецца.',
    more: 'Што з гэтым робіць Google',
    accept: 'Дазволіць',
    decline: 'Не трэба',
  },
  notFound: {
    title: 'Старонка не знойдзена',
    text: 'Па гэтым адрасе нічога няма.',
    home: 'На галоўную',
  },
};

export const dictionaries: Record<Lang, Dictionary> = { en, ru, be };

/* `icon` keys the inline SVG in SocialLinks.astro. Order is the order shown. */
export const socials = [
  { label: 'GitHub', icon: 'github', href: 'https://github.com/dimhold' },
  { label: 'X', icon: 'x', href: 'https://x.com/dimhold' },
  { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/dimhold' },
  { label: 'Telegram', icon: 'telegram', href: 'https://t.me/dimhold' },
  { label: 'Product Hunt', icon: 'producthunt', href: 'https://www.producthunt.com/@dimhold' },
  { label: 'Stack Overflow', icon: 'stackoverflow', href: 'https://stackoverflow.com/users/1538240/dimhold' },
  { label: 'Upwork', icon: 'upwork', href: 'https://www.upwork.com/freelancers/~01f23e484922726655' },
  { label: 'ORCID', icon: 'orcid', href: 'https://orcid.org/0009-0009-3013-4978' },
  { label: 'Hugging Face', icon: 'huggingface', href: 'https://huggingface.co/dimhold' },
] as const;
