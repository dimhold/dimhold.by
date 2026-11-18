/* Colour and afterimages. Colour belongs neither to the light nor to the surface. It is an
   answer to “what paint is this, under light I can’t see?”, and that question has no
   answer without assumptions. The illusions here are the places where the assumption shows. */
import type { Group } from '../ru/types';

export const COLOUR: Group = {
  'colour-constancy': {
    lede: 'A sheet of white paper stays white under a tungsten bulb, at midday and in shade. The light coming off it could hardly be more different.',
    what: 'Not an illusion but an ability, and the one that makes everything else in this group work.',
    how: [
      'Land proposed the retinex theory: lightness is worked out separately in each wavelength band, by comparing each patch with the rest of the scene, so only relative values count.',
      'The consequence is that the system reports on the surface, whatever light happened to reach the eye. Colour is inferred, never measured.',
    ],
    demo: 'colour-constancy',
    demoNote: 'Five painted patches and a physically meaningful illumination slider. The paint stays the same across the whole range and only the light changes, yet you go on naming the colours correctly. The gap between the pixels and what you name is the system at work.',
  },

  'the-dress': {
    lede: 'One photograph. About half of us see white and gold, the other half blue and black.',
    what: 'A dress in a 2015 snapshot. People disagree about its colour, consistently, and nobody can switch sides at will.',
    how: [
      'The lighting in the photo is ambiguous. If you assume cool daylight, you subtract the blue and see white and gold. If you assume warm artificial light, you subtract the yellow and see blue and black.',
      'This is the same colour constancy that works flawlessly every day. Here it has no data to choose with, so it falls back on the viewer’s habits.',
    ],
    demo: 'the-dress',
    demoNote: 'We cannot reproduce the photograph; it is under copyright. So this shows the mechanism instead of the snapshot: our own fabric under a slider that moves the lighting from a tungsten bulb to an overcast sky, while the colours of the fabric itself stay fixed and only the light falling on it changes. The photograph shows the effect. The demo explains it.',
    twist: 'The split correlates with chronotype: larks, who have seen more daylight, say white and gold more often. The dress did more for public understanding of individual differences in perception than all the literature before it.',
  },

  'grey-strawberries': {
    lede: 'There is not a single red pixel in the picture. The strawberries are red.',
    what: 'An image under a heavy cyan cast. The berries look unmistakably red, although the hue of every pixel sits in the blue-green range.',
    how: [
      'The cyan is put down to the lighting and subtracted. What remains is what strawberries ought to be, and that is what they look like.',
    ],
    demo: 'grey-strawberries',
    demoNote: 'The still life is by Jacob van Hulsdonck, c. 1620, released under CC0 by the National Gallery of Art. The cyan cast is applied pixel by pixel in your browser and the red channel is pulled down, and the colour picker confirms it: hover anywhere and read the numbers.',
    twist: 'A good companion to the dress. Here constancy does its job; there it splits the population in two.',
  },

  'negative-afterimage': {
    lede: 'Stare at a red patch, then at a white wall. The patch will be green.',
    what: 'After you have stared at a coloured field for a while, a patch of the complementary colour appears on a blank background.',
    how: [
      'The classic explanation: photoreceptors and opponent channels tire, and the balance tips the other way.',
      'But it is not only the retina. The colour of the afterimage depends on contours shown after the adaptation, and the retina cannot know about contours that have not appeared yet.',
    ],
    demo: 'negative-afterimage',
    demoNote: 'A fixation dot, a twenty-second timer, a red disc, then white. A menu adds a contour, a circle or a square, that appears only after the adaptation: the idea behind van Lier’s version, though with a single red disc the page cannot show a contour choosing between colours.',
  },

  'colour-dove': {
    lede: 'The colour of an afterimage is set by a contour shown after the adaptation.',
    what: 'The same multicoloured image leaves afterimages of different colours, depending on which contour is shown next.',
    how: [
      'Afterimage colour is assigned to surfaces bounded by contours. If the contour arrives later, the colour gets distributed later too.',
    ],
    demo: 'negative-afterimage',
    demoNote: 'This entry borrows the ordinary afterimage demo, where a contour picked from a menu appears after the adaptation. The adapting image there is a single red disc rather than a multicoloured one, so it shows the principle, not the dove itself.',
    twist: 'A strong argument against thinking of an afterimage as simple residue left on the retina.',
  },

  mccollough: {
    lede: 'A few minutes of adaptation, and black-and-white gratings take on colour. Sometimes for months.',
    what: 'After you have watched a red horizontal grating alternate with a green vertical one, black-and-white gratings pick up the complementary tint, each according to its orientation.',
    how: [
      'What adapts are cells tuned to colour and orientation at once, somewhere in early visual cortex.',
      'Ordinary adaptation wears off in seconds. This lasts vastly longer, which is why it is explained as learning with error correction rather than fatigue.',
    ],
    caution: 'In 1975 Jones and Holding measured an aftereffect that lasted for months after long adaptation. That is why this page has no demonstration of it: a version that is fair to try would need a time limit and explicit consent.',
    twist: 'Celeste McCollough published the effect in Science in 1965. It took two pages.',
  },

  'benham-top': {
    lede: 'A black and white top. Spin it, and colours appear.',
    what: 'The disc has only black ink and white paper on it. When it spins, distinct coloured arcs show up.',
    how: [
      'The three cone pathways respond to flicker at different speeds. A black and white pattern with the right rhythm knocks them out of balance, and the result is read as hue.',
    ],
    demo: 'benham-top',
    demoNote: 'Drag the slider to set the speed. The rotation follows the real frame timestamps rather than a fixed step, otherwise every screen would give a different result. Your screen’s refresh rate does affect what you see here, and the page says so. A button reverses the spin.',
    twist: 'The colours differ between people and swap places when the spin is reversed. It is one of the clearest cases of an illusion that is different for everyone. Priority is disputed: Prévost’s observation in 1826, Fechner’s analysis in 1838, Benham’s top in 1894.',
  },

  'munker-white': {
    lede: 'Balls of the same colour look different. The colour picker says otherwise.',
    what: 'Identical coloured balls or stripes under a grid of differently coloured lines read as completely different shades.',
    how: [
      'This is chromatic assimilation: colour is pulled towards the pattern laid over it. It is the colour twin of White’s illusion.',
    ],
    demo: 'munker-white',
    demoNote: 'The colour picker is not optional. Hover over any pixel and you get its true values; without a measurement this illusion is just a claim. A slider sets the spacing of the stripes.',
    twist: 'The viral image of 2019, a grey photo with coloured lines that looks fully in colour, is the same thing.',
  },

  'neon-colour-spreading': {
    lede: 'Colour leaks past the lines and fills a circle that is not there.',
    what: 'A few segments of a black lattice are replaced with coloured ones. The colour seems to glow and spread across a transparent disc that nobody drew.',
    how: [
      'The spreading is contained by an illusory contour, the edge of a disc that does not exist in the image.',
      'A second reading: the disc is seen as a transparent coloured film lying over the lattice. Then both the spreading and the glow follow from the transparency.',
      'The effect lives in a narrow window of contrast between the coloured and black segments and collapses outside it.',
    ],
    demo: 'neon-colour-spreading',
    demoNote: 'A slider sets the luminance of the coloured segments. The window is narrow, and finding its edge yourself is worth the trouble.',
  },

  watercolour: {
    lede: 'A wiggly line tints the whole region inside it. Faintly, but over a large area.',
    what: 'A white region is outlined with a bright wiggly line, flanked on the outside by a darker one. The whole interior picks up a pale tint of the bright line.',
    how: [
      'The colour spreads from the inner edge across the whole surface. At the same moment the region stops being a hole and becomes a figure; the two effects go together.',
      'It is the pair of lines that decides, not the region. Swap them, and the outside gets tinted instead.',
    ],
    demo: 'watercolour',
    demoNote: 'A wavy contour in two colours, purple and orange, with a slider for how wavy it is. A button swaps the two colours, which flips the region that gets tinted, and that is the cleanest way to show the effect belongs to the pair of edges.',
    twist: 'Unusually robust for a colour illusion: the tint is pale, but it holds even when you look straight at it.',
  },

  'colour-phi': {
    lede: 'A red dot travels to a green one and changes colour halfway, before the green one has lit up.',
    what: 'A red dot flashes, then a green one nearby. You see a single dot that moved across and changed colour on the way.',
    how: [
      'The percept is put together after both stimuli have arrived. There is no other way to describe what is seen: the colour changes before the event that caused the change.',
      'Dennett used exactly this case to argue that there is no single moment at which perception “happens”.',
    ],
    demo: 'colour-phi',
    demoNote: 'You set the gap between the flashes. The window is narrow, so the page measures how long a frame lasts on your screen and shows it in milliseconds: the interval can be no more precise than that.',
    twist: 'The most philosophically loaded entry in the catalogue. It is hard to describe without saying the brain reported the future.',
  },

  'purkinje-shift': {
    lede: 'At dusk, red flowers go black before blue ones do.',
    what: 'As the light fades, red darkens faster than blue, and peak sensitivity moves towards the short wavelengths.',
    how: [
      'It is a changing of the guard: cone vision, peaking around 555 nm, hands over to rod vision, peaking around 507 nm.',
    ],
    twist: 'This is why instrument lighting in submarines and aircraft cockpits is red: it barely disturbs the rods’ dark adaptation. A bright screen cannot show this properly; better to go out at dusk and look for yourself. Purkinje described the effect in 1825, from watching colours emerge at dawn.',
  },
};
