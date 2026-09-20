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

/** Строка подписи: кто, что, когда и на каких правах. */
export const creditLine = (a: Asset): string =>
  `${a.author}, «${a.title}», ${a.date}. ${a.source}. ${a.rights}.`;
