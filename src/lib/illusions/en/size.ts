/* Size and length. The oldest group and the most measured: nearly everything here turned
   up between 1851 and 1912, in laboratories that were only just learning to put questions
   to perception in numbers. */
import type { Group } from '../ru/types';

export const SIZE: Group = {
  'mueller-lyer': {
    lede: 'Two lines of the same length. One looks longer, and knowing that doesn’t help.',
    what: 'The top line has its fins turned inwards, like an arrowhead; the bottom one has them turned outwards, like the flights on the tail. The lines themselves are equal, and you can hold a ruler to them. The difference you see survives the check.',
    how: [
      'The best-known explanation is Gregory’s, from 1968: the fins read as corners. The tail reads as the inside corner of a room, the far corner; the arrowhead as the outside corner of a building, the near one. The brain scales size to apparent distance, and the far line gets a bonus. That is why the line with the tail looks longer.',
      'A simpler explanation: the visual system places the end of a line at the centre of mass of the whole figure, fins included, rather than at its tip. Then no depth is needed, only averaging.',
      'A third version is simpler still: blur the picture and the difference in length shows up in the image itself. No inference about the world is needed, just filtering.',
    ],
    demo: 'mueller-lyer',
    demoNote: 'Open the fins from zero to 75° with the slider. Both lines are drawn from a single number, so they are equal by construction, not by promise. At zero the fins lie along the line, and the difference goes with them. A button brings up a ruler.',
    twist: 'In 1966 Segall, Campbell and Herskovits reported that how strongly people fall for the illusion depends on how rectangular the world they grew up in is. The finding spread through the textbooks and was later challenged many times over its samples and statistics. Treat it as a contested classic, not an established fact.',
  },

  ebbinghaus: {
    lede: 'Two identical circles. One among big ones, the other among small ones.',
    what: 'A central circle surrounded by big neighbours looks smaller than an identical circle among small ones. The difference is typically around a tenth of the diameter.',
    how: [
      'The classic explanation is size contrast: a circle is judged against its neighbours rather than on its own.',
      'A more precise one: what matters is not so much the size of the neighbours as their distance. The closer the ring, the stronger the effect.',
    ],
    demo: 'ebbinghaus',
    demoNote: 'The slider has no numbers on purpose. Adjust the right-hand circle until it looks the same as the left, and only then press “check”. The error is shown as a percentage, which turns this from a demo into a measurement.',
    twist: 'The illusion carries Ebbinghaus’s name, but nobody has found a publication of his that includes it. Titchener put it into print in a 1901 textbook, hence its other name, “Titchener circles”. Later it got caught up in the argument over whether the hand is fooled the way the eye is: Aglioti reported that grasping is immune to the illusion, and Franz disagreed. The argument isn’t over.',
  },

  ponzo: {
    lede: 'Two identical lines on converging rails.',
    what: 'The upper line looks longer than the lower one. They are equal.',
    how: [
      'Converging lines read as perspective, a road running off into the distance. The upper line is then “further away”, and since it casts the same-sized image on the retina from further away, it must be bigger.',
      'This is the same size constancy that works properly in everyday life. The illusion is the seam where you can see it at work.',
    ],
    demo: 'ponzo',
    demoNote: 'Change the angle of convergence from none to steep with the slider. With parallel rails the effect disappears, so you can find the point where it begins.',
    twist: 'Ponzo himself put his figure forward as an explanation of the moon illusion, which is why his 1912 paper, in French, is about the “size of heavenly bodies at the horizon”.',
  },

  'moon-illusion': {
    lede: 'Near the horizon the Moon is huge. High in the sky it’s ordinary. The angular size is the same, and you can measure it.',
    what: 'A full Moon sitting on the horizon looks markedly bigger than the same Moon two hours later, high in the sky. Photograph both and the discs match.',
    how: [
      'The apparent-distance hypothesis: the sky near the horizon reads as further away than the zenith, so a fixed angular size is converted into a bigger physical one.',
      'The relative-size hypothesis: near the horizon the Moon has things to be compared with, such as trees, roofs and the lie of the land.',
      'The oculomotor hypothesis: raising your eyes changes convergence, and scale changes with it.',
    ],
    twist: 'People have been discussing it for more than two thousand years, Aristotle, Ptolemy and Ibn al-Haytham among them. Ross and Plug counted more than twenty published explanations. The honest answer to “why does it happen?” is that it still isn’t settled.',
  },

  delboeuf: {
    lede: 'A circle in a tight ring looks bigger than it is. In a roomy one, smaller.',
    what: 'The same disc changes its apparent size depending on whether the ring around it is close or far away.',
    how: [
      'It is the contour-proximity mechanism from the Ebbinghaus illusion, with one neighbour instead of a scatter of them.',
    ],
    demo: 'delboeuf',
    demoNote: 'Set the radius of the ring with the slider. A tight ring makes the disc look bigger; a wide one makes it look smaller, which is the dinner-plate version. A button outlines the true size on both discs.',
    twist: 'The size illusion most often cited in practical advice: a portion on a large plate is consistently underestimated. Hence the advice to eat off smaller plates, though the evidence that it changes how much people eat is shaky.',
  },

  'dynamic-ebbinghaus': {
    lede: 'The Ebbinghaus illusion again, only several times stronger.',
    what: 'If the surrounding circles pulse and the whole arrangement travels across the screen, the effect grows many times over.',
    how: [
      'Motion and a changing context get round the mechanisms that keep the influence of context in check when everything is still.',
    ],
    twist: 'A good argument for building the catalogue as something interactive rather than a gallery of pictures: as a still image, this illusion barely exists.',
  },

  irradiation: {
    lede: 'A light patch on dark looks bigger than a dark patch on light. Same size.',
    what: 'Two squares of the same size: the white one on black looks noticeably larger than the black one on white.',
    how: [
      'Light scatters inside the eye, and the receptors respond non-linearly. Together they smear a bright area out beyond its physical edge.',
    ],
    twist: 'Galileo described it in 1632 in the Dialogue, while trying to work out why the sizes of planets seen through a telescope didn’t add up. Helmholtz gave the effect its name. It is also why the crescent of a young moon looks like part of a bigger sphere than the dimly lit disc behind it.',
  },

  jastrow: {
    lede: 'Two identical ring segments, one above the other. The lower one is bigger.',
    what: 'Two curved pieces of the same shape and size. The lower one definitely looks bigger.',
    how: [
      'What gets compared is the pair of edges that sit next to each other: the short arc of the upper piece ends up right beside the long arc of the lower one.',
    ],
    demo: 'jastrow',
    demoNote: 'A button lays one piece on top of the other, and they match to the pixel. That is the whole demonstration.',
    twist: 'It was sold as a toy for a hundred years: two identical pieces of toy railway track that never look identical.',
  },

  'leaning-tower': {
    lede: 'Two identical photos of a tower, side by side. They lean differently.',
    what: 'The same shot of a tower rising away from the camera, shown twice. The right-hand tower seems to be leaning more.',
    how: [
      'The pair reads as a single scene. In a single scene, two sets of parallel edges should converge on a shared vanishing point. These don’t, and the difference is put down to the towers leaning differently.',
    ],
    demo: 'leaning-tower',
    demoNote: 'Not a photo: the tower is drawn by code, and both panels come from the same function with the same numbers, so they match to the pixel. Widen the gap between them with the slider, or mirror the second one, which kills the effect. It isn’t Pisa.',
  },

  'oppel-kundt': {
    lede: 'A marked-off line looks longer than an empty one. Same length.',
    what: 'Two equal intervals side by side: one divided by ticks, the other empty. The divided one looks longer.',
    how: [
      'The more items inside an interval, the longer the interval seems. The relationship isn’t strictly linear, and it levels off.',
    ],
    demo: 'oppel-kundt',
    demoNote: 'Add anywhere from zero to forty ticks. The marked half grows before your eyes, while its measured length doesn’t change.',
    twist: 'It matters more historically than practically: Oppel’s 1855 paper gave its name to the whole field of geometrical-optical illusions. It wasn’t translated into English until 2017.',
  },

  'sander-parallelogram': {
    lede: 'Two diagonals in a parallelogram. They look very different and are equal.',
    what: 'A wide parallelogram is split in two, with a diagonal drawn in each half. The left one looks noticeably longer.',
    how: [
      'Each diagonal is judged against the parallelogram it sits in, rather than against the other diagonal.',
    ],
    demo: 'sander',
    demoNote: 'Change the slant with the slider, and press the button to swing one diagonal round onto the other.',
    twist: 'It carries Sander’s name, but the first publication is Luckiesh’s, in 1922, four years before Sander. A familiar story in this field.',
  },

  'shepard-tables': {
    lede: 'Two tabletops: the same parallelogram, rotated.',
    what: 'One long, narrow table and one nearly square. Cut out one top, rotate it, and it fits neatly over the other.',
    how: [
      'A parallelogram is automatically read as a rectangle lying in depth. The system undoes the foreshortening along the apparent depth axis and stretches the shape in exactly the direction in which it supposedly recedes from you.',
    ],
    demo: 'shepard-tables',
    demoNote: 'Watch one tabletop lift, turn and settle onto the other. A separate mode takes the legs away: without them the effect weakens but doesn’t vanish.',
    twist: 'One of the strongest illusions known: knowing the answer doesn’t weaken it at all. The catalogue first dated it 1990 and later corrected that to 1981.',
  },

  'sine-illusion': {
    lede: 'Equal bars along a sine wave. On the steep stretches they look shorter.',
    what: 'Vertical lines of equal length are set out along a sine curve. Where the curve is steep, they seem to shrink.',
    how: [
      'What gets judged is the extent across the local direction of the curve, while the true vertical length is ignored. On a steep stretch the two come apart sharply.',
    ],
    demo: 'sine-illusion',
    demoNote: 'Change the amplitude of the curve with the slider, or press the button to straighten it out.',
    twist: 'Day and Stecher argue that it is the Müller-Lyer illusion in different clothes. The practical upshot: it’s why error bands and stock-market candlestick charts mislead, since their thickness gets read across the slope.',
  },

  'vertical-horizontal': {
    lede: 'A vertical line looks longer than a horizontal one. Same length.',
    what: 'An upside-down letter T: the vertical looks noticeably longer than the horizontal, though they are equal.',
    how: [
      'Two separate effects add up here. The first is a general anisotropy: vertical lines are overestimated in their own right.',
      'The second is bisection: a line cut in half looks shorter than an unbroken one. In an upside-down T the vertical cuts the horizontal in half, so the second effect stacks on top of the first.',
    ],
    demo: 'vertical-horizontal',
    demoNote: 'Compare three panels side by side: an L, a T and an upside-down T. That way you can see what each of the two components contributes on its own.',
    twist: 'This explains the Gateway Arch in St Louis: it is as wide as it is tall, and looks noticeably taller than it is wide.',
  },

  'vista-paradox': {
    lede: 'Walk towards the window and the mountain beyond it shrinks.',
    what: 'A distant object seen through an opening seems to get smaller as you approach the opening, even though its angular size is growing.',
    how: [
      'The distant object is assigned the distance of the opening: we tend to treat distances within one picture as equal.',
      'As the opening gets closer, the assigned distance drops, and the inferred size drops with it.',
    ],
  },

  'numerosity-adaptation': {
    lede: 'After a dense scatter of dots, an ordinary one looks sparse.',
    what: 'Look at a dense field of dots and then at a medium one: it looks noticeably sparser than the same field does after a sparse one.',
    how: [
      'Burr and Ross say that vision has a dedicated sense of number, and that it adapts the way colour or motion does.',
      'Durgin objects: what adapts is the density of the texture, not number as such.',
      'The argument is still open, and the catalogue doesn’t try to close it.',
    ],
  },
};
