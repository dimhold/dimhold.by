/* Беларускія тэксты раздзела. Пішуцца рукамі, па-беларуску, а не перакладаюцца з
 * рускай: рускі тэкст тут заданне, а не арыгінал. Падзел па групах той жа, што ў ru/,
 * ключы тыя ж. Запіс без тэксту ўсё роўна трапляе ў каталог з першакрыніцай. */

import type { Copy } from './ru/types';
import { MOTION } from './be/motion';
import { BRIGHTNESS } from './be/brightness';
import { OPTICS } from './be/optics';
import { SIZE } from './be/size';
import { AMBIGUOUS } from './be/ambiguous';
import { DEPTH } from './be/depth';
import { COLOUR } from './be/colour';
import { IMPOSSIBLE } from './be/impossible';
import { DIRECTION } from './be/direction';
import { CONTOURS } from './be/contours';
import { FACES } from './be/faces';
import { BINOCULAR } from './be/binocular';
import { ATTENTION } from './be/attention';
import { AUDITORY } from './be/auditory';
import { TOUCH } from './be/touch';
import { COGNITIVE } from './be/cognitive';
import { CROSSMODAL } from './be/crossmodal';
import { MISC } from './be/misc';

export const BE: Record<string, Copy> = {
  ...MOTION,
  ...BRIGHTNESS,
  ...OPTICS,
  ...SIZE,
  ...AMBIGUOUS,
  ...DEPTH,
  ...COLOUR,
  ...IMPOSSIBLE,
  ...DIRECTION,
  ...CONTOURS,
  ...FACES,
  ...BINOCULAR,
  ...ATTENTION,
  ...AUDITORY,
  ...TOUCH,
  ...COGNITIVE,
  ...CROSSMODAL,
  ...MISC,
};
