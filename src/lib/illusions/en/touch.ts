/* Touch and the body. Almost none of this can be shown on a screen, and almost all of it
   can be done with your own hands in half a minute, no equipment needed. Where a helper or
   a device is required, we say so instead of covering for it with a video. */
import type { Group } from '../ru/types';

export const TOUCH: Group = {
  'aristotle-illusion': {
    lede: 'Cross two fingers and roll a pea between them. There will be two peas.',
    what: 'One object feels like two. It works for almost everyone, first time.',
    how: [
      'The touch lands on sides of the fingers that, in their usual position, could never be touching the same object. Different surfaces, so two objects.',
    ],
    twist: 'Described by Aristotle. It is very likely the oldest documented illusion in any of the senses, and it still works on most people. Five seconds to check, no screen required: a pea, a bead or the tip of your own nose will do.',
  },

  'kohnstamm-phenomenon': {
    lede: 'Press the backs of your hands against a door frame for half a minute, then step away. Your arms will rise on their own.',
    what: 'Your arms float upwards, and it does not feel like something you are doing. You can stop them, but stopping is the right word: as if the movement belonged to someone else.',
    how: [
      'An involuntary motor signal carries on after the voluntary effort has ended.',
      'It starts below the level at which intention is represented. So the movement is yours, yet it feels like someone else’s.',
    ],
    twist: 'The catalogue first filed this under body ownership and later moved it to the motor illusions: this is an involuntary movement, not a question of whose arm it is. All it takes is a set of instructions and a timer, and it works for most people.',
  },

  'size-weight': {
    lede: 'Two boxes of the same weight. The smaller one is noticeably heavier.',
    what: 'Check on the scales, check again, swap hands. The smaller one is still heavier.',
    how: [
      'Expected weight is subtracted from felt weight. The expectation is based on size, so it is wrong, and what you feel is the error.',
      'The main point is that knowing does not help in the slightest. It is a direct counterexample to the idea that an illusion is a mistake that understanding will correct.',
    ],
    twist: 'Easy to reproduce at home in five minutes: two containers of different sizes, topped up on kitchen scales to the same mass. Charpentier, 1891.',
  },

  'rubber-hand': {
    lede: 'A rubber hand becomes yours within a minute. Take a swing at it and you flinch.',
    what: 'Your own hand is hidden, and a rubber one lies next to it. Both are stroked with a brush at the same time. After a minute the feeling of touch moves into the rubber hand.',
    how: [
      'Sight, touch and your sense of where your body is disagree. The cheapest way to reconcile them is to adopt the hand you can see.',
      'So the sense of owning your body is inferred rather than given, and the inference can be faked.',
    ],
    twist: 'This cannot be done in a browser, and the page does not pretend otherwise. Instead it gives a protocol: a rubber hand or a stuffed glove, a partition to hide your real hand, two brushes, a helper, and always a control condition with out-of-sync stroking. Without the control it is a party trick, not an experiment.',
  },

  'phantom-limb': {
    lede: 'An amputated limb goes on being felt: its position, its movement and, very often, pain.',
    what: 'An arm or a leg that is no longer there holds a position in space, clenches, goes numb and hurts.',
    how: [
      'The body model keeps running without its input. It is kept going by reorganisation in the cortex and by conflicts between motor commands and the feedback that never arrives.',
    ],
    twist: 'This is not a demonstration, and it must not be presented as a trick: most amputees live with it. It is in the catalogue for two reasons. It is the strongest evidence that the body model is generated rather than received from outside. And research on phantoms gave us mirror therapy, one of the few cases where studying illusions led to a treatment.',
  },

  'pinocchio-illusion': {
    lede: 'A vibrator on the biceps tendon, and your nose grows by up to thirty centimetres.',
    what: 'Blindfolded, you hold your nose. Your arm “straightens”, yet your finger stays on your nose. So the nose must have grown.',
    how: [
      'The vibration stimulates the muscle spindles and reports a stretch that is not happening. That sets up a conflict: the arm has straightened, but the finger is still on the nose.',
      'The conflict is resolved not by cancelling the touch but by bending the body model. Stretching your nose is easier than doubting your own sense of touch.',
    ],
    twist: 'A vivid demonstration that the body model is a construction that can be edited from outside. The catalogue first filed this entry under body ownership and later moved it to proprioception: the mechanism lies in the sense of limb position, not in the sense that the limb is yours.',
  },

  'cutaneous-rabbit': {
    lede: 'A quick run of taps at the wrist, then another near the elbow. It feels like something hopping all the way up your forearm.',
    what: 'The taps are felt evenly spaced along the arm, in places nobody touched.',
    how: [
      'Location is assigned after the fact. The later taps rewrite where the earlier ones were felt.',
      'This is tactile postdiction in its purest form: where you felt a tap depends on what happened after it.',
    ],
    twist: 'Clear evidence from touch that perception is not assembled in real time. The taps have to come about 40–80 ms apart, which is faster than a hand can manage reliably: two vibration motors do it best.',
  },

  'tau-effect': {
    lede: 'Three touches, equally spaced along the arm, feel unequally spaced if the pauses between them differ.',
    what: 'Time bends felt distance.',
    how: [
      'It runs on an assumption of constant speed: if the gap in time was shorter, the distance must have been shorter too.',
    ],
    twist: 'The mirror twin of the kappa effect. There, space distorts time; here, time distorts space. The two are one assumption seen from opposite sides, and they are best shown together.',
  },

  'funneling-illusion': {
    lede: 'Two vibrators on the skin feel like one, somewhere between them.',
    what: 'Both are buzzing, you feel a single spot, and neither vibrator is at it. Change the balance of strength and the phantom slides from one to the other.',
    how: [
      'Lateral inhibition in the somatosensory system merges the two inputs into one sensation, centred at their weighted midpoint.',
    ],
    twist: 'That is how a phone with two motors can place a sensation between them. The whole vibrotactile interface industry rests on it, and von Békésy described the mechanism in 1958, half a century before the industry arrived.',
  },

  'tactile-aftereffect': {
    lede: 'Run a finger along a convex edge, and a straight edge will then feel concave.',
    what: 'A minute on a curved surface, then a straight one, and the straight one bends the other way.',
    how: [
      'Mechanisms tuned to curvature adapt. It is the same thing as the visual curvature and tilt aftereffects, only in touch.',
    ],
    twist: 'Gibson described it in 1933, in the same paper as the visual curvature aftereffect and four years before he and Radner described the tilt aftereffect. The catalogue first filed this entry under touch localisation and later moved it to shape: it is a curvature aftereffect, so it is about shape.',
  },

  'thermal-referral': {
    lede: 'Two fingers out of three are warmed. All three feel warm.',
    what: 'Three fingers rest on a surface, and only the outer two are heated. The middle one feels warm too.',
    how: [
      'Temperature on its own is hard to pin to a place: the thermal sense has poor spatial resolution. So the location is borrowed from the touch map. Where you feel contact, you feel the warmth.',
    ],
    twist: 'The safe member of the thermal family. Three coins, two of them warmed, are all it takes. Unlike the thermal grill next to it, this one can safely come with instructions.',
  },

  'thermal-grill': {
    lede: 'Alternating warm and cool bars burn. Neither temperature is anywhere near painful.',
    what: 'A grill of bars at 40 °C and 20 °C. Touching it produces a burning pain.',
    how: [
      'Pathways that respond to cool normally hold back a pain pathway. The warm bars lift that brake, and a harmless stimulus gets reported as pain.',
    ],
    caution: 'The catalogue documents this and deliberately does not turn it into a demonstration. A grill can be made from copper tubes and two water baths, but it causes real pain, and the safety margin on the temperatures is small. There are no instructions for making one here.',
  },

  'pseudo-haptics': {
    lede: 'Slow the cursor down and the mouse gets heavier. Nothing at all is pressing on your hand.',
    what: 'The cursor crosses a region and slows down. You feel weight, friction, roughness, stickiness.',
    how: [
      'Force is inferred from the mismatch between the motor command and what happened on screen. Change the control-display ratio and you manufacture that mismatch on purpose.',
    ],
    demo: 'pseudo-haptics',
    demoNote: 'A demonstration that suits a browser perfectly, yet you rarely see it online: an object you drag, with different cursor gain in different regions. Bumps, weight, friction and stickiness, all from a mouse that can do none of those things. It works on a trackpad and is weaker on a touchscreen.',
    twist: 'A whole literature of illusions invented on purpose, for interfaces, and not one of the catalogues of illusions this project consulted even registers it.',
  },

  'redirected-walking': {
    lede: 'You walked straight across a field. You were walking in circles around a room.',
    what: 'In a headset, the world is turned by fractions of a degree with each step, below the threshold of detection. The walker is certain they are going straight.',
    how: [
      'You judge the direction you are moving in mostly by sight. A slow enough rotation of the picture is simply absorbed and never noticed.',
    ],
    twist: 'An illusion designed for a job rather than found in a lab. For a long time the catalogue had nowhere to put that kind of thing.',
  },

  'full-body-illusion': {
    lede: 'You see your own back from three metres away, and that is where you feel you are.',
    what: 'A headset shows you from behind, someone strokes your back, and your sense of where you are drifts towards the body you can see.',
    how: [
      'It is the same reconciling of evidence as with the rubber hand, only for the whole body: where you feel you are follows the body you see.',
    ],
    twist: 'An earlier version of the catalogue had this merged with Ehrsson’s out-of-body illusion; they are separate experiments and now separate entries. It needs a headset, a camera and a second person. The site cannot provide that, and it is better to say so plainly.',
  },
};
