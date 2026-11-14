import type { Lang } from './index';
import type { Finding } from '../components/home/Findings.astro';
import type { Stop } from '../components/home/Path.astro';

/* The two blocks under the hero: what the measurements found, and the road that
   led to measuring. The numbers are the same in every language; only the words
   around them change, so each finding is a shared skeleton plus a line of text. */

interface HomeCopy {
  findingsTitle: string;
  findingsLede: string;
  /** One line per finding, in the order of SKELETON below. */
  findings: [string, string, string, string, string, string];
  pathTitle: string;
  pathLede: string;
  pathNow: string;
  /** Name (only where it is translated) and note per stop, in the order of STOPS. */
  stops: { name?: string; note: string }[];
  counters: { papers: string; datasets: string; posts: string; illusions: string };
}

const SKELETON: Omit<Finding, 'text'>[] = [
  { from: 40, to: 0, tpl: '{n} / 40', share: 0, source: 'tool-failure', href: '/papers/tool-failure/' },
  { from: 0, to: 20, tpl: '{n} / 20', share: 1, source: 'silent-books', href: '/papers/silent-books/' },
  { from: 0, to: 330, tpl: '{n} / 330', share: 1, source: 'boundary-split', href: 'https://github.com/dimhold/boundary-split' },
  { from: 0, to: 84.9, decimals: 1, tpl: '{n}%', share: 0.849, source: 'npm-registry-census', href: '/papers/npm-registry-census/' },
  { from: 14, to: 17, tpl: '14–{n}%', share: 0.17, source: 'install-graph', href: '/papers/install-graph/' },
  { from: 1, to: 2.8, decimals: 1, tpl: '{n}×', source: 'key-order', href: '/papers/key-order/' },
];

const STOPS: Omit<Stop, 'note'>[] = [
  { year: '2010', name: 'EPAM', era: 'start' },
  { name: 'UpMyGame', era: 'start' },
  { name: 'Rando4.me', era: 'start' },
  { year: '2014', name: 'Ciklum', era: 'product' },
  { name: 'HYLA Mobile', era: 'product' },
  { name: 'Assurant', era: 'product' },
  { year: '2022', name: 'Modulr', era: 'product' },
  { name: 'Architecture consulting', era: 'product' },
  { name: 'Belun', era: 'own' },
  { name: 'whotop', era: 'own' },
  { year: '2024', name: 'DScover', era: 'now' },
  { name: 'Adlega', era: 'now' },
];

/** How many datasets sit on Hugging Face. Not derivable from the repository. */
export const DATASETS = 15;

const COPY: Record<Lang, HomeCopy> = {
  en: {
    findingsTitle: 'What the measurements found',
    findingsLede: 'Every number can be checked: the data and the scripts are in a public repository.',
    findings: [
      'answers flagged a tool that returned a wrong value quietly. When it failed loudly: 39 of 40.',
      'times 2 models repeated a misstated subtotal in a P&L as fact. One added clause: 10 of 10.',
      'right when code does the math for the model. Until a unit needs converting: then 71.5%.',
      'of 4,296,340 npm packages list exactly one maintainer. The whole registry, counted.',
      'of node_modules is a second copy of a package already installed. Measured on disk.',
      'slower inserts with random UUIDs on Postgres at 20M rows. No difference on a point read.',
    ],
    pathTitle: 'More than 15 years where a wrong number costs money',
    pathLede: 'and then I started counting',
    pathNow: '2026 · research, open source',
    stops: [
      { note: 'full stack: Java and JavaScript' },
      { note: 'startup consulting' },
      { note: 'open source, 10 years' },
      { note: 'outstaffing, many projects' },
      { note: '16,000+ stores' },
      { note: 'trade-in behind US carriers' },
      { note: 'UK banking payments' },
      { note: 'platforms that outgrew their architecture' },
      { note: '100+ tools in the browser' },
      { note: 'open source CLI' },
      { note: 'AI architect' },
      { note: 'an AI CFO' },
    ],
    counters: {
      papers: 'studies with a DOI',
      datasets: 'open datasets',
      posts: 'essays in three languages',
      illusions: 'illusions in the catalogue',
    },
  },
  ru: {
    findingsTitle: 'Что показали замеры',
    findingsLede: 'Каждое число можно проверить: данные и скрипты лежат в открытом репозитории.',
    findings: [
      'ответов заметили, что инструмент тихо вернул неверное значение. Когда он падал громко: 39 из 40.',
      'раз две модели повторили неверный подытог в отчёте о прибылях как факт. Одна фраза в промпте: 10 из 10.',
      'верных ответов, когда арифметику делает код, а не модель. Пока единицы не нужно переводить: дальше 71,5%.',
      'из 4 296 340 пакетов npm ведёт один человек. Посчитан весь реестр целиком.',
      'node_modules занимают вторые копии пакетов, которые уже установлены. Измерено на диске.',
      'медленнее вставка со случайными UUID в Postgres на 20 млн строк. На чтение по ключу разницы нет.',
    ],
    pathTitle: 'Больше 15 лет там, где неверная цифра стоит денег',
    pathLede: 'а потом я начал считать',
    pathNow: '2026 · исследования, open source',
    stops: [
      { note: 'фулстек: Java и JavaScript' },
      { note: 'консалтинг для стартапа' },
      { note: 'open source, 10 лет' },
      { note: 'аутстаф, много проектов' },
      { note: '16 000+ магазинов' },
      { note: 'trade-in для операторов США' },
      { note: 'банковские платежи, UK' },
      { name: 'Архитектурный консалтинг', note: 'платформы, переросшие свою архитектуру' },
      { note: '100+ инструментов в браузере' },
      { note: 'open source CLI' },
      { note: 'ИИ-архитектор' },
      { note: 'ИИ-финдиректор' },
    ],
    counters: {
      papers: 'исследований с DOI',
      datasets: 'открытых датасетов',
      posts: 'статей на трёх языках',
      illusions: 'иллюзий в каталоге',
    },
  },
  be: {
    findingsTitle: 'Што паказалі замеры',
    findingsLede: 'Кожную лічбу можна праверыць: даныя і скрыпты ляжаць у адкрытым рэпазіторыі.',
    findings: [
      'адказаў заўважылі, што інструмент ціха вярнуў няправільнае значэнне. Калі ён падаў гучна: 39 з 40.',
      'разоў дзве мадэлі паўтарылі няправільны падрахунак у справаздачы аб прыбытках як факт. Адна фраза ў промпце: 10 з 10.',
      'правільных адказаў, калі арыфметыку робіць код, а не мадэль. Пакуль адзінкі не трэба пераводзіць: далей 71,5%.',
      'з 4 296 340 пакетаў npm вядзе адзін чалавек. Палічаны ўвесь рэестр цалкам.',
      'node_modules займаюць другія копіі пакетаў, якія ўжо ўсталяваныя. Вымерана на дыску.',
      'павольней устаўка з выпадковымі UUID у Postgres на 20 млн радкоў. На чытанне па ключы розніцы няма.',
    ],
    pathTitle: 'Больш за 15 гадоў там, дзе няправільная лічба каштуе грошай',
    pathLede: 'а потым я пачаў лічыць',
    pathNow: '2026 · даследаванні, open source',
    stops: [
      { note: 'фулстэк: Java і JavaScript' },
      { note: 'кансалтынг для стартапа' },
      { note: 'open source, 10 гадоў' },
      { note: 'аўтстаф, шмат праектаў' },
      { note: '16 000+ крам' },
      { note: 'trade-in для аператараў ЗША' },
      { note: 'банкаўскія плацяжы, UK' },
      { name: 'Архітэктурны кансалтынг', note: 'платформы, што перараслі сваю архітэктуру' },
      { note: '100+ інструментаў у браўзеры' },
      { note: 'open source CLI' },
      { note: 'ШІ-архітэктар' },
      { note: 'ШІ-фіндырэктар' },
    ],
    counters: {
      papers: 'даследаванняў з DOI',
      datasets: 'адкрытых датасэтаў',
      posts: 'артыкулаў на трох мовах',
      illusions: 'ілюзій у каталогу',
    },
  },
};

export function homeCopy(lang: Lang) {
  const c = COPY[lang];
  return {
    ...c,
    findings: SKELETON.map((f, i) => ({ ...f, text: c.findings[i] })) as Finding[],
    stops: STOPS.map((s, i) => ({ ...s, ...c.stops[i], name: c.stops[i].name ?? s.name })) as Stop[],
  };
}
