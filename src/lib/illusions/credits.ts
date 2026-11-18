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
   и права, а там, где название или дата записаны по-русски, и они, берутся отсюда по
   идентификатору материала. Оригинальные названия (Kaninchen und Ente) не трогаются. */
export const ASSET_TEXT: Record<'en' | 'be', Record<string, Partial<Pick<Asset, 'title' | 'date' | 'author' | 'source' | 'rights'>>>> = {
  en: {
    'duck-rabbit': { author: 'Anonymous', source: 'Fliegende Blätter, 23 October 1892', rights: 'Public domain' },
    'all-is-vanity': { source: 'Drawn in 1892; widely reprinted from 1902', rights: 'Public domain' },
    'wife-mother-in-law': { source: 'Puck, 6 November 1915', rights: 'Public domain' },
    lincoln: { title: 'Portrait of Abraham Lincoln (O-77)', source: 'Collodion print', rights: 'Public domain' },
    'hogarth-perspective': { source: 'Engraving, frontispiece to “Kirby’s Perspective”', rights: 'Public domain' },
    'mars-viking': { title: 'The Face on Mars, Viking 1 image', author: 'NASA / Viking 1', source: 'NASA, 25 July 1976', rights: 'Public domain' },
    'mars-mgs': { title: 'The same spot, imaged by Mars Global Surveyor', rights: 'Public domain' },
    strawberries: { title: 'Wild Strawberries and a Carnation in a Wan-Li Bowl', date: 'c. 1620', source: 'National Gallery of Art, open access', rights: 'CC0, National Gallery of Art, Washington' },
    'face-chekhov': { title: 'Anton Chekhov', author: 'V. Chekhovsky, Moscow', source: 'Photograph', rights: 'Public domain' },
    'face-mendeleev': { title: 'Dmitri Mendeleev', date: '1890s', author: 'Unknown photographer', source: 'Photograph', rights: 'Public domain' },
    'face-kovalevskaya': { title: 'Sofia Kovalevskaya', date: 'before 1891', author: 'Unknown photographer', source: 'Photograph', rights: 'Public domain' },
    'face-curie': { title: 'Marie Skłodowska-Curie', date: 'c. 1920', source: 'Photograph', rights: 'Public domain' },
    'face-tesla': { title: 'Nikola Tesla', date: '1890s', author: 'Unknown photographer', source: 'Photograph', rights: 'Public domain' },
  },
  be: {
    'duck-rabbit': { author: 'ананім', source: 'Fliegende Blätter, 23 кастрычніка 1892', rights: 'грамадскі набытак' },
    'all-is-vanity': { source: 'малюнак 1892 года, шырока перадрукоўваўся з 1902-га', rights: 'грамадскі набытак' },
    'wife-mother-in-law': { source: 'часопіс Puck, 6 лістапада 1915', rights: 'грамадскі набытак' },
    lincoln: { title: 'Партрэт Аўраама Лінкальна (O-77)', source: 'калодыевы адбітак, 1863', rights: 'грамадскі набытак' },
    'hogarth-perspective': { source: 'гравюра, франтыспіс да «Kirby’s Perspective»', rights: 'грамадскі набытак' },
    'mars-viking': { title: 'Твар на Марсе, здымак «Вікінга-1»', author: 'NASA / «Вікінг-1»', source: 'NASA, 25 ліпеня 1976', rights: 'грамадскі набытак' },
    'mars-mgs': { title: 'Тое ж месца, здымак Mars Global Surveyor', rights: 'грамадскі набытак' },
    strawberries: { title: 'Дзікія суніцы і гваздзік у чашы Ваньлі', date: 'каля 1620', source: 'National Gallery of Art, адкрыты доступ', rights: 'CC0, Нацыянальная галерэя мастацтваў (Вашынгтон)' },
    'face-chekhov': { title: 'Антон Чэхаў', author: 'В. Чэхоўскі, Масква', source: 'фотаздымак 1889 года', rights: 'грамадскі набытак' },
    'face-mendeleev': { title: 'Дзмітрый Мендзялееў', date: '1890-я', author: 'невядомы', source: 'фотаздымак 1890-х', rights: 'грамадскі набытак' },
    'face-kovalevskaya': { title: 'Соф’я Кавалеўская', date: 'да 1891', author: 'невядомы', source: 'фотаздымак XIX стагоддзя', rights: 'грамадскі набытак' },
    'face-curie': { title: 'Марыя Складоўская-Кюры', date: 'каля 1920', source: 'фотаздымак каля 1920 года', rights: 'грамадскі набытак' },
    'face-tesla': { title: 'Нікола Тэсла', date: '1890-я', author: 'невядомы', source: 'фотаздымак 1890-х', rights: 'грамадскі набытак' },
  },
};

const QUOTES: Record<'ru' | 'en' | 'be', [string, string]> = { ru: ['«', '»'], be: ['«', '»'], en: ['“', '”'] };

/** Строка подписи: кто, что, когда и на каких правах. */
export const creditLine = (a: Asset, lang: 'ru' | 'en' | 'be' = 'ru', id = ''): string => {
  const x = lang === 'ru' ? {} : (ASSET_TEXT[lang][id] ?? {});
  const [o, c] = QUOTES[lang];
  return `${x.author ?? a.author}, ${o}${x.title ?? a.title}${c}, ${x.date ?? a.date}. ${x.source ?? a.source}. ${x.rights ?? a.rights}.`;
};
