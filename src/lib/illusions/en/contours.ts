/* Contours and filling-in. Vision records edges and makes up the inside. Usually you never
   notice. Collected here are the cases where it fills in something that is not there, or
   fails to fill in something that is. */
import type { Group } from '../ru/types';

export const CONTOURS: Group = {
  'kanizsa-triangle': {
    lede: 'A white triangle with sharp edges. It is not in the picture.',
    what: 'Three black discs with wedges cut out of them. Between them sits a pale triangle, brighter than the page, with a clear edge. The image contains neither the edge nor the triangle.',
    how: [
      'Vision completes a contour wherever the notches can be explained by something lying in front. One shape on top is a simpler story than three discs that happen to have bites taken out in just the right places.',
      'The triangle also picks up depth and lightness: it looks nearer than the background and brighter. The page underneath has not gone anywhere. It is the same white paper.',
      'The visual cortex has cells that respond to an illusory contour much as they do to a real one. That is not a figure of speech. For those cells, the contour exists.',
    ],
    demo: 'kanizsa-triangle',
    demoNote: 'A slider rotates the notches. At a certain misalignment the triangle vanishes entirely, with exactly the same amount of black on screen. A button measures the luminance inside the figure and outside it: the numbers are identical.',
    twist: 'Kanizsa published the figure in 1955, but the first illusory figure with a contour is Schumann’s, from 1900. That is a gap of fifty-five years, and popular accounts never mention it.',
  },

  'illusory-contours': {
    lede: 'The umbrella entry: an edge where neither brightness nor colour changes at all.',
    what: 'The whole class: the Kanizsa triangle, the Ehrenstein figure, Schumann’s figure, Varin’s figure, abutting gratings. They all work the same way.',
    how: [
      'Early visual cortex completes the boundary, prompted by aligned line ends and by cues that something lies in front.',
      'Cells in V1 and V2 respond to such a contour as they do to a real one, so the contour is put together very early, before any object has been recognised.',
    ],
    demo: 'illusory-contours',
    demoNote: 'A showcase rather than a single demo: the Kanizsa triangle, the Ehrenstein figure, Schumann’s figure, Varin’s figure and abutting gratings, picked from a menu one at a time. One slider works on all five. For Kanizsa and Ehrenstein it sets how much of each edge is actually drawn; for Schumann, the thickness of the strokes; for Varin, the size of the four bullseyes; for the gratings, how dense the lines are. You can see they are one family.',
  },

  'ehrenstein-illusion': {
    lede: 'The rays stop short of the centre, and a bright disc with an edge appears there.',
    what: 'Radial lines break off before they meet. In the gap between them you see a disc brighter than the page, and it has a boundary.',
    how: [
      'The illusory contour is built from line ends. Vision explains the breaks by assuming something is lying on top.',
      'Colour the inner ends of the lines and you get neon colour spreading. It is literally the same figure, translated into colour.',
    ],
    demo: 'ehrenstein-illusion',
    demoNote: 'You set the size of the gap and the number of lines. A switch recolours the inner segments and turns the figure into neon spreading, so the kinship is right there on the screen.',
    twist: 'Mind the name. There is also the “Ehrenstein square”, a different distortion in a different category. The catalogue keeps the two apart, because otherwise it looks like a duplicate. And that is not the only mix-up around Ehrenstein: his 1941 paper was about the Hermann grid, and the catalogue itself once cited the wrong work.',
  },

  troxler: {
    lede: 'Stare at one point without moving your eyes. Whatever is off to the side stops existing.',
    what: 'Keep your eyes on the cross. A blurry coloured patch to one side fades within a few seconds and disappears completely. Blink or look away and it comes back.',
    how: [
      'Vision is built on change. A signal that does not change stops being passed on: the neurons adapt, and there is nothing left to report.',
      'Normally it never gets that far. The eye makes constant tiny movements, so the image on the retina never stands still. The illusion shows what happens when those movements are not enough.',
      'The blurred edge is essential. A sharp boundary resists fading, because it always has something to report.',
    ],
    demo: 'troxler',
    demoNote: 'A stopwatch shows how long you held your gaze before the patch vanished. The edge-softness slider is the real test: with a sharp edge the patch almost never fades.',
    twist: 'One of the few illusions where something disappears rather than appears. Gregory’s classification has no slot for it. His four kinds cover “an extra reading”, “a wrong value”, “the impossible” and “something from nothing”, but not “nothing from something”. The catalogue thought it had found a gap. It had not: the class was described long ago. Kim and Blake (2005) survey it among the ways of making the visible invisible, and Weil and Rees (2011) go further and treat Troxler fading as a kind of filling-in, the same event seen from the side of the background rather than the patch.',
  },

  'blind-spot-filling': {
    lede: 'Each of your eyes has a hole in it. You have never seen it.',
    what: 'Where the optic nerve leaves the retina there are no receptors. The hole is not black and not grey. It is simply absent from what you see.',
    how: [
      'The spot is actively painted over with whatever surrounds it: texture, colour, the continuation of a line. It is drawn in rather than ignored.',
      'This is easy to check. Put your blind spot over a gap in a line and the line joins up. Put it over a chequered background and the pattern carries on.',
    ],
    demo: 'blind-spot-filling',
    demoNote: 'A cross, and to its right a single dot, a gap in a line, or a hole in a chequered background. Close your left eye, look at the cross with your right, and move towards or away from the screen until the target falls into the blind spot. There is no ruler and no set viewing distance: a slider moves the two marks apart or together to suit your screen and how far you sit from it.',
    twist: 'Mariotte described it in 1668. It is the oldest reference in the catalogue that anyone can turn into a working demonstration in thirty seconds.',
  },

  'extinction-illusion': {
    lede: 'Twelve black dots. You cannot hold on to more than three or four at once.',
    what: 'Twelve dots sit at the crossings of a grey grid. You always see a few. The rest vanish.',
    how: [
      'Two things combine here: crowding in the periphery and filling-in. Outside the fovea, the grid texture is completed right over the dots.',
    ],
    demo: 'extinction-illusion',
    demoNote: 'Sliders change the number of dots and the contrast of the grid. The page tells you how many dots are drawn; how many you can hold at once is for you to count. With twelve, the answer is never twelve.',
    twist: 'It went viral in 2016 as the “twelve dot illusion”, without a single mention of who made it. Ninio and Stevens, 2000. That is exactly the problem this catalogue was put together to fix.',
  },

  'visual-phantoms': {
    lede: 'The grating carries on across the empty strip. The strip is empty.',
    what: 'A moving grating is cut by a blank strip. A faint ghost of the same grating drifts across it.',
    how: [
      'Vision completes the surface across an occluder. What decides it is not motion as such but brightness and contrast: the phantom needs a low spatial frequency and a slow drift.',
    ],
    demo: 'visual-phantoms',
    demoNote: 'You control the width of the strip, the frequency of the grating and its speed. The phantom lives in a narrow window, and it is worth feeling out the edges of that window yourself.',
    twist: 'Rosenbach described it in 1902. It got its name seventy-three years later, from Tynan and Sekuler. In this catalogue a gap like that is nothing unusual.',
  },
};
