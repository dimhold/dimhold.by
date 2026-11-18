/* Происхождение материалов.
 *
 * Список пишется скриптом scripts/fetch-illusion-assets.mjs, который перед каждой
 * выгрузкой перепроверяет лицензию через API Викисклада. Ничего, кроме общественного
 * достояния и CC0, сюда не попадает: доля «свободных» лицензий с оговорками слишком
 * велика, чтобы разбираться с каждой по отдельности.
 *
 * Подпись выводится под демонстрацией всегда, даже для общественного достояния, где
 * её не требуют. Каталог собирался ради того, чтобы источник был виден; прятать его у
 * собственных картинок было бы странно.
 */
import assets from './assets.json';

export interface Asset {
  file: string;
  title: string;
  author: string;
  date: string;
  source: string;
  rights: string;
  licence: string;
  commons: string;
}

export const ASSETS = assets as Record<string, Asset>;

export const asset = (id: string): Asset | undefined => ASSETS[id];

/* assets.json пишет скрипт, и подписи в нём русские. Для других языков автор, источник
   и права берутся отсюда по идентификатору материала; название остаётся оригинальным. */
export const ASSET_TEXT: Record<'en' | 'be', Record<string, Partial<Pick<Asset, 'author' | 'source' | 'rights'>>>> = {
  en: {},
  be: {},
};

const QUOTES: Record<'ru' | 'en' | 'be', [string, string]> = { ru: ['«', '»'], be: ['«', '»'], en: ['“', '”'] };

/** Строка подписи: кто, что, когда и на каких правах. */
export const creditLine = (a: Asset, lang: 'ru' | 'en' | 'be' = 'ru', id = ''): string => {
  const x = lang === 'ru' ? {} : (ASSET_TEXT[lang][id] ?? {});
  const [o, c] = QUOTES[lang];
  return `${x.author ?? a.author}, ${o}${a.title}${c}, ${a.date}. ${x.source ?? a.source}. ${x.rights ?? a.rights}.`;
};
