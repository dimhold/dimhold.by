/* Everything else: the categories with one to five entries each. Too small for files of
   their own, and too unlike the big groups to be piled in with them. */
import type { Group } from '../ru/types';

export const MISC: Group = {
  /* — shape and curvature — */

  'fraser-spiral': {
    lede: 'There is no spiral. These are concentric circles.',
    what: 'A twisted cord laid out in arcs reads as one continuous spiral. Trace a single turn with your finger and you end up back where you started.',
    how: [
      'Local tilt signals from the elements of the cord are pooled along the contour and outweigh the fact that it closes on itself.',
      'The system trusts what it sees on each stretch and never checks whether the loop closes.',
    ],
    demo: 'fraser-spiral',
    demoNote: 'The cord is generated procedurally, so the element-tilt slider can be taken through zero, and the spiral collapses into circles. A button traces one turn, and that is the proof.',
    twist: 'James Fraser generalised the trick: with the same twisted cord he made letters lean and chequered backgrounds warp. One discovery in 1908, a whole family of figures.',
  },

  orbison: {
    lede: 'A square on a radial background stops being square.',
    what: 'A regular shape laid over a fan of lines or a set of rings bends and skews.',
    how: [
      'Orbison explained it with a “vector field”: the background sets up a field of directed forces, and the shape is judged inside it.',
      'The modern reading treats it as Hering and Wundt generalised: the same orientation contrast, applied to the whole figure at once.',
    ],
    demo: 'orbison',
    demoNote: 'Pick a background (fan, rings, grid) and a figure (square, circle, hexagon). Set the fan rotating slowly and the effect gets noticeably stronger.',
  },

  'ehrenstein-square': {
    lede: 'The sides of a square laid over concentric circles bow inwards.',
    what: 'Straight sides look concave.',
    how: [
      'The same family as Hering, Wundt and Orbison: orientation contrast where the lines cross.',
    ],
    demo: 'orbison',
    demoNote: 'A setting of the same renderer: ring background plus a square.',
    twist: 'Careful with the name: “the Ehrenstein illusion” is a different figure, filed under contours and filling-in. The two are easily run together, citations included: the 1941 paper is about the Hermann grid, and the square dates from 1954.',
  },

  'checker-bulge': {
    lede: 'A flat chessboard bulges out of the page.',
    what: 'A regular board with small high-contrast elements at the corners of its squares swells up in the middle.',
    how: [
      'Border capture and orientation contrast: the same mechanism as the café wall, only accumulated across the whole field at once instead of along a row.',
    ],
    demo: 'checker-bulge',
    demoNote: 'You can change the size of the corner elements, and lay a straight line across the board.',
  },

  'curvature-blindness': {
    lede: 'The same sine wave: a gentle wave on one background, a sharp zigzag on another.',
    what: 'The line doesn’t change. All that changes is where along it the contrast switches.',
    how: [
      'A switch in contrast polarity at a turning point reads as a corner. And when both readings are available, corner and curve, the corner wins.',
    ],
    demo: 'curvature-blindness',
    demoNote: 'The same wave runs over a light half and a dark half of the background, and sliders set its amplitude and the switch point. Move the switch point off the crest of the wave and the illusion vanishes instantly.',
    twist: 'One of the few genuinely new geometric illusions of the last decade: Kohske Takahashi, 2017, in an open-access paper with every parameter spelled out.',
  },

  /* — op art and mathematical curiosities — */

  'scintillating-starburst': {
    lede: 'Rays burst out from the centre. There are no rays.',
    what: 'Concentric star polygons produce bright radial rays that nobody drew.',
    how: [
      'Illusory contours are completed through the vertices of the polygons. The effect is stronger in the periphery and depends on contrast and the number of vertices.',
    ],
    demo: 'scintillating-starburst',
    demoNote: 'Pure geometry, fully specified in an open paper: the number of rings, the number of points and the line thickness can all be changed. What you see is the study itself, reproduced.',
  },

  'op-art': {
    lede: 'Painting designed to make a still surface tremble.',
    what: 'A whole movement: shimmer, pulsing, warping and motion on a flat canvas.',
    how: [
      'Nothing new in the mechanism. Op art deliberately uses what the rest of the catalogue describes: orientation contrast, lateral inhibition, illusory motion from high-contrast periodic patterns, moiré.',
    ],
    twist: 'Anything from the period that is even moderately well known is under copyright, so this entry points to the tradition without reproducing the works. The demos elsewhere in the catalogue, from moiré to the Ouchi illusion, are generated in the same idioms, and that approach is more honest anyway: you can see exactly what the effect depends on.',
  },

  'missing-square-puzzle': {
    lede: 'The same four pieces, the same triangle, and a hole that wasn’t there before.',
    what: 'You rearrange the pieces and get the same triangle again, now with one small square missing.',
    how: [
      'The hypotenuse was never straight. The two small triangles have slightly different slopes, so both “triangles” are really quadrilaterals, one bent slightly inwards, the other slightly outwards.',
      'The difference in area is exactly one square.',
    ],
    demo: 'missing-square-puzzle',
    demoNote: 'The two triangles on a grid, a button that swaps them round, a ruler along the hypotenuse and a slider that stretches the vertical. The stretched view is what turns the trick into an explanation.',
    twist: 'This illusion is mathematical, not perceptual, and that is worth saying plainly: the eye isn’t making a mistake, it is simply being asked to spot a difference in slope of about one degree. Invented by the amateur magician Paul Curry in 1953, published by Martin Gardner.',
  },

  /* — aftereffects — */

  'lilac-chaser': {
    lede: 'Lilac dots in a circle. After a few seconds all that’s left is a green spot running round in empty space.',
    what: 'Twelve blurred lilac discs that go out one at a time, in turn. First you see a green gap running round, then the lilac discs disappear altogether.',
    how: [
      'Three mechanisms in a row. First, apparent motion: the gap left by the missing disc runs round the circle.',
      'Second, a negative afterimage: complementary green shows up where the lilac was.',
      'Third, Troxler fading: with your gaze held still, the discs themselves fade away, leaving only the green runner.',
    ],
    demo: 'lilac-chaser',
    demoNote: 'The page talks you through it in three steps, so each of the three mechanisms can be caught on its own. You set the speed and the blur; the fixation cross is not optional.',
    twist: 'The best demonstration of several mechanisms adding up to a single impression. Jeremy Hinton devised it in 2005.',
  },

  'tilt-aftereffect': {
    lede: 'Stare at a tilted grating for a minute, and a vertical one then leans the other way.',
    what: 'After adaptation the vertical looks tilted, and it stays that way for tens of seconds.',
    how: [
      'Orientation-tuned cells adapt, and the response of the whole population shifts away from the adapted angle.',
    ],
    demo: 'tilt-aftereffect',
    demoNote: 'Adaptation on a timer, then a nulling task: turn the test grating to vertical, and the page tells you your error in degrees.',
    twist: 'The temporal twin of the tilt illusion. Both come from the same pair of 1937 papers, the first by Gibson and Radner, the second by Gibson alone.',
  },

  'contingent-aftereffect': {
    lede: 'An aftereffect that appears only when a second feature matches.',
    what: 'Colour contingent on orientation; motion contingent on colour. The test stimulus shows an aftereffect only if it shares the second feature with the adapting one.',
    how: [
      'The cells that adapt are tuned to two dimensions at once.',
      'The effect lasts far longer than ordinary adaptation, which is why it is explained as learning rather than fatigue.',
    ],
    caution: 'This is the umbrella entry for the McCollough effect and its relatives, and it carries the same warning: prolonged adaptation produces an aftereffect that has been measured months later.',
  },

  'emmert-law': {
    lede: 'An afterimage on a far wall is huge. On your palm it is tiny.',
    what: 'The image on the retina doesn’t change at all. Its size changes with the distance to the surface you “project” it onto.',
    how: [
      'Perceived size equals retinal size times perceived distance. It is the same rule that gives you size constancy, applied to a stimulus that has no distance of its own.',
    ],
    demo: 'emmert-law',
    demoNote: 'An adapting spot, then instructions: look at your palm, at the desk, at the far wall. This exhibit deliberately sends you away from the screen, which few others do, and it is worth doing once.',
    twist: 'About the cleanest evidence there is that the moon illusion comes down to scaling by perceived distance.',
  },

  /* — eye movements — */

  'saccadic-suppression': {
    lede: 'You go blind several times a second. And you have never once noticed.',
    what: 'Vision is suppressed during every jump of the eye. The gap isn’t experienced as a gap.',
    how: [
      'The magnocellular pathway is actively suppressed around the start of the jump, and the images before and after it mask whatever is left.',
    ],
    twist: 'The demonstration needs no code at all. Look in a mirror at your left eye, then at your right. You will never catch your own eyes moving, though someone standing beside you will see it perfectly well. This entry used to sit under attention. It now has a category of its own, eye movements, where its kinship with chronostasis shows.',
  },

  chronostasis: {
    lede: 'The first second on a clock you have just glanced at lasts longer than a second.',
    what: 'The hand seems stuck. Measured, the extra time is 120 milliseconds or more, and it grows with the size of the jump.',
    how: [
      'The brain backdates the image that arrives after the jump to the moment the jump began. That fills the blind interval.',
      'As a result, the first fixation is credited with time it never had.',
    ],
    demo: 'chronostasis',
    demoNote: 'A dot to look at on one side, a seconds counter on the other that starts from zero when you press the button, and a jump of the eyes from one to the other. It works passably on a large screen, but a real clock with hands works better and costs less.',
  },

  /* — balance and self-motion — */

  vection: {
    lede: 'The train next to yours pulls out, and you are the one moving.',
    what: 'You are sitting still, yet the sense of motion is complete, down to the jolt when you “stop”.',
    how: [
      'In everyday life, motion of the whole visual field means that you are moving. That is what the visual system reports.',
      'The vestibular system objects, and loses. It is poor at sensing steady motion anyway; it needs acceleration.',
    ],
    demo: 'vection',
    demoNote: 'It works when the image fills enough of your field of view: a textured tunnel, best on a phone held close to your face. As soon as it starts, the page warns you about motion sickness, and the same button stops it at once.',
    twist: 'This is why virtual reality makes people sick: vection without a matching vestibular signal is exactly the conflict that brings on nausea. Ernst Mach described the phenomenon in 1875, riding a rotating platform he had built for the purpose.',
  },

  somatogravic: {
    lede: 'Acceleration on take-off is indistinguishable from the nose pitching up. The pilot pushes the stick forward and flies the aircraft into the water.',
    what: 'Forward acceleration feels like tilting backwards. There is no telling them apart.',
    how: [
      'The otoliths measure the sum of gravity and linear acceleration, and they cannot split it into its parts.',
      'Nothing has gone wrong in the processing. The ambiguity is physical: the information that would tell the two apart is not in the signal.',
    ],
    demo: 'somatogravic',
    demoNote: 'A vector diagram with a slider for the acceleration: gravity plus acceleration, with the resultant labelled, which is what the otoliths report. One move of the slider and the ambiguity is obvious.',
    twist: 'The catalogue’s best example of an illusion that is no defect at all: the sensor reports exactly what it measures. In aviation it is a recognised cause of crashes, and that is why these illusions were studied in the first place.',
  },

  oculogravic: {
    lede: 'Under sustained acceleration, a stationary point drifts upwards.',
    what: 'The visual counterpart of the somatogravic illusion: a target fixed in front of you seems to rise or tilt.',
    how: [
      'The apparent vertical is set by the resultant of gravity and acceleration, and visual space is measured from that apparent vertical.',
    ],
    demo: 'somatogravic',
    demoNote: 'Shares its vector diagram with the somatogravic illusion.',
  },

  oculogyral: {
    lede: 'In the dark, a target rotating along with you drifts off to one side.',
    what: 'Under angular acceleration, a point rigidly fixed to the chair seems to move relative to the observer.',
    how: [
      'The target’s position is computed from where it falls on the retina and from the vestibular signal about your own rotation. If the signal is wrong, so is the result.',
    ],
  },

  'coriolis-illusion': {
    lede: 'Tilt your head in a sustained turn and the world tumbles about a third axis.',
    what: 'A sense of rotation that has nothing to do with anything the aircraft is doing. Strong, sudden and disorienting.',
    how: [
      'Moving the head during rotation stimulates the semicircular canals in a plane other than the one the system had adapted to. The result is a strong sense of rotation about a third axis.',
    ],
    twist: 'A recognised cause of fatal accidents in instrument flight. It can be reproduced on an ordinary rotating chair, sitting down, with a second person present. A browser cannot fake it and should not try.',
  },

  /* — time — */

  'kappa-effect': {
    lede: 'Flashes at equal intervals of time seem unequal if they are spaced unevenly.',
    what: 'The greater the distance, the longer the interval feels.',
    how: [
      'The assumption of constant speed is at work: if the path was longer, more time must have passed.',
    ],
    demo: 'kappa-effect',
    demoNote: 'Three flashes 0.4 s apart, with a slider that moves the middle one; you judge whether the intervals were equal. The tau effect, the same assumption seen from the other side, has an entry of its own.',
  },

  'oddball-effect': {
    lede: 'The odd frame in a stream of identical ones seems to last longer than the rest.',
    what: 'Every stimulus lasts exactly as long as the others. The one that stands out seems longer.',
    how: [
      'Attention speeds up processing, and more processing reads as more time.',
    ],
    demo: 'oddball-effect',
    demoNote: 'Seven shapes, 400 ms each: blue circles with one red square among them. Then the page asks whether the square lasted longer than the circles, just as long or shorter, and reminds you that every frame, the square included, was given the same 400 ms.',
    twist: 'Probably the source of the everyday report that time slowed down during an accident, though that report is most likely about memory rather than the moment itself.',
  },

  'representational-momentum': {
    lede: 'Where an object stopped is remembered as further along its path.',
    what: 'A moving object disappears. You point to where it was, and you consistently overshoot forwards.',
    how: [
      'The representation keeps travelling along the implied path, as if it had inertia.',
    ],
    demo: 'representational-momentum',
    demoNote: 'The object disappears and you click where it stopped. The forward bias is measured in pixels and averaged over as many tries as you make.',
    twist: 'A close relative of the flash-lag effect, and a party to the same argument: is it prediction, or reassembly after the fact?',
  },

  /* — taste and smell — */

  'olfactory-label-illusion': {
    lede: 'One bottle, two labels. “Parmesan” smells pleasant; “vomit” smells revolting.',
    what: 'The smell is the same. The label changes the experience itself, not just the rating.',
    how: [
      'Smell has almost no vocabulary of its own. The name supplies an interpretation, and the interpretation shapes perception.',
    ],
    twist: 'The strongest published case that olfactory illusions exist at all, which was a disputed question for years: next to vision, smell has suspiciously few of them. It doesn’t travel through a screen. You need a real, genuinely ambiguous smell and two friends.',
  },

  'wine-colour-illusion': {
    lede: 'White wine coloured red gets described in the vocabulary of red.',
    what: 'Oenology students described white wine dyed red with terms from the red-wine repertoire.',
    how: [
      'Colour sets up an expectation, and the expectation rearranges how a smell is categorised and what words are found for it.',
    ],
    twist: 'Popular retellings blow this up into “experts can’t tell red from white”. The study doesn’t show that, and correcting the legend is more useful than repeating it. Whoever repeats it, the control is what matters: the same wine, undyed, with the same tasters. The retellings always lose the control.',
  },

  'miracle-fruit': {
    lede: 'Chew a miracle berry and for half an hour a lemon is lemonade.',
    what: 'Sour becomes sweet. Vinegar turns into sweet wine.',
    how: [
      'Miraculin binds to sweet receptors and switches them on only at low pH. So the sweetness is really produced, not imagined.',
    ],
    twist: 'This is a pharmacological change to the receptor and arguably no illusion at all, which makes it a useful edge case when deciding what counts. The French traveller Reynaud des Marchais recorded it after a voyage to West Africa in 1725; miraculin itself was isolated in 1968.',
  },

  'sonic-crisp': {
    lede: 'Boost the crunch in your headphones and the crisp seems fresher.',
    what: 'Raising the frequencies above 2 kHz in the sound of your own bite makes a crisp seem crisper and fresher. The crisp is the same.',
    how: [
      'Food texture is judged partly by sound, and hearing turned out to carry far more weight in that judgement than anyone expected.',
    ],
    demo: 'sonic-crisp',
    demoNote: 'A browser can do this: your microphone picks up the bite, a filter lifts the high frequencies, and the sound comes straight back into your headphones with almost no delay. You bring the crisps. Nothing starts until you allow microphone access.',
  },

  'sonic-seasoning': {
    lede: 'The same toffee tastes more bitter to low-pitched music and sweeter to high-pitched. By about a tenth.',
    what: 'Only the sound changes. The taste rating follows it.',
    how: [
      'There are stable crossmodal correspondences between pitch, timbre and the basic tastes. They shift the criterion by which an ambiguous taste is judged.',
    ],
    demo: 'sonic-seasoning',
    demoNote: 'Two soundtracks, a piece of chocolate of your own and a rating scale. It takes a minute, the result is real, and you leave the screen with something to do.',
    twist: 'Used commercially by airlines and chocolate brands, which gives it something rare in this catalogue: a revenue model.',
  },

  /* — signals from inside — */

  'false-heart-rate-feedback': {
    lede: 'Play someone a heartbeat that isn’t theirs, tell them it is, and they will find a photo more attractive.',
    what: 'Speed up the fake heartbeat and attractiveness ratings go up, while exercise feels harder.',
    how: [
      'Emotion and effort are partly inferred from the state of the body. Swap the signal and the inference follows the swap, not the body.',
    ],
    demo: 'false-heart-rate-feedback',
    demoNote: 'The browser version plays a heartbeat for nine seconds, at 62 or 105 beats a minute picked at random, while you look at a pattern, and then asks you to rate the pattern from 0 to 10. It ends with an immediate, plain debrief: the sound was never your pulse.',
  },

  'cardio-visual-full-body': {
    lede: 'A silhouette of your body, flashing in time with your heart, pulls you towards it.',
    what: 'You see yourself from behind, the silhouette flashes in sync with your pulse, and your sense of where you are shifts towards it.',
    how: [
      'Where you are is worked out from signals coming from outside and from inside. Synchronising an outside image with an inside rhythm ties the two together.',
    ],
    twist: 'This finding is what made the catalogue add an interoceptive modality: until then nothing in it dealt with signals from inside the body. It needs a heart-rate sensor and a headset, so all you get here is the explanation.',
  },

  /* — material — */

  'glare-effect': {
    lede: 'A white patch stops being white paper and becomes a light source.',
    what: 'An area surrounded by converging luminance gradients reads as glowing rather than lit.',
    how: [
      'Converging gradients are an optical sign of glare. Glare means a source, so the area is assigned a luminosity higher than the physical white of the page.',
    ],
    demo: 'asahi',
    demoNote: 'Shares a renderer with the Asahi illusion.',
    twist: 'This entry used to be filed under lightness. It belongs under material: to see a glow is to judge that the surface emits light of its own, and that is a claim about what the thing is made of, not how bright it is.',
  },

  /* — clinical — */

  akinetopsia: {
    lede: 'Motion stops being visible. The world arrives in separate frames.',
    what: 'Coffee hangs in the air as a frozen stream. A person is here, then there, with nothing seen in between.',
    how: [
      'Bilateral damage to area V5/MT removes the perception of motion and leaves form and colour untouched.',
      'It is the strongest single piece of evidence that motion is computed by a separate system.',
    ],
    twist: 'The case that proved vision has a dedicated motion module. Extremely rare: only a handful have been documented. It is not a trick and should not be shown as one. This is what it is like to lose an ability.',
  },

  'fortification-spectra': {
    lede: 'A shimmering zigzag spreads slowly across the visual field, leaving a blind patch in its wake.',
    what: 'An arc of broken lines grows for twenty minutes or so and slides off the edge. Up to a third of people with migraine get an aura, and this is its classic form.',
    how: [
      'A wave of spreading depression crosses the visual cortex at about three millimetres a minute.',
      'The zigzag geometry reflects the layout of the orientation columns the wave passes through.',
    ],
    caution: 'This page has no animated version of the aura. If you look one up elsewhere, bear in mind that it may be unpleasant for people with migraine.',
    twist: 'Here an illusion doubles as a direct readout of cortical geometry: the shape of what you see tells you how the cortex is laid out. In 1870 Hubert Airy drew his own attacks, and those drawings are still reproduced.',
  },

  'charles-bonnet-syndrome': {
    lede: 'People who are losing their sight see vivid, detailed images, and know perfectly well they aren’t there.',
    what: 'Patterns, faces, figures, buildings. Silent, sharp, arriving on their own.',
    how: [
      'Deafferentation: cut off from its input, the visual cortex starts generating activity of its own. It is the visual counterpart of tinnitus.',
    ],
    twist: 'Many people never mention it, for fear of being thought mad. The most useful thing this page can do is say that it is common and has nothing to do with psychiatric illness. Charles Bonnet described it in 1760 from what his own grandfather told him.',
  },

  'alice-in-wonderland-syndrome': {
    lede: 'Objects, or parts of your own body, become huge or tiny.',
    what: 'Macropsia and micropsia, sometimes together with distortions of distance and time.',
    how: [
      'A passing disturbance of the parietal and occipital cortex, most often with migraine, epilepsy or Epstein–Barr virus infection.',
    ],
    twist: 'The entry is here because the clinical literature describes illusions that appear in no perception textbook: the same phenomena, approached from the other side. The psychiatrist John Todd named the syndrome in 1955; Lewis Carroll, it seems, had migraines himself.',
  },

  palinopsia: {
    lede: 'The image stays after the object has gone. Sometimes for minutes; sometimes it comes back hours later.',
    what: 'A trail behind a moving object, a picture that sticks, something seen earlier turning up again.',
    how: [
      'A pathological afterimage, not the same thing as the ordinary physiological kind. It is linked to occipital lesions, seizures and some medications.',
    ],
    twist: 'It sits next to ordinary afterimages deliberately, so you can see where the line between physiology and pathology runs. Macdonald Critchley coined the term in 1951.',
  },
};
