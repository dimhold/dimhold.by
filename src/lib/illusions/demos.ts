/* Описания демонстраций: что за холст и какие ручки.
 *
 * Пока демонстраций было десять, разметку можно было писать руками для каждой. На
 * полутора сотнях это перестаёт работать, поэтому ручки описаны данными, а Demo.astro
 * строит по описанию любую панель. Модуль демонстрации после этого занимается только
 * рисованием и находит свои ручки по имени.
 */

export type Control =
  | { kind: 'slider'; name: string; label: string; min: number; max: number; step?: number; value: number;
      /** Формат вывода: % подставляется значением. Без него значение не показывается вовсе —
          так делают там, где число превращает задачу подгонки в арифметику. */
      fmt?: string }
  | { kind: 'toggle'; name: string; label: string; on?: string }
  | { kind: 'button'; name: string; label: string }
  | { kind: 'check'; name: string; label: string }
  | { kind: 'select'; name: string; label: string; options: { value: string; label: string }[] }
  | { kind: 'clock'; name: string }
  | { kind: 'hint'; label: string };

export interface DemoSpec {
  /** Высота основного холста в долях ширины. 0 — холста нет вовсе. */
  ratio?: number;
  /** Второй холст под основным: гистограмма, спектр, профиль яркости. */
  chart?: number;
  /** Слой обычного HTML поверх демонстрации — для задач с текстом и кнопками. */
  stage?: boolean;
  controls?: Control[];
  /** Демонстрации со звуком: предупреждение про наушники выводится само. */
  headphones?: boolean;
  /** Идентификаторы материалов из assets.json: подпись о происхождении Demo.astro
      выводит сам, и она обязательна даже для общественного достояния. */
  credits?: string[];
}

const sl = (name: string, label: string, min: number, max: number, value: number, fmt?: string, step = 1): Control =>
  ({ kind: 'slider', name, label, min, max, step, value, fmt });
const btn = (name: string, label: string): Control => ({ kind: 'button', name, label });
const tog = (name: string, label: string, on: string): Control => ({ kind: 'toggle', name, label, on });

export const DEMOS: Record<string, DemoSpec> = {
  /* — размер и длина — */
  'mueller-lyer': { ratio: 0.52, controls: [sl('angle', 'угол наконечников', 0, 75, 45, '%°'), btn('ruler', 'приложить линейку')] },
  ponzo: { ratio: 0.8, controls: [sl('deg', 'схождение рельсов', 0, 40, 16, '%°')] },
  ebbinghaus: { ratio: 0.48, controls: [sl('mine', 'размер правого круга', 14, 50, 44), btn('check', 'проверить')] },
  delboeuf: { ratio: 0.5, controls: [sl('ring', 'радиус кольца', 34, 120, 40, '% px'), btn('check', 'показать эталон')] },
  jastrow: { ratio: 0.6, controls: [btn('stack', 'наложить друг на друга')] },
  'oppel-kundt': { ratio: 0.36, controls: [sl('ticks', 'число штрихов', 0, 40, 16), btn('ruler', 'приложить линейку')] },
  sander: { ratio: 0.55, controls: [sl('shear', 'наклон', 0, 60, 35, '%°'), btn('rotate', 'повернуть диагональ')] },
  'vertical-horizontal': { ratio: 0.42, controls: [sl('len', 'длина', 60, 200, 130, '% px'), btn('ruler', 'уравнять')] },
  'sine-illusion': { ratio: 0.5, controls: [sl('amp', 'амплитуда кривой', 0, 100, 60, '% %'), btn('flat', 'распрямить')] },
  'shepard-tables': { ratio: 0.6, controls: [btn('fly', 'наложить столешницы'), tog('legs', 'убрать ножки', 'вернуть ножки')] },
  'leaning-tower': { ratio: 0.62, controls: [sl('gap', 'зазор', 0, 60, 8, '% px'), tog('mirror', 'отразить правую', 'вернуть правую')] },

  /* — направление линий и форма — */
  'cafe-wall': { ratio: 0.6, controls: [sl('offset', 'сдвиг рядов', 0, 100, 50, '% %'), sl('mortar', 'толщина шва', 0, 8, 3, '% px'), sl('lum', 'яркость шва', 0, 100, 50, '% %')] },
  zollner: { ratio: 0.62, controls: [sl('angle', 'угол штриховки', 0, 90, 25, '%°'), sl('pitch', 'шаг штрихов', 8, 40, 16, '% px')] },
  poggendorff: { ratio: 0.55, controls: [sl('guess', 'подгоните продолжение', -60, 60, 0), btn('check', 'показать прямую')] },
  hering: { ratio: 0.62, controls: [sl('rays', 'число лучей', 8, 60, 30), tog('wundt', 'перевернуть в Вундта', 'вернуть Геринга')] },
  bourdon: { ratio: 0.42, controls: [sl('wedge', 'угол клина', 0, 25, 14, '%°'), btn('ruler', 'приложить прямую')] },
  'tilt-illusion': { ratio: 0.5, controls: [sl('surround', 'наклон окружения', -45, 45, 15, '%°'), sl('guess', 'выставьте центр в вертикаль', -20, 20, 0), btn('check', 'проверить')] },
  'fraser-spiral': { ratio: 0.9, controls: [sl('tilt', 'наклон элементов', -45, 45, 30, '%°'), btn('trace', 'обвести один виток')] },
  orbison: {
    ratio: 0.8,
    controls: [
      { kind: 'select', name: 'bg', label: 'фон', options: [{ value: 'fan', label: 'веер' }, { value: 'rings', label: 'кольца' }, { value: 'grid', label: 'сетка' }] },
      { kind: 'select', name: 'fig', label: 'фигура', options: [{ value: 'square', label: 'квадрат' }, { value: 'circle', label: 'круг' }, { value: 'hex', label: 'шестиугольник' }] },
      { kind: 'check', name: 'spin', label: 'вращать фон' },
    ],
  },
  'checker-bulge': { ratio: 0.7, controls: [sl('size', 'размер угловых элементов', 0, 50, 26, '% %'), btn('ruler', 'приложить линейку')] },
  'curvature-blindness': { ratio: 0.55, controls: [sl('phase', 'место переключения контраста', 0, 100, 0, '% %'), sl('amp', 'амплитуда', 5, 40, 22, '% px')] },

  /* — светлота и контраст — */
  'hermann-grid': { ratio: 0.62, controls: [sl('street', 'ширина улиц', 6, 26, 14, '% px'), tog('wavy', 'сделать улицы волнистыми', 'выпрямить улицы')] },
  'checker-shadow': { ratio: 0.75, controls: [tog('bridge', 'соединить A и B', 'убрать мост'), btn('probe', 'измерить обе клетки')] },
  'simultaneous-contrast': { ratio: 0.45, controls: [sl('patch', 'яркость квадратов', 20, 80, 50, '% %'), btn('swap', 'перенести квадрат')] },
  'mach-bands': { ratio: 0.34, chart: 0.16, controls: [sl('ramp', 'крутизна перехода', 5, 90, 40, '% %')] },
  chevreul: { ratio: 0.3, controls: [sl('steps', 'число ступеней', 3, 24, 10), tog('mask', 'закрыть соседей', 'открыть соседей')] },
  cornsweet: { ratio: 0.36, controls: [sl('occl', 'положение заслонки', 0, 100, 0, '% %'), btn('probe', 'измерить обе половины')] },
  'koffka-ring': { ratio: 0.5, controls: [sl('gap', 'разрез кольца', 0, 60, 0, '% px')] },
  'white-illusion': { ratio: 0.55, controls: [sl('len', 'длина вставок', 20, 100, 60, '% %'), btn('probe', 'измерить обе вставки')] },
  'benary-cross': { ratio: 0.5, controls: [tog('lift', 'снять с креста', 'вернуть на крест')] },
  'grating-induction': { ratio: 0.42, chart: 0.16, controls: [sl('freq', 'частота решётки', 1, 12, 4), sl('strip', 'высота полосы', 10, 80, 34, '% px')] },
  asahi: { ratio: 0.72, controls: [sl('petals', 'число лепестков', 3, 16, 8), sl('steep', 'крутизна градиента', 0, 100, 70, '% %'), tog('invert', 'развернуть градиент', 'вернуть градиент')] },
  'scintillating-grid': { ratio: 0.62, controls: [sl('disc', 'размер дисков', 4, 16, 8, '% px'), sl('bar', 'яркость брусков', 20, 80, 50, '% %'), sl('pitch', 'шаг решётки', 30, 90, 56, '% px')] },
  bezold: { ratio: 0.4, controls: [sl('width', 'толщина линий', 1, 24, 3, '% px')] },
  'shaded-diamond': { ratio: 0.45, controls: [tog('round', 'скруглить контур', 'выпрямить контур'), btn('probe', 'измерить обе фигуры')] },
  chubb: { ratio: 0.45, controls: [sl('surround', 'контраст окружения', 0, 100, 90, '% %'), sl('guess', 'подгоните правое пятно', 5, 100, 50), btn('check', 'проверить')] },
  'snake-illusion': { ratio: 0.55, controls: [tog('anti', 'убрать подсказку об освещении', 'вернуть подсказку'), btn('probe', 'измерить оба ромба')] },

  /* — движение — */
  barberpole: { ratio: 0.62, controls: [sl('aspect', 'пропорции окна', 20, 300, 60, '% %'), sl('angle', 'наклон полос', 10, 80, 45, '%°')] },
  'breathing-square': { ratio: 0.7, controls: [btn('trails', 'показать настоящие траектории')] },
  enigma: { ratio: 0.85, controls: [sl('lines', 'плотность лучей', 60, 400, 220), sl('ring', 'ширина колец', 8, 40, 18, '% px')] },
  'frequency-doubling': { ratio: 0.45, controls: [sl('freq', 'частота решётки', 1, 10, 3), sl('rate', 'частота мельканий', 2, 30, 18, '% Гц')] },
  'kinetic-depth': { ratio: 0.7, controls: [tog('spin', 'остановить', 'запустить'), sl('dots', 'число точек', 40, 400, 200)] },
  'motion-aftereffect': { ratio: 0.7, controls: [btn('go', 'адаптироваться 60 с'), { kind: 'clock', name: 'clock' }] },
  'motion-binding': { ratio: 0.7, controls: [tog('occl', 'показать заслонки', 'скрыть заслонки')] },
  'motion-induced-blindness': { ratio: 0.7, controls: [sl('speed', 'скорость вращения', 5, 60, 25), { kind: 'hint', label: 'держите пробел, пока точка отсутствует' }, btn('reset', 'сбросить')], chart: 0.2 },
  ouchi: { ratio: 0.7, controls: [sl('aspect', 'пропорции клеток', 100, 600, 400, '% %'), sl('inset', 'размер вставки', 15, 60, 34, '% %')] },
  'peripheral-drift': { ratio: 0.85, controls: [sl('seq', 'сдвиг последовательности яркостей', 0, 3, 0), sl('rings', 'число колец', 2, 8, 4)] },
  'rotating-snakes': { ratio: 0.85, controls: [sl('seq', 'сдвиг последовательности яркостей', 0, 3, 0), sl('rings', 'число колец', 2, 8, 5)] },
  'phi-beta': { ratio: 0.42, controls: [sl('isi', 'пауза между вспышками', 0, 400, 60, '% мс')] },
  'pinna-brelstaff': { ratio: 0.9, controls: [tog('zoom', 'остановить приближение', 'запустить приближение'), sl('tilt', 'наклон элементов', 0, 45, 22, '%°')] },
  'reverse-phi': { ratio: 0.45, controls: [tog('invert', 'инвертировать через кадр', 'вернуть обычные кадры'), sl('speed', 'скорость', 1, 20, 8)] },
  'roget-palisade': { ratio: 0.7, controls: [sl('slat', 'ширина планок', 2, 30, 10, '% px'), sl('gap', 'просвет', 2, 30, 8, '% px'), sl('rate', 'скорость вращения', 1, 30, 12)] },
  'rotating-circles': { ratio: 0.7, controls: [btn('trails', 'показать следы')] },
  silencing: {
    ratio: 0.8,
    controls: [
      sl('speed', 'скорость вращения', 0, 60, 30),
      { kind: 'select', name: 'what', label: 'что меняется', options: [{ value: 'hue', label: 'цвет' }, { value: 'lum', label: 'яркость' }, { value: 'size', label: 'размер' }] },
      btn('freeze', 'остановить вращение'),
    ],
  },
  'stepping-feet': { ratio: 0.5, controls: [sl('a', 'яркость первого', 0, 100, 90, '% %'), sl('b', 'яркость второго', 0, 100, 12, '% %'), sl('stripe', 'контраст полос', 0, 100, 100, '% %')] },
  ternus: { ratio: 0.4, controls: [sl('isi', 'пауза между кадрами', 0, 200, 20, '% мс')] },
  tusi: { ratio: 0.8, controls: [sl('speed', 'скорость', 1, 30, 10), btn('trail', 'показать след')] },
  'wagon-wheel': { ratio: 0.5, controls: [sl('spokes', 'число спиц', 3, 24, 8), sl('rate', 'скорость вращения', 1, 60, 30)] },

  /* — контуры и заполнение — */
  'kanizsa-triangle': { ratio: 0.72, controls: [sl('spin', 'поворот вырезов', 0, 180, 0, '%°'), btn('probe', 'измерить яркость')] },
  'ehrenstein-illusion': { ratio: 0.8, controls: [sl('gap', 'размер разрыва', 4, 60, 26, '% px'), sl('lines', 'число линий', 8, 48, 24), tog('neon', 'перекрасить в неон', 'вернуть чёрные')] },
  'illusory-contours': {
    ratio: 0.5,
    controls: [{ kind: 'select', name: 'fig', label: 'фигура', options: [{ value: 'kanizsa', label: 'Канижа' }, { value: 'ehrenstein', label: 'Эренштейн' }, { value: 'schumann', label: 'Шуман' }, { value: 'abutting', label: 'стык решёток' }] }, sl('support', 'доля поддержки', 10, 90, 55, '% %')] },
  troxler: { ratio: 0.55, controls: [sl('soft', 'мягкость края', 0, 100, 70, '% %'), btn('go', 'начать'), { kind: 'clock', name: 'clock' }] },
  'blind-spot-filling': { ratio: 0.42, controls: [sl('sep', 'расстояние между метками', 60, 400, 220, '% px'), { kind: 'select', name: 'test', label: 'что в слепом пятне', options: [{ value: 'gap', label: 'разрыв линии' }, { value: 'texture', label: 'клетчатый фон' }, { value: 'dot', label: 'ничего' }] }] },
  'extinction-illusion': { ratio: 0.7, controls: [sl('dots', 'число точек', 4, 24, 12), sl('contrast', 'контраст сетки', 10, 90, 45, '% %')] },
  'visual-phantoms': { ratio: 0.5, controls: [sl('strip', 'ширина пустой полосы', 10, 120, 50, '% px'), sl('freq', 'частота решётки', 1, 10, 2), sl('speed', 'скорость', 1, 20, 5)] },
  'lilac-chaser': { ratio: 0.8, controls: [sl('speed', 'скорость', 4, 20, 10), sl('blur', 'размытие', 0, 100, 60, '% %')] },
  'scintillating-starburst': { ratio: 0.9, controls: [sl('rings', 'число колец', 2, 10, 5), sl('vertices', 'число вершин', 4, 16, 8), sl('width', 'толщина линий', 1, 6, 2, '% px')] },

  /* — цвет и последействия — */
  'negative-afterimage': { ratio: 0.6, controls: [btn('go', 'адаптироваться 20 с'), { kind: 'clock', name: 'clock' }, { kind: 'select', name: 'shape', label: 'контур после', options: [{ value: 'none', label: 'без контура' }, { value: 'circle', label: 'круг' }, { value: 'square', label: 'квадрат' }] }] },
  'benham-top': { ratio: 0.8, controls: [sl('speed', 'скорость', 1, 15, 7), tog('dir', 'сменить направление', 'вернуть направление')] },
  'munker-white': { ratio: 0.6, controls: [sl('grid', 'шаг сетки', 6, 30, 14, '% px'), { kind: 'hint', label: 'наведите курсор — покажет настоящий цвет' }] },
  'neon-colour-spreading': { ratio: 0.7, controls: [sl('lum', 'яркость цветных отрезков', 0, 100, 55, '% %')] },
  watercolour: { ratio: 0.65, controls: [tog('swap', 'поменять линии местами', 'вернуть как было'), sl('wave', 'волнистость', 0, 30, 14, '% px')] },
  'colour-phi': { ratio: 0.4, controls: [sl('isi', 'интервал между вспышками', 0, 300, 50, '% мс')] },
  'colour-constancy': { ratio: 0.6, controls: [sl('illum', 'освещение: лампа — дневной свет', 0, 100, 50, '% %'), { kind: 'hint', label: 'наведите курсор — покажет пиксель и краску' }] },
  'the-dress': { ratio: 0.7, controls: [sl('illum', 'освещение: лампа — пасмурное небо', 0, 100, 50, '% %'), { kind: 'hint', label: 'значения пикселей ткани при этом не меняются' }] },
  'tilt-aftereffect': { ratio: 0.5, controls: [btn('go', 'адаптироваться 45 с'), { kind: 'clock', name: 'clock' }, sl('guess', 'выставьте в вертикаль', -15, 15, 0), btn('check', 'проверить')] },
  'emmert-law': { ratio: 0.5, controls: [btn('go', 'адаптироваться 20 с'), { kind: 'clock', name: 'clock' }] },

  /* — глубина, форма, невозможное — */
  'shape-from-shading': { ratio: 0.6, controls: [sl('dir', 'направление света', 0, 360, 90, '%°')] },
  'crater-illusion': { ratio: 0.6, controls: [sl('rot', 'поворот снимка', 0, 360, 0, '%°')] },
  'size-constancy': {
    ratio: 0.62,
    controls: [
      { kind: 'check', name: 'perspective', label: 'линейная перспектива' },
      { kind: 'check', name: 'texture', label: 'градиент текстуры' },
      { kind: 'check', name: 'shadow', label: 'тени' },
      sl('dist', 'расстояние', 0, 100, 50, '% %'),
    ],
  },
  'ames-window': { ratio: 0.55, controls: [sl('trap', 'трапеция — прямоугольник', 0, 100, 0, '% %'), sl('speed', 'скорость', 1, 20, 8), { kind: 'check', name: 'rod', label: 'просунуть стержень' }] },
  'ames-room': { ratio: 0.6, controls: [sl('view', 'отойти от смотрового отверстия', 0, 100, 0, '% %')] },
  anamorphosis: { ratio: 0.65, controls: [sl('view', 'угол взгляда', 0, 100, 0, '% %')] },
  'penrose-triangle': { ratio: 0.8, controls: [sl('orbit', 'отвести камеру', 0, 100, 0, '% %')] },
  'penrose-stairs': { ratio: 0.7, controls: [sl('orbit', 'отвести камеру', 0, 100, 0, '% %')] },
  'impossible-cube': { ratio: 0.8, controls: [sl('orbit', 'отвести камеру', 0, 100, 0, '% %')] },
  'impossible-object': {
    ratio: 0.7,
    credits: ['hogarth-perspective'],
    controls: [
      { kind: 'select', name: 'fig', label: 'фигура', options: [{ value: 'tribar', label: 'трибар' }, { value: 'stairs', label: 'лестница' }, { value: 'cube', label: 'куб' }, { value: 'hogarth', label: 'Хогарт, 1754' }] },
      sl('orbit', 'отвести камеру', 0, 100, 0, '% %'),
    ],
  },
  blivet: { ratio: 0.4, controls: [sl('mask', 'положение заслонки', 0, 100, 50, '% %')] },
  'shepard-elephant': { ratio: 0.6, controls: [sl('fix', 'поставить ступни на место', 0, 100, 0, '% %')] },
  'necker-cube': { ratio: 0.6, chart: 0.22, controls: [btn('tap', 'перевернулся'), btn('reset', 'сбросить'), { kind: 'hint', label: 'или пробел' }] },
  'peppers-ghost': { ratio: 0.55, controls: [sl('glass', 'наклон стекла', 20, 70, 45, '%°'), sl('ghost', 'свет на призраке', 0, 100, 60, '% %'), tog('plan', 'показать схему сверху', 'убрать схему')] },
  'gravity-hill': { ratio: 0.55, controls: [sl('slope', 'настоящий уклон', -8, 8, -4, '%°'), sl('tilt', 'наклон придорожных предметов', -12, 12, 8, '%°'), tog('horizon', 'открыть горизонт', 'закрыть горизонт')] },
  'hybrid-image': { ratio: 0.6, controls: [sl('cut', 'частота среза', 2, 40, 12), sl('zoom', 'отойти', 5, 100, 100, '% %')] },

  /* — два глаза — */
  'random-dot-stereogram': { ratio: 0.5, controls: [sl('shift', 'сдвиг', 2, 20, 8, '% px'), tog('anaglyph', 'красно-синий режим', 'две картинки рядом'), btn('outline', 'обвести сдвинутую область')] },
  autostereogram: { ratio: 0.55, controls: [sl('period', 'период узора', 40, 160, 90, '% px'), tog('cross', 'сводить внутрь', 'разводить наружу')] },
  'binocular-rivalry': { ratio: 0.45, controls: [tog('anaglyph', 'красно-синий режим', 'две картинки рядом'), { kind: 'hint', label: 'держите пробел, пока видна одна картинка' }, btn('reset', 'сбросить')], chart: 0.2 },
  chromostereopsis: { ratio: 0.45, controls: [sl('bg', 'яркость фона', 0, 60, 0, '% %'), sl('sat', 'насыщенность', 40, 100, 100, '% %')] },

  /* — двойственное — */
  'rubin-vase': { ratio: 0.7, controls: [sl('cue', 'кому отдать контур', 0, 100, 50, '% %')] },
  'figure-ground': { ratio: 0.5, controls: [sl('convex', 'выпуклость', 0, 100, 50, '% %'), sl('area', 'площадь', 0, 100, 50, '% %'), sl('sym', 'симметрия', 0, 100, 50, '% %')] },
  'coffer-illusion': { ratio: 0.65, controls: [sl('len', 'длина отрезков', 20, 100, 60, '% %'), btn('circles', 'обвести круги')] },
  'multistable-perception': {
    ratio: 0.55,
    chart: 0.22,
    controls: [{ kind: 'select', name: 'fig', label: 'стимул', options: [{ value: 'necker', label: 'куб Неккера' }, { value: 'schroder', label: 'лестница Шрёдера' }, { value: 'rings', label: 'кольца' }] }, btn('tap', 'переключилось'), btn('reset', 'сбросить')],
  },
  pareidolia: {
    ratio: 0.6,
    credits: ['mars-viking', 'mars-mgs'],
    controls: [
      { kind: 'select', name: 'what', label: 'что смотрим', options: [{ value: 'noise', label: 'процедурный шум' }, { value: 'mars', label: 'лицо на Марсе' }] },
      btn('roll', 'перебросить шум'),
      sl('scale', 'масштаб шума', 2, 20, 8),
      tog('hires', 'снимок 2001 года', 'снимок 1976 года'),
    ],
  },

  /* — внимание — */
  'change-blindness': { ratio: 0.6, controls: [btn('start', 'начать'), btn('give', 'сдаюсь'), { kind: 'clock', name: 'clock' }] },
  'attentional-blink': { ratio: 0.4, chart: 0.25, stage: true, controls: [btn('start', 'запустить серию')] },
  crowding: { ratio: 0.5, controls: [sl('ecc', 'удаление от центра', 40, 300, 150, '% px'), sl('space', 'промежуток до соседей', 4, 120, 40, '% px'), btn('reroll', 'новая буква')] },

  /* — мышление — */
  'launching-effect': { ratio: 0.3, controls: [sl('delay', 'задержка', 0, 300, 0, '% мс'), btn('go', 'показать ещё раз')] },
  'heider-simmel-animacy': { ratio: 0.6, stage: true, controls: [btn('play', 'смотреть')] },
  stroop: { ratio: 0, stage: true, controls: [btn('start', 'начать')] },
  'monty-hall': { ratio: 0, stage: true, chart: 0.3, controls: [btn('sim', 'прогнать 10 000 партий'), btn('reset', 'сбросить')] },
  anchoring: { ratio: 0, stage: true, chart: 0.3 },
  'linda-problem': { ratio: 0, stage: true },
  'illusion-of-control': { ratio: 0.35, stage: true, controls: [btn('press', 'нажать')] },
  'intentional-binding': { ratio: 0.5, stage: true, controls: [btn('start', 'начать пробу')] },
  'drm-false-memory': { ratio: 0, stage: true, controls: [btn('start', 'начать')] },
  'choice-blindness': { ratio: 0, stage: true },
  'bouba-kiki': { ratio: 0.4, stage: true },
  'kappa-effect': { ratio: 0.25, controls: [sl('pos', 'положение средней вспышки', 10, 90, 50, '% %'), btn('go', 'показать')] },
  'oddball-effect': { ratio: 0.4, stage: true, controls: [btn('go', 'показать поток')] },
  'representational-momentum': { ratio: 0.5, stage: true, controls: [btn('go', 'новая попытка')] },
  chronostasis: { ratio: 0.35, stage: true, controls: [btn('go', 'перевести взгляд')] },
  'pseudo-haptics': { ratio: 0.55, controls: [{ kind: 'select', name: 'mode', label: 'что имитируем', options: [{ value: 'bump', label: 'бугор' }, { value: 'friction', label: 'трение' }, { value: 'sticky', label: 'липкость' }, { value: 'weight', label: 'вес' }] }, { kind: 'hint', label: 'тяните шайбу мышью' }] },
  vection: { ratio: 0.6, controls: [tog('go', 'запустить', 'остановить'), sl('speed', 'скорость', 1, 20, 8)] },
  somatogravic: { ratio: 0.55, controls: [sl('accel', 'ускорение', 0, 100, 40, '% %')] },
  'false-heart-rate-feedback': { ratio: 0, stage: true, headphones: true, controls: [btn('go', 'начать')] },
  'missing-square-puzzle': { ratio: 0.5, controls: [tog('swap', 'переложить части', 'вернуть как было'), tog('ruler', 'приложить линейку', 'убрать линейку'), sl('exag', 'растянуть по вертикали', 1, 12, 1, '%×')] },
  moire: { ratio: 0.6, controls: [sl('rot', 'поворот верхнего слоя', 0, 90, 4, '%°'), sl('pitch', 'шаг верхнего слоя', 3, 20, 6, '% px')] },


  /* — на открытых материалах: подпись о происхождении строит Demo.astro — */
  'duck-rabbit': {
    ratio: 0.72,
    credits: ['duck-rabbit'],
    controls: [sl('bias', 'подсказка', 0, 100, 50, '% %'), btn('duck', 'обвести утку'), btn('rabbit', 'обвести кролика')],
  },
  'my-wife-mother-in-law': {
    ratio: 1.1,
    credits: ['wife-mother-in-law'],
    controls: [btn('young', 'обвести молодую'), btn('old', 'обвести старуху')],
  },
  'all-is-vanity': {
    ratio: 0.82,
    credits: ['all-is-vanity'],
    controls: [sl('blur', 'размытие', 0, 30, 0, '% px'), sl('zoom', 'отойти', 10, 100, 100, '% %')],
  },
  'lincoln-effect': {
    ratio: 0.78,
    credits: ['lincoln'],
    controls: [sl('block', 'размер блока', 1, 40, 22, '% px'), sl('blur', 'размытие', 0, 24, 0, '% px')],
  },
  'grey-strawberries': {
    ratio: 0.72,
    credits: ['strawberries'],
    controls: [sl('cast', 'голубой налёт', 0, 100, 85, '% %'), { kind: 'hint', label: 'наведите курсор — покажет настоящий оттенок' }],
  },
  'mooney-faces': {
    ratio: 0.9,
    credits: ['face-curie'],
    controls: [sl('threshold', 'порог', 20, 80, 50, '% %'), sl('blurm', 'сглаживание', 0, 12, 4, '% px'), btn('found', 'вижу лицо'), { kind: 'clock', name: 'clock' }],
  },
  thatcher: {
    ratio: 0.9,
    credits: ['face-curie'],
    controls: [sl('rot', 'поворот', 0, 180, 180, '%°'), tog('flip', 'перевернуть глаза и рот', 'вернуть как было')],
  },
  'face-inversion': {
    ratio: 0.5,
    stage: true,
    chart: 0.3,
    credits: ['face-chekhov', 'face-mendeleev', 'face-kovalevskaya', 'face-curie', 'face-tesla'],
    controls: [btn('start', 'начать серию')],
  },

  /* — звук — */
  'shepard-tone': { chart: 0.2, headphones: false, controls: [btn('play', 'играть'), sl('speed', 'скорость', 5, 60, 22, undefined, 1), sl('width', 'ширина колокола', 10, 60, 28), { kind: 'check', name: 'down', label: 'вниз' }, { kind: 'check', name: 'glide', label: 'непрерывно' }] },
  'risset-rhythm': { chart: 0.2, controls: [btn('play', 'играть'), sl('rate', 'скорость изменения', 1, 20, 6), { kind: 'check', name: 'down', label: 'замедляться' }] },
  'pitch-circularity': { stage: true, headphones: true, controls: [btn('play', 'следующая пара')] },
  'tritone-paradox': { stage: true, headphones: true, chart: 0.5, controls: [btn('play', 'следующая пара')] },
  'octave-illusion': { headphones: true, controls: [btn('play', 'играть'), btn('swap', 'поменять каналы'), btn('check', 'проверить каналы')] },
  'scale-illusion': { headphones: true, controls: [btn('play', 'играть'), { kind: 'select', name: 'ear', label: 'слушать', options: [{ value: 'both', label: 'оба уха' }, { value: 'left', label: 'только левое' }, { value: 'right', label: 'только правое' }] }] },
  'glissando-illusion': { headphones: true, controls: [btn('play', 'играть'), { kind: 'select', name: 'ear', label: 'слушать', options: [{ value: 'both', label: 'оба уха' }, { value: 'left', label: 'только левое' }, { value: 'right', label: 'только правое' }] }] },
  'precedence-effect': { headphones: true, controls: [btn('play', 'играть'), sl('delay', 'задержка второй копии', 0, 50, 5, '% мс'), sl('gain', 'громкость отстающей', 0, 150, 100, '% %')] },
  'binaural-beats': { headphones: true, chart: 0.2, controls: [btn('play', 'играть'), sl('diff', 'разность частот', 1, 30, 6, '% Гц'), { kind: 'check', name: 'acoustic', label: 'обычные акустические биения' }] },
  'missing-fundamental': { chart: 0.2, controls: [btn('play', 'играть'), { kind: 'check', name: 'f1', label: 'убрать основную' }, { kind: 'check', name: 'f2', label: 'убрать вторую' }, { kind: 'check', name: 'f3', label: 'убрать третью' }] },
  'tartini-tone': { controls: [btn('play', 'играть'), sl('f1', 'первый тон', 300, 1200, 600, '% Гц', 5), sl('f2', 'второй тон', 300, 1200, 750, '% Гц', 5)] },
  'illusory-continuity-tones': { chart: 0.2, controls: [btn('play', 'играть'), { kind: 'select', name: 'fill', label: 'чем заполнен разрыв', options: [{ value: 'silence', label: 'тишина' }, { value: 'noise', label: 'громкий шум' }, { value: 'quiet', label: 'тихий шум' }] }] },
  'zwicker-tone': { headphones: true, controls: [btn('play', 'шум 8 с, потом тишина'), sl('notch', 'частота выреза', 300, 3000, 1000, '% Гц', 10), sl('width', 'ширина выреза', 20, 400, 120, '% Гц', 10)] },
  'sound-induced-flash': { ratio: 0.35, controls: [btn('go', 'показать'), sl('beeps', 'число гудков', 0, 4, 2), sl('flashes', 'число вспышек', 1, 3, 1)] },
  'stream-bounce': { ratio: 0.3, controls: [btn('go', 'показать'), { kind: 'check', name: 'click', label: 'щелчок при встрече' }, sl('when', 'момент щелчка', -200, 200, 0, '% мс', 10)] },
  'ventriloquism-effect': { ratio: 0.4, headphones: true, controls: [btn('play', 'играть'), sl('pan', 'панорама звука', -100, 100, 0, '% %'), { kind: 'hint', label: 'рот можно таскать мышью' }] },
};

export const hasDemo = (key: string | undefined): boolean => !!key && key in DEMOS;
