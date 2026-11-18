/* Line direction and shape. Nearly everything here is one trick: an acute angle in view gets
   opened out a little. Collect enough of those angles along a line and the line drifts. */
import type { Group } from '../ru/types';

export const DIRECTION: Group = {
  'cafe-wall': {
    lede: 'The rows of tiles are parallel. They look like wedges.',
    what: 'Offset rows of light and dark tiles with a thin grey line of mortar between them. The rows splay apart and close in again. Not one of them is tilted.',
    how: [
      'Gregory and Heard showed in 1979 that it comes down to the mortar. The thin grey line gets “locked” to the tile edges and tilts towards them. The locking adds up along the row, and the row drifts.',
      'The key condition is that the mortar’s luminance lies between those of the light and dark tiles. Make the mortar pure white or pure black and the effect disappears completely.',
    ],
    demo: 'cafe-wall',
    demoNote: 'Three controls: row offset, mortar width and mortar luminance. Push the mortar to white or black and watch the illusion die. That is a test of the explanation, not an illustration of it.',
    twist: 'Münsterberg first printed the figure in 1894, in a booklet called Pseudoptics. It only got the name “café wall” in 1979, after the tiled front of a café in Bristol, which a member of Gregory’s lab had noticed. Eighty-five years between the figure and the name. The Bristol wall is still standing.',
  },

  munsterberg: {
    lede: 'The café wall’s ancestor: the same offset rows, without the grey mortar.',
    what: 'Offset chequerboard rows, high contrast, no intermediate grey. The wedge is already there.',
    how: [
      'The same border locking, only weaker. With no mortar of intermediate luminance there is nothing to lock, and the tilt comes from the tiles alone.',
    ],
    demo: 'cafe-wall',
    demoNote: 'This is the café wall with the mortar width set to zero. Pull the slider down to nothing and you have Münsterberg’s figure.',
    twist: 'The catalogue keeps it as a separate entry, and not out of pedantry: the question of priority only makes sense if the earlier figure has a name of its own. In 1898 Pierce called it the “kindergarten illusion”.',
  },

  zollner: {
    lede: 'The long lines are parallel. Short hatching pushes them apart.',
    what: 'Parallel lines are crossed by short oblique strokes. The lines converge and diverge.',
    how: [
      'Orientation contrast between stroke and line: each acute angle opens out slightly, and the line turns a little where it is crossed.',
      'The effect builds along the whole line. A single turn is invisible; the sum is not.',
    ],
    demo: 'zollner',
    demoNote: 'Sliders set the angle and spacing of the hatching. The peak is somewhere around 10–30°, and at 0° and 90° there is no effect at all. Find the limits yourself.',
    twist: 'Zöllner sent the drawing in a letter to Poggendorff, the editor of Annalen der Physik und Chemie. Poggendorff spotted a second illusion in the same drawing, and it now bears his name. One figure, two effects, two surnames.',
  },

  poggendorff: {
    lede: 'A straight line passes behind a bar and comes out on the other side in the wrong place.',
    what: 'An oblique line goes under a wide bar. On the far side its continuation looks shifted, although it lies on the same straight line.',
    how: [
      'The acute angles where the line meets the edges of the bar open out, and the apparent slope of the segments changes.',
      'There is also a depth explanation: the bar reads as an object in front. But the effect survives when the bar is nothing more than two parallel lines with empty space between them, which sits awkwardly with explanations that rest purely on occlusion.',
    ],
    demo: 'poggendorff',
    demoNote: 'Move the right-hand segment with the slider until it lines up with the left one, then reveal the real line. Your error is shown in pixels, and the demo becomes a measurement.',
    twist: 'Poggendorff noticed it in someone else’s drawing: Zöllner’s figure, which he was editing for his journal in 1860.',
  },

  hering: {
    lede: 'Two parallel straight lines bow outwards over a radial fan.',
    what: 'The lines are drawn across rays spreading from a single point. They look curved.',
    how: [
      'Orientation contrast at every crossing, building up along the line: the same mechanism as in the Zöllner figure.',
      'There is another reading. A radial pattern is what you see when moving forward, and Changizi suggests the visual system corrects the geometry in advance for what is about to happen.',
    ],
    demo: 'hering',
    demoNote: 'Drag the slider to change the number of rays. A button flips the figure into the Wundt illusion, the same geometry turned inside out.',
  },

  wundt: {
    lede: 'The same figure turned inside out: the straight lines bow inwards.',
    what: 'Two verticals against lines that converge outside them. The verticals look concave.',
    how: [
      'Angles opening out at the crossings. It is strongest when the lines cross at 10–30°.',
    ],
    demo: 'hering',
    demoNote: 'It shares a renderer with the Hering illusion: one button flips the geometry of the fan.',
    twist: 'Wundt’s 1898 monograph on geometrical-optical illusions is the closest thing to this catalogue that the nineteenth century produced.',
  },

  bourdon: {
    lede: 'A straight edge running along two triangles set tip to tip looks kinked.',
    what: 'Two triangles meet at their tips, with one edge of each lying on the same straight line. At the join it looks bent.',
    how: [
      'The apex angle of the neighbouring wedge skews the perceived slope of the straight edge. The sharper the wedge, the more visible the bend.',
    ],
    demo: 'bourdon',
    demoNote: 'A slider sets the wedge angle, and a button lays a true straight line over the top.',
  },

  'tilt-illusion': {
    lede: 'A grating looks tilted because of what surrounds it.',
    what: 'The central grating looks rotated in the opposite direction to the tilt of the surround.',
    how: [
      'The usual account is inhibition between orientation-tuned cells in V1, which pushes the centre away from the surround when the two differ by a small angle. At large differences the effect reverses into a weaker attraction, and that part is less well explained.',
      'So the relationship is not monotonic: the effect first grows with the angle, then falls and changes sign.',
    ],
    demo: 'tilt-illusion',
    demoNote: 'You control the surround angle, then line up the centre in an adjustment task, and the page tells you your error. Note it down for a range of surround angles and you reproduce the classic curve, repulsion and attraction both.',
  },
};
