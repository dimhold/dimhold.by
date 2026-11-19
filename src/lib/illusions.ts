/* The illusions section's data layer.
 *
 * catalog.json is generated from the research dossier by scripts/gen-illusions.mjs and
 * committed; the dossier itself is gitignored. Everything a page renders comes from
 * here, so that a page never reaches into the dossier and never has to know it exists.
 */
import catalog from './illusions/catalog.json';
import { RU, type Copy } from './illusions/ru';
import { EN } from './illusions/en';
import { BE } from './illusions/be';
import { NAMES_BE } from './illusions/names';
import { MODALITY, CATEGORY, CONFIDENCE, type IllLang } from './illusions/labels';

export type { IllLang };
export const ILL_LANGS: IllLang[] = ['ru', 'en', 'be'];
const COPY: Record<IllLang, Record<string, Copy>> = { ru: RU, en: EN, be: BE };

export type Modality =
  | 'visual' | 'auditory' | 'tactile' | 'multisensory' | 'interoceptive'
  | 'vestibular' | 'temporal' | 'cognitive' | 'chemical' | 'physical';

export interface Source {
  authors: string[];
  year: number | null;
  title: string;
  container: string;
  locator: string;
  publisher: string;
  url: string;
  doi: string;
  lang: string;
  type: string;
  primary: boolean;
  /** The citation is verified as a record but the document has not been read. */
  unread: boolean;
}

export interface Entry {
  id: string;
  ru: string;
  en: string;
  aka: string[];
  modality: Modality;
  category: string;
  tier: string;
  tags: string[];
  first: {
    year: number;
    by: string;
    where: string;
    confidence: 'high' | 'medium' | 'low' | 'disputed';
    source: string | null;
  } | null;
  /* Рабочие заметки из досье. На страницы не выводятся: русский текст пишется руками,
     а это — то, по чему его пишут, вместе с атрибуцией механизма. */
  effectEn: string;
  mechanismEn: { name: string; by: string; source: string }[];
  notesEn: string;
  impl: { dim: string; interactive: boolean; difficulty: number | null; notes: string };
  difficulty: number | null;
  sources: string[];
}

export const entries = catalog.entries as Entry[];
export const sources = catalog.sources as Record<string, Source>;
export const dossier = catalog.dossier;
export const generated = catalog.generated;

/* Reader-facing names live in illusions/labels.ts, one block per language. The _RU
   names stay exported for anything that still imports them. */
export const MODALITY_RU = MODALITY.ru;
export const CATEGORY_RU = CATEGORY.ru;
export const CONFIDENCE_RU = CONFIDENCE.ru;

export const catLabel = (slug: string, lang: IllLang = 'ru') => CATEGORY[lang][slug] ?? slug;
export const modLabel = (m: Modality, lang: IllLang = 'ru') => MODALITY[lang][m] ?? m;
export const confLabel = (c: string, lang: IllLang = 'ru') => CONFIDENCE[lang][c] ?? c;

/** The entry's name in the reader's language. */
export const nameFor = (e: Entry, lang: IllLang = 'ru') =>
  lang === 'en' ? e.en : lang === 'be' ? (NAMES_BE[e.id] ?? e.ru) : e.ru;

/** The name shown under the title: the English one, or the Russian one on an English page. */
export const altNameFor = (e: Entry, lang: IllLang = 'ru') => (lang === 'en' ? '' : e.en);

/** Copy for an entry in a language, when someone has written it. */
export const copyFor = (id: string, lang: IllLang = 'ru'): Copy | undefined => COPY[lang][id];

const LOCALE: Record<IllLang, string> = { ru: 'ru', en: 'en', be: 'be' };

/** Entries that have prose in the language, and those of them with a demo. */
export const written = entries.filter((e) => RU[e.id]);
export const withDemo = entries.filter((e) => RU[e.id]?.demo);

export const bySlug = new Map(entries.map((e) => [e.id, e]));

/** Grouped for the index, biggest group first, with written entries at the top of each. */
export function groups(lang: IllLang = 'ru') {
  const copy = COPY[lang];
  const byMod = new Map<Modality, Entry[]>();
  for (const e of entries) {
    if (!byMod.has(e.modality)) byMod.set(e.modality, []);
    byMod.get(e.modality)!.push(e);
  }
  for (const list of byMod.values()) {
    list.sort((a, b) => {
      const aw = copy[a.id] ? 0 : 1, bw = copy[b.id] ? 0 : 1;
      return aw - bw || nameFor(a, lang).localeCompare(nameFor(b, lang), LOCALE[lang]);
    });
  }
  return [...byMod.entries()].sort((a, b) => b[1].length - a[1].length);
}

/** A source rendered as one citation line. */
export function cite(s: Source): string {
  const who = s.authors.length ? s.authors.join(', ') : s.publisher;
  const bits = [who, s.year ? `(${s.year})` : '', s.title].filter(Boolean).join(' ');
  const rest = [s.container, s.locator, s.publisher && !who.includes(s.publisher) ? s.publisher : '']
    .filter(Boolean).join(', ');
  return rest ? `${bits}. ${rest}` : bits;
}

/** The best external link for a source: DOI first, it outlives any URL. */
export function href(s: Source): string | null {
  if (s.doi) return `https://doi.org/${s.doi}`;
  if (s.url) return s.url;
  return null;
}

/** The compact index the browser searches. Kept small: this ships to every visitor. */
export function searchIndex() {
  return entries.map((e) => ({
    i: e.id,
    r: e.ru,
    e: e.en,
    a: e.aka,
    m: modLabel(e.modality),
    c: catLabel(e.category),
    y: e.first?.year ?? null,
    w: RU[e.id] ? 1 : 0,
    d: RU[e.id]?.demo ? 1 : 0,
  }));
}
