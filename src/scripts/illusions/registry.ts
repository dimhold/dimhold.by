/* Ключ демонстрации → модуль семейства и имя в нём.
 *
 * Семейство грузится одним чанком: внутри него демонстрации делят рисовальщики и
 * вспомогательные функции, а между семействами общего почти нет. Посетитель страницы
 * про кафе-стену не скачивает синтезатор Шепарда.
 */
import type { Mount } from './kit';

type Loader = () => Promise<Record<string, Mount>>;

const geometry: Loader = () => import('./demos/geometry');
const lines: Loader = () => import('./demos/lines');
const lightness: Loader = () => import('./demos/lightness');
const motion: Loader = () => import('./demos/motion');
const contours: Loader = () => import('./demos/contours');
const colourfx: Loader = () => import('./demos/colourfx');
const space3d: Loader = () => import('./demos/space3d');
const stereo: Loader = () => import('./demos/stereo');
const attention: Loader = () => import('./demos/attention');
const cognition: Loader = () => import('./demos/cognition');
const audio: Loader = () => import('./demos/audio');
const photo: Loader = () => import('./demos/photo');

/* [загрузчик семейства, имя экспорта]. Имя отличается от ключа там, где ключ
   с дефисами, — camelCase в модуле и kebab-case в каталоге. */
export const REGISTRY: Record<string, [Loader, string]> = {
  'mueller-lyer': [geometry, 'muellerLyer'],
  ponzo: [geometry, 'ponzo'],
  ebbinghaus: [geometry, 'ebbinghaus'],
  delboeuf: [geometry, 'delboeuf'],
  jastrow: [geometry, 'jastrow'],
  'oppel-kundt': [geometry, 'oppelKundt'],
  sander: [geometry, 'sander'],
  'vertical-horizontal': [geometry, 'verticalHorizontal'],
  'sine-illusion': [geometry, 'sineIllusion'],
  'shepard-tables': [geometry, 'shepardTables'],
  'leaning-tower': [geometry, 'leaningTower'],

  'cafe-wall': [lines, 'cafeWall'],
  zollner: [lines, 'zollner'],
  poggendorff: [lines, 'poggendorff'],
  hering: [lines, 'hering'],
  bourdon: [lines, 'bourdon'],
  'tilt-illusion': [lines, 'tiltIllusion'],
  'fraser-spiral': [lines, 'fraserSpiral'],
  orbison: [lines, 'orbison'],
  'checker-bulge': [lines, 'checkerBulge'],
  'curvature-blindness': [lines, 'curvatureBlindness'],

  'hermann-grid': [lightness, 'hermannGrid'],
  'checker-shadow': [lightness, 'checkerShadow'],
  'simultaneous-contrast': [lightness, 'simultaneousContrast'],
  'mach-bands': [lightness, 'machBands'],
  chevreul: [lightness, 'chevreul'],
  cornsweet: [lightness, 'cornsweet'],
  'koffka-ring': [lightness, 'koffkaRing'],
  'white-illusion': [lightness, 'whiteIllusion'],
  'benary-cross': [lightness, 'benaryCross'],
  'grating-induction': [lightness, 'gratingInduction'],
  asahi: [lightness, 'asahi'],
  'scintillating-grid': [lightness, 'scintillatingGrid'],
  bezold: [lightness, 'bezold'],
  'shaded-diamond': [lightness, 'shadedDiamond'],
  chubb: [lightness, 'chubb'],
  'snake-illusion': [lightness, 'snakeIllusion'],

  barberpole: [motion, 'barberpole'],
  'breathing-square': [motion, 'breathingSquare'],
  enigma: [motion, 'enigma'],
  'frequency-doubling': [motion, 'frequencyDoubling'],
  'kinetic-depth': [motion, 'kineticDepth'],
  'motion-aftereffect': [motion, 'motionAftereffect'],
  'motion-binding': [motion, 'motionBinding'],
  'motion-induced-blindness': [motion, 'motionInducedBlindness'],
  ouchi: [motion, 'ouchi'],
  'peripheral-drift': [motion, 'peripheralDrift'],
  'rotating-snakes': [motion, 'rotatingSnakes'],
  'phi-beta': [motion, 'phiBeta'],
  'pinna-brelstaff': [motion, 'pinnaBrelstaff'],
  'reverse-phi': [motion, 'reversePhi'],
  'roget-palisade': [motion, 'rogetPalisade'],
  'rotating-circles': [motion, 'rotatingCircles'],
  silencing: [motion, 'silencing'],
  'stepping-feet': [motion, 'steppingFeet'],
  ternus: [motion, 'ternus'],
  tusi: [motion, 'tusi'],
  'wagon-wheel': [motion, 'wagonWheel'],

  'kanizsa-triangle': [contours, 'kanizsaTriangle'],
  'ehrenstein-illusion': [contours, 'ehrensteinIllusion'],
  'illusory-contours': [contours, 'illusoryContours'],
  troxler: [contours, 'troxler'],
  'blind-spot-filling': [contours, 'blindSpotFilling'],
  'extinction-illusion': [contours, 'extinctionIllusion'],
  'visual-phantoms': [contours, 'visualPhantoms'],
  'lilac-chaser': [contours, 'lilacChaser'],
  'scintillating-starburst': [contours, 'scintillatingStarburst'],

  'negative-afterimage': [colourfx, 'negativeAfterimage'],
  'benham-top': [colourfx, 'benhamTop'],
  'munker-white': [colourfx, 'munkerWhite'],
  'neon-colour-spreading': [colourfx, 'neonColourSpreading'],
  watercolour: [colourfx, 'watercolour'],
  'colour-phi': [colourfx, 'colourPhi'],
  'colour-constancy': [colourfx, 'colourConstancy'],
  'the-dress': [colourfx, 'theDress'],
  'tilt-aftereffect': [colourfx, 'tiltAftereffect'],
  'emmert-law': [colourfx, 'emmertLaw'],
  'rubin-vase': [colourfx, 'rubinVase'],
  'figure-ground': [colourfx, 'figureGround'],
  'coffer-illusion': [colourfx, 'cofferIllusion'],
  'necker-cube': [colourfx, 'neckerCube'],
  'multistable-perception': [colourfx, 'multistablePerception'],
  pareidolia: [colourfx, 'pareidolia'],

  'shape-from-shading': [space3d, 'shapeFromShading'],
  'crater-illusion': [space3d, 'craterIllusion'],
  'size-constancy': [space3d, 'sizeConstancy'],
  'ames-window': [space3d, 'amesWindow'],
  'ames-room': [space3d, 'amesRoom'],
  anamorphosis: [space3d, 'anamorphosis'],
  'penrose-triangle': [space3d, 'penroseTriangle'],
  'penrose-stairs': [space3d, 'penroseStairs'],
  'impossible-cube': [space3d, 'impossibleCube'],
  'impossible-object': [space3d, 'impossibleObject'],
  blivet: [space3d, 'blivet'],
  'shepard-elephant': [space3d, 'shepardElephant'],
  'peppers-ghost': [space3d, 'peppersGhost'],
  'gravity-hill': [space3d, 'gravityHill'],
  'hybrid-image': [space3d, 'hybridImage'],

  'random-dot-stereogram': [stereo, 'randomDotStereogram'],
  autostereogram: [stereo, 'autostereogram'],
  'binocular-rivalry': [stereo, 'binocularRivalry'],
  chromostereopsis: [stereo, 'chromostereopsis'],

  'change-blindness': [attention, 'changeBlindness'],
  'attentional-blink': [attention, 'attentionalBlink'],
  crowding: [attention, 'crowding'],

  'launching-effect': [cognition, 'launchingEffect'],
  'heider-simmel-animacy': [cognition, 'heiderSimmelAnimacy'],
  stroop: [cognition, 'stroop'],
  'monty-hall': [cognition, 'montyHall'],
  anchoring: [cognition, 'anchoring'],
  'linda-problem': [cognition, 'lindaProblem'],
  'illusion-of-control': [cognition, 'illusionOfControl'],
  'intentional-binding': [cognition, 'intentionalBinding'],
  'drm-false-memory': [cognition, 'drmFalseMemory'],
  'choice-blindness': [cognition, 'choiceBlindness'],
  'bouba-kiki': [cognition, 'boubaKiki'],
  'kappa-effect': [cognition, 'kappaEffect'],
  'oddball-effect': [cognition, 'oddballEffect'],
  'representational-momentum': [cognition, 'representationalMomentum'],
  chronostasis: [cognition, 'chronostasis'],
  'pseudo-haptics': [cognition, 'pseudoHaptics'],
  vection: [cognition, 'vection'],
  somatogravic: [cognition, 'somatogravic'],
  'false-heart-rate-feedback': [cognition, 'falseHeartRateFeedback'],
  'missing-square-puzzle': [cognition, 'missingSquarePuzzle'],
  moire: [cognition, 'moire'],

  'duck-rabbit': [photo, 'duckRabbit'],
  'my-wife-mother-in-law': [photo, 'myWifeMotherInLaw'],
  'all-is-vanity': [photo, 'allIsVanity'],
  'lincoln-effect': [photo, 'lincolnEffect'],
  'grey-strawberries': [photo, 'greyStrawberries'],
  'mooney-faces': [photo, 'mooneyFaces'],
  thatcher: [photo, 'thatcher'],
  'face-inversion': [photo, 'faceInversion'],

  'shepard-tone': [audio, 'shepardTone'],
  'risset-rhythm': [audio, 'rissetRhythm'],
  'pitch-circularity': [audio, 'pitchCircularity'],
  'tritone-paradox': [audio, 'tritoneParadox'],
  'octave-illusion': [audio, 'octaveIllusion'],
  'scale-illusion': [audio, 'scaleIllusion'],
  'glissando-illusion': [audio, 'glissandoIllusion'],
  'precedence-effect': [audio, 'precedenceEffect'],
  'binaural-beats': [audio, 'binauralBeats'],
  'missing-fundamental': [audio, 'missingFundamental'],
  'tartini-tone': [audio, 'tartiniTone'],
  'illusory-continuity-tones': [audio, 'illusoryContinuityTones'],
  'zwicker-tone': [audio, 'zwickerTone'],
  'sound-induced-flash': [audio, 'soundInducedFlash'],
  'stream-bounce': [audio, 'streamBounce'],
  'ventriloquism-effect': [audio, 'ventriloquismEffect'],
};
