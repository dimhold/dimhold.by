/* Забирает материалы для демонстраций из открытых источников.
 *
 * Каждый файл здесь — с проверенной лицензией: либо общественное достояние, либо CC0.
 * Шаблон лицензии на странице файла в Викискладе выписан в поле `licence` и проверялся
 * через API, а не на глаз. Ничего с пометкой «review needed», ничего под CC BY-SA
 * (совместимость с оформлением сайта там мутная) и ничего, чьё авторское право могло
 * быть восстановлено в США по URAA: поэтому все портреты — публикации до 1929 года.
 *
 * Запускается руками: node scripts/fetch-illusion-assets.mjs
 * Результат кладётся в public/illusions/ и коммитится вместе с происхождением.
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const out = join(root, 'public', 'illusions');
const cache = join(root, 'node_modules', '.cache', 'illusion-assets');

/** id — имя файла на сайте. commons — страница в Викискладе, она же документ о правах. */
const ASSETS = [
  {
    id: 'duck-rabbit',
    commons: 'File:Kaninchen und Ente.svg',
    licence: 'PD-old-70-1923',
    rights: 'общественное достояние',
    author: 'аноним',
    title: 'Kaninchen und Ente',
    date: '1892',
    source: 'Fliegende Blätter, 23 октября 1892',
    width: 900,
    format: 'png',
    flatten: '#f2efe8',
  },
  {
    id: 'all-is-vanity',
    commons: 'File:Charles Allan Gilbert - All is Vanity.jpg',
    licence: 'PD-art',
    rights: 'общественное достояние',
    author: 'Charles Allan Gilbert',
    title: 'All Is Vanity',
    date: '1892',
    source: 'рисунок 1892 года, широко перепечатывался с 1902-го',
    width: 900,
    format: 'jpeg',
  },
  {
    id: 'wife-mother-in-law',
    commons: 'File:My Wife and My Mother-in-Law.jpg',
    licence: 'PD-US',
    rights: 'общественное достояние',
    author: 'William Ely Hill',
    title: 'My Wife and My Mother-in-Law',
    date: '1915',
    source: 'журнал Puck, 6 ноября 1915',
    width: 800,
    format: 'jpeg',
  },
  {
    id: 'lincoln',
    commons: 'File:Abraham Lincoln O-77 matte collodion print.jpg',
    licence: 'PD',
    rights: 'общественное достояние',
    author: 'Alexander Gardner',
    title: 'Портрет Авраама Линкольна (O-77)',
    date: '1863',
    source: 'коллодионный отпечаток, 1863',
    width: 700,
    format: 'jpeg',
    grey: true,
  },
  {
    id: 'hogarth-perspective',
    commons: 'File:William Hogarth - Absurd perspectives.png',
    licence: 'PD',
    rights: 'общественное достояние',
    author: 'William Hogarth',
    title: 'Satire on False Perspective',
    date: '1754',
    source: 'гравюра, фронтиспис к «Kirby’s Perspective»',
    width: 1000,
    format: 'jpeg',
  },
  {
    id: 'mars-viking',
    commons: 'File:Martian face viking cropped.jpg',
    licence: 'PD-USGov-NASA',
    rights: 'общественное достояние',
    author: 'NASA / «Викинг-1»',
    title: 'Лицо на Марсе, снимок «Викинга-1»',
    date: '1976',
    source: 'NASA, 25 июля 1976',
    width: 500,
    format: 'jpeg',
    grey: true,
  },
  {
    id: 'mars-mgs',
    commons: 'File:Mars face.png',
    licence: 'PD-USGov-NASA',
    rights: 'общественное достояние',
    author: 'NASA / JPL / Malin Space Science Systems',
    title: 'То же место, съёмка Mars Global Surveyor',
    date: '2001',
    source: 'NASA/JPL/MSSS',
    width: 500,
    format: 'jpeg',
    grey: true,
  },
  {
    id: 'strawberries',
    commons: 'File:Jacob van Hulsdonck, Wild Strawberries and a Carnation in a Wan-Li Bowl, c. 1620, NGA 161665.jpg',
    licence: 'CC0',
    rights: 'CC0, Национальная галерея искусств (Вашингтон)',
    author: 'Jacob van Hulsdonck',
    title: 'Дикая земляника и гвоздика в ваньли-чаше',
    date: 'около 1620',
    source: 'National Gallery of Art, открытый доступ',
    width: 1000,
    format: 'jpeg',
  },
  {
    id: 'face-chekhov',
    crop: [0.40, 0.15, 0.27, 0.30],
    commons: 'File:Anton Chekhov 1889.jpg',
    licence: 'PD-US',
    rights: 'общественное достояние',
    author: 'В. Чеховский, Москва',
    title: 'Антон Чехов',
    date: '1889',
    source: 'фотография 1889 года',
    width: 520,
    format: 'jpeg',
    grey: true,
  },
  {
    id: 'face-mendeleev',
    crop: [0.33, 0.07, 0.32, 0.33],
    commons: 'File:Dmitri Mendeleev 1890s.jpg',
    licence: 'PD-Rus-Empire',
    rights: 'общественное достояние',
    author: 'неизвестен',
    title: 'Дмитрий Менделеев',
    date: '1890-е',
    source: 'фотография 1890-х',
    width: 520,
    format: 'jpeg',
    grey: true,
  },
  {
    id: 'face-kovalevskaya',
    crop: [0.27, 0.06, 0.47, 0.51],
    commons: 'File:Sofja Wassiljewna Kowalewskaja 1.jpg',
    licence: 'PD-old',
    rights: 'общественное достояние',
    author: 'неизвестен',
    title: 'Софья Ковалевская',
    date: 'до 1891',
    source: 'фотография XIX века',
    width: 520,
    format: 'jpeg',
    grey: true,
  },
  {
    id: 'face-curie',
    crop: [0.24, 0.13, 0.46, 0.49],
    commons: 'File:Marie Curie c1920.jpg',
    licence: 'PD-old-auto-1923',
    rights: 'общественное достояние',
    author: 'Henri Manuel',
    title: 'Мария Склодовская-Кюри',
    date: 'около 1920',
    source: 'фотография около 1920 года',
    width: 520,
    format: 'jpeg',
    grey: true,
  },
  {
    id: 'face-tesla',
    crop: [0.37, 0.15, 0.42, 0.43],
    commons: 'File:N.Tesla.JPG',
    licence: 'PD-old',
    rights: 'общественное достояние',
    author: 'неизвестен',
    title: 'Никола Тесла',
    date: '1890-е',
    source: 'фотография 1890-х',
    width: 520,
    format: 'jpeg',
    grey: true,
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Викисклад бьёт по рукам за частые запросы. Отступаем и ждём, а не падаем:
   таблица лицензий проверяется целиком или не проверяется вовсе. */
const get = async (url) => {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'dimhold.by illusion-assets/1.0 (dimhold@dimhold.by)' } });
    if (res.ok) return res;
    if (res.status !== 429 && res.status < 500) throw new Error(`${res.status} ${url}`);
    await sleep(2000 * 2 ** attempt);
  }
  throw new Error(`не достучался: ${url}`);
};

const api = async (params) => {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  for (const [k, v] of Object.entries({ format: 'json', ...params })) url.searchParams.set(k, v);
  return (await get(url)).json();
};

/* Лицензия перепроверяется при каждом запуске: если на Викискладе её переставят,
   сборка заметит это здесь, а не читатель на сайте. */
async function verify(asset) {
  const d = await api({
    action: 'query',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size',
    titles: asset.commons,
  });
  const page = Object.values(d.query.pages)[0];
  if (!page.imageinfo) throw new Error(`нет файла: ${asset.commons}`);
  const ii = page.imageinfo[0];
  const short = ii.extmetadata?.LicenseShortName?.value ?? '';
  const free = /public domain|cc0/i.test(short);
  if (!free) throw new Error(`лицензия на ${asset.commons} перестала быть свободной: ${short}`);
  return { url: ii.url, short, bytes: ii.size };
}

async function main() {
  mkdirSync(out, { recursive: true });
  mkdirSync(cache, { recursive: true });
  const manifest = [];
  for (const a of ASSETS) {
    const { url, short, bytes } = await verify(a);
    const raw = join(cache, a.id + (a.commons.endsWith('.svg') ? '.svg' : '.bin'));
    if (!existsSync(raw)) {
      writeFileSync(raw, Buffer.from(await (await get(url)).arrayBuffer()));
    }
    let img = sharp(readFileSync(raw), { density: 200 });
    if (a.flatten) img = img.flatten({ background: a.flatten });
    if (a.crop) {
      /* Портреты в архивах — почти всегда в полный рост. Для лицевых демонстраций
         нужна голова, и рамка задаётся в долях кадра, чтобы не зависеть от размера
         исходника. */
      const meta = await img.metadata();
      const [cx, cy, cw, ch] = a.crop;
      img = img.extract({
        left: Math.round(cx * meta.width),
        top: Math.round(cy * meta.height),
        width: Math.round(cw * meta.width),
        height: Math.round(ch * meta.height),
      });
    }
    img = img.resize({ width: a.width, withoutEnlargement: true });
    if (a.grey) img = img.greyscale();
    const file = `${a.id}.${a.format === 'png' ? 'png' : 'jpg'}`;
    const buf = await (a.format === 'png' ? img.png({ compressionLevel: 9 }) : img.jpeg({ quality: 82, mozjpeg: true })).toBuffer();
    writeFileSync(join(out, file), buf);
    manifest.push({ ...a, file, licenceChecked: short, originalBytes: bytes, bytes: buf.length });
    console.log(`${short.padEnd(16)} ${(buf.length / 1024).toFixed(0).padStart(5)}K  ${file}`);
    await sleep(1200);
  }
  writeFileSync(join(out, 'provenance.json'), JSON.stringify(manifest, null, 1) + '\n');
  /* Тот же список едет в src, чтобы страница подписывала каждый материал сама:
     происхождение — часть экспоната, а не сноска в репозитории. */
  const forSite = Object.fromEntries(
    manifest.map((m) => [
      m.id,
      {
        file: `/illusions/${m.file}`,
        title: m.title,
        author: m.author,
        date: m.date,
        source: m.source,
        rights: m.rights,
        licence: m.licence,
        commons: `https://commons.wikimedia.org/wiki/${encodeURIComponent(m.commons.replace(/ /g, '_'))}`,
      },
    ]),
  );
  writeFileSync(join(root, 'src', 'lib', 'illusions', 'assets.json'), JSON.stringify(forSite, null, 1) + '\n');
  console.log(`\n${manifest.length} файлов; происхождение — в public/illusions/provenance.json и в src/lib/illusions/assets.json`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
