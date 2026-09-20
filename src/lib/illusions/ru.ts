/* Русские тексты раздела. Пишутся руками, по одному языку за раз.
 *
 * В досье исследования поля `effect` и `mechanism` — английские рабочие заметки, и они
 * сюда не переносятся. Машинный перевод текста о восприятии читается как машинный
 * перевод текста о восприятии, а раздел про обман зрения не должен начинаться с обмана
 * читателя.
 *
 * Разбито по группам: одним файлом на двести пятьдесят записей пользоваться невозможно.
 * Группы примерно совпадают с категориями каталога, а `misc` собирает те категории,
 * в которых по одной-пять записей.
 *
 * Запись без текста здесь всё равно попадает в каталог: у неё есть имя, категория и
 * первоисточник. Ей просто нечего пока рассказать.
 */
import type { Copy } from './ru/types';
import { MOTION } from './ru/motion';
import { BRIGHTNESS } from './ru/brightness';
import { OPTICS } from './ru/optics';
import { SIZE } from './ru/size';
import { AMBIGUOUS } from './ru/ambiguous';
import { DEPTH } from './ru/depth';
import { COLOUR } from './ru/colour';
import { IMPOSSIBLE } from './ru/impossible';
import { DIRECTION } from './ru/direction';
import { CONTOURS } from './ru/contours';
import { FACES } from './ru/faces';
import { BINOCULAR } from './ru/binocular';
import { ATTENTION } from './ru/attention';
import { AUDITORY } from './ru/auditory';
import { TOUCH } from './ru/touch';
import { COGNITIVE } from './ru/cognitive';
import { CROSSMODAL } from './ru/crossmodal';
import { MISC } from './ru/misc';

export type { Copy };

export const RU: Record<string, Copy> = {
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
