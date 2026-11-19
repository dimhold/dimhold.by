/* Between the senses. One rule, and it almost always holds: the sense that is more precise
   on the question at hand wins. Vision is better at space, hearing at time. So a sound
   comes from where you are looking, and hearing is the one that counts the flashes. */
import type { Group } from '../ru/types';

export const CROSSMODAL: Group = {
  mcgurk: {
    lede: 'You hear “ba” and see lips saying “ga”. You hear “da”. Close your eyes and it is “ba” again.',
    what: 'The same sound changes depending on what your eyes are shown. Knowing about it does not help at all.',
    how: [
      'Speech is assembled from acoustic and visual cues to articulation before it ever reaches awareness.',
      'The fusion is obligatory. You do not get to decide whether the lips count. The only way to switch it off is to close your eyes.',
    ],
    demo: 'mcgurk',
    demoNote: 'Our own speaker, recorded with the aim of covering all three of the site’s languages: the effect depends on the language, and comparisons like that are hard to find. The “close your eyes” toggle is a single click, because the whole argument rests on it.',
    twist: 'An everyday demonstration that hearing is not a sealed channel. It does not work for everyone, or equally well in every language, so promising that it will work for you would be misleading.',
  },

  'ventriloquism-effect': {
    lede: 'A sound seems to come from wherever you see a likely source, even when it comes from somewhere else.',
    what: 'The voice comes from the puppet’s mouth, not the performer’s throat. On television, a line of dialogue comes from the actor on the screen, not from the speakers at the sides.',
    how: [
      'Vision is more precise than hearing about space, so its estimate gets more weight and the auditory estimate is pulled towards it.',
    ],
    demo: 'ventriloquism-effect',
    demoNote: 'A slider sets the pan of the sound, and you can drag the mouth around the screen independently of it. The voice you hear follows the picture, not the pan.',
    twist: 'This is the reason film and television work at all: the dialogue comes out of loudspeakers and is heard from the actor’s mouth.',
  },

  'stream-bounce': {
    lede: 'Two discs pass through each other. Add a click at the moment they meet and they bounce.',
    what: 'Two identical discs move together and apart. From the picture alone you cannot tell whether they passed through each other or collided. With a short click at the moment of contact, most people see a bounce.',
    how: [
      'A sound is evidence of a collision. Ambiguous visual motion is resolved in favour of the reading that a collision implies.',
    ],
    demo: 'stream-bounce',
    demoNote: 'A click toggle and a timing slider for how far before or after the meeting it sounds. The window is narrow, and you can find its edges yourself.',
    twist: 'The ambiguous display itself is Metzger’s, from 1934. The sound was added sixty-three years later. It works even on laptop speakers.',
  },

  'sound-induced-flash': {
    lede: 'One flash with two beeps looks like two flashes.',
    what: 'The screen flashes once and you hear two beeps. You see two flashes.',
    how: [
      'The sense that is more reliable on the question wins. In time, hearing resolves an order of magnitude better than vision, so hearing keeps the count.',
    ],
    demo: 'sound-induced-flash',
    demoNote: 'Sliders set the number of beeps and flashes, and a button plays them. Each flash lasts exactly one frame and is timed against the audio clock, and afterwards the page tells you how far the flashes strayed from the beeps on your machine. The effect is stronger in the periphery, so keep your eyes on the red dot above the flash.',
    twist: 'It runs in the unusual direction. In almost every other crossmodal illusion vision overrides hearing; here it is the other way round.',
  },

  'bouba-kiki': {
    lede: 'The round blob is bouba. The spiky star is kiki. Nine people out of ten say so.',
    what: 'Two shapes, two made-up words. The agreement holds across most languages and writing systems.',
    how: [
      'The link between how a sound is made and heard and how a shape looks is not arbitrary. Rounded lips go with a rounded outline, a sharp burst with a corner.',
    ],
    demo: 'bouba-kiki',
    demoNote: 'Two shapes, two words, one click, and straight away the page tells you whether you answered the way nine people in ten do. Nothing is stored or counted: the cross-language figures come from the published studies, not from visitors to this page.',
    twist: 'In 1929 Köhler used the words “takete” and “baluma”; Uznadze had reported a similar observation in 1924. The names in use today come from Ramachandran and Hubbard, 2001. A cross-cultural study from 2022 found that it holds in most of the languages tested, but not all, and that is the accurate way to put it.',
  },

  'parchment-skin': {
    lede: 'Turn up the treble on the sound of rubbing and your skin goes dry as paper.',
    what: 'You rub your palms together and hear the sound in headphones with the high frequencies boosted. Your own skin starts to feel different.',
    how: [
      'Texture is judged from touch and from the sound that touching makes, both at once. Change the sound and what your hands feel changes with it.',
    ],
    demo: 'parchment-skin',
    demoNote: 'It works in a browser: microphone, filter, and back into your headphones with very little delay. The delay has to stay low, or the effect does not come through. The page needs your explicit permission to use the microphone, and nothing starts until you give it.',
    twist: 'Zampini and Spence later showed the same thing with food (2004): a crisp seems crisper and fresher when its crunch is louder or brighter. A whole industry has been working on that ever since.',
  },

  'body-transfer': {
    lede: 'You look out through someone else’s eyes and shake hands with yourself.',
    what: 'A headset shows the feed from a camera on another person’s head. The touches are in sync. Within a minute the other body feels like yours.',
    how: [
      'The feeling that a body is yours follows matching evidence from sight and touch, wherever that evidence happens to point.',
    ],
    twist: 'It takes equipment and cannot be done on a web page. Here you get only an explanation, and it is better to admit that up front.',
  },
};
