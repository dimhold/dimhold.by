/* Depth and perspective. The retina is flat and the world is not, so the difference has to
   be filled in with assumptions. Nearly every entry here is a case where the assumption
   beat the evidence against it. */
import type { Group } from '../ru/types';

export const DEPTH: Group = {
  'size-constancy': {
    lede: 'A person walking away does not shrink, although their image on the retina shrinks in inverse proportion to their distance.',
    what: 'This is an ability, not an illusion. But take away the depth cues and it falls apart, and the rest of our size machinery goes with it.',
    how: [
      'Perceived size is retinal size multiplied by perceived distance. The formula is simple, and the whole story is in it.',
      'One consequence is worth keeping in mind throughout this section: most size illusions are really distance illusions.',
    ],
    demo: 'size-constancy',
    demoNote: 'A slider moves an object away across the floor, and checkboxes add the depth cues one at a time: linear perspective, texture gradient, shadow. Watching constancy come and go with them is the most useful thing in this section.',
    twist: 'Holway and Boring ran the definitive experiment in 1941, but Descartes and Berkeley had both described the phenomenon long before.',
  },

  'ames-room': {
    lede: 'Two people of the same height in different corners of a room. One is a giant, the other a child.',
    what: 'From the single viewpoint it was built for, the room looks like an ordinary rectangular one. The people in it do not look ordinary.',
    how: [
      'The room is trapezoidal: the far corner is twice as far away and twice as tall. From the viewing point it projects exactly as a rectangular room would.',
      'The assumption that rooms are rectangular turns out to be stronger than the evidence about the people. Something has to give, the people give, and they are rescaled.',
    ],
    demo: 'ames-room',
    demoNote: 'At first you look from the peephole, and of two people of the same height one looks more than half as tall again as the other. Slide the viewpoint away from it, and the room, chequered floor and all, reveals itself as a wedge. A photograph cannot give you that moment, and it is the reason to build the whole scene.',
    twist: 'There is the “Honi phenomenon”: observers see less distortion when the person in the room is their own spouse. Replications are patchy, so treat it as a story rather than an established fact.',
  },

  'ames-window': {
    lede: 'A trapezoidal window turns steadily in one direction. You see it swing back and forth.',
    what: 'The window goes round at a constant speed, yet it seems to rock to and fro. A rod fixed through one of the panes keeps going round, so it seems to slice through the solid frame.',
    how: [
      'The trapezoid reads as a rectangular window in perspective. So the long edge must always be the near one.',
      'But as it rotates, the long edge becomes the far one for half of every turn. To keep the assumption, perception reverses the motion, and that is the swing.',
    ],
    demo: 'ames-window',
    demoNote: 'A slider morphs the trapezoid smoothly into a rectangle. With a rectangle the illusion dies, and that sweep is the argument. A checkbox pushes a rod through the window, so you can watch it seem to pass through the frame.',
    twist: 'In 1957 Allport and Pettigrew claimed that people raised among round buildings are less susceptible to it. The evidence is thin, and it is better to say so than to repeat the claim.',
  },

  'hollow-face': {
    lede: 'The inside of a mask looks like a normal face. And it turns to follow you.',
    what: 'A concave mask reads as a convex face. As you walk past, it swivels after you, faster than you are walking.',
    how: [
      'The assumption that faces are convex is so strong that it overrides both stereo vision and shading, though both contradict it directly.',
      'The way it follows you is a consequence of that. Once the hollow has been read as a bump, the real parallax from your movement has to be put down to the object turning.',
    ],
    twist: 'People with schizophrenia are noticeably less susceptible to this illusion, and it has been turned into a clinical test. The wording should stay careful: the result is often overstated in the retelling. On a screen the effect is weaker than in real life. A paper mask works far better, and there is no point pretending the screen version is just as good.',
  },

  'shape-from-shading': {
    lede: 'Light on top: a bump. Light underneath: a dent. Turn the page over.',
    what: 'A row of identically shaded circles: half read as bumps, half as dents. Rotate by 180° and they swap.',
    how: [
      'The visual system assumes there is one light source and that it is overhead. On a planet with one sun, that is an excellent bet.',
    ],
    demo: 'shape-from-shading',
    demoNote: 'A slider sets the direction of the light. Take it past horizontal and the whole grid flips at once.',
  },

  'crater-illusion': {
    lede: 'Craters in a photograph turn into hills when you rotate it.',
    what: 'Impact craters in a picture of the Moon become domes as soon as the image is turned so that the light comes from below.',
    how: [
      'The same light-from-above prior, applied to a scene that was actually lit from the side or from below.',
    ],
    demo: 'crater-illusion',
    demoNote: 'A rotation slider on a cratered surface drawn by code, not a NASA photograph. The light within the scene never changes; only the picture turns, and once it is upside down the craters become domes.',
    twist: 'In planetary science this is a practical nuisance, and it is the reason images are conventionally published with the light coming from the left.',
  },

  anamorphosis: {
    lede: 'A smeared blot resolves into a picture from one point and one point only.',
    what: 'The image is built so that it looks right only from a sharp angle or reflected in a cylindrical mirror. From anywhere else it is shapeless.',
    how: [
      'The projection is constructed in reverse: you take a picture and recompute it so that it gives the right result from the chosen point. The maths is simple; the hard part is the setup.',
    ],
    demo: 'anamorphosis',
    demoNote: 'Oblique anamorphosis: a word stretched across the canvas and a slider for the viewing angle. Only at the right spot does it read properly.',
    twist: 'The skull in Holbein’s The Ambassadors of 1533 is the best-known example, and it is long out of copyright. The earliest known anamorphosis is Leonardo’s eye in the Codex Atlanticus, around 1485. The term itself only appeared in 1657, in the work of Gaspar Schott.',
  },

  'hybrid-image': {
    lede: 'Up close it is one thing. From across the room, another.',
    what: 'One picture with two contents. Squint or step back, and the first gives way to the second.',
    how: [
      'The high spatial frequencies come from one picture, the low ones from another, and the two are added together.',
      'Your distance from the screen decides which band of frequencies you can still resolve. Stepping back cuts off the high ones, and the second picture is what remains.',
    ],
    demo: 'hybrid-image',
    demoNote: 'A real hybrid, built in the browser the way Schyns and Oliva built theirs: Chekhov’s portrait, blurred with a Gaussian filter, supplies the low spatial frequencies, and Marie Curie’s the high ones, the two aligned by the pupils. One slider sets the cut-off, the other shrinks the picture as if you were stepping back. Close up you see Curie; small, or from across the room, you see Chekhov.',
  },

  'peppers-ghost': {
    lede: 'A transparent ghost walks the stage among live actors. The year is 1862.',
    what: 'A see-through figure stands among real people and vanishes instantly, with no trapdoors and no smoke.',
    how: [
      'A large sheet of angled glass reflects part of the light. A brightly lit actor hidden below the stage is reflected in it, superimposed on the real scene.',
      'How solid the ghost looks is a ratio of light levels. Turn down the light on the hidden actor and the ghost melts away.',
    ],
    demo: 'peppers-ghost',
    demoNote: 'A stage with a sheet of glass you can tilt, a slider for the light on the hidden actor, and a plan view from above that shows the hidden actor, the glass, the ghost and the viewer. The plan is what makes it all click.',
    twist: 'Dircks described it in 1858; Pepper staged the working version on 24 December 1862. The trick is alive and well: modern concert “holograms” are exactly this, with projection foil in place of the glass.',
  },

  reverspective: {
    lede: 'A relief whose nearest parts carry the farthest scenery. It turns to follow you.',
    what: 'A painting that sticks out of the wall in pyramids. Walk past it, and the whole composition tilts and travels with you.',
    how: [
      'The painted perspective overrides the real depth, and the physical relief is seen inside out.',
      'From there it works like the hollow mask: the real parallax from your movement is put down to the object turning.',
    ],
    twist: 'One of the few illusions that is reliably better in person than in any screen version. Patrick Hughes invented both the word and the genre in 1964.',
  },

  'gravity-hill': {
    lede: 'A car in neutral rolls uphill. The road is in fact going down.',
    what: 'A stretch of road where water flows “up” and a parked car rolls “up” unaided.',
    how: [
      'The true horizon is hidden, so the slope is judged against local references: leaning trees, walls, verges.',
      'If those references are themselves tilted, the zero point shifts and a descent reads as a climb.',
    ],
    demo: 'gravity-hill',
    demoNote: 'The true slope and the tilt of the roadside objects have independent sliders, and a button shows or hides the horizon. Make a real descent look like a climb, then reveal the horizon: that is exactly what Bressan and colleagues did in their experiment.',
    twist: 'Belarus has at least one place like this, though it is still waiting to be confirmed.',
  },

  'bowerbird-forced-perspective': {
    lede: 'The only entry in the catalogue whose author is not human.',
    what: 'Male great bowerbirds lay out objects on their court by size, small ones near the entrance and larger ones further away. For a female standing in the bower this creates forced perspective. Males that pull the illusion off better mate more often.',
    how: [
      'A size gradient along the line of sight flattens the apparent depth of the court. Against that backdrop the male himself may look bigger.',
    ],
    demo: 'bowerbird-forced-perspective',
    demoNote: 'You can rearrange the court yourself, with the female’s view and a top-down view alongside. Building the illusion with your own hands and seeing the gradient that makes it is the whole point.',
    twist: 'It also answers a question visitors ask all the time: do animals see illusions? Some do, some do not, and pigeons see the Ebbinghaus illusion the wrong way round.',
  },

  'lunar-terminator': {
    lede: 'The Moon is lit from the wrong side.',
    what: 'When the Sun and the Moon are both in the sky, the Moon’s lit side clearly points somewhere other than the Sun.',
    how: [
      'The observer expects the line from the Sun to the Moon to be straight, with a constant slope.',
      'But it is an arc of a great circle on the celestial sphere, and projected onto an imagined flat sky it bends. There is nowhere you could stand to see it straight.',
    ],
    twist: 'The author of the 1998 paper, Bernhard Schölkopf, later became far better known for something else entirely: kernel methods in machine learning.',
  },
};
