/* Atmospheric optics. The one group in the catalogue where the camera is fooled as well:
   the image is in the light itself, not in whoever is looking. It is here for the sake of
   that boundary. Without it, you can’t see what perception is doing in all the others. */
import type { Group } from '../ru/types';

export const OPTICS: Group = {
  rainbow: {
    lede: 'A rainbow is real, you can photograph it, and it still isn’t anywhere.',
    what: 'The arc isn’t an object, and it isn’t at any distance. Every observer has their own rainbow, made by different drops. You can’t walk up to it.',
    how: [
      'Refraction, one internal reflection and dispersion in spherical drops gather light at 42° from the point directly opposite the sun.',
      'The angle is fixed by the geometry of the drop rather than by where the rain is. That is why the rainbow moves with you and never gets any closer.',
    ],
    twist: 'This is where the boundary of the whole section runs: a rainbow fools the camera too. It is an illusion in the light, not in the observer. Gregory kept it in his classification for that reason, and a catalogue with nowhere to put the rainbow loses an entire kind. Descartes gave the correct geometry in 1637, but Theodoric of Freiberg had it around 1304.',
  },

  'refraction-bent-stick': {
    lede: 'A stick dipped in water breaks at the surface. The oldest illusion in philosophy.',
    what: 'A straight stick looks bent, and the part under water looks shorter and raised.',
    how: [
      'It is refraction at the boundary between water and air, as described by Snell’s law. No physiology is involved.',
    ],
    twist: 'The Greek sceptics used it to argue that the senses can’t be trusted. A poor choice of example: here the eye reports the light correctly. The light does arrive from the direction it seems to.',
  },

  'alexanders-dark-band': {
    lede: 'The sky between two rainbows is darker than the sky outside them.',
    what: 'When a secondary rainbow is visible, the band of sky between it and the primary is noticeably darker than the rest of the sky.',
    how: [
      'No drop scatters light back into this range of angles, whether with one internal reflection or with two. There is nowhere for light there to come from.',
    ],
    twist: 'Described by Alexander of Aphrodisias around AD 200, in his commentary on Aristotle’s Meteorologica. It is one of the oldest dated entries in the catalogue.',
  },

  'sun-dog': {
    lede: 'Two bright spots either side of the sun, level with it.',
    what: 'The spots stand to the left and right, often with a coloured tail pointing outwards. Old chronicles regularly describe them as a second and third sun.',
    how: [
      'Refraction in plate-shaped ice crystals that fall with their flat faces horizontal and so all share the same orientation. That orientation is what pins the spots to the height of the sun.',
    ],
    twist: 'Hevelius drew the Gdańsk halo display of 1661 with all its parhelia at once, one of the first scientific images of a complex halo.',
  },

  'moon-dog': {
    lede: 'The same thing around the moon, and almost always colourless.',
    what: 'Bright spots on either side of the moon. Usually there is no colour in them.',
    how: [
      'The crystal optics are the same as for a sun dog.',
      'The lack of colour is another matter, and not optics at all: there’s too little light for the cones, so night vision takes over, and night vision doesn’t see colour.',
    ],
    twist: 'A useful edge case: the phenomenon is optical, and its colourlessness is physiological. Two causes stack up into one percept.',
  },

  'halo-22': {
    lede: 'A ring around the sun at 22 degrees. No more, no less.',
    what: 'A bright ring around the sun or the moon, with the sky inside it noticeably darker.',
    how: [
      'Light is refracted through hexagonal ice crystals, going in at one face and out through another inclined at 60 degrees to it. A prism like that has a minimum angle of deviation, and it is 22 degrees.',
      'The crystals point every which way, but the minimum deviation is the same for all of them, hence the sharp inner edge of the ring.',
    ],
  },

  glory: {
    lede: 'Coloured rings around the shadow of your head on the cloud below.',
    what: 'From a plane or a mountain: your shadow falls on mist, and concentric coloured rings surround your head. Only your head; the person next to you sees rings around theirs.',
    how: [
      'Small water droplets scatter light back towards its source, partly by way of surface waves.',
      'The full explanation needed Mie theory and was still being refined in the 2000s. For something you can see with the naked eye, that is an unusually long wait.',
    ],
  },

  'green-flash': {
    lede: 'A green flash on the sun’s upper rim, a second before it sets.',
    what: 'A bright green spot that lasts a second or two. Plenty of people try for years to see it, never do, and decide it’s made up.',
    how: [
      'Atmospheric dispersion splits the image of the sun by colour. The blue is scattered away, so the green image is the last to set.',
    ],
    twist: 'Sailors always knew about it; Jules Verne made it famous with his 1882 novel The Green Ray.',
  },

  'inferior-mirage': {
    lede: 'A puddle that isn’t there, on a scorching road.',
    what: 'Up ahead on the road there’s water, reflecting the sky. Drive closer and there’s no water. It has moved further on.',
    how: [
      'Above hot tarmac there is a steep gradient in temperature, and with it in refractive index. A ray heading downwards curves back up and reaches your eye.',
      'The result is an upside-down image of the sky, shifted below the real object. That is what gets taken for water.',
    ],
  },

  'novaya-zemlya-effect': {
    lede: 'The sun came up two weeks before geometry said it could.',
    what: 'The polar night isn’t over yet, but the sun is already visible above the horizon.',
    how: [
      'Light is trapped in an inversion layer and travels along it, following the curve of the Earth. Something that is below the horizon becomes visible above it.',
    ],
    twist: 'Barents’s crew recorded it while wintering there in 1597. Nobody believed them for three centuries.',
  },

  'light-pillar': {
    lede: 'A column of light standing over a street lamp on a frosty night. It isn’t a beam.',
    what: 'In freezing air a vertical column rises above a light source, as if a searchlight were pointing at the sky.',
    how: [
      'Light reflects, as off a mirror, from the flat faces of ice crystals that float with those faces nearly horizontal.',
      'The pillar is made of many separate reflections from many crystals at different heights. There is no single solid beam.',
    ],
  },

  'crepuscular-rays': {
    lede: 'Rays fan out from the sun. They are parallel.',
    what: 'Bright bands shine through gaps in the clouds, converging on the sun.',
    how: [
      'The shafts really are parallel, and the fan is ordinary perspective: parallel lines meet at a vanishing point.',
      'What makes them visible is scattering by dust and droplets.',
    ],
    twist: 'It sits right on the section’s boundary: the rays are physically there, but their spread is a misreading of perspective. The line between “in the light” and “in the observer” isn’t always sharp, and here is the proof.',
  },

  'heat-shimmer': {
    lede: 'Distant things boil above hot ground.',
    what: 'The air over the tarmac quivers, and everything behind it wobbles and ripples.',
    how: [
      'Turbulent cells with different refractive indices cross the line of sight and keep shifting the image about.',
      'The same thing makes stars twinkle. Astronomers call it seeing.',
    ],
  },

  'towering-stooping': {
    lede: 'Distant objects stretch up into towers or squash down flat.',
    what: 'A ship on the horizon looks implausibly tall or, the other way round, pressed down onto the water.',
    how: [
      'The atmosphere is layered by temperature, so light is bent differently in the vertical than in the horizontal. Only the height gets stretched or squashed.',
    ],
  },

  'mist-ambiguity': {
    lede: 'In mist, distance becomes impossible to judge.',
    what: 'A small object nearby and a big one far away send the eye the same image. Hills seem closer or further away as the humidity changes.',
    how: [
      'Scattering eats up contrast and colour, the very cues that normally carry distance. The image becomes underdetermined.',
      'The ambiguity here is in the light: there is nothing to settle it with, because the information physically isn’t there.',
    ],
    twist: 'Leonardo turned it into a painting technique, aerial perspective, four centuries before anyone measured it.',
  },

  'mirror-reversal': {
    lede: 'A mirror swaps left and right but not top and bottom. In fact it does neither.',
    what: 'Raise your right hand and your reflection raises its left. Yet the reflection’s head is at the top, the same as yours.',
    how: [
      'A mirror reverses only the axis at right angles to its surface: front and back. It leaves left and right alone, and top and bottom too.',
      'The apparent swap of left and right comes from mentally turning yourself round a vertical axis to face the way the reflection faces. Turn yourself head over heels instead and top and bottom would “swap”.',
    ],
    twist: 'Lay the mirror on the floor and the paradox turns over with it. Arguably this is a linguistic illusion dressed up as an optical one, and the puzzle has more to do with words than with light.',
  },

  'moire-pattern': {
    lede: 'Two patterns overlap and a third one appears that is in neither.',
    what: 'Two periodic grids laid over each other produce a large pattern of bands. Rotate one and the pattern slides away.',
    how: [
      'These are spatial beats, the difference between two frequencies. The effect is physical, and it is there in the image.',
    ],
    demo: 'moire',
    demoNote: 'Rotate the top layer and change its spacing; the bottom one stays put. It is a good illustration of the boundary: nobody is being fooled here, the pattern is real, and a camera records it just the same.',
    twist: 'The catalogue first filed moiré under perception and later moved it to physical optics, correcting its own classification. Rayleigh described it in 1874 while working on how to make diffraction gratings.',
  },
};
