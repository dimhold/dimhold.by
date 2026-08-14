export type Lang = 'en' | 'ru' | 'be';

export interface WorkItem {
  title: string;
  tag: string;
  meta: string;
  href: string;
  linkLabel: string;
  body: string[];
}

export interface RecordEntry {
  years: string;
  title: string;
  note: string;
}

export type ShelfStatus = 'alive' | 'wip' | 'shipped' | 'dead' | 'exp';

export interface ShelfItem {
  name: string;
  years: string;
  note: string;
  status: ShelfStatus;
  href?: string;
}

export interface Dictionary {
  lang: Lang;
  path: string;
  metaTitle: string;
  metaDescription: string;
  langLabel: string;
  skipLink: string;
  lampLabel: string;
  nav: {
    blog: string;
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
    artifactLabel: string;
    seedLine: string;
    seedTomorrow: string;
  };
  weather: {
    line: string;
    conditions: {
      clear: string;
      clouds: string;
      fog: string;
      rain: string;
      snow: string;
      thunder: string;
    };
  };
  artifacts: string[];
  work: {
    label: string;
    items: WorkItem[];
  };
  shelf: {
    label: string;
    statuses: Record<ShelfStatus, string>;
    items: ShelfItem[];
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
  notFound: {
    title: string;
    text: string;
    home: string;
  };
}

export const en: Dictionary = {
  lang: 'en',
  path: '/',
  metaTitle: 'Dmitriy Semenkevich — full-stack engineer & founder',
  metaDescription:
    'Fifteen years of production software: payments infrastructure, a trade-in platform in 16,000 stores. Co-founder of Adlega, an AI CFO for SaaS founders. Minsk.',
  langLabel: 'Language',
  skipLink: 'Skip to content',
  lampLabel: 'Toggle the lamp',
  nav: {
    blog: 'writing',
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
    role: 'Full-stack engineer · Co-founder of Adlega · Minsk',
    chips: ['engineer · 15 years', 'co-founder @ Adlega', 'Minsk'],
    lead: 'Fifteen years building software where a wrong number costs real money: payments, a device trade-in platform in 16,000 stores — and now Adlega, an AI CFO with one rule: the AI never does the math.',
    lead2:
      'Between releases I poke at the digital world — experiments, new tools, pop-science rabbit holes. This site is my workshop.',
    ctaEmail: 'Write me',
    ctaAdlega: 'See Adlega',
    photoAlt: 'Portrait of Dmitriy Semenkevich',
    hint: 'drag me. poke me.',
    artifactLabel: 'today’s artifact',
    seedLine: 'this site is deterministic',
    seedTomorrow: 'peek at tomorrow →',
  },
  weather: {
    line: 'in Minsk right now',
    conditions: {
      clear: 'clear',
      clouds: 'cloudy',
      fog: 'fog',
      rain: 'rain',
      snow: 'snow',
      thunder: 'a thunderstorm',
    },
  },
  artifacts: [
    'a mug of coffee',
    'a stack of books',
    'a houseplant',
    'a chess pawn',
    'a donut',
    'a dumbbell',
    'a vinyl record',
    'a laptop',
    'a gem',
    'a balloon',
  ],
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
    statuses: {
      alive: 'alive',
      wip: 'in progress',
      shipped: 'shipped',
      dead: 'dead',
      exp: 'experiment',
    },
    items: [
      {
        name: 'Belun',
        years: '2025 —',
        note: '90+ browser utilities; no servers, no accounts, files never leave your machine.',
        status: 'alive',
        href: 'https://belun.app',
      },
      {
        name: 'Minsk Weather Engine',
        years: '2026',
        note: 'The weather layer of this site: when it rains in Minsk, it rains here.',
        status: 'alive',
        href: '/blog/',
      },
      {
        name: 'UpMyGame Player',
        years: '2013',
        note: 'HTML5 video player for a gaming platform, freelance.',
        status: 'shipped',
      },
      {
        name: 'Map renderer',
        years: '2013',
        note: 'Custom map rendering pipeline on Mapnik.',
        status: 'shipped',
      },
      {
        name: 'Beeper',
        years: '2013',
        note: 'A Java streaming playground.',
        status: 'dead',
      },
      {
        name: 'Mobile startup',
        years: '2013 – 2014',
        note: 'Co-founded; the product didn’t take off, the lessons stayed.',
        status: 'dead',
      },
    ],
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
        title: 'BSUIR, Minsk',
        note: 'Engineer’s degree in software engineering.',
      },
    ],
    stack:
      'Java · Spring · TypeScript · Angular · React · Node.js · PostgreSQL · Kafka · AWS · LLM agents',
  },
  contact: {
    label: 'Say hello',
    lede: 'Consulting, product feedback, interesting problems — the inbox is open.',
    email: 'dimhold@gmail.com',
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
  metaTitle: 'Dmitriy Semenkevich — фулстек-инженер и сооснователь Adlega',
  metaDescription:
    'Пятнадцать лет продакшен-разработки: платёжная инфраструктура, trade-in-платформа в 16 000 магазинов. Сооснователь Adlega — ИИ-финдиректора для SaaS-фаундеров. Минск.',
  langLabel: 'Язык',
  skipLink: 'К содержанию',
  lampLabel: 'Переключить лампу',
  nav: {
    blog: 'блог',
  },
  blog: {
    label: 'Статьи',
    all: 'все статьи →',
    title: 'Статьи — Dmitriy Semenkevich',
    description:
      'Статьи и билд-логи Дмитрия Семенкевича: ИИ-продукты, которые не угадывают, финансовые движки, веб-эксперименты.',
    min: 'мин чтения',
  },
  hero: {
    greeting: 'привет, я',
    role: 'Фулстек-инженер · Сооснователь Adlega · Минск',
    chips: ['инженер · 15 лет', 'сооснователь Adlega', 'Минск'],
    lead: 'Пятнадцать лет строю софт, в котором неверная цифра стоит настоящих денег: платежи, trade-in-платформа в 16 000 магазинов — а теперь Adlega, ИИ-финдиректор с одним правилом: ИИ никогда не считает сам.',
    lead2:
      'Между релизами копаюсь в цифровом мире: эксперименты, новые инструменты, науч-поп. Этот сайт — моя мастерская.',
    ctaEmail: 'Написать мне',
    ctaAdlega: 'Смотреть Adlega',
    photoAlt: 'Портрет Дмитрия Семенкевича',
    hint: 'покрутите меня. ткните в меня.',
    artifactLabel: 'артефакт дня',
    seedLine: 'этот сайт детерминирован',
    seedTomorrow: 'заглянуть в завтра →',
  },
  weather: {
    line: 'в Минске сейчас',
    conditions: {
      clear: 'ясно',
      clouds: 'облачно',
      fog: 'туман',
      rain: 'дождь',
      snow: 'снег',
      thunder: 'гроза',
    },
  },
  artifacts: [
    'кружка кофе',
    'стопка книг',
    'растение',
    'шахматная пешка',
    'пончик',
    'гантель',
    'виниловая пластинка',
    'ноутбук',
    'кристалл',
    'воздушный шарик',
  ],
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
    statuses: {
      alive: 'живой',
      wip: 'в работе',
      shipped: 'сдан',
      dead: 'умер',
      exp: 'эксперимент',
    },
    items: [
      {
        name: 'Belun',
        years: '2025 —',
        note: '90+ браузерных утилит; без серверов и аккаунтов, файлы не покидают компьютер.',
        status: 'alive',
        href: 'https://belun.app',
      },
      {
        name: 'Minsk Weather Engine',
        years: '2026',
        note: 'Погодный слой этого сайта: в Минске дождь — и здесь дождь.',
        status: 'alive',
        href: '/ru/blog/',
      },
      {
        name: 'UpMyGame Player',
        years: '2013',
        note: 'HTML5-видеоплеер для игровой платформы, фриланс.',
        status: 'shipped',
      },
      {
        name: 'Рендер карт',
        years: '2013',
        note: 'Собственный конвейер рендеринга карт на Mapnik.',
        status: 'shipped',
      },
      {
        name: 'Beeper',
        years: '2013',
        note: 'Полигон стриминга на Java.',
        status: 'dead',
      },
      {
        name: 'Мобильный стартап',
        years: '2013 – 2014',
        note: 'Сооснователь; продукт не взлетел, уроки остались.',
        status: 'dead',
      },
    ],
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
        title: 'БГУИР, Минск',
        note: 'Диплом инженера-программиста.',
      },
    ],
    stack:
      'Java · Spring · TypeScript · Angular · React · Node.js · PostgreSQL · Kafka · AWS · LLM-агенты',
  },
  contact: {
    label: 'Скажите привет',
    lede: 'Консалтинг, фидбек по продукту, интересные задачи — почта открыта.',
    email: 'dimhold@gmail.com',
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
  metaTitle: 'Dmitriy Semenkevich — фулстэк-інжынер і сузаснавальнік Adlega',
  metaDescription:
    'Пятнаццаць гадоў прадакшен-распрацоўкі: плацёжная інфраструктура, trade-in-платформа ў 16 000 крамах. Сузаснавальнік Adlega — ШІ-фіндырэктара для SaaS-заснавальнікаў. Мінск.',
  langLabel: 'Мова',
  skipLink: 'Да зместу',
  lampLabel: 'Пераключыць лямпу',
  nav: {
    blog: 'блог',
  },
  blog: {
    label: 'Артыкулы',
    all: 'усе артыкулы →',
    title: 'Артыкулы — Dmitriy Semenkevich',
    description:
      'Артыкулы і білд-логі Дзмітрыя Семянкевіча: ШІ-прадукты, якія не гадаюць, фінансавыя рухавікі, веб-эксперыменты.',
    min: 'хв чытання',
  },
  hero: {
    greeting: 'прывітанне, я',
    role: 'Фулстэк-інжынер · Сузаснавальнік Adlega · Мінск',
    chips: ['інжынер · 15 гадоў', 'сузаснавальнік Adlega', 'Мінск'],
    lead: 'Пятнаццаць гадоў будую софт, у якім няправільная лічба каштуе сапраўдных грошай: плацяжы, trade-in-платформа ў 16 000 крамах — а цяпер Adlega, ШІ-фіндырэктар з адным правілам: ШІ ніколі не лічыць сам.',
    lead2:
      'Паміж рэлізамі корпаюся ў лічбавым свеце: эксперыменты, новыя інструменты, навук-поп. Гэты сайт — мая майстэрня.',
    ctaEmail: 'Напісаць мне',
    ctaAdlega: 'Глядзець Adlega',
    photoAlt: 'Партрэт Дзмітрыя Семянкевіча',
    hint: 'пакруціце мяне. тыцніце ў мяне.',
    artifactLabel: 'артэфакт дня',
    seedLine: 'гэты сайт дэтэрмінаваны',
    seedTomorrow: 'зазірнуць у заўтра →',
  },
  weather: {
    line: 'у Мінску цяпер',
    conditions: {
      clear: 'ясна',
      clouds: 'воблачна',
      fog: 'туман',
      rain: 'дождж',
      snow: 'снег',
      thunder: 'навальніца',
    },
  },
  artifacts: [
    'кубак кавы',
    'стос кніг',
    'расліна',
    'шахматная пешка',
    'пончык',
    'гантэля',
    'вінілавая пласцінка',
    'ноўтбук',
    'крышталь',
    'паветраны шарык',
  ],
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
    statuses: {
      alive: 'жывы',
      wip: 'у працы',
      shipped: 'здадзены',
      dead: 'памёр',
      exp: 'эксперымент',
    },
    items: [
      {
        name: 'Belun',
        years: '2025 —',
        note: '90+ браўзерных утыліт; без сервераў і акаўнтаў, файлы не пакідаюць камп’ютар.',
        status: 'alive',
        href: 'https://belun.app',
      },
      {
        name: 'Minsk Weather Engine',
        years: '2026',
        note: 'Надвор’евы слой гэтага сайта: у Мінску дождж — і тут дождж.',
        status: 'alive',
        href: '/be/blog/',
      },
      {
        name: 'UpMyGame Player',
        years: '2013',
        note: 'HTML5-відэаплэер для гульнявой платформы, фрыланс.',
        status: 'shipped',
      },
      {
        name: 'Рэндар картаў',
        years: '2013',
        note: 'Уласны канвеер рэндэрынгу картаў на Mapnik.',
        status: 'shipped',
      },
      {
        name: 'Beeper',
        years: '2013',
        note: 'Палігон стрымінгу на Java.',
        status: 'dead',
      },
      {
        name: 'Мабільны стартап',
        years: '2013 – 2014',
        note: 'Сузаснавальнік; прадукт не ўзляцеў, урокі засталіся.',
        status: 'dead',
      },
    ],
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
        title: 'БДУІР, Мінск',
        note: 'Дыплом інжынера-праграміста.',
      },
    ],
    stack:
      'Java · Spring · TypeScript · Angular · React · Node.js · PostgreSQL · Kafka · AWS · LLM-агенты',
  },
  contact: {
    label: 'Скажыце прывітанне',
    lede: 'Кансалтынг, фідбэк па прадукце, цікавыя задачы — пошта адкрытая.',
    email: 'dimhold@gmail.com',
  },
  notFound: {
    title: 'Старонка не знойдзена',
    text: 'Па гэтым адрасе нічога няма.',
    home: 'На галоўную',
  },
};

export const dictionaries: Record<Lang, Dictionary> = { en, ru, be };

export const socials = [
  { label: 'GitHub', href: 'https://github.com/dimhold' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dimhold' },
  { label: 'X', href: 'https://x.com/dimhold' },
] as const;
