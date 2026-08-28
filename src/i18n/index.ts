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
  /** Why the RU and BE switches on the papers pages are locked. Shown in the language of the locked switch. */
  papersOnlyEnglish: string;
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
      'Belarusian folk games, playable in the browser. Each one comes with who recorded it and where — and an honest account of what makes it Belarusian.',
    lede: 'These are games people played in Belarusian villages, and you can play them here. Hardly any of them is found nowhere else — the ethnographers are quite frank about that. But each has something of its own: the words, the tune, the thing in your hands, the day of the year it was played on. That is what this section is for.',
    framing:
      'In how they work, these games are much the same as their Russian, Ukrainian and Polish cousins. What differs is not the rules but the language, the tune, the equipment and the occasion. That is a far better story than arguing over uniqueness — and unlike the argument, it happens to be true.',
    rulesLabel: 'Three rules of this section',
    rules: [
      'Every game has a source: who recorded it, where, and in what year.',
      'Nothing added. The words “only in Belarus” appear only where the record says so.',
      'Where the record is silent and a number had to be invented, the page owns up to it.',
    ],
    statuses: { live: 'playable', planned: 'in the works' },
    play: 'play →',
    soon: 'coming',
    items: [
      {
        slug: 'kata-piachy',
        name: '«Ката пячы»',
        gloss:
          'A cat is shaped out of buns and hung from the ceiling. You are hoisted up on a pitchfork, jump and bite, while everyone else tries to knock you off. Reach the tail and you have won.',
        status: 'live',
        href: '/games/kata-piachy/',
      },
      {
        slug: 'lianok',
        name: '«Лянок»',
        gloss:
          'A song that follows flax from the field to the shirt: pulled, threshed, spread, broken, woven, bleached, cut, sewn — eight verses, eight movements. And the cloth at the end folds into a real pattern.',
        status: 'planned',
      },
      {
        slug: 'pannachka',
        name: '«Панначка»',
        gloss:
          'Girls stand in a ring, a candle in every hand. Guard your own, blow out your neighbour’s. Nobody loses: the last flame goes round the ring and lights everyone up again.',
        status: 'planned',
      },
      {
        slug: 'hrahi',
        name: '«Грахі»',
        gloss:
          'A ball is rolled along a row of holes. Miss, and the sin is yours; hit, and it goes to your opponent. The more sins you carry, the fewer throws you get: the guilty are in no position to punish.',
        status: 'planned',
      },
      {
        slug: 'zanicba-cyareski',
        name: '«Жаніцьба Цярэшкі»',
        gloss:
          'A make-believe wedding at Kalady — the one game ethnographers call purely Belarusian. You are the matchmaker, pairing off couple after couple, and the song tells you what comes next.',
        status: 'planned',
      },
    ],
    kata: {
      name: '«Ката пячы»',
      gloss: 'baking the cat',
      title: '«Ката пячы» — a game where the cat is baked first and bitten after',
      description:
        'Every 27 November in Skirmantava a cat is shaped out of buns, hung from the ceiling and bitten at from a pitchfork; whoever gets the tail wins. Here you have to bake the cat yourself first.',
      kicker: '27 November · аг. Скірмантава · State List 33АК000117',
      lede: 'On the evening before the fast a cat is shaped out of buns and hung from the ceiling on a cord. The players are hoisted up to it one by one on a pitchfork: jump, bite, and the piece is yours. Everyone else, meanwhile, is shoving to make you miss. Whoever bites off the tail wins. Here there is an oven in front of all that: the cat has to be baked first. And whatever comes out of the oven is the cat you will have to bite.',
      howLabel: 'How to play',
      how: [
        'Hold, and a lump of dough pulls away from the trough. A big bun is easier to bite later; a small one is harder — and it burns faster in the oven.',
        'The trough holds dough for exactly six buns. The sixth is the tail, and without a tail there is no winning. Remember to leave some for it.',
        'Let go, and the lump goes into the oven. Press when the bun turns golden. Raw comes out heavy and slippery; burnt comes out wide and crisp, but light as a feather.',
        'Then the cat is hung up, and the real thing begins. A heavy cat swings lazily, a light one tears about — and with every piece bitten off it gets lighter.',
      ],
      start: 'Knead',
      again: 'Again',
      jump: 'Hold to shape a bun, press to take it out of the oven, press to bite',
      soundOn: 'sound on',
      soundOff: 'sound off',
      viewWide: 'full width',
      viewNormal: 'usual size',
      actBake: 'baking',
      actBite: 'biting',
      dough: 'trough',
      weight: 'the cat’s weight',
      bakes: { raw: 'underdone', golden: 'just right', burnt: 'burnt' },
      yours: 'yours',
      rivals: 'theirs',
      tries: 'tries',
      shove: 'a shove!',
      sceneAlt:
        'A cat made of buns hangs on a cord from a beam. Below it a boy on a pitchfork, beside them an oven and a trough of dough, and the whole house around.',
      bestLabel: 'best so far',
      bestWon: 'took the tail',
      bestNone: 'no tail yet',
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
        scene: 'Winter, evening, the last one before the fast. One window is lit — inside, the dough is already being kneaded.',
        skip: 'skip',
      },
      goal: {
        standing: 'bite off the tail',
        bake: 'six buns from one trough; the sixth is the tail',
        bite: 'every piece you bite off is one more try at the tail',
      },
      msg: {
        idle: 'The trough is full and the oven is hot. Six buns make a cat.',
        shape: 'Hold, and the lump grows. This one will be {piece}.',
        bake: 'Into the oven. Press when it turns golden.',
        baked: '{piece}: {bake}.',
        tailNext: 'The last one is the tail, and the tail is the whole game. Dough left: {n}.',
        doughOut: 'The trough is empty. From here on, you bake what you scraped.',
        hung: 'The cat is baked and hung. Time to bite.',
        ready: 'Bite: {piece}.',
        hit: 'Got it! The cat is lighter — and picking up speed.',
        miss: 'Missed. That piece went to someone else.',
        tail: 'Only the tail is left, and the cord is flying like never before. Tries: {n}.',
        tailMiss: 'Missed. Tries left: {n}.',
        win: 'The tail is yours. The game is yours.',
        lose: 'The tail went to someone else. Never mind — next 27 November is not far off.',
      },
      advisors: {
        hanna: {
          name: 'Hanna',
          tag: 'generous',
          greeting: [
            { be: 'Кладзі больш. Малы кот — малая радасць.', gloss: 'Put more in. A small cat is a small joy.' },
            { be: 'Не шкадуй цеста — будзе што кусаць.', gloss: 'Don’t skimp on the dough, and there will be something to bite.' },
          ],
          bigBun: [
            { be: 'Вось гэта булка. Пад такую і рот шырэй.', gloss: 'Now that’s a bun. Your mouth opens wider for one like that.' },
            { be: 'Правільна. Чым большая, тым лягчэй у яе трапіць.', gloss: 'That’s right. The bigger it is, the easier to hit.' },
            { be: 'І пячэцца спакайней: вялікая не так хутка гарыць.', gloss: 'And it bakes calmer: a big one doesn’t burn so fast.' },
          ],
          smallBun: [
            { be: 'Гэта не булка, гэта гузік.', gloss: 'That’s not a bun, that’s a button.' },
            { be: 'Малая і гарыць хутка, і кусаецца вузка. Навошта табе такая?', gloss: 'A small one burns fast and bites narrow. What do you want that for?' },
            { be: 'Шкадуеш цеста? Яно ж не срэбра.', gloss: 'Saving the dough? It isn’t silver.' },
          ],
          raw: [
            { be: 'Сыраватая. Затое цяжкая — кот павісне спакойна.', gloss: 'A bit raw. But heavy — the cat will hang nice and calm.' },
            { be: 'Недапечаная. Кусаць будзе вузка, але вага ў ёй ёсць.', gloss: 'Underdone. A narrow bite, but there’s weight in it.' },
          ],
          golden: [
            { be: 'Залатая. Такую і людзям паказаць не сорамна.', gloss: 'Golden. You could show that one to anybody.' },
            { be: 'Во, акурат. Кладзі на стол.', gloss: 'There, just right. Put it on the table.' },
          ],
          burnt: [
            { be: 'Спаліў. Ну хоць шырокая — хрумсткае лёгка кусаецца.', gloss: 'Burnt it. Well, at least it’s wide — crisp is easy to bite.' },
            { be: 'Чорная і лёгкая, як папера. Кот з такіх будзе скакаць.', gloss: 'Black and light as paper. A cat of those will jump.' },
          ],
          doughLow: [
            { be: 'Ужо дно відаць. Затое пяць булак — як булкі.', gloss: 'I can see the bottom already. But five proper buns, at least.' },
            { be: 'Цеста мала. Ну, хай хвост будзе малы — хвост ёсць хвост.', gloss: 'Not much dough left. Well, let the tail be small — a tail is a tail.' },
          ],
          tailNext: [
            { be: 'Апошні — хвост. Што ў дзяжы засталося, тое яму і будзе.', gloss: 'The last one is the tail. Whatever is left in the trough is what it gets.' },
            { be: 'Хвост. Аддай яму ўсё, што ёсць, — больш узяць няма адкуль.', gloss: 'The tail. Give it everything you have — there’s nowhere else to get more.' },
          ],
          swing: [
            { be: 'Ротам наперад! Не бокам!', gloss: 'Mouth first! Not sideways!' },
            { be: 'Хапай вялікі кавалак, не дзяўбі па крошцы.', gloss: 'Grab a big piece, don’t peck at crumbs.' },
            { be: 'Ну чаго чакаеш? Сам ён да рота не прыйдзе.', gloss: 'What are you waiting for? It won’t come to your mouth by itself.' },
          ],
          shove: [
            { be: 'Штурхаюць! Трымайся за вілы.', gloss: 'They’re shoving! Hold on to the pitchfork.' },
            { be: 'Шырокі кавалак штуршка не баіцца.', gloss: 'A wide piece isn’t afraid of a shove.' },
          ],
          playerHit: [
            { be: 'Во! Я ж казала: шырокая булка — шырокі ўкус.', gloss: 'There! I told you: a wide bun, a wide bite.' },
            { be: 'Твой кавалак. І яшчэ адна спроба на хвост.', gloss: 'That piece is yours. And one more try at the tail.' },
          ],
          playerMiss: [
            { be: 'Малаваты быў. Кажу ж — не шкадуй цеста.', gloss: 'Too small, that one. I keep telling you: don’t skimp on the dough.' },
            { be: 'Міма. Нічога, кот цяпер лягчэйшы.', gloss: 'Missed. Never mind, the cat is lighter now.' },
          ],
          win: [
            { be: 'Во як трэба. Хвост твой, і гаворка скончана.', gloss: 'That’s how it’s done. The tail is yours, and that settles it.' },
            { be: 'Малайчына. Сядай, будзем есці.', gloss: 'Well done. Sit down, let’s eat.' },
          ],
          lose: [
            { be: 'Шкада. Блізка ж было.', gloss: 'A pity. It was so close.' },
            { be: 'Ну, чужы хвост — таксама хвост. На той год адкусіш.', gloss: 'Well, somebody else’s tail is still a tail. You’ll get it next year.' },
          ],
        },
        symon: {
          name: 'Symon',
          tag: 'thrifty',
          greeting: [
            { be: 'Дзяжа адна, а булак шэсць. Лічы адразу.', gloss: 'One trough, six buns. Start counting now.' },
            { be: 'Спачатку падумай, потым адрывай.', gloss: 'Think first, tear off after.' },
          ],
          bigBun: [
            { be: 'Куды столькі? Гэта ж ты ў хваста адарваў.', gloss: 'What do you want all that for? That came off the tail.' },
            { be: 'Вялікая, вядома. А з чаго потым хвост ляпіць?', gloss: 'Big, sure. And what do you shape the tail from later?' },
          ],
          smallBun: [
            { be: 'Во. Малую і рабі — на хвост застанецца.', gloss: 'There. Keep them small, and there’ll be some left for the tail.' },
            { be: 'Разумна. Толькі малая гарыць хутка, ад печы не адыходзь.', gloss: 'Sensible. Only a small one burns fast — don’t leave the oven.' },
          ],
          raw: [
            { be: 'Ранавата выняў. Цяжкая, ды ўкус ад яе вузкі.', gloss: 'Took it out too early. Heavy, but a narrow bite.' },
            { be: 'Сырая. Кот павісне цяжкі і спакойны, а кусаць нязручна.', gloss: 'Raw. The cat will hang heavy and calm, but it’s awkward to bite.' },
          ],
          golden: [
            { be: 'Во так. Залатая: і вага ёсць, і ўкус шырокі.', gloss: 'That’s it. Golden: it has weight, and the bite is wide.' },
            { be: 'У самы час выняў. Больш нічога і не трэба.', gloss: 'Took it out at just the right moment. Nothing more is needed.' },
          ],
          burnt: [
            { be: 'Перадзяржаў. Лёгкая, як вугаль, — цяпер кот пойдзе ў разнос.', gloss: 'Left it in too long. Light as charcoal — now the cat will go wild.' },
            { be: 'Спаліў. Кусаць шырэй, ды гайдацца будзе шалёна.', gloss: 'Burnt. A wider bite, but the swing will be mad.' },
          ],
          doughLow: [
            { be: 'Вось табе і дно дзяжы. А хвост яшчэ наперадзе.', gloss: 'There’s the bottom of the trough for you. And the tail still to come.' },
            { be: 'Мала засталося. Далей толькі скрабці.', gloss: 'Not much left. From here on you’re scraping.' },
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
            { be: 'Чакай, не скачы пад штуршок. Перачакай.', gloss: 'Wait — don’t jump into the shove. Let it pass.' },
            { be: 'Замахнуліся. Пастой, хай пройдзе.', gloss: 'They’re winding up. Stand still, let it go by.' },
          ],
          playerHit: [
            { be: 'Добра. Яшчэ адна спроба на хвост.', gloss: 'Good. One more try at the tail.' },
            { be: 'Узяў. Толькі памятай: кот цяпер лягчэйшы і хутчэйшы.', gloss: 'Got it. Only remember: the cat is lighter now, and faster.' },
          ],
          playerMiss: [
            { be: 'Раней трэба было. Ён ужо адыходзіў.', gloss: 'Should have gone sooner. It was already on its way out.' },
            { be: 'Міма. Кавалак пайшоў іншаму, а кот усё роўна палягчэў.', gloss: 'Missed. The piece went to somebody else, and the cat got lighter anyway.' },
          ],
          win: [
            { be: 'Ну вось. А ты лічыць не хацеў.', gloss: 'There you go. And you didn’t want to count.' },
            { be: 'Хвост твой. Значыць, у дзяжы засталося акурат колькі трэба.', gloss: 'The tail is yours. So there was exactly enough left in the trough.' },
          ],
          lose: [
            { be: 'Не хапіла. Кажу ж: апошні кавалак вырашае.', gloss: 'Not enough. I keep saying: the last piece decides it.' },
            { be: 'Шкада. Ну, хоць паглядзелі, як яно бывае.', gloss: 'A pity. Well, at least we saw how it goes.' },
          ],
        },
        alesik: {
          name: 'Alesik',
          tag: 'the youngest',
          greeting: [
            { be: 'Я ў печ гляджу! Скажу, калі счарнее.', gloss: 'I’m watching the oven! I’ll say when it goes black.' },
            { be: 'А давайце спалім хоць адну! Ну хоць адну!', gloss: 'Let’s burn one! Just one, come on!' },
          ],
          bigBun: [
            { be: 'Вялікая! Такая доўга пячэцца — я пачакаю.', gloss: 'A big one! That takes ages to bake — I’ll wait.' },
            { be: 'Ого. Пакуль яна зарумяніцца, я тры разы збегаю.', gloss: 'Whoa. By the time that browns I can run out three times.' },
          ],
          smallBun: [
            { be: 'Малая счарнее ў момант. Не адыходзь!', gloss: 'A small one goes black in a blink. Don’t walk away!' },
            { be: 'Гэтая згарыць хутчэй за ўсіх. Здорава!', gloss: 'That one will burn faster than any of them. Brilliant!' },
          ],
          raw: [
            { be: 'Рана! Яна ж яшчэ цеста. Цяжкая будзе — кот павісне, як мех.', gloss: 'Too early! It’s still dough. It’ll be heavy — the cat will hang like a sack.' },
            { be: 'Сырая. Нудна. Вяроўка з ёй ледзь варушыцца.', gloss: 'Raw. Boring. The cord hardly moves with that on it.' },
          ],
          golden: [
            { be: 'Залатая… ну добра. Хоць адну ж дайце спаліць.', gloss: 'Golden… fine. But let me burn at least one.' },
            { be: 'Во, акурат. Толькі ж нецікава.', gloss: 'There, just right. Boring, though.' },
          ],
          burnt: [
            { be: 'Чорная! Цяпер кот скакаць будзе!', gloss: 'Black! Now the cat will jump!' },
            { be: 'Вугаль! Лёгкі, як пух, — вяроўка з розуму сыдзе.', gloss: 'Charcoal! Light as fluff — the cord will lose its mind.' },
            { be: 'Хрумсціць! І рот пад яе шырэйшы.', gloss: 'It crunches! And your mouth opens wider for it.' },
          ],
          doughLow: [
            { be: 'Цеста мала — значыць, апошняя згарыць у момант!', gloss: 'Not much dough left — so the last one will burn in a blink!' },
            { be: 'Ужо дно? А я і не наеўся.', gloss: 'The bottom already? I’m not even full.' },
          ],
          tailNext: [
            { be: 'Хвост! Спаліце хвост — ён шырокі будзе, сам у рот трапіць!', gloss: 'The tail! Burn the tail — it’ll be wide, it’ll jump into your mouth by itself!' },
            { be: 'Апошні. Толькі рана не выцягвайце: сыры хвост вузкі.', gloss: 'The last one. Only don’t take it out early: a raw tail is narrow.' },
          ],
          swing: [
            { be: 'Скачы! Ну скачы ўжо!', gloss: 'Jump! Come on, jump already!' },
            { be: 'Глядзі, як лётае! Гэта таму, што лёгкі.', gloss: 'Look at it fly! That’s because it’s light.' },
          ],
          shove: [
            { be: 'Я штурхну! Я моцна штурхну!', gloss: 'I’ll shove! I’ll shove really hard!' },
            { be: 'Зараз штурхнём! Трымайся, калі можаш!', gloss: 'Here comes a shove! Hold on if you can!' },
            { be: 'Гэта я! Гэта я цяпер штурхаю!', gloss: 'It’s me! It’s me shoving this time!' },
          ],
          playerHit: [
            { be: 'Адкусіў! Цяпер яшчэ хутчэй пойдзе!', gloss: 'Bit it off! Now it’ll go even faster!' },
            { be: 'Во! Яшчэ адну спробу зарабіў.', gloss: 'There! One more try earned.' },
          ],
          playerMiss: [
            { be: 'Мі-іма! Гэта я штурхнуў.', gloss: 'Mi-issed! That was me shoving.' },
            { be: 'Не туды! Ён жа ў той бок ляцеў.', gloss: 'Wrong way! It was flying the other way.' },
          ],
          win: [
            { be: 'Хвост! Хвост адкусіў! Я ж казаў!', gloss: 'The tail! He got the tail! I told you!' },
            { be: 'А заўтра можна яшчэ? …Не, заўтра нельга.', gloss: 'Can we do it again tomorrow? …No. Not tomorrow.' },
          ],
          lose: [
            { be: 'Э-эх. А я хацеў, каб усё згарэла.', gloss: 'Aww. And I wanted the whole thing burnt.' },
            { be: 'Не адкусіў. Ну, хоць кот добра лётаў.', gloss: 'Didn’t get it. The cat flew nicely, though.' },
          ],
        },
      },
      epilogue: {
        win: 'The tail is yours. The cat is eaten to the last crumb, and the house falls quiet.',
        lose: 'The tail went to someone else. The cat is eaten all the same, to the last crumb.',
        calendar:
          'And in the morning the Piĺipaŭka fast begins. It takes the meat away, and the games with it, until Kalady.',
        docLabel: 'What the record actually says',
        facts: [
          'The rite «Ката пячы» was entered on the State List of Historical and Cultural Values of Belarus in 2017, number 33АК000117.',
          'The village of Skirmantava, Dziaržynsk district.',
          'The rite rests on the Redźka family and the ensembles «Сваякі» and «Весялуха» — every year since 1993.',
        ],
        invented:
          'Hanna, Symon and Alesik are our invention. The list records a rite, not people: the names, the bickering and every piece of advice were made up here.',
      },
      sourceLabel: 'Source',
      source:
        'State List of Historical and Cultural Values of the Republic of Belarus, no. 33АК000117, entered in 2017: the rite «Ката пячы», village of Skirmantava, Dziaržynsk district. The rite rests on the Redźka family and the ensembles «Сваякі» and «Весялуха», every year since 1993.',
      honestyLabel: 'How Belarusian it is',
      honesty:
        'A rare case where the word “unique” holds up: nothing like it turned up among Russians, Ukrainians or Poles, however hard we looked. Then again, the rite is not Belarus-wide either — it belongs to one village. And that is how it is shown here: as Skirmantava’s.',
      calendarLabel: 'Why 27 November',
      calendar:
        'It is the last evening before the Piĺipaŭka fast. The food is deliberately rich and filling: the fast starts in the morning, and it allows neither meat nor games.',
      choicesLabel: 'What we made up ourselves',
      choices:
        'The record says little: the cat is baked from buns, hung from the ceiling, reached on a pitchfork, the others shove, and the tail decides. Every number is ours: how much dough the trough holds, what a bun’s size is worth in the biting, how raw and burnt change the swing, how many tries the tail allows. Baking as a half of the game is ours too: in the record the buns are simply baked, nobody competes over them. And the three at the table are invented — Hanna, Symon and Alesik. They deliberately give conflicting advice: the tradition comes in variants, and none of the three is more right than the others.',
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
  papersOnlyEnglish: 'Papers are English only. Each has a DOI and a PDF that Google Scholar indexes, and a translation would drift from them.',
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
    papers: 'papers',
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
      'Белорусские народные игры прямо в браузере. Про каждую сказано, кто и где её записал — и что в ней по-настоящему своё.',
    lede: 'Здесь можно сыграть в игры, в которые играли в белорусских деревнях. Таких, каких больше нигде нет, среди них почти не найдётся — этнографы говорят об этом прямо. Но у каждой есть своё: слова, песня, вещь в руках, день в году, когда в неё играли. Ради этого всё и затеяно.',
    framing:
      'Устроены эти игры примерно так же, как у русских, украинцев и поляков. Отличаются не правила, а язык, напев, инвентарь и повод. Это куда интереснее, чем спорить об уникальности, — и, в отличие от споров, это правда.',
    rulesLabel: 'Три правила раздела',
    rules: [
      'У каждой игры есть источник: кто записал, где и в каком году.',
      'Ничего от себя. Слова «только в Беларуси» появляются лишь там, где так написано в записи.',
      'Если в записи чего-то нет и цифру пришлось придумать, страница честно в этом признаётся.',
    ],
    statuses: { live: 'можно играть', planned: 'в работе' },
    play: 'играть →',
    soon: 'скоро',
    items: [
      {
        slug: 'kata-piachy',
        name: '«Ката пячы»',
        gloss:
          'Из булок лепят кота и вешают под потолок. Тебя поднимают на вилах, ты прыгаешь и откусываешь, а вокруг стараются столкнуть. Кто добрался до хвоста — тот и победил.',
        status: 'live',
        href: '/ru/games/kata-piachy/',
      },
      {
        slug: 'lianok',
        name: '«Лянок»',
        gloss:
          'Песня про лён от поля до рубахи: рвут, молотят, стелют, мнут, ткут, белят, кроят, шьют — восемь куплетов, восемь движений. А из полотна в конце складывается настоящий узор.',
        status: 'planned',
      },
      {
        slug: 'pannachka',
        name: '«Панначка»',
        gloss:
          'Девушки встают в круг, у каждой свеча. Свою — беречь, соседкину — задуть. Проигравших нет: последний огонёк обходит круг и зажигает всех заново.',
        status: 'planned',
      },
      {
        slug: 'hrahi',
        name: '«Грахі»',
        gloss:
          'Мяч катят вдоль лунок. Промазал — грех тебе, попал — грех сопернику. И чем больше на тебе грехов, тем реже тебе дают бросать: виноватому наказывать не положено.',
        status: 'planned',
      },
      {
        slug: 'zanicba-cyareski',
        name: '«Жаніцьба Цярэшкі»',
        gloss:
          'Колядная свадьба понарошку — единственная игра, которую этнографы называют чисто белорусской. Ты сваха: сводишь пары одну за другой, а что делать дальше, подсказывает песня.',
        status: 'planned',
      },
    ],
    kata: {
      name: '«Ката пячы»',
      gloss: 'печь кота',
      title: '«Ката пячы» — игра, где кота сначала пекут, а потом кусают',
      description:
        'Каждое 27 ноября в Скирмантове из булок лепят кота, вешают под потолок и кусают с вил — кто откусил хвост, тот победил. Здесь кота ещё и печь придётся самому.',
      kicker: '27 лістапада · аг. Скірмантава · Дзяржаўны спіс 33АК000117',
      lede: 'Вечером перед постом в хате из булок лепят кота и подвешивают на верёвке к потолку. Игроков по очереди поднимают к нему на вилах: прыгнул, откусил — твоё. А остальные тем временем толкаются, чтобы ты промахнулся. Кто откусил хвост, тот и выиграл. Здесь к этому добавлена печь: кота сначала надо испечь. И каким он выйдет из печи, такого и придётся кусать.',
      howLabel: 'Как играть',
      how: [
        'Зажми — и из дежи тянется ком теста. Большая булка потом легче кусается, маленькая — труднее, да ещё и горит в печи быстрее.',
        'Теста в деже ровно на шесть булок. Шестая — хвост, а без хвоста нет победы. Не забудь оставить на него.',
        'Отпусти — ком отправится в печь. Нажми, когда булка станет золотой. Сырая выйдет тяжёлой и скользкой, подгорелая — широкой и хрустящей, но лёгкой, как пух.',
        'Потом кота подвешивают, и начинается главное. Тяжёлый кот качается лениво, лёгкий носится как угорелый — и с каждым откушенным куском он всё легче.',
      ],
      start: 'Месить',
      again: 'Ещё раз',
      jump: 'Удерживай — лепишь булку, нажми — вынимаешь из печи, нажми — кусаешь',
      soundOn: 'звук включён',
      soundOff: 'звук выключен',
      viewWide: 'во всю ширину',
      viewNormal: 'обычный размер',
      actBake: 'печём',
      actBite: 'кусаем',
      dough: 'дежа',
      weight: 'вес кота',
      bakes: { raw: 'сыровато', golden: 'в самый раз', burnt: 'подгорело' },
      yours: 'у тебя',
      rivals: 'у остальных',
      tries: 'попыток',
      shove: 'толкают!',
      sceneAlt:
        'Кот из булок висит на верёвке под балкой. Под ним парень на вилах, рядом печь и дежа с тестом, вокруг вся хата.',
      bestLabel: 'лучший результат',
      bestWon: 'взял хвост',
      bestNone: 'хвоста пока не было',
      pieces: [
        { be: 'вуха', gloss: 'ухо' },
        { be: 'лапа', gloss: 'лапа' },
        { be: 'лапа', gloss: 'лапа' },
        { be: 'бок', gloss: 'бок' },
        { be: 'галава', gloss: 'голова' },
        { be: 'хвост', gloss: 'хвост' },
      ],
      prologue: {
        card: ['27 лістапада', 'аг. Скірмантава'],
        scene: 'Зима, вечер, последний перед постом. В одном окне свет — там уже месят тесто.',
        skip: 'пропустить',
      },
      goal: {
        standing: 'откуси хвост',
        bake: 'шесть булок из одной дежи, шестая — хвост',
        bite: 'каждый откушенный кусок — лишняя попытка на хвост',
      },
      msg: {
        idle: 'Дежа полна, печь натоплена. Шесть булок — и будет кот.',
        shape: 'Держи, ком растёт. Это будет {piece}.',
        bake: 'В печь. Нажми, когда зазолотится.',
        baked: '{piece}: {bake}.',
        tailNext: 'Последняя — хвост, а в нём вся игра. Теста осталось: {n}.',
        doughOut: 'Дежа пуста. Дальше лепим из того, что наскребли.',
        hung: 'Кот испечён и висит. Пора кусать.',
        ready: 'Кусай: {piece}.',
        hit: 'Есть! Кот полегчал — и разогнался.',
        miss: 'Мимо. Этот кусок ушёл другому.',
        tail: 'Остался хвост. Верёвка летает как никогда. Попыток: {n}.',
        tailMiss: 'Мимо. Осталось попыток: {n}.',
        win: 'Хвост твой. Игра твоя.',
        lose: 'Хвост достался другому. Ничего, до следующего 27 ноября недолго.',
      },
      advisors: {
        hanna: {
          name: 'Ганна',
          tag: 'щедрая',
          greeting: [
            { be: 'Кладзі больш. Малы кот — малая радасць.', gloss: 'Клади больше. Маленький кот — маленькая радость.' },
            { be: 'Не шкадуй цеста — будзе што кусаць.', gloss: 'Не жалей теста — будет что кусать.' },
          ],
          bigBun: [
            { be: 'Вось гэта булка. Пад такую і рот шырэй.', gloss: 'Вот это булка. Под такую и рот шире.' },
            { be: 'Правільна. Чым большая, тым лягчэй у яе трапіць.', gloss: 'Правильно. Чем больше, тем легче в неё попасть.' },
            { be: 'І пячэцца спакайней: вялікая не так хутка гарыць.', gloss: 'И печётся спокойнее: большая не так быстро горит.' },
          ],
          smallBun: [
            { be: 'Гэта не булка, гэта гузік.', gloss: 'Это не булка, это пуговица.' },
            { be: 'Малая і гарыць хутка, і кусаецца вузка. Навошта табе такая?', gloss: 'Маленькая и горит быстро, и кусается узко. Зачем тебе такая?' },
            { be: 'Шкадуеш цеста? Яно ж не срэбра.', gloss: 'Жалеешь тесто? Оно же не серебро.' },
          ],
          raw: [
            { be: 'Сыраватая. Затое цяжкая — кот павісне спакойна.', gloss: 'Сыровата. Зато тяжёлая — кот повиснет спокойно.' },
            { be: 'Недапечаная. Кусаць будзе вузка, але вага ў ёй ёсць.', gloss: 'Недопечённая. Кусать будет узко, но вес в ней есть.' },
          ],
          golden: [
            { be: 'Залатая. Такую і людзям паказаць не сорамна.', gloss: 'Золотая. Такую и людям показать не стыдно.' },
            { be: 'Во, акурат. Кладзі на стол.', gloss: 'Во, в самый раз. Клади на стол.' },
          ],
          burnt: [
            { be: 'Спаліў. Ну хоць шырокая — хрумсткае лёгка кусаецца.', gloss: 'Сжёг. Ну хоть широкая — хрустящее легко кусается.' },
            { be: 'Чорная і лёгкая, як папера. Кот з такіх будзе скакаць.', gloss: 'Чёрная и лёгкая, как бумага. Кот из таких будет скакать.' },
          ],
          doughLow: [
            { be: 'Ужо дно відаць. Затое пяць булак — як булкі.', gloss: 'Уже дно видно. Зато пять булок — как булки.' },
            { be: 'Цеста мала. Ну, хай хвост будзе малы — хвост ёсць хвост.', gloss: 'Теста мало. Ну, пусть хвост будет маленький — хвост есть хвост.' },
          ],
          tailNext: [
            { be: 'Апошні — хвост. Што ў дзяжы засталося, тое яму і будзе.', gloss: 'Последний — хвост. Что в деже осталось, то ему и достанется.' },
            { be: 'Хвост. Аддай яму ўсё, што ёсць, — больш узяць няма адкуль.', gloss: 'Хвост. Отдай ему всё, что есть, — больше взять неоткуда.' },
          ],
          swing: [
            { be: 'Ротам наперад! Не бокам!', gloss: 'Ртом вперёд! Не боком!' },
            { be: 'Хапай вялікі кавалак, не дзяўбі па крошцы.', gloss: 'Хватай большой кусок, не клюй по крошке.' },
            { be: 'Ну чаго чакаеш? Сам ён да рота не прыйдзе.', gloss: 'Ну чего ждёшь? Сам он ко рту не придёт.' },
          ],
          shove: [
            { be: 'Штурхаюць! Трымайся за вілы.', gloss: 'Толкают! Держись за вилы.' },
            { be: 'Шырокі кавалак штуршка не баіцца.', gloss: 'Широкий кусок толчка не боится.' },
          ],
          playerHit: [
            { be: 'Во! Я ж казала: шырокая булка — шырокі ўкус.', gloss: 'Во! Я же говорила: широкая булка — широкий укус.' },
            { be: 'Твой кавалак. І яшчэ адна спроба на хвост.', gloss: 'Твой кусок. И ещё одна попытка на хвост.' },
          ],
          playerMiss: [
            { be: 'Малаваты быў. Кажу ж — не шкадуй цеста.', gloss: 'Маловат был. Говорю же — не жалей теста.' },
            { be: 'Міма. Нічога, кот цяпер лягчэйшы.', gloss: 'Мимо. Ничего, кот теперь легче.' },
          ],
          win: [
            { be: 'Во як трэба. Хвост твой, і гаворка скончана.', gloss: 'Вот как надо. Хвост твой, и разговор окончен.' },
            { be: 'Малайчына. Сядай, будзем есці.', gloss: 'Молодец. Садись, будем есть.' },
          ],
          lose: [
            { be: 'Шкада. Блізка ж было.', gloss: 'Жалко. Близко же было.' },
            { be: 'Ну, чужы хвост — таксама хвост. На той год адкусіш.', gloss: 'Ну, чужой хвост — тоже хвост. На тот год откусишь.' },
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
            { be: 'Куды столькі? Гэта ж ты ў хваста адарваў.', gloss: 'Куда столько? Это ж ты у хвоста оторвал.' },
            { be: 'Вялікая, вядома. А з чаго потым хвост ляпіць?', gloss: 'Большая, конечно. А из чего потом хвост лепить?' },
          ],
          smallBun: [
            { be: 'Во. Малую і рабі — на хвост застанецца.', gloss: 'Во. Маленькую и делай — на хвост останется.' },
            { be: 'Разумна. Толькі малая гарыць хутка, ад печы не адыходзь.', gloss: 'Разумно. Только маленькая горит быстро, от печи не отходи.' },
          ],
          raw: [
            { be: 'Ранавата выняў. Цяжкая, ды ўкус ад яе вузкі.', gloss: 'Рановато вынул. Тяжёлая, да укус от неё узкий.' },
            { be: 'Сырая. Кот павісне цяжкі і спакойны, а кусаць нязручна.', gloss: 'Сырая. Кот повиснет тяжёлый и спокойный, а кусать неудобно.' },
          ],
          golden: [
            { be: 'Во так. Залатая: і вага ёсць, і ўкус шырокі.', gloss: 'Вот так. Золотая: и вес есть, и укус широкий.' },
            { be: 'У самы час выняў. Больш нічога і не трэба.', gloss: 'Вовремя вынул. Больше ничего и не надо.' },
          ],
          burnt: [
            { be: 'Перадзяржаў. Лёгкая, як вугаль, — цяпер кот пойдзе ў разнос.', gloss: 'Передержал. Лёгкая, как уголь, — теперь кот пойдёт вразнос.' },
            { be: 'Спаліў. Кусаць шырэй, ды гайдацца будзе шалёна.', gloss: 'Сжёг. Кусать шире, да качаться будет бешено.' },
          ],
          doughLow: [
            { be: 'Вось табе і дно дзяжы. А хвост яшчэ наперадзе.', gloss: 'Вот тебе и дно дежи. А хвост ещё впереди.' },
            { be: 'Мала засталося. Далей толькі скрабці.', gloss: 'Мало осталось. Дальше только скрести.' },
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
            { be: 'Чакай, не скачы пад штуршок. Перачакай.', gloss: 'Погоди, не прыгай под толчок. Пережди.' },
            { be: 'Замахнуліся. Пастой, хай пройдзе.', gloss: 'Замахнулись. Постой, пусть пройдёт.' },
          ],
          playerHit: [
            { be: 'Добра. Яшчэ адна спроба на хвост.', gloss: 'Хорошо. Ещё одна попытка на хвост.' },
            { be: 'Узяў. Толькі памятай: кот цяпер лягчэйшы і хутчэйшы.', gloss: 'Взял. Только помни: кот теперь легче и быстрее.' },
          ],
          playerMiss: [
            { be: 'Раней трэба было. Ён ужо адыходзіў.', gloss: 'Раньше надо было. Он уже уходил.' },
            { be: 'Міма. Кавалак пайшоў іншаму, а кот усё роўна палягчэў.', gloss: 'Мимо. Кусок ушёл другому, а кот всё равно полегчал.' },
          ],
          win: [
            { be: 'Ну вось. А ты лічыць не хацеў.', gloss: 'Ну вот. А ты считать не хотел.' },
            { be: 'Хвост твой. Значыць, у дзяжы засталося акурат колькі трэба.', gloss: 'Хвост твой. Значит, в деже осталось ровно сколько нужно.' },
          ],
          lose: [
            { be: 'Не хапіла. Кажу ж: апошні кавалак вырашае.', gloss: 'Не хватило. Говорю же: последний кусок решает.' },
            { be: 'Шкада. Ну, хоць паглядзелі, як яно бывае.', gloss: 'Жалко. Ну, хоть посмотрели, как оно бывает.' },
          ],
        },
        alesik: {
          name: 'Алесик',
          tag: 'младший',
          greeting: [
            { be: 'Я ў печ гляджу! Скажу, калі счарнее.', gloss: 'Я в печь смотрю! Скажу, когда почернеет.' },
            { be: 'А давайце спалім хоць адну! Ну хоць адну!', gloss: 'А давайте сожжём хоть одну! Ну хоть одну!' },
          ],
          bigBun: [
            { be: 'Вялікая! Такая доўга пячэцца — я пачакаю.', gloss: 'Большая! Такая долго печётся — я подожду.' },
            { be: 'Ого. Пакуль яна зарумяніцца, я тры разы збегаю.', gloss: 'Ого. Пока она зарумянится, я три раза сбегаю.' },
          ],
          smallBun: [
            { be: 'Малая счарнее ў момант. Не адыходзь!', gloss: 'Маленькая почернеет мигом. Не отходи!' },
            { be: 'Гэтая згарыць хутчэй за ўсіх. Здорава!', gloss: 'Эта сгорит быстрее всех. Здорово!' },
          ],
          raw: [
            { be: 'Рана! Яна ж яшчэ цеста. Цяжкая будзе — кот павісне, як мех.', gloss: 'Рано! Она же ещё тесто. Тяжёлая будет — кот повиснет, как мешок.' },
            { be: 'Сырая. Нудна. Вяроўка з ёй ледзь варушыцца.', gloss: 'Сырая. Скучно. Верёвка с ней еле шевелится.' },
          ],
          golden: [
            { be: 'Залатая… ну добра. Хоць адну ж дайце спаліць.', gloss: 'Золотая… ну ладно. Хоть одну-то дайте сжечь.' },
            { be: 'Во, акурат. Толькі ж нецікава.', gloss: 'Во, в самый раз. Только неинтересно же.' },
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
            { be: 'Апошні. Толькі рана не выцягвайце: сыры хвост вузкі.', gloss: 'Последний. Только рано не вынимайте: сырой хвост узкий.' },
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
            { be: 'Мі-іма! Гэта я штурхнуў.', gloss: 'Ми-имо! Это я толкнул.' },
            { be: 'Не туды! Ён жа ў той бок ляцеў.', gloss: 'Не туда! Он же в другую сторону летел.' },
          ],
          win: [
            { be: 'Хвост! Хвост адкусіў! Я ж казаў!', gloss: 'Хвост! Хвост откусил! Я же говорил!' },
            { be: 'А заўтра можна яшчэ? …Не, заўтра нельга.', gloss: 'А завтра можно ещё? …Нет, завтра нельзя.' },
          ],
          lose: [
            { be: 'Э-эх. А я хацеў, каб усё згарэла.', gloss: 'Э-эх. А я хотел, чтобы всё сгорело.' },
            { be: 'Не адкусіў. Ну, хоць кот добра лётаў.', gloss: 'Не откусил. Ну, хоть кот хорошо летал.' },
          ],
        },
      },
      epilogue: {
        win: 'Хвост твой. Кота съели до крошки, и в хате стало тихо.',
        lose: 'Хвост достался другому. Кота всё равно съели — до последней крошки.',
        calendar:
          'А с утра — Филипповки. Пост забирает мясо, а вместе с ним и игры, до самых Колядок.',
        docLabel: 'А что записано на самом деле',
        facts: [
          'Обряд «Ката пячы» внесён в Государственный список историко-культурных ценностей Беларуси в 2017 году под номером 33АК000117.',
          'Агрогородок Скирмантово Дзержинского района.',
          'Обряд держится на семье Радьковых и коллективах «Сваякі» и «Весялуха» — каждый год с 1993-го.',
        ],
        invented:
          'Ганна, Сымон и Алесик — наша выдумка. В списке записан обряд, а не люди: имена, споры и все советы придуманы здесь.',
      },
      sourceLabel: 'Источник',
      source:
        'Государственный список историко-культурных ценностей Республики Беларусь, № 33АК000117, внесён в 2017 году: обряд «Ката пячы», агрогородок Скирмантово Дзержинского района. Обряд держится на семье Радьковых и коллективах «Сваякі» и «Весялуха», каждый год с 1993-го.',
      honestyLabel: 'Насколько она белорусская',
      honesty:
        'Редкий случай, когда слово «уникальная» подтверждается: ни у русских, ни у украинцев, ни у поляков ничего похожего не нашлось, как ни ищи. Правда, и обряд этот не общебелорусский, а одной деревни. Так он и показан здесь — как скирмантовский.',
      calendarLabel: 'Почему 27 ноября',
      calendar:
        'Это последний вечер перед Филипповками. Еда нарочно жирная и сытная: с утра начнётся пост, а в пост нельзя ни мяса, ни игр.',
      choicesLabel: 'Что мы придумали сами',
      choices:
        'Из записи известно немногое: кота пекут из булок, вешают под потолок, к нему поднимаются на вилах, остальные толкают, а решает хвост. Все цифры — наши: сколько теста в деже, что размер булки даёт при укусе, как сырое и горелое меняют качание, сколько попыток положено на хвост. Выпечка как отдельная половина игры тоже наша: в записи булки просто пекут, никто за них не соревнуется. И трое за столом выдуманы — Ганна, Сымон и Алесик. Они нарочно советуют вразнобой: у традиции есть варианты, и ни один из троих не прав больше других.',
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
  papersOnlyEnglish: 'Papers только по-английски. У каждой работы есть DOI и PDF, которые индексирует Google Scholar, — перевод разошёлся бы с ними.',
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
    papers: 'papers',
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
      'Беларускія народныя гульні проста ў браўзеры. Пра кожную сказана, хто і дзе яе запісаў — і што ў ёй па-сапраўднаму сваё.',
    lede: 'Тут можна згуляць у гульні, у якія гулялі ў беларускіх вёсках. Такіх, якіх больш нідзе няма, сярод іх амаль не знойдзецца — этнографы кажуць пра гэта проста. Але ў кожнай ёсць сваё: словы, песня, рэч у руках, дзень у годзе, калі ў яе гулялі. Дзеля гэтага ўсё і задумана.',
    framing:
      'Зладжаныя гэтыя гульні прыкладна так жа, як у рускіх, украінцаў і палякаў. Розняцца не правілы, а мова, напеў, начынне і нагода. Гэта куды цікавей, чым спрачацца пра ўнікальнасць, — і, у адрозненне ад спрэчак, гэта праўда.',
    rulesLabel: 'Тры правілы раздзела',
    rules: [
      'У кожнай гульні ёсць крыніца: хто запісаў, дзе і ў якім годзе.',
      'Нічога ад сябе. Словы «толькі ў Беларусі» з’яўляюцца толькі там, дзе так напісана ў запісе.',
      'Калі ў запісе чагосьці няма і лічбу давялося прыдумаць, старонка шчыра ў гэтым прызнаецца.',
    ],
    statuses: { live: 'можна гуляць', planned: 'у працы' },
    play: 'гуляць →',
    soon: 'хутка',
    items: [
      {
        slug: 'kata-piachy',
        name: '«Ката пячы»',
        gloss:
          'З булак лепяць ката і вешаюць пад столь. Цябе падымаюць на вілах, ты скачаш і адкусваеш, а навокал стараюцца сапхнуць. Хто дабраўся да хваста — той і перамог.',
        status: 'live',
        href: '/be/games/kata-piachy/',
      },
      {
        slug: 'lianok',
        name: '«Лянок»',
        gloss:
          'Песня пра лён ад поля да кашулі: бяруць, малоцяць, сцелюць, мнуць, ткуць, беляць, крояць, шыюць — восем куплетаў, восем рухаў. А з палатна ў канцы складаецца сапраўдны ўзор.',
        status: 'planned',
      },
      {
        slug: 'pannachka',
        name: '«Панначка»',
        gloss:
          'Дзяўчаты становяцца ў кола, у кожнай свечка. Сваю — берагчы, суседчыну — задзьмуць. Тых, хто прайграў, няма: апошні агеньчык абыходзіць кола і запальвае ўсіх нанова.',
        status: 'planned',
      },
      {
        slug: 'hrahi',
        name: '«Грахі»',
        gloss:
          'Мяч коцяць уздоўж ямак. Схібіў — грэх табе, пацэліў — грэх суперніку. І чым больш на табе грахоў, тым радзей табе даюць кідаць: вінаватаму караць не належыць.',
        status: 'planned',
      },
      {
        slug: 'zanicba-cyareski',
        name: '«Жаніцьба Цярэшкі»',
        gloss:
          'Каляднае вяселле панарошку — адзіная гульня, якую этнографы называюць чыста беларускай. Ты свацця: зводзіш пары адну за адной, а што рабіць далей, падказвае песня.',
        status: 'planned',
      },
    ],
    kata: {
      name: '«Ката пячы»',
      gloss: 'ігрышча',
      title: '«Ката пячы» — гульня, дзе ката спачатку пякуць, а потым кусаюць',
      description:
        'Кожнага 27 лістапада ў Скірмантаве з булак лепяць ката, вешаюць пад столь і кусаюць з вілаў — хто адкусіў хвост, той перамог. Тут ката яшчэ і спячы давядзецца самому.',
      kicker: '27 лістапада · аг. Скірмантава · Дзяржаўны спіс 33АК000117',
      lede: 'Вечарам перад постам у хаце з булак лепяць ката і падвешваюць на вяроўцы да столі. Гульцоў па чарзе падымаюць да яго на вілах: скокнуў, адкусіў — тваё. А астатнія тым часам штурхаюцца, каб ты схібіў. Хто адкусіў хвост, той і выйграў. Тут да гэтага дададзеная печ: ката спачатку трэба спячы. І якім ён выйдзе з печы, такога і давядзецца кусаць.',
      howLabel: 'Як гуляць',
      how: [
        'Зацісні — і з дзяжы цягнецца камяк цеста. Вялікая булка потым лягчэй кусаецца, малая — цяжэй, ды яшчэ і гарыць у печы хутчэй.',
        'Цеста ў дзяжы роўна на шэсць булак. Шостая — хвост, а без хваста няма перамогі. Не забудзь пакінуць на яго.',
        'Адпусці — камяк пойдзе ў печ. Націсні, калі булка стане залатой. Сырая выйдзе цяжкай і слізкай, падгарэлая — шырокай і хрумсткай, але лёгкай, як пух.',
        'Потым ката падвешваюць, і пачынаецца галоўнае. Цяжкі кот гайдаецца ляніва, лёгкі носіцца як ашалелы — і з кожным адкушаным кавалкам ён усё лягчэйшы.',
      ],
      start: 'Месіць',
      again: 'Яшчэ раз',
      jump: 'Утрымлівай — лепіш булку, націсні — вымаеш з печы, націсні — кусаеш',
      soundOn: 'гук уключаны',
      soundOff: 'гук выключаны',
      viewWide: 'на ўсю шырыню',
      viewNormal: 'звычайны памер',
      actBake: 'пячом',
      actBite: 'кусаем',
      dough: 'дзяжа',
      weight: 'вага ката',
      bakes: { raw: 'сыравата', golden: 'акурат', burnt: 'падгарэла' },
      yours: 'у цябе',
      rivals: 'у астатніх',
      tries: 'спробаў',
      shove: 'штурхаюць!',
      sceneAlt:
        'Кот з булак вісіць на вяроўцы пад бэлькай. Пад ім хлопец на вілах, побач печ і дзяжа з цестам, навокал уся хата.',
      bestLabel: 'найлепшы вынік',
      bestWon: 'узяў хвост',
      bestNone: 'хваста яшчэ не было',
      pieces: [
        { be: 'вуха', gloss: '' },
        { be: 'лапа', gloss: '' },
        { be: 'лапа', gloss: '' },
        { be: 'бок', gloss: '' },
        { be: 'галава', gloss: '' },
        { be: 'хвост', gloss: '' },
      ],
      prologue: {
        card: ['27 лістапада', 'аг. Скірмантава'],
        scene: 'Зіма, вечар, апошні перад постам. У адным акне святло — там ужо месяць цеста.',
        skip: 'прапусціць',
      },
      goal: {
        standing: 'адкусі хвост',
        bake: 'шэсць булак з адной дзяжы, шостая — хвост',
        bite: 'кожны адкушаны кавалак — лішняя спроба на хвост',
      },
      msg: {
        idle: 'Дзяжа поўная, печ напаленая. Шэсць булак — і будзе кот.',
        shape: 'Трымай, камяк расце. Гэта будзе {piece}.',
        bake: 'У печ. Націсні, калі зазалаціцца.',
        baked: '{piece}: {bake}.',
        tailNext: 'Апошняя — хвост, а ў ім уся гульня. Цеста засталося: {n}.',
        doughOut: 'Дзяжа пустая. Далей лепім з таго, што наскрэблі.',
        hung: 'Кот спечаны і вісіць. Пара кусаць.',
        ready: 'Кусай: {piece}.',
        hit: 'Ёсць! Кот палягчэў — і разагнаўся.',
        miss: 'Міма. Гэты кавалак пайшоў іншаму.',
        tail: 'Застаўся хвост. Вяроўка лётае як ніколі. Спробаў: {n}.',
        tailMiss: 'Міма. Засталося спробаў: {n}.',
        win: 'Хвост твой. Гульня твая.',
        lose: 'Хвост дастаўся іншаму. Нічога, да наступнага 27 лістапада нядоўга.',
      },
      advisors: {
        hanna: {
          name: 'Ганна',
          tag: 'шчодрая',
          greeting: [
            { be: 'Кладзі больш. Малы кот — малая радасць.', gloss: '' },
            { be: 'Не шкадуй цеста — будзе што кусаць.', gloss: '' },
          ],
          bigBun: [
            { be: 'Вось гэта булка. Пад такую і рот шырэй.', gloss: '' },
            { be: 'Правільна. Чым большая, тым лягчэй у яе трапіць.', gloss: '' },
            { be: 'І пячэцца спакайней: вялікая не так хутка гарыць.', gloss: '' },
          ],
          smallBun: [
            { be: 'Гэта не булка, гэта гузік.', gloss: '' },
            { be: 'Малая і гарыць хутка, і кусаецца вузка. Навошта табе такая?', gloss: '' },
            { be: 'Шкадуеш цеста? Яно ж не срэбра.', gloss: '' },
          ],
          raw: [
            { be: 'Сыраватая. Затое цяжкая — кот павісне спакойна.', gloss: '' },
            { be: 'Недапечаная. Кусаць будзе вузка, але вага ў ёй ёсць.', gloss: '' },
          ],
          golden: [
            { be: 'Залатая. Такую і людзям паказаць не сорамна.', gloss: '' },
            { be: 'Во, акурат. Кладзі на стол.', gloss: '' },
          ],
          burnt: [
            { be: 'Спаліў. Ну хоць шырокая — хрумсткае лёгка кусаецца.', gloss: '' },
            { be: 'Чорная і лёгкая, як папера. Кот з такіх будзе скакаць.', gloss: '' },
          ],
          doughLow: [
            { be: 'Ужо дно відаць. Затое пяць булак — як булкі.', gloss: '' },
            { be: 'Цеста мала. Ну, хай хвост будзе малы — хвост ёсць хвост.', gloss: '' },
          ],
          tailNext: [
            { be: 'Апошні — хвост. Што ў дзяжы засталося, тое яму і будзе.', gloss: '' },
            { be: 'Хвост. Аддай яму ўсё, што ёсць, — больш узяць няма адкуль.', gloss: '' },
          ],
          swing: [
            { be: 'Ротам наперад! Не бокам!', gloss: '' },
            { be: 'Хапай вялікі кавалак, не дзяўбі па крошцы.', gloss: '' },
            { be: 'Ну чаго чакаеш? Сам ён да рота не прыйдзе.', gloss: '' },
          ],
          shove: [
            { be: 'Штурхаюць! Трымайся за вілы.', gloss: '' },
            { be: 'Шырокі кавалак штуршка не баіцца.', gloss: '' },
          ],
          playerHit: [
            { be: 'Во! Я ж казала: шырокая булка — шырокі ўкус.', gloss: '' },
            { be: 'Твой кавалак. І яшчэ адна спроба на хвост.', gloss: '' },
          ],
          playerMiss: [
            { be: 'Малаваты быў. Кажу ж — не шкадуй цеста.', gloss: '' },
            { be: 'Міма. Нічога, кот цяпер лягчэйшы.', gloss: '' },
          ],
          win: [
            { be: 'Во як трэба. Хвост твой, і гаворка скончана.', gloss: '' },
            { be: 'Малайчына. Сядай, будзем есці.', gloss: '' },
          ],
          lose: [
            { be: 'Шкада. Блізка ж было.', gloss: '' },
            { be: 'Ну, чужы хвост — таксама хвост. На той год адкусіш.', gloss: '' },
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
            { be: 'Куды столькі? Гэта ж ты ў хваста адарваў.', gloss: '' },
            { be: 'Вялікая, вядома. А з чаго потым хвост ляпіць?', gloss: '' },
          ],
          smallBun: [
            { be: 'Во. Малую і рабі — на хвост застанецца.', gloss: '' },
            { be: 'Разумна. Толькі малая гарыць хутка, ад печы не адыходзь.', gloss: '' },
          ],
          raw: [
            { be: 'Ранавата выняў. Цяжкая, ды ўкус ад яе вузкі.', gloss: '' },
            { be: 'Сырая. Кот павісне цяжкі і спакойны, а кусаць нязручна.', gloss: '' },
          ],
          golden: [
            { be: 'Во так. Залатая: і вага ёсць, і ўкус шырокі.', gloss: '' },
            { be: 'У самы час выняў. Больш нічога і не трэба.', gloss: '' },
          ],
          burnt: [
            { be: 'Перадзяржаў. Лёгкая, як вугаль, — цяпер кот пойдзе ў разнос.', gloss: '' },
            { be: 'Спаліў. Кусаць шырэй, ды гайдацца будзе шалёна.', gloss: '' },
          ],
          doughLow: [
            { be: 'Вось табе і дно дзяжы. А хвост яшчэ наперадзе.', gloss: '' },
            { be: 'Мала засталося. Далей толькі скрабці.', gloss: '' },
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
            { be: 'Чакай, не скачы пад штуршок. Перачакай.', gloss: '' },
            { be: 'Замахнуліся. Пастой, хай пройдзе.', gloss: '' },
          ],
          playerHit: [
            { be: 'Добра. Яшчэ адна спроба на хвост.', gloss: '' },
            { be: 'Узяў. Толькі памятай: кот цяпер лягчэйшы і хутчэйшы.', gloss: '' },
          ],
          playerMiss: [
            { be: 'Раней трэба было. Ён ужо адыходзіў.', gloss: '' },
            { be: 'Міма. Кавалак пайшоў іншаму, а кот усё роўна палягчэў.', gloss: '' },
          ],
          win: [
            { be: 'Ну вось. А ты лічыць не хацеў.', gloss: '' },
            { be: 'Хвост твой. Значыць, у дзяжы засталося акурат колькі трэба.', gloss: '' },
          ],
          lose: [
            { be: 'Не хапіла. Кажу ж: апошні кавалак вырашае.', gloss: '' },
            { be: 'Шкада. Ну, хоць паглядзелі, як яно бывае.', gloss: '' },
          ],
        },
        alesik: {
          name: 'Алесік',
          tag: 'малодшы',
          greeting: [
            { be: 'Я ў печ гляджу! Скажу, калі счарнее.', gloss: '' },
            { be: 'А давайце спалім хоць адну! Ну хоць адну!', gloss: '' },
          ],
          bigBun: [
            { be: 'Вялікая! Такая доўга пячэцца — я пачакаю.', gloss: '' },
            { be: 'Ого. Пакуль яна зарумяніцца, я тры разы збегаю.', gloss: '' },
          ],
          smallBun: [
            { be: 'Малая счарнее ў момант. Не адыходзь!', gloss: '' },
            { be: 'Гэтая згарыць хутчэй за ўсіх. Здорава!', gloss: '' },
          ],
          raw: [
            { be: 'Рана! Яна ж яшчэ цеста. Цяжкая будзе — кот павісне, як мех.', gloss: '' },
            { be: 'Сырая. Нудна. Вяроўка з ёй ледзь варушыцца.', gloss: '' },
          ],
          golden: [
            { be: 'Залатая… ну добра. Хоць адну ж дайце спаліць.', gloss: '' },
            { be: 'Во, акурат. Толькі ж нецікава.', gloss: '' },
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
            { be: 'Апошні. Толькі рана не выцягвайце: сыры хвост вузкі.', gloss: '' },
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
            { be: 'Мі-іма! Гэта я штурхнуў.', gloss: '' },
            { be: 'Не туды! Ён жа ў той бок ляцеў.', gloss: '' },
          ],
          win: [
            { be: 'Хвост! Хвост адкусіў! Я ж казаў!', gloss: '' },
            { be: 'А заўтра можна яшчэ? …Не, заўтра нельга.', gloss: '' },
          ],
          lose: [
            { be: 'Э-эх. А я хацеў, каб усё згарэла.', gloss: '' },
            { be: 'Не адкусіў. Ну, хоць кот добра лётаў.', gloss: '' },
          ],
        },
      },
      epilogue: {
        win: 'Хвост твой. Ката з’елі да крошкі, і ў хаце стала ціха.',
        lose: 'Хвост дастаўся іншаму. Ката ўсё роўна з’елі — да апошняй крошкі.',
        calendar:
          'А з раніцы — Піліпаўка. Пост забірае мяса, а разам з ім і гульні, да самых Каляд.',
        docLabel: 'А што запісана насамрэч',
        facts: [
          'Ігрышча «Ката пячы» ўнесена ў Дзяржаўны спіс гісторыка-культурных каштоўнасцей Беларусі ў 2017 годзе пад нумарам 33АК000117.',
          'Аграгарадок Скірмантава Дзяржынскага раёна.',
          'Абрад трымаецца на сям’і Радзькаў і калектывах «Сваякі» і «Весялуха» — штогод з 1993-га.',
        ],
        invented:
          'Ганна, Сымон і Алесік — наша выдумка. У спісе запісаны абрад, а не людзі: імёны, спрэчкі і ўсе парады прыдуманы тут.',
      },
      sourceLabel: 'Крыніца',
      source:
        'Дзяржаўны спіс гісторыка-культурных каштоўнасцей Рэспублікі Беларусь, № 33АК000117, унесена ў 2017 годзе: ігрышча «Ката пячы», аграгарадок Скірмантава Дзяржынскага раёна. Абрад трымаецца на сям’і Радзькаў і калектывах «Сваякі» і «Весялуха», штогод з 1993-га.',
      honestyLabel: 'Наколькі яна беларуская',
      honesty:
        'Рэдкі выпадак, калі слова «ўнікальная» пацвярджаецца: ні ў рускіх, ні ва ўкраінцаў, ні ў палякаў нічога падобнага не знайшлося, як ні шукай. Праўда, і абрад гэты не агульнабеларускі, а адной вёскі. Так ён тут і паказаны — як скірмантаўскі.',
      calendarLabel: 'Чаму 27 лістапада',
      calendar:
        'Гэта апошні вечар перад Піліпаўкай. Ежа знарок тлустая і сытная: з раніцы пачнецца пост, а ў пост нельга ні мяса, ні гульняў.',
      choicesLabel: 'Што мы прыдумалі самі',
      choices:
        'З запісу вядома няшмат: ката пякуць з булак, вешаюць пад столь, да яго падымаюцца на вілах, астатнія штурхаюць, а вырашае хвост. Усе лічбы — нашы: колькі цеста ў дзяжы, што памер булкі дае пры ўкусе, як сырое і гарэлае мяняюць гайданне, колькі спробаў належыць на хвост. Выпечка як асобная палова гульні таксама наша: у запісе булкі проста пякуць, ніхто за іх не спаборнічае. І трое за сталом выдуманыя — Ганна, Сымон і Алесік. Яны знарок раяць уразнабой: у традыцыі ёсць варыянты, і ніводзін з траіх не мае рацыі больш за іншых.',
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
  papersOnlyEnglish: 'Papers толькі па-англійску. У кожнай працы ёсць DOI і PDF, якія індэксуе Google Scholar, — пераклад разышоўся б з імі.',
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
