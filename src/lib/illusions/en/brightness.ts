/* Lightness and contrast. This group is where the longest-running argument in perception
   science is fought: is lightness worked out early, by neighbouring cells inhibiting each
   other, or late, as a guess about what the surface is and how it is lit? The illusions
   below are the evidence both sides keep reaching for. */
import type { Group } from '../ru/types';

export const BRIGHTNESS: Group = {
  'checker-shadow': {
    lede: 'Square A and square B are printed in the same grey.',
    what: 'A checkerboard with a cylinder casting a shadow across it. A light square inside the shadow and a dark square out in the light are the same grey on the page. You won’t believe it until you cover up everything else.',
    how: [
      'Vision doesn’t report how bright something is. It reports reflectance: what the paint is. How much light happens to be coming off it right now is another matter.',
      'To get there it has to subtract the lighting. The system sees the shadow, discounts it, and gets the paint right. It isn’t making a mistake. It is solving a harder problem, and solving it correctly.',
      'Adelson was firm on this point: calling it an error means missing what vision is for in the first place.',
    ],
    demo: 'checker-shadow',
    demoNote: 'Follow the strip of the same grey that runs from A to B. While it joins them, the match is obvious. Take it away and the match becomes impossible again.',
    twist: 'The first record is a web page: Adelson’s, at MIT, in 1995. The catalogue has a fair few sources like that by now, and a modern illusion is as likely to be born on a website as in a journal.',
  },

  'hermann-grid': {
    lede: 'Grey smudges at the crossings. Everywhere except where you’re looking.',
    what: 'A grid of white bars on black. Grey blobs appear at the intersections. Look straight at one and it vanishes, while the ones around it show up.',
    how: [
      'The textbook explanation is lateral inhibition in the retina: a receptive field sitting on an intersection gets more light from its surround than one sitting on a bar, so it is inhibited more. Baumgartner, 1960.',
      'That explanation is wrong, yet it has survived in textbooks for decades. Make the bars wavy and the blobs disappear, even though everything a receptive field would measure stays the same. Concentric receptive fields can’t account for that.',
      'The current suspect is orientation-tuned cells in the cortex. A wavy bar is no longer a straight line, so they have nothing to pick up.',
    ],
    demo: 'hermann-grid',
    demoNote: 'Flip the switch to make the streets wavy. That switch is the point of the demo: the blobs go, and the standard explanation goes with them.',
    twist: 'Hermann spotted the effect in 1870, outside the lab, on a page of Chladni figures in the German edition of Tyndall’s Sound that he was reading.',
  },

  'simultaneous-contrast': {
    lede: 'The same grey looks lighter on a dark background than on a light one.',
    what: 'Two identical squares on different backgrounds. The difference is instant, and knowing about it changes nothing.',
    how: [
      'Hering’s explanation: neighbouring patches of retina inhibit each other. This is low-level machinery.',
      'Helmholtz’s explanation: the eye infers how the surface is lit and what it really is. That is high-level processing.',
      'The two traditions have been arguing for a century and a half, and almost every entry in this group is a point made for one side or the other.',
    ],
    demo: 'simultaneous-contrast',
    demoNote: 'A slider sets the grey, and both squares always get the same value. The button puts a third square of that grey right on the border between the backgrounds. It belongs to both at once and can’t settle on a lightness, though its grey is the same to the last level.',
    twist: 'Chevreul was taken on at the Gobelins tapestry works to deal with a complaint about the dyes: the black wool didn’t look black enough. He found that the dyers weren’t to blame. The neighbouring threads were. Then he wrote a book the Impressionists later read.',
  },

  'mach-bands': {
    lede: 'Where a smooth ramp meets a flat field, bands appear. They aren’t in the image.',
    what: 'Brightness rises smoothly, then levels off abruptly into a flat field. There is a light band on the bright side of the join and a dark band on the dark side.',
    how: [
      'Lateral inhibition boosts the second derivative of the luminance profile, so it picks out the places where the slope changes.',
      'There is an empirical account too: in nature, profiles like this are mostly produced by edges, so perception reports what such a picture usually turns out to be, not the picture itself.',
    ],
    demo: 'mach-bands',
    demoNote: 'Check the real luminance profile under the image, computed from the same numbers that draw it. Where your eye insists on a band, the profile is a straight line.',
    twist: 'Radiologists are specifically warned about Mach bands: at the edge of a dense structure they can read as a fracture or tooth decay that isn’t there.',
  },

  chevreul: {
    lede: 'A staircase of flat grey stripes looks fluted.',
    what: 'Each stripe is a single grey. Yet each seems to brighten along the edge that faces its darker neighbour.',
    how: [
      'It is the Mach band mechanism again, applied to each step separately.',
    ],
    demo: 'chevreul',
    demoNote: 'Set the number of steps with the slider, then use the mask to hide everything except one stripe. Under the mask the stripe is flat.',
  },

  cornsweet: {
    lede: 'Two halves of the same grey. Put a finger over the join and they match.',
    what: 'Left and right are the same grey, but they look different. The whole difference comes from a narrow gradient on the border between them.',
    how: [
      'Information about edges spreads into the flat regions. Vision encodes the boundaries and fills in the rest.',
      'Image compression saves space on the same principle, as it happens, and for the same reason nobody notices the swap.',
    ],
    demo: 'cornsweet',
    demoNote: 'A slider widens a cover over the central gradient until the two halves look the same. A button measures both halves: they were equal all along.',
    twist: 'Priority is disputed. Cornsweet published it in 1970, but Craik had seen it in the 1940s and O’Brien in 1958. The literature uses all three names, in various combinations.',
  },

  'koffka-ring': {
    lede: 'A ring of even grey. Cut it in two and the halves drift apart in lightness.',
    what: 'The ring sits on a background that is light on the left and dark on the right. While the ring is whole, it looks even. Split it with a gap and the two halves stop matching.',
    how: [
      'Grouping sets the frame of reference. One object gets one lightness; two objects get two, each judged against its own surroundings.',
    ],
    demo: 'koffka-ring',
    demoNote: 'Open the gap gradually with the slider. Watching the lightness come apart as the gap widens is far more convincing than two separate pictures.',
  },

  'white-illusion': {
    lede: 'Identical grey patches in a grating look different, and the wrong way round for contrast.',
    what: 'Identical grey rectangles are set into the black bars and the white bars of a grating. The one in a black bar looks lighter, although most of its border is white and contrast ought to darken it.',
    how: [
      'The belongingness account: a patch takes its lightness from the bar it appears to be part of, whatever surrounds it.',
      'The filtering account: Blakeslee and McCourt reproduced the effect with multiscale spatial filters, with no grouping at all.',
      'It isn’t settled. Longer patches make the effect stronger, and that observation is what the two theories are arguing over.',
    ],
    demo: 'white-illusion',
    demoNote: 'Change the length of the patches with the slider. That is the very quantity in dispute; the catalogue lets you see it and leaves the verdict open.',
    twist: 'It is the most useful test case in the whole theory of lightness, because it goes the wrong way.',
  },

  'benary-cross': {
    lede: 'Two identical triangles on a cross. Same surroundings, different lightness.',
    what: 'A black cross with two grey triangles. Their immediate neighbours are the same for both. They look different.',
    how: [
      'One triangle reads as part of the cross, the other as part of the background. Belonging decides the matter; touching doesn’t.',
      'The objection: coarse spatial filtering reproduces the difference without grouping anything.',
    ],
    demo: 'benary-cross',
    demoNote: 'Press the button to lift the triangles off the cross and onto a plain field. The difference collapses.',
    twist: 'It is a clean case for the belongingness argument: the local surround is equalised by construction, so there’s nothing to argue about there.',
  },

  'dungeon-illusion': {
    lede: 'Identical discs in two lattices. The difference depends on what they’ve grouped with.',
    what: 'Grey discs inside lattices of bars differ noticeably in lightness, and what surrounds them doesn’t explain it.',
    how: [
      'Double anchoring: lightness is worked out within a perceptual group. Distant luminances count only when the grouping lets them in.',
    ],
    twist: 'The catalogue found this one only through a German-language index. It isn’t in the English lists the project started from.',
  },

  'grating-induction': {
    lede: 'A flat grey strip laid across a grating grows a grating of its own.',
    what: 'A strip of uniform grey runs across a sinusoidal grating. A matching grating appears in it, in counterphase. There is no variation in luminance inside the strip at all.',
    how: [
      'The surrounding grating induces contrast in the strip, and the effect is tuned to spatial frequency.',
      'This is the case multiscale filters handle best, which is why it sits alongside White’s illusion and the Benary cross.',
    ],
    demo: 'grating-induction',
    demoNote: 'Use the sliders for grating frequency and strip height, and keep an eye on the luminance profile of the strip drawn underneath: it stays flat.',
  },

  asahi: {
    lede: 'The white centre glows brighter than the white of the page it’s printed on.',
    what: 'A flower whose petals each darken from the centre to the tip. The centre looks like a light source rather than paper.',
    how: [
      'Luminance gradients that converge on one point read as glare from a source. The apparent brightness ends up higher than the physical maximum the screen can produce.',
    ],
    demo: 'asahi',
    demoNote: 'Adjust the steepness of the gradient and the number of petals. Reverse the gradient and the glow is gone, so the direction is doing the work; a busy pattern on its own does nothing.',
    twist: 'The effect is Zavagno’s, from 1999. This particular petal figure is Kitaoka’s. The catalogue keeps them apart because they are different contributions.',
  },

  'scintillating-grid': {
    lede: 'Black dots flicker in the white discs at the crossings. Only out of the corner of your eye.',
    what: 'A grey grid with white discs at the intersections. Black dots flash on and off inside the discs, in every one except the disc you’re looking at.',
    how: [
      'It is a relative of the Hermann grid, but a different effect: it depends on the discs, on eye movements and on contrast in ways the Hermann grid doesn’t.',
    ],
    demo: 'scintillating-grid',
    demoNote: 'Try the sliders for disc size, bar brightness and grid spacing. A fixation cross makes the dependence on peripheral vision obvious: nothing ever flickers under the cross.',
    twist: 'Elke Lingelbach noticed it by accident at home. A reminder that the field is still open to amateurs.',
  },

  bezold: {
    lede: 'A colour drifts towards the lines next to it instead of pulling away from them.',
    what: 'A colour interlaced with black lines looks darker; the same colour interlaced with white lines looks lighter. Contrast would do the reverse.',
    how: [
      'At fine scales the visual system averages rather than opposes. This is called assimilation, and where it hands over to contrast is a question of size.',
    ],
    demo: 'bezold',
    demoNote: 'Run the line-width slider from thick to thin. Somewhere in the middle the effect flips over, and that is the spot worth finding.',
  },

  'shaded-diamond': {
    lede: 'Same pixels. Only the outline changes, and the lightness changes with it.',
    what: 'Two shapes with identical luminance gradients. With curved outlines they read as cylinders and look evenly painted. With straight ones they read as flat facets, and then they look sharply different.',
    how: [
      'Perceived shape decides how a gradient gets split between lighting and paint. A curved surface explains the gradient as lighting. A flat one can’t explain it at all, so the gradient is put down to the paint.',
    ],
    demo: 'shaded-diamond',
    demoNote: 'The switch changes only the outlines. The fill stays the same to the last pixel, and the probe lets you check.',
  },

  chubb: {
    lede: 'The same texture looks washed out in a busy surround and punchy in a plain one.',
    what: 'Two identical patches of noise. One is surrounded by high-contrast texture, the other by a flat field. Their contrast looks different.',
    how: [
      'Contrast gain control: the response to local contrast is normalised by the contrast of the surround.',
      'Note that contrast is what changes here, not lightness. In the taxonomy they are different things, and lumping them together is a mistake.',
    ],
    demo: 'chubb',
    demoNote: 'Set the surround contrast with the slider, then try the matching task: adjust the second patch until the two look equal. You end up with a number.',
  },

  'snake-illusion': {
    lede: 'Keep the local contrast, take away the haze, and the effect nearly disappears.',
    what: 'Identical grey diamonds on a snaking striped background look different. In the control version, the anti-snake, the immediate surroundings of each diamond stay the same, but the layout no longer suggests a hazy or shaded strip, and the diamonds look almost alike.',
    how: [
      'This is an objection rather than an explanation. Theories that reduce lightness to local contrast predict the same effect in both versions, since the neighbours haven’t changed. The anti-snake shows it gone, so something has to be reading the scene as a whole.',
    ],
    demo: 'snake-illusion',
    demoNote: 'Flip the switch between the snake and the anti-snake. That is how this argument is made: by comparing the two pictures. A button measures both diamonds, and they are the same grey.',
  },

  'adelson-corrugated-plaid': {
    lede: 'A corrugated surface: the same grey patches on a lit face and on a shaded one.',
    what: 'A plaid folded like a concertina. Identical grey patches look sharply different depending on which face they sit on.',
    how: [
      'The apparent 3D layout decides which patches fall into the same “frame of illumination” and so get judged together.',
      'Flatten the folds and the frames merge into one, taking the difference with them.',
    ],
  },

  'gelb-effect': {
    lede: 'A black disc lit by a hidden spotlight looks white. Until you put real white paper next to it.',
    what: 'A dark room, a black disc, an unseen beam aimed at it. The disc reads as white. Hold up a white sheet and the disc turns black on the spot.',
    how: [
      'Anchoring: the highest luminance in the frame is taken to be white. A lone disc has nothing to look darker than.',
      'The white sheet brings a new maximum into the frame, and the whole scale is recalculated.',
    ],
    twist: 'It is stunning in a real room and flat on a screen, because the effect depends on real lighting. A screen version could only approximate it, and the catalogue would rather say so than pretend.',
  },

  samoiloff: {
    lede: 'Change the colour of the stage lights and a striped coat turns plain.',
    what: 'Painted colours on sets and costumes vanish, go black or turn into other colours when the colour of the spotlight changes. A made-up face changes its skin colour.',
    how: [
      'A surface can’t reflect what isn’t in the light. The physics is simple; the surprise is how completely the object disappears.',
    ],
    twist: 'The only entry in the catalogue that first appeared in a variety show: the London Hippodrome, 1921, in a scene called “The Valley of Echoes”. Finding it meant digging through the theatre-lighting trade literature rather than the perception literature, and the indexes cover only the latter.',
  },
};
