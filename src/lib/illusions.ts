/* The illusions section's data layer.
 *
 * catalog.json is generated from the research dossier by scripts/gen-illusions.mjs and
 * committed; the dossier itself is gitignored. Everything a page renders comes from
 * here, so that a page never reaches into the dossier and never has to know it exists.
 */
import catalog from './illusions/catalog.json';
import { RU, type Copy } from './illusions/ru';

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
  effectEn: string;
  difficulty: number | null;
  sources: string[];
}

export const entries = catalog.entries as Entry[];
export const sources = catalog.sources as Record<string, Source>;
export const dossier = catalog.dossier;
export const generated = catalog.generated;

/* Reader-facing names. A slug that is missing here falls back to itself, which is ugly
   enough to be noticed and fixed rather than quietly shipped. */
export const MODALITY_RU: Record<Modality, string> = {
  visual: 'зрение',
  auditory: 'слух',
  tactile: 'осязание',
  multisensory: 'между чувствами',
  interoceptive: 'сигналы тела',
  vestibular: 'равновесие',
  temporal: 'время',
  cognitive: 'мышление',
  chemical: 'вкус и запах',
  physical: 'физика света',
};

export const CATEGORY_RU: Record<string, string> = {
  'geometric-size': 'размер и длина',
  'geometric-direction': 'направление линий',
  'geometric-shape': 'форма и кривизна',
  'brightness-contrast': 'светлота и контраст',
  colour: 'цвет',
  motion: 'движение',
  'motion-position': 'движение сдвигает место',
  'depth-3d': 'глубина и перспектива',
  impossible: 'невозможные фигуры',
  ambiguous: 'двойственные образы',
  'contours-filling': 'контуры и заполнение',
  'face-body': 'лица',
  attention: 'внимание и незамечание',
  'afterimage-adaptation': 'последействие и адаптация',
  numerosity: 'количество',
  'op-art': 'оп-арт',
  clinical: 'клинические',
  entoptic: 'собственный глаз',
  binocular: 'два глаза',
  'eye-movement': 'движения глаз',
  material: 'материал и поверхность',
  hallucination: 'вызванные образы',
  pitch: 'высота звука',
  loudness: 'громкость',
  'spatial-audio': 'звук в пространстве',
  speech: 'речь',
  'rhythm-tempo': 'ритм и темп',
  continuity: 'непрерывность звука',
  'scene-analysis': 'что с чем звучит',
  'body-ownership': 'владение телом',
  proprioceptive: 'где находится тело',
  'touch-location': 'где вас коснулись',
  'weight-texture': 'вес и фактура',
  temperature: 'температура',
  pain: 'боль',
  'shape-extent': 'форма на ощупь',
  'motor-efferent': 'собственное движение',
  'haptic-vr': 'тактильные интерфейсы',
  crossmodal: 'между чувствами',
  flavour: 'вкус еды',
  'body-signals': 'сигналы изнутри',
  'self-motion': 'движение себя',
  locomotor: 'ходьба и качка',
  'time-perception': 'течение времени',
  judgement: 'суждение',
  memory: 'память',
  agency: 'авторство действия',
  causality: 'причинность',
  metacognition: 'знание о своём знании',
  social: 'социальные',
  linguistic: 'язык',
  sleep: 'на границе сна',
  satiation: 'насыщение повтором',
  suggestion: 'внушение',
  'taste-smell': 'вкус и запах',
  chemesthesis: 'жжение и холод',
  optics: 'оптика атмосферы',
};

export const CONFIDENCE_RU: Record<string, string> = {
  high: 'установлено',
  medium: 'вероятно',
  low: 'под вопросом',
  disputed: 'спорно',
};

export const catLabel = (slug: string) => CATEGORY_RU[slug] ?? slug;
export const modLabel = (m: Modality) => MODALITY_RU[m] ?? m;

/** Russian copy for an entry, when someone has written it. */
export const copyFor = (id: string): Copy | undefined => RU[id];

/** Entries that have both Russian prose and, usually, a demo — the ones worth reading. */
export const written = entries.filter((e) => RU[e.id]);
export const withDemo = entries.filter((e) => RU[e.id]?.demo);

export const bySlug = new Map(entries.map((e) => [e.id, e]));

/** Grouped for the index, biggest group first, with written entries at the top of each. */
export function groups() {
  const byMod = new Map<Modality, Entry[]>();
  for (const e of entries) {
    if (!byMod.has(e.modality)) byMod.set(e.modality, []);
    byMod.get(e.modality)!.push(e);
  }
  for (const list of byMod.values()) {
    list.sort((a, b) => {
      const aw = RU[a.id] ? 0 : 1, bw = RU[b.id] ? 0 : 1;
      return aw - bw || a.ru.localeCompare(b.ru, 'ru');
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
