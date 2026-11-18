/* Two eyes. Stereo vision works out depth from the mismatch between two images, and it
   does so before anything in those images has been recognised. Julesz proved that in
   1960, and the whole group circles around his result. */
import type { Group } from '../ru/types';

export const BINOCULAR: Group = {
  'random-dot-stereogram': {
    lede: 'Two fields of random dots. Nothing in either. Together, a shape hanging in depth.',
    what: 'The two images differ only in one rectangular patch, shifted by a few dots in one of them. On their own they are noise. Together they show a square floating above the background.',
    how: [
      'Stereo vision works on the raw disparity between the eyes, before any shape has been recognised.',
      'This is the decisive twentieth-century result on depth: you do not have to see a shape first in order to see it in depth.',
    ],
    demo: 'random-dot-stereogram',
    demoNote: 'Generated on a canvas. Two fields side by side for free fusion, a slider for how far the patch is shifted, and an anaglyph mode for red-blue glasses. A button outlines the shifted patch and proves that a single eye sees nothing there.',
  },

  autostereogram: {
    lede: 'One picture made of repeating texture. Let your eyes go out of focus and it turns out to have depth.',
    what: 'A flat field of pattern assembles into a three-dimensional scene once your eyes converge somewhere other than the page.',
    how: [
      'The horizontal repeat period of the texture encodes disparity. Your eyes pair up the wrong repeat, and the mistake comes out as depth.',
    ],
    demo: 'autostereogram',
    demoNote: 'Generated on the page from our own depth map, a cone in the middle. The algorithm is short, so the code is entirely our own. A slider sets the repeat period, a switch chooses between diverging and crossing your eyes, and a pair of guide dots sits at the top: without them a fair number of people never manage to fuse the image.',
    twist: 'Roughly one person in ten can never fuse an autostereogram at all. It is usually dated to 1990, the year the paper appeared; Tyler and Clarke made the first one in 1979.',
  },

  'binocular-rivalry': {
    lede: 'Show each eye a different picture and they do not blend. They take turns.',
    what: 'Horizontal stripes to the left eye, vertical to the right. You see one, then the other, endlessly.',
    how: [
      'The two monocular representations compete, and the contest is settled moment by moment.',
      'That is where all its research value lies. Both images sit on the retinas the whole time, yet you are aware of them in turns. Nobody has yet found a better way to separate “what reached the eye” from “what was seen”.',
    ],
    demo: 'binocular-rivalry',
    demoNote: 'You need either free fusion or an anaglyph, and a browser can do both: two striped fields side by side, or one overlaid in red and cyan for red-blue glasses. Hold the space bar for as long as only one picture is visible. Each hold goes into a histogram, and its shape is worth comparing with your own Necker cube.',
    twist: 'First described by Giambattista della Porta in 1593. The catalogue first filed it under ambiguous figures and later moved it here. Rivalry is still a kind of ambiguity, but its cause is different, and one heading cannot say both.',
  },

  chromostereopsis: {
    lede: 'Red on black comes forward, blue sinks back. For some people it is the other way round.',
    what: 'Saturated red and blue shapes on a dark background sit at different depths. Usually the red is nearer.',
    how: [
      'The eye’s chromatic aberration focuses red and blue differently, and the pupil is offset from the optical axis. Together they produce a real disparity between the two eyes.',
      'So the depth is real enough: it is computed by the same machinery as ordinary stereo depth, only this time from aberration.',
    ],
    demo: 'chromostereopsis',
    demoNote: 'Red and blue words on black, a slider for saturation and another for background brightness, which can flip the depth order. Ask whoever is next to you which way round they see it: a surprising number of people see it reversed, and that is interesting in itself.',
  },

  pulfrich: {
    lede: 'A pendulum swings in a plane. Cover one eye with a dark lens and it swings in an ellipse.',
    what: 'An ordinary pendulum, going back and forth in a single plane, starts tracing a loop.',
    how: [
      'The darkened eye is slower, so its signal arrives late. The brain combines the current image from one eye with a slightly stale one from the other.',
      'The result is a genuine disparity, and the depth is computed from it by the book. Nothing here is a trick of the mind. It is the right answer to the wrong input.',
    ],
    twist: 'A rare case where seeing it for yourself needs a physical object: a dark lens from a pair of sunglasses, which is why this page has no demonstration of it. Pulfrich published the effect in 1922, but the explanation came from Fertsch. By then Pulfrich had lost the sight of one eye and could not see his own illusion.',
  },

  'convergence-micropsia': {
    lede: 'Converge your eyes more than the distance calls for, and the world turns into a toy.',
    what: 'Objects look smaller. This is why scenes in autostereograms often look miniature.',
    how: [
      'Vergence is itself a distance signal. Extra convergence means “nearer”, and something nearer with the same angular size has to be smaller.',
    ],
    twist: 'Wheatstone described it in 1852, in the second part of the series whose first part, in 1838, introduced his stereoscope.',
  },
};
