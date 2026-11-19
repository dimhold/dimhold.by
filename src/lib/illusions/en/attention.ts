/* Attention. The one group where nothing appears and things only go missing. The feeling
   that you see the whole scene in full detail is an illusion too, and this group is
   about that one. */
import type { Group } from '../ru/types';

export const ATTENTION: Group = {
  'change-blindness': {
    lede: 'A large object in the picture vanishes, and you can search for a minute without finding it.',
    what: 'Two versions of a picture alternate with a brief blank between them. Something big changes, appears or disappears.',
    how: [
      'Without attention, your picture of a scene is far sparser than it feels. The sense of a complete picture is an impression, not a fact.',
      'The blank is there to swamp the local jolt a change would otherwise produce. Normally that transient is exactly what pulls attention in. Take it away and you have to search the scene bit by bit.',
    ],
    demo: 'change-blindness',
    demoNote: 'Not a photo: the scene is drawn by code, so the change is exactly one shape that comes and goes. The scene stays up for about a quarter of a second, followed by an 80 ms blank, as in Rensink’s experiments. There is a stopwatch, and an “I give up” button that circles what was changing.',
  },

  'inattentional-blindness': {
    lede: 'Half the people counting basketball passes never notice someone in a gorilla suit.',
    what: 'The gorilla walks into the middle of the frame, beats its chest and walks off. About half of viewers never see it.',
    how: [
      'Without attention, an unexpected object is barely perceived at all, however conspicuous it is physically.',
    ],
    twist: 'The hardest entry in the catalogue to present honestly, because the demonstration is destroyed by its own title. Anyone who has seen the original video is immune for life. That is why there is no demonstration here: it only works on a viewer who does not know what is coming, and a page with this title has already told you.',
  },

  'attentional-blink': {
    lede: 'Spot the first target and you are blind to the second for half a second.',
    what: 'A rapid stream of letters holds two targets. If the second arrives 200–500 ms after the first, you do not see it.',
    how: [
      'Attention is still busy consolidating the first target when the second one arrives. Half a second later it is free again, and everything comes back.',
      'That is why the accuracy curve is U-shaped. At a very short gap the second target slips through along with the first; at a medium gap it drops out; at a long gap it recovers.',
    ],
    demo: 'attentional-blink',
    demoNote: 'Ten items a second: a stream of letters with the first target in red and the second target, a digit, one to seven places after it. Fifteen runs, three at each of five lags. After each run you name the red letter, then the digit, each from a choice of four. Your accuracy on the digit, counted only when you got the letter right, is plotted against lag and should trace the textbook dip. The frames change with the screen’s refresh, and the page tells you how long a frame actually lasted on average.',
  },

  crowding: {
    lede: 'A letter you can easily read out of the corner of your eye becomes unreadable between two neighbours.',
    what: 'You can see that something is there. You cannot tell what.',
    how: [
      'Features are pooled over a region that grows with distance from the centre of gaze.',
      'Bouma’s law puts the critical spacing at about half the eccentricity: a letter 10° from fixation needs 5° of clear space around it.',
    ],
    demo: 'crowding',
    demoNote: 'A fixation cross, a target letter at a set eccentricity, flankers with adjustable spacing. In a minute you measure your own critical spacing and check Bouma’s law. That is a genuine replication, not a re-enactment.',
    twist: 'This is the main limit on reading speed in peripheral vision. Korte was the first to describe it, in 1923; Bouma gave the quantitative law in 1970.',
  },

  'vanishing-ball-illusion': {
    lede: 'A magician throws a ball up for the third time. It rises and dissolves in mid-air. There was no third throw.',
    what: 'About two thirds of viewers (68 per cent in the original study) see the ball go up and vanish. It was in his hand the whole time.',
    how: [
      'Social cues do the work. When the magician’s eyes follow the imaginary ball, most viewers see it fly; when he looks at his hand instead, most do not. Eye tracking shows viewers glancing at his face, while their own eyes never travel to where the ball supposedly went.',
      'Add a cue from his gaze to what you already expect, and perception fills in an event that never happened.',
    ],
    demo: 'vanishing-ball-illusion',
    demoNote: 'Our own version, in three takes: a normal one, one with the magician’s face covered, and one where he looks at his hand. The effect gets weaker with each take. Side by side, they make a whole psychology lecture in ninety seconds.',
    twist: 'This opens a whole class of techniques that were working tools of the trade for centuries before anyone studied them. Stage magic is a research literature that the standard catalogues of illusions never cite.',
  },
};
