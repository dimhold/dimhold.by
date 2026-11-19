/* Thinking, memory, authorship. The line between these and perception is blurry, and the
   catalogue marks it instead of pretending it isn’t there: a mistake about probability is not
   the same as a grey smudge at a crossing. The machinery is alike, though. Perception and
   judgement both fill in the gaps, and both trust what they filled in. */
import type { Group } from '../ru/types';

export const COGNITIVE: Group = {
  'launching-effect': {
    lede: 'One square pushes another. You don’t conclude that it pushed. You see it.',
    what: 'A square slides up to a second one and stops, and the second moves off at once. The impression of a push is as direct as the impression of a colour.',
    how: [
      'Causality is perceived, not inferred. It all depends on timing and direction.',
      'Hold the second square back for 150 milliseconds and the push is gone. What’s left is two unrelated events, and no amount of knowing better brings the causality back.',
    ],
    demo: 'launching-effect',
    demoNote: 'Drag the delay slider. At zero it’s a collision; at two hundred milliseconds it’s two independent events; in between you can watch the causality drain out of the picture. No demo in the catalogue is simpler, and few carry more philosophical weight.',
    twist: 'Michotte described two more variants: entraining, where the objects move off together, and triggering, where the second shoots off faster than the first arrived, as if under its own power. All three are worth seeing.',
  },

  'heider-simmel-animacy': {
    lede: 'Two triangles and a circle moving round a rectangle. Give it a minute and a half and it’s a chase drama.',
    what: 'Viewers describe bullying, courtship, fear and escape. Hardly anyone describes it in geometric terms.',
    how: [
      'Movement alone is enough to start up the machinery for reading intentions: changes of speed, coordinated motion, signs that something moves under its own steam. No bodies or faces required.',
    ],
    demo: 'heider-simmel-animacy',
    demoNote: 'Our own short version: an eighteen-second story with a house and a door, a big triangle, a small one and a circle, and a chase. Watch it and describe what happened in your own words. The box is for you alone: nothing is saved or sent, and there are no other people’s answers to read. Almost nobody manages to keep to geometric words.',
    twist: 'It pairs with biological motion: there, animacy is read from a human skeleton; here, from three shapes with no bodies at all.',
  },

  stroop: {
    lede: 'Naming the ink colour of the word “green” is hard when the ink is red.',
    what: 'You never stop reading. The word pushes its way into your answer, and you have to hold it down.',
    how: [
      'Reading is more automatic than naming a colour. So the irrelevant dimension gets in first, and holding it back takes time.',
    ],
    demo: 'stroop',
    demoNote: 'Twenty words, congruent and incongruent in turn: answer with the colour of the ink, not the word, by clicking a button or pressing 1 to 4. Each answer is timed, and you get your own interference cost in milliseconds. The words are in the language of the page, so a Russian–Belarusian bilingual can run it on both versions and compare.',
    twist: 'Stroop published it in 1935, but Jaensch had already printed it in German in 1929.',
  },

  'monty-hall': {
    lede: 'Three doors, a car behind one. Switching doubles your chances. Almost nobody believes it.',
    what: 'You pick a door, the host opens one of the other two to show a goat, and offers you the chance to switch. Switching wins two times out of three.',
    how: [
      'The host isn’t random: he knows where the car is and always opens an empty door. What he does carries information.',
      'Intuition treats the two remaining doors as equal, and they aren’t. Your door got its one-in-three chance before the new information turned up, and it keeps that chance.',
    ],
    demo: 'monty-hall',
    demoNote: 'Play the doors yourself first; then run the simulator through ten thousand games and watch both strategies settle on a graph, against guide lines at one third and two thirds. Playing badly and then seeing the numbers is more convincing than a proof. If it still doesn’t click, picture a hundred doors with the host opening ninety-eight of them: that version convinces almost everyone straight away.',
    twist: 'This one isn’t a perceptual illusion at all but a cognitive one, and the catalogue says so out loud. Selvin was the first to print the problem, in a letter in 1975, long before the famous row over a magazine column.',
  },

  anchoring: {
    lede: 'A random number you’ve just seen shifts your next estimate.',
    what: 'Even a number that obviously means nothing, such as the last digits of a phone number or a roll of the dice, pulls the estimate towards it.',
    how: [
      'An estimate starts from whatever value is to hand and is adjusted away from it too little.',
    ],
    demo: 'anchoring',
    demoNote: 'You are given a high or a low anchor at random and asked for an estimate. The page then draws a scale from 0 to 3,000 km with three marks: your anchor, your answer and the real length of the Dnieper, 2,201 km. Nothing is collected, so you see only your own answer; the comparison between groups is in the published studies. The explanation comes straight after your answer; without it, this would be a trick rather than a demonstration.',
    twist: 'One of the sturdier findings in the field, although replications find a smaller effect than the original studies did.',
  },

  'linda-problem': {
    lede: 'Most people think “bank teller and feminist” is more likely than plain “bank teller”.',
    what: 'You are given a description of Linda. Offered two options, people pick the one that logically cannot be more likely.',
    how: [
      'A judgement of probability gets swapped for a judgement of resemblance: the combination fits the description better, and “fits” takes the place of “likely”.',
      'There is an objection. Part of the effect may be ordinary conversational inference rather than a failure of logic: hearing “bank teller”, people take it to mean “bank teller and nothing else”, and then the answer stops being a mistake.',
    ],
    demo: 'linda-problem',
    demoNote: 'Answer the question before any explanation. Only once you have answered does the page explain, with a diagram, that “bank teller and feminist” lies wholly inside “bank teller”. Asking first is the whole design.',
  },

  'illusion-of-control': {
    lede: 'A ticket you picked yourself is worth more than one you were handed. Dice get thrown harder when a high number is needed.',
    what: 'A sense of control appears where there is no control at all.',
    how: [
      'Cues that go with skill, such as choice, familiarity, involvement and competition, carry over into judgements about an outcome that is pure chance.',
    ],
    demo: 'illusion-of-control',
    demoNote: 'There’s a button that does nothing and a light that comes on at random. After fifteen presses the page asks how much control you felt, from 0 to 10, and then tells you how many times the light just happened to be on. Your confidence in a button that isn’t connected to anything is the exhibit.',
  },

  'choice-blindness': {
    lede: 'You are handed back the face you turned down. Only about one swap in eight is caught on the spot, and about a quarter are caught at all.',
    what: 'In the rest, people explain in detail, and convincingly, why they chose it.',
    how: [
      'An account of your own choice isn’t read off a record of the decision. There is no such record. The account is put together after the fact from whatever is to hand, and what’s to hand is the swapped card.',
    ],
    demo: 'choice-blindness',
    demoNote: 'In the browser this runs on generated cards of coloured circles, all in one palette, rather than faces: pick the one you prefer, then say why you chose it. If you spot the swap, there is a button to say so. It works once per person, like the gorilla video, and the lines above have already given it away, so it is best tried on someone who hasn’t read them. The explanation comes as soon as you’ve answered.',
    twist: 'Memory and authorship behave here the way vision does in change blindness: the same logic and almost the same name.',
  },

  'intentional-binding': {
    lede: 'When you are the cause, the action and its effect move closer together in time.',
    what: 'Your key press feels later than it was, and the sound it triggers feels earlier. Make the movement involuntary and they drift apart again.',
    how: [
      'The sense of authorship bends felt time. So the size of the shift can be measured and used as a sign of whether the action felt like your own.',
    ],
    demo: 'intentional-binding',
    demoNote: 'A Libet clock. Press the space bar or click the clock whenever you like, then set where the hand was when you pressed. Trials alternate: in one a beep follows your press a quarter of a second later, scheduled on the audio clock, and in the next there is no beep. The page keeps your average error for each kind of trial and the difference between them, which is your action binding. Only the press is judged, never the tone, and over a handful of trials an effect of ten milliseconds or so is easily lost in the scatter.',
  },

  'illusion-of-conscious-will': {
    lede: 'People confidently report intending an action that someone else actually performed for them.',
    what: 'All it takes is for the right thought to arrive at the right moment before the action.',
    how: [
      'The feeling of will is an inference from three cues: the thought came first, it fits the action, and nothing else obviously explains the action.',
      'You have no direct access to what caused your own movement. There is only this inference, and it can be faked.',
    ],
    twist: 'It is the catalogue’s strongest argument that the sense of authorship is a perception too, and so goes wrong in the same ways as any other. The original experiment needs a confederate, and a fair software version would have to explain itself straight afterwards, because the experiment works by deceiving the participant.',
  },

  'drm-false-memory': {
    lede: 'Bed, rest, awake, tired, dream. You will confidently remember the word “sleep”. It wasn’t there.',
    what: 'A list of related words, and a firm memory of a word that wasn’t on it.',
    how: [
      'Recall rebuilds the meaning rather than replaying a recording. The lure that was never shown fits the overall meaning better than some of the words that were on the list.',
    ],
    demo: 'drm-false-memory',
    demoNote: 'Read a timed list, count backwards for a few seconds, then go through four words, one of them the lure, answering “definitely”, “I think so” or “no”. People aren’t just wrong about the lure, they’re sure. The English list comes from Roediger and McDermott’s own “sleep” list; the Russian and Belarusian lists are built for those languages rather than translated, since the web of associations doesn’t survive translation.',
    twist: 'The memory counterpart of the whole perceptual side of the catalogue: what you get is assembled, not recorded.',
  },

  'mandela-effect': {
    lede: 'Lots of people remember the same detail, and it doesn’t exist.',
    what: 'A line that was never in the film, a letter that was never in the logo, an ending that was never in the book.',
    how: [
      'A schema fills in the gaps the same way in many people independently, because it fills them in by the same rules.',
      'Then social confirmation takes over: a person finds others who made the same mistake, and the mistake turns into a memory of how things really were.',
    ],
    demo: 'mandela-effect',
    demoNote: 'Pick the logos and quotes you recognise and rate your confidence, then see the correct versions. The examples are chosen to work in all three of the site’s language communities: for this audience, Soviet and post-Soviet material is far more interesting than American.',
  },

  'deja-vu': {
    lede: 'A firm sense that this has happened before, alongside firm knowledge that it hasn’t.',
    what: 'The moment is experienced as a repeat. No memory is actually retrieved.',
    how: [
      'A signal of familiarity fires without the memory that normally comes with it.',
      'The eerie part comes from the system that keeps track of your own knowledge noticing the mismatch. You feel the familiarity and know, at the same time, that there’s nothing to remember.',
    ],
    twist: 'It is the only entry in the catalogue defined entirely by a subjective report, with no stimulus at all, which puts it at the edge of what the catalogue can be about. Outside a lab, it can’t be reliably produced on demand.',
  },

  'sleep-paralysis-hallucination': {
    lede: 'Waking up unable to move, and knowing for certain that someone is in the room.',
    what: 'Waking with the muscle atonia still in place: the body can’t move, the mind is clear, there’s a weight on the chest and a presence in the room. The paralysis is real. The presence is not.',
    how: [
      'The muscle relaxation of REM sleep didn’t switch off in time and has spilled over into waking.',
      'Dream imagery is laid over the real room, while the threat-detection system runs with no way to act.',
    ],
    twist: 'Estimates of how many people have had it at least once range from 8 to 40 per cent, which probably makes it the most widely experienced illusion in the whole catalogue. Yet it appears in none of the eight standard illusion indexes this research started from. Every culture has its own name and explanation for it: the Old Hag, kanashibari, the domovoi “pressing down” on you.',
  },

  'hypnagogic-imagery': {
    lede: 'Faces, patterns and voices on the edge of sleep, experienced as seen rather than imagined.',
    what: 'Vivid images while falling asleep, often with a sense of falling. What sets them apart from imagination is that they arrive on their own; vividness has little to do with it.',
    how: [
      'The sensory cortex is working and outside input is already shut off, while the system that checks for reality has either not started yet or already stopped.',
    ],
    twist: 'The “Tetris effect” belongs here too: a repetitive task from the day comes back as you drop off. Unlike everything else in this subgroup, it’s easy to reproduce at home. Maury coined the term in 1848, watching himself fall asleep.',
  },

  'exploding-head-syndrome': {
    lede: 'A deafening explosion inside your head just as you fall asleep. No pain.',
    what: 'A bang, a gunshot or a crash inside the skull, with no sound outside at all. Harmless, and terrifying the first time.',
    how: [
      'A glitch in the sequence the brainstem uses to shut the senses down as you fall asleep: instead of a smooth fade there’s a burst.',
    ],
    twist: 'Described in 1876 by Silas Weir Mitchell, the man who gave the phantom limb its name. That makes two entries in the catalogue from one nineteenth-century neurologist. The most useful thing a page can do is say that it’s common and harmless, because people who have it usually aren’t told.',
  },
};
