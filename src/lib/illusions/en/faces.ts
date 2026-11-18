/* Faces. A system of its own with rules of its own: it only works on an upright face, it
   goes off at anything vaguely face-like, and in half the entries here you can tell the
   fault lies with that system rather than with the eyes. */
import type { Group } from '../ru/types';

export const FACES: Group = {
  'face-inversion': {
    lede: 'An upside-down face is far harder to recognise than an upside-down house.',
    what: 'Turning a picture through 180° damages recognition of faces many times more than recognition of anything else.',
    how: [
      'Faces are processed configurally: as a whole, as a combination, not as a set of parts. That machinery is tied to orientation, and on an inverted face it simply never engages.',
      'What is left is working through the parts one by one, the way you read houses and aeroplanes. It is slower and worse.',
    ],
    demo: 'face-inversion',
    demoNote: 'A matching task: same or different, in both orientations, twenty-four pairs. The faces are five old portraits in the public domain, four from the nineteenth century and Marie Curie’s from about 1920. The control is houses drawn for this page, because photos of buildings with an equally clean licence were not to be had, and a parametric house is more honest than a photo with murky rights. At the bottom you get your own inversion cost, separately for faces and for houses.',
    twist: 'Both the Thatcher effect and composite faces rest on this. Yin was first, in 1969.',
  },

  thatcher: {
    lede: 'The upside-down face looks normal. Turn it the right way up and it becomes frightening.',
    what: 'The face has its eyes and mouth flipped. While the whole face is upside down, you barely notice. Turn it upright and it is a grimace.',
    how: [
      'Configural processing only works on an upright face. Upside down, the face is read part by part, and the local flips of those parts go unnoticed.',
    ],
    demo: 'thatcher',
    demoNote: 'A portrait of Marie Skłodowska-Curie from about 1920, in the public domain. The eyes and mouth are flipped live on the canvas, with nothing prepared in advance. Rotation is a slider rather than a button, so you can look for the angle at which the grimace appears, and a switch puts the eyes and mouth back the right way. Usually it is somewhere between 90° and 120°.',
    twist: 'The name comes from Peter Thompson’s first demonstration in 1980, made with a portrait of the British prime minister. We do not use that portrait.',
  },

  'mooney-faces': {
    lede: 'Black and white blotches. Then there is a face, and there is no going back.',
    what: 'An image reduced to hard black and white patches looks meaningless. Once you have found the face, it never goes away again.',
    how: [
      'This is closure: as soon as the idea “this is a face” is available, the very same picture organises itself in a completely different way.',
    ],
    demo: 'mooney-faces',
    demoNote: 'The same Curie portrait, reduced to two tones right on the canvas, with adjustable threshold and smoothing. The exhibit here is the irreversibility. The page times how long you searched and warns you that on this picture the stopwatch cannot be run a second time.',
    twist: 'Good evidence that perception can be irreversible: knowing changes how an image looks, for good.',
  },

  'lincoln-effect': {
    lede: 'A face made of large squares is unrecognisable. Blur the picture and you know who it is.',
    what: 'A portrait reduced to coarse grey blocks cannot be read. Squint, step back or add blur, and the face comes through.',
    how: [
      'Quantising into blocks adds sharp edges that the face never had. These spurious high frequencies mask the real low-frequency information about the face.',
      'Blur cuts them off and lifts the mask. Hence a conclusion that is hard to accept at first: adding blur helps.',
    ],
    demo: 'lincoln-effect',
    demoNote: 'Alexander Gardner’s portrait of Lincoln, 1863, in the public domain. Blocks and blur are computed on the canvas. The block slider sets how many cells the portrait is shrunk to before it is stretched back up.',
    twist: 'This is why pixelation is poor anonymisation: the information survives the quantisation, and blur brings it back.',
  },

  'dr-angry-mr-smile': {
    lede: 'Two faces, one angry and one smiling. Step back and they swap expressions.',
    what: 'Two portraits side by side. From a few paces away the angry one turns kind and the kind one turns angry.',
    how: [
      'Each face carries one expression in its high spatial frequencies and the other in its low ones. Distance decides which band your vision can still make out.',
    ],
    demo: 'hybrid-image',
    demoNote: 'This is the hybrid-image demo, and it has no faces in it: a soft blob carries the low frequencies and a fine grating the high ones, with one slider for the cut-off and another for stepping back. The principle is the same; for the two expressions themselves you need Schyns and Oliva’s original.',
    twist: 'The catalogue first dated this work to 1994; a later check corrected it to Schyns and Oliva, 1999.',
  },

  'flashed-face-distortion': {
    lede: 'Ordinary faces flashing past in the corner of your eye turn grotesque within seconds.',
    what: 'A stream of faces, in pairs on either side of a fixation point. After a few seconds they distort into caricatures. Stop the stream and look at any one of them: it is perfectly normal.',
    how: [
      'Faces in the periphery are processed differently and adapt fast. Each face is coded relative to the one before it, and the differences between them get exaggerated.',
    ],
    demo: 'flashed-face-distortion',
    demoNote: 'Two sliders: presentation speed and distance from the centre. The faces are generated, which keeps them clean on rights and makes them easier to align by the eyes, and here alignment is everything.',
    twist: 'No illusion in the catalogue gets a stronger effect from so simple a stimulus. It is also good evidence that peripheral vision is not a scaled-down copy of central vision but something different in kind.',
  },

  pareidolia: {
    lede: 'Faces in clouds, in wood grain, in a wall socket and on the surface of Mars.',
    what: 'The face-detection system fires at anything remotely similar: two dots with a line beneath them.',
    how: [
      'It is tuned for a very low miss rate. Missing a face costs more than seeing one too many, and that automatically means plenty of false alarms.',
      'The cortex that handles faces responds to a pareidolic face exactly as it does to a real one, so this is no mere resemblance.',
    ],
    demo: 'pareidolia',
    demoNote: 'Two modes. In the first, you reshuffle procedural noise until a face emerges, and the page counts the throws, which turns the false-alarm rate into a number. The second is the 1976 Viking 1 image and the same spot as Mars Global Surveyor saw it in 2001: both NASA images, both public domain, and the toggle between them is worth a lecture on its own.',
    twist: 'The “Face on Mars” from the 1976 Viking 1 image is in the public domain, and Mars Global Surveyor went back to it at high resolution in 1998 and again in 2001, so the pair is ideal. The page uses the 2001 image. The term was coined by Kahlbaum in 1866.',
  },
};
