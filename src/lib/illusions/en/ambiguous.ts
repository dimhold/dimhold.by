/* Ambiguous figures. One picture, two readings, and neither wins for long. The flipping is
   the obvious part; the interesting part is that you never get both at once, and the
   reading that loses has no shape at all. */
import type { Group } from '../ru/types';

export const AMBIGUOUS: Group = {
  'necker-cube': {
    lede: 'Twelve lines make a cube. Whether you see it from above or from below is not up to the drawing.',
    what: 'A wire-frame cube flips of its own accord: first one face is nearer, then the other. Trying to stop it by willpower mostly fails.',
    how: [
      'A flat drawing like this has exactly two equally good three-dimensional readings. There is nothing to choose between them, so perception goes back and forth.',
      'The switches keep their own pace. One person’s intervals are surprisingly steady, but they differ a great deal from person to person.',
      'Add shading, or let one line pass behind another, and the ambiguity is gone. Now the picture has a right answer.',
    ],
    demo: 'necker-cube',
    demoNote: 'Press the space bar every time it flips. The page plots the distribution of your intervals. That is a real psychophysical measurement, and it took you a minute.',
    twist: 'Necker was a crystallographer and noticed the flip in 1832 while drawing crystals. What he published was a rhomboid, not a cube.',
  },

  'rubin-vase': {
    lede: 'A vase or two profiles. Never both.',
    what: 'The same edge reads either as the side of a vase or as the line of a face. It flips unprompted, but you never get both readings at once.',
    how: [
      'What matters here is the asymmetry more than the switching. Whichever region gets the edge becomes the figure. The other loses its shape entirely and slips behind.',
      'The background is not just the part you are not looking at. At that moment it has no shape.',
    ],
    demo: 'rubin-vase',
    demoNote: 'The vase is built by mirroring the face profile, so the link between the two readings is there in the construction. A slider hands the contour to one side. Move it one way and the vase gets shading and two bands round it; move it the other way and the faces get eyes and shading. In the middle nobody gets it, and the readings change on their own.',
    twist: 'Rubin described this in his 1915 doctoral thesis. The subject of the thesis was the principle behind the picture: how a scene gets split into figure and ground.',
  },

  'figure-ground': {
    lede: 'The visual field is always split into figure and ground. The figure owns the edge; the ground carries on behind it.',
    what: 'The split always happens, and it happens instantly. You can reverse it but you cannot cancel it: the two regions are never both figure at once.',
    how: [
      'Which side gets the edge is settled by cues: convexity, symmetry, closure, area and familiarity. Each pulls its own way, and the sum decides.',
      'This is why the Rubin vase, the coffer illusion and the Benary cross belong to one family, even though they look nothing alike.',
    ],
    demo: 'figure-ground',
    demoNote: 'One slider per cue: convexity, symmetry, area. More useful than yet another ambiguous picture, because you can see how much each cue weighs.',
  },

  'duck-rabbit': {
    lede: 'A duck looking left. Or a rabbit looking right. The bill is the ears.',
    what: 'One drawing, two animals, and it switches without warning.',
    how: [
      'Two equally strong hypotheses about the object sit on the same lines. Where you look, at the bill or at the ears, decides which one wins.',
    ],
    demo: 'duck-rabbit',
    demoNote: 'This is the original drawing from Fliegende Blätter of 23 October 1892. It is out of copyright, and we show it as it is. In the original the bill and the ears both lie level. The slider tilts the drawing: one way the bill points down, like a bird pecking, and the duck wins; the other way the ears stand up, and the rabbit wins. The buttons outline the two prongs that are a bill in one reading and ears in the other.',
    twist: 'Wittgenstein used this drawing to argue that seeing is already interpreting. Nobody has put the point of this whole catalogue better. It first appeared unsigned in Fliegende Blätter on 23 October 1892, under the caption “Which animals are most like each other?”',
  },

  'my-wife-mother-in-law': {
    lede: 'A young woman turned away from you, or an old woman in profile.',
    what: 'The young woman’s ear is the old woman’s eye, and her chin is the old woman’s nose. The same lines play different parts.',
    how: [
      'Two hypotheses share one set of contours, and every feature gets reassigned. What was a piece of jewellery becomes part of a face.',
    ],
    demo: 'my-wife-mother-in-law',
    demoNote: 'There is a button for each reading, and it outlines the same two places as an ear and a chin, or as an eye and a nose. It earns its place: a fair share of people never find the second reading without help.',
    twist: 'In 2018 Nicholls and colleagues found an own-age bias. Younger viewers tend to see the young woman first, older viewers the old one.',
  },

  'spinning-dancer': {
    lede: 'The dancer spins clockwise. Or anticlockwise. Both fit perfectly.',
    what: 'A black silhouette turns, and every so often the direction reverses of its own accord.',
    how: [
      'A silhouette has no overlaps and no shading, nothing that would say what is in front. Structure from motion genuinely has two solutions here.',
    ],
    demo: 'spinning-dancer',
    demoNote: 'The shading slider puts the depth cues back and locks the direction. That one control is what turns a viral image into an explanation.',
    twist: 'The claim that the direction you see shows which side of your brain is dominant is made up. A newspaper invented it in 2007. Of all the falsehoods attached to any illusion in this catalogue, it is the one repeated most often, and it is worth saying so plainly.',
  },

  'schroder-stairs': {
    lede: 'A staircase seen from above, or the same staircase from below, upside down.',
    what: 'The drawing flips in depth: one moment you look down on the steps, the next you are looking at their underside.',
    how: [
      'The perspective is reversible. The same lines describe two opposite orientations of the surface.',
    ],
    twist: 'Sugihara turned it into a physical object. His “3D Schröder Staircase” took first place in the Best Illusion of the Year Contest in 2020, and in that version turning the object through 180° switches the reading.',
  },

  'coffer-illusion': {
    lede: 'Sixteen panelled doors. There are also sixteen circles, and almost nobody sees them at first.',
    what: 'A pattern of rectangular panels. The circles are in it too, drawn with the same strokes, and only a handful of people find them first time.',
    how: [
      'Figure–ground assignment prefers closed rectangles. The circles do not vanish; they lose the competition for ownership of the contours.',
    ],
    demo: 'coffer-illusion',
    demoNote: 'This is our own approximation rather than Norcia’s image: inside each circle the same panel pattern is simply shifted by half a panel, so the circles exist only as seams in the pattern. One button outlines them, and the segment-length slider shifts the balance between the two readings.',
    twist: 'It has gone viral several times, most recently in 2023, and every time without the author’s name. The author is Anthony Norcia, and it was entered in the Best Illusion of the Year Contest in 2006.',
  },

  'dalmatian-hidden-figure': {
    lede: 'Blotches. Then you find the Dalmatian, and you can never unsee it.',
    what: 'A field of black and white blots with nothing recognisable in it. Once you have found the dog, it stops hiding for good.',
    how: [
      'This is closure: perception assembles an object out of scraps. The interesting part is that it cannot be undone. Once found, the organisation is applied automatically from then on.',
      'It is a door that opens one way only. Mooney faces and sine-wave speech work exactly the same way.',
    ],
    demo: 'dalmatian-hidden-figure',
    demoNote: 'We generate the blots from a silhouette rather than using the famous 1965 photograph, which is under copyright. A button draws the dog’s outline, and a stopwatch records how long you searched.',
  },

  'all-is-vanity': {
    lede: 'A lady at her mirror. From across the room, a skull.',
    what: 'A woman sits at a dressing table. Step back or squint, and the whole scene becomes a skull.',
    how: [
      'It works by separating spatial frequencies, as hybrid images do, with a reorganisation of figure and ground on top.',
    ],
    demo: 'all-is-vanity',
    demoNote: 'The blur slider stands in for walking away from the screen. Both cut out the high spatial frequencies. Gilbert’s drawing dates from 1892 and is out of copyright.',
    twist: 'A note from the margins of the catalogue: an automated pass over Wikipedia matched this title to a 2017 music album. It stays in the log as a reminder that mechanical tidying needs a human to check it.',
  },

  'ambiguous-image': {
    lede: 'The umbrella entry: one picture, two or more incompatible readings.',
    what: 'A whole class rather than a single figure. The duck–rabbit, My Wife and My Mother-in-Law, All Is Vanity and Arcimboldo’s heads all belong here.',
    how: [
      'Hypotheses about the object compete for the same evidence. Whichever has more support at the moment wins, and holds on until it tires.',
    ],
  },

  'multistable-perception': {
    lede: 'The stimulus stands still, and what you see keeps changing anyway.',
    what: 'Nothing happens in the outside world, yet what you see flips, unpredictably and with no help from you.',
    how: [
      'Readings compete, the winner tires, and there is noise. Add those three together and you get a characteristic distribution of intervals.',
      'It is close to a gamma distribution, and its shape is the same for very different stimuli, from the Necker cube to binocular rivalry.',
    ],
    demo: 'multistable-perception',
    demoNote: 'Several ambiguous stimuli share one report button, so you can compare your switching rates across them. That comparison is the most interesting part, and almost nobody else offers it.',
    twist: 'It happens outside vision too. Deutsch described ambiguous auditory stimuli, and there are olfactory ones too. So this is a general way the brain works, not a quirk of the visual system.',
  },

  ambigram: {
    lede: 'A word that reads as the same word upside down.',
    what: 'Rotated by 180° or reflected, the lettering gives the same word, or a different one chosen in advance.',
    how: [
      'Letter recognition tolerates a great deal of distortion. That is why a single stroke can satisfy two letter hypotheses at once, in two orientations.',
    ],
    twist: 'Hofstadter coined the term in 1983; the form itself is much older. A set of Cyrillic ambigrams is a rare thing.',
  },
};
