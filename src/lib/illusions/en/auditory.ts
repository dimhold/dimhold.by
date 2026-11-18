/* Hearing. Half of this group is Diana Deutsch, and that isn’t the catalogue playing
   favourites: she really did find most of what is here, and showed along the way that what
   you hear depends on the language you grew up with. Nearly everything needs headphones,
   and where it does, the entry says so. */
import type { Group } from '../ru/types';

export const AUDITORY: Group = {
  'shepard-tone': {
    lede: 'A scale that climbs for ever and never gets anywhere.',
    what: 'The sound goes up step by step and, after a full cycle, is back where it started. To the ear the climb never stops.',
    how: [
      'The tone is built from sine waves spaced an octave apart under a fixed bell-shaped spectral envelope. The top components fade out as the bottom ones fade in.',
      'Pitch has two dimensions: chroma (which note within the octave) and height (how high overall). Shepard pulled them apart, so the chroma moves while the height stays put. The ear follows the chroma.',
    ],
    demo: 'shepard-tone',
    demoNote: 'Turn the knobs for speed and envelope width. The spectrum drawn alongside shows the top components fading out just where the bottom ones come in. It takes a click to start, because browsers won’t play sound on their own.',
    twist: 'Shepard built these tones in 1964 on an IBM 7090 at Bell Labs. A by-product of the paper matters more than the illusion itself: judgements of pitch turned out to be intransitive. You have heard the trick more often than you think. It’s in The Dark Knight, in Dunkirk and on the endless staircase in Super Mario 64.',
  },

  'risset-glissando': {
    lede: 'The same thing, but continuous: a slide downwards with no end and no bottom.',
    what: 'The tone glides smoothly down and never arrives anywhere.',
    how: [
      'The same octave-spaced components sit under the same fixed spectral envelope. The one difference is that the frequency glides continuously instead of moving in steps.',
    ],
    demo: 'shepard-tone',
    demoNote: 'This is the Shepard-tone demo itself. Tick “continuous” and it glides instead of stepping; tick “down” as well for the endless fall.',
    twist: 'Risset worked at Bell Labs alongside Shepard and went on to invent a good part of what computer music sounds like.',
  },

  'risset-rhythm': {
    lede: 'A rhythm that speeds up for ever.',
    what: 'The beat keeps on accelerating, and yet after a full cycle the tempo is back where it was.',
    how: [
      'Layers run at tempos related by factors of two and fade in and out under a fixed loudness envelope.',
      'The tempo’s “chroma” moves while the tempo itself stays put. It is the Shepard tone’s design, carried over into time.',
    ],
    demo: 'risset-rhythm',
    demoNote: 'Try it on speakers if you like: this is the least fussy of the sound exhibits. Events are scheduled ahead of time against the audio engine’s clock; otherwise the illusion falls apart on a busy page.',
    twist: 'Electronic musicians have used this for decades: the beat that keeps speeding up and the drop that never lands.',
  },

  'pitch-circularity': {
    lede: 'Each tone is higher than the last. Twelve steps later you’re back where you started.',
    what: 'A series of paired comparisons, and in each one the second tone is clearly higher than the first. Close the loop and you have a contradiction.',
    how: [
      'Pitch has two independent dimensions, chroma and height. Separate them and transitivity breaks down: “higher” stops being an ordering.',
    ],
    demo: 'pitch-circularity',
    demoNote: 'Three pairs, each a step of four semitones round the circle, and for each you say whether the second tone is higher or lower. Three steps of four semitones bring you back to the note you started on, so if you answered “higher” every time, the page points out that your own answers have closed a loop. Your own contradiction is far more convincing than anyone else’s.',
  },

  'tritone-paradox': {
    lede: 'The same pair of tones: some people hear it go up, others hear it go down. Both are certain.',
    what: 'Two tones a tritone apart. The direction you hear depends on who you are, and you can’t change it at will.',
    how: [
      'Every listener has the circle of note names oriented their own way, and the orientation is tied to the pitch range of their own speaking voice. Tones from the upper half of that circle are heard as the higher ones.',
      'The orientation depends on the language and the accent a person grew up with. Californians and people from the south of England tend to give opposite answers.',
    ],
    demo: 'tritone-paradox',
    demoNote: 'Go through the full battery: twelve pairs, up or down for each, and the page draws your own circle as you go. Nothing is collected or sent anywhere, so compare circles with someone who grew up speaking a different language.',
    twist: 'The strongest evidence in the catalogue that perception depends on the language you learned as a child. It is also the most awkward fact for the idea that “everyone hears the same”.',
  },

  'octave-illusion': {
    lede: 'Two notes an octave apart hop between the ears. Most right-handers hear the high one on the right, wherever it really is.',
    what: 'In headphones, two tones keep swapping ears. What you hear is one tone jumping from ear to ear, with its pitch alternating as it goes.',
    how: [
      'The pitch is taken from one ear and the location from the other. Which ear wins depends on handedness, that is, on how the two hemispheres are organised.',
    ],
    demo: 'octave-illusion',
    demoNote: 'Use headphones: on speakers this is a different stimulus and there is no illusion. A separate button tests the channels, a low tone on the left and then a high one on the right, so you know the headphones are the right way round. Press the button to swap the channels: most listeners hear no difference at all, which is the most striking part.',
    twist: 'One of the few illusions whose outcome depends on handedness. That is why it found a home in neuropsychology as well as psychoacoustics.',
  },

  'scale-illusion': {
    lede: 'Two scales, scattered between the ears one note at a time, come out as two smooth melodies.',
    what: 'A rising scale and a falling scale alternate between the ears note by note. You hear two smooth melodies, one high and one low, each coming cleanly from one ear.',
    how: [
      'The auditory scene is put together first by pitch proximity, and only then is each group given a location.',
      'The real split between the channels is thrown away, because it contradicts a more important guess about which notes belong together.',
    ],
    demo: 'scale-illusion',
    demoNote: 'Use headphones, then listen to each channel by itself: on its own the left one is a jagged, leaping sequence that flatly contradicts what you just heard. Nothing else explains it as well.',
    twist: 'Composers have used this for centuries. In his Sixth Symphony Tchaikovsky splits the finale’s opening theme between the first and second violins so that the melody the audience hears is played by neither of them.',
  },

  'glissando-illusion': {
    lede: 'The oboe hops from side to side, as it really does. The glide, chopped into pieces, comes out whole.',
    what: 'A steady synthesised oboe tone and a gliding sine tone keep swapping sides, so that whenever the oboe is on the left a piece of the glide is on the right. You hear the oboe switch sides, correctly. The pieces of the glide join into one unbroken tone that drifts through space with its pitch: for most right-handers, from left to right as it rises and back as it falls.',
    how: [
      'The steady tone and the glide group into two separate streams, and each is given its location independently: the oboe by where it is, the glide by its pitch.',
    ],
    demo: 'glissando-illusion',
    demoNote: 'Deutsch and her colleagues played it from two loudspeakers; this page plays it through headphones, one channel to each ear. A buzzy sawtooth tone stands in for the oboe, the glide is a sine that rises in eight pieces and starts again, and once again you can listen to each ear on its own.',
  },

  'precedence-effect': {
    lede: 'The same sound from two sides is heard from whichever side it reached first. Even if the other is louder.',
    what: 'Two copies of a sound, a few milliseconds apart. You hear a single sound, coming entirely from where it arrived first, even when the second copy is ten decibels louder.',
    how: [
      'Location cues that arrive later are suppressed. Without this, hearing in an ordinary room wouldn’t work at all: every reflection off a wall would announce a new source.',
    ],
    demo: 'precedence-effect',
    demoNote: 'In headphones: two copies of a click train, a slider for the interaural delay from 0 to 50 ms, and a separate volume for the lagging copy. Take the delay past the echo threshold. The point where one sound becomes two is the whole demonstration.',
    twist: 'Probably the most commercially exploited illusion in the catalogue: it governs how delay speakers are set up in halls, and it is why the sound still seems to come from the stage. Wallach, Newman and Rosenzweig, 1949, and independently Haas in the same year.',
  },

  'franssen-effect': {
    lede: 'The tone has moved to the other speaker. You still hear it in the first, even after that one goes off.',
    what: 'A sound starts abruptly in one speaker and fades smoothly over to a second. Listeners point confidently at the first, even once it has gone silent.',
    how: [
      'Localisation rests on the sharp onset. After that, a steady tone in a reverberant room offers no reliable clues to where it is, so the first decision stands.',
    ],
    twist: 'A good example of an illusion that depends on the room as well as the listener. It doesn’t work in headphones and barely works without reverberation, and a web page can’t deliver it, so this entry has only an explanation.',
  },

  'binaural-beats': {
    lede: 'Two tones, one in each ear. The beat happens somewhere there are no ears.',
    what: 'The two frequencies differ by a few hertz. You hear a slow pulse that is in neither the left channel nor the right.',
    how: [
      'Ordinary beats are acoustic: two waves add up in the air. These add up in the comparison between the ears, that is, in your head.',
    ],
    demo: 'binaural-beats',
    demoNote: 'Set the frequency difference between the two oscillators, then switch between binaural beats and ordinary acoustic ones. One click makes the difference plain: ordinary beats work on speakers too, binaural ones only in headphones.',
    caution: 'Claims that binaural beats entrain brain rhythms, sharpen concentration or bring on meditative states are not backed by good evidence. The effect itself is real and interesting. The industry built around it is not.',
  },

  'missing-fundamental': {
    lede: 'Take the fundamental out of a sound completely. The pitch stays the same.',
    what: 'A harmonic tone with its fundamental cut out. You hear the same note; only the timbre shifts a little.',
    how: [
      'Pitch comes from the periodicity of the whole set of harmonics, not from the energy at the fundamental. The set keeps the same period even when the first harmonic is missing.',
    ],
    demo: 'missing-fundamental',
    demoNote: 'Eight harmonics of 160 Hz, the lowest three with a switch each, and the spectrum drawn underneath. Turn off the fundamental and the pitch doesn’t budge. One checkbox does it all.',
    twist: 'That’s why a phone speaker that reproduces nothing below 300 Hz can still play a bass line. The bass isn’t there; you supply it yourself. Seebeck described this in 1841.',
  },

  'tartini-tone': {
    lede: 'Two loud pure tones give rise to a third, lower than either. It isn’t in the air.',
    what: 'Two notes are played. You hear a third one, the difference tone.',
    how: [
      'The cochlea responds non-linearly, and that non-linearity puts energy at the difference frequency. The waves aren’t adding up in the air; the distortion happens inside the ear.',
    ],
    demo: 'tartini-tone',
    demoNote: 'Set the two oscillators independently and watch the calculated difference frequency on the display. It needs a fair amount of volume, so the page reminds you not to overdo it as soon as it starts.',
    twist: 'Violinists still use it: a double stop played in tune produces the third tone, and they check their intonation against it. Tartini claimed to have heard it in 1714 but didn’t publish until 1754, and Sorge had already published in 1745.',
  },

  'illusory-continuity-tones': {
    lede: 'Cut a gap in a tone and fill it with noise, and the tone carries on straight through.',
    what: 'A tone has a hole cut out of it. In silence, you hear the hole. Fill it with noise and the tone sounds unbroken.',
    how: [
      'Hearing assumes the tone kept going and was drowned out. In the real world that happens far more often than a sound stopping for just as long as some unrelated noise and then starting again.',
    ],
    demo: 'illusory-continuity-tones',
    demoNote: 'A menu fills the gap in the tone with one of three things: silence, loud noise or quiet noise. The whole phenomenon takes ten seconds to hear.',
    twist: 'The auditory counterpart of filling in the blind spot. And the reason a conversation survives a passing lorry.',
  },

  'zwicker-tone': {
    lede: 'A negative afterimage, for the ears.',
    what: 'Listen to broadband noise with a narrow band notched out, then switch it off. In the silence a faint tone appears, right at the frequency of the missing band.',
    how: [
      'The neighbouring frequency channels adapt and the notched one doesn’t. When the noise stops, the population is out of balance, and the unadapted channel looks active.',
    ],
    demo: 'zwicker-tone',
    demoNote: 'The page plays notch-filtered noise for eight seconds; then listen to the silence. Sliders set the frequency and width of the notch. The tone is faint, so you need headphones, a moderate volume and a quiet room, and the page tells you so.',
    twist: 'A good bridge between the senses: unmistakably the same idea as a visual afterimage, just in another modality.',
  },

  'speech-to-song': {
    lede: 'Repeat a phrase ten times without changing a thing, and it starts to sing.',
    what: 'An ordinary spoken phrase, looped exactly, stops being speech and turns into song. You can’t turn it back.',
    how: [
      'Repetition moves processing out of speech mode and into music mode. The melodic contour, until then a by-product of intonation, becomes a melody.',
    ],
    demo: 'speech-to-song',
    demoNote: 'Listen to our own phrases, in Russian, Belarusian and English, with a repetition counter. Nobody has properly checked whether it works the same way in all three languages, so the page asks you on which repetition it flipped.',
    twist: 'Deutsch found it in 1995 while editing her own commentary for a CD: a fragment happened to loop, and she heard it singing. The paper came out sixteen years later.',
  },

  'sine-wave-speech': {
    lede: 'Three whistles. Electronic noise, until someone tells you what they say.',
    what: 'Speech reduced to three gliding tones. At first it is a string of squeaks. After the hint it is a clear phrase, and you can never hear it any other way again.',
    how: [
      'Speech is recognised by patterns that change over time; the acoustic detail of a live voice isn’t needed. Three tones are enough.',
      'Once speech mode has switched on, it doesn’t switch off.',
    ],
    demo: 'sine-wave-speech',
    demoNote: 'The order is strict: noise first, then the phrase, then the noise again. Nothing on the page hints at the phrase before you’ve heard the noise.',
    twist: 'Like Mooney faces, it is a one-way door: you can’t have the experience fresh a second time. Bear that in mind when you show it to friends. You only get one go.',
  },

  'phantom-words': {
    lede: 'Two meaningless syllables on a loop. Everyone hears their own words.',
    what: 'The syllables loop with an offset between the speakers. People hear clear words and phrases, different for everyone and often about whatever is on their mind.',
    how: [
      'The input is ambiguous, and the speech system imposes the most readily available reading, drawn from expectation, vocabulary and whatever you happen to be thinking about.',
    ],
    demo: 'phantom-words',
    demoNote: 'Listen to our own syllable pairs, offset across the channels, in the site’s three languages. What visitors heard is collected and shown as a summary; that needs no personal data.',
    twist: 'This is also the “electronic voice phenomenon”, the thing enthusiasts record in cemeteries. The mechanism is the same; only the interpretation differs.',
  },

  'yanny-laurel': {
    lede: 'One recording. Half of us hear Laurel, half hear Yanny.',
    what: 'A short synthesised sound. You can’t switch at will, and both camps are completely sure.',
    how: [
      'The recording contains acoustic evidence for both words, but in different frequency bands.',
      'What you hear depends on your hearing, your speakers and which band your system gives more weight. Shift the spectral balance and listeners cross over to the other side.',
    ],
    demo: 'yanny-laurel',
    demoNote: 'We can’t republish that recording. Instead we synthesise our own ambiguous sound with the same spectral layout and add a slider for spectral tilt, which turns a viral curiosity into an explanation. Age matters here too: hearing at high frequencies fades over the years.',
    twist: 'The auditory counterpart of the dress, three years later. It did the same job: it made the general public accept that people perceive things differently.',
  },
};
