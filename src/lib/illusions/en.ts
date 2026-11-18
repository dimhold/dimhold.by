/* English copy for the illusions section. Written by hand in English, one language at a
 * time, not translated from the Russian: the Russian text is the brief, not the source.
 * Same split by group as ru/, same keys. An entry missing here falls back to a stub that
 * still shows the first mention and the sources. */

import type { Copy } from './ru/types';
import { MOTION } from './en/motion';
import { BRIGHTNESS } from './en/brightness';
import { OPTICS } from './en/optics';
import { SIZE } from './en/size';
import { AMBIGUOUS } from './en/ambiguous';
import { DEPTH } from './en/depth';
import { COLOUR } from './en/colour';
import { IMPOSSIBLE } from './en/impossible';
import { DIRECTION } from './en/direction';
import { CONTOURS } from './en/contours';
import { FACES } from './en/faces';
import { BINOCULAR } from './en/binocular';
import { ATTENTION } from './en/attention';
import { AUDITORY } from './en/auditory';
import { TOUCH } from './en/touch';
import { COGNITIVE } from './en/cognitive';
import { CROSSMODAL } from './en/crossmodal';
import { MISC } from './en/misc';

export const EN: Record<string, Copy> = {
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
