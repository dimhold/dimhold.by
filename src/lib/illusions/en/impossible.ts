/* Impossible figures. They all run on the same fault: vision checks each joint separately
   and never asks whether the joints add up to a whole. Four costumes, one mistake.

   On copyright: Escher’s work is protected until 2043, so none of it is reproduced here.
   We build our own objects with the same trick instead, which is the proper way to do it
   and, on reflection, the more interesting one. */
import type { Group } from '../ru/types';

export const IMPOSSIBLE: Group = {
  'penrose-triangle': {
    lede: 'Three beams meeting at right angles in a closed loop.',
    what: 'Each corner, taken alone, is fine. The whole cannot exist.',
    how: [
      'The visual system checks the joints locally and never asks whether they add up to a whole. Three correct corners, and the global contradiction goes unnoticed.',
      'Formally, it is a non-zero cohomology class on the figure. Roger Penrose wrote this down in 1992, thirty-four years after the figure itself.',
      'You can build a physical model. It looks like a triangle from exactly one point and falls apart from any other.',
    ],
    demo: 'penrose-triangle',
    demoNote: 'We build a real open object that projects into a tribar from exactly one direction. Move the camera away and it falls apart. That is the point: the figure does not become a lie until you move.',
    twist: 'The figure was drawn by a Swedish schoolboy, Oscar Reutersvärd, in a Latin lesson in 1934. The Penroses did not know about him and arrived at the same thing independently in 1958. Sweden put the figure on a stamp in 1982. Real sculptures stand in Perth and in Ophoven, and each works from a single viewpoint.',
  },

  'impossible-object': {
    lede: 'The umbrella entry: a flat drawing that reads as a solid object, except no such object exists.',
    what: 'The whole class. The reading arrives instantly and cannot be cancelled at will; knowing the object is impossible changes nothing.',
    how: [
      'The three-dimensional interpretation is assembled from local joints, and there is no global check anywhere in the assembly.',
      'Hence the property the whole group shares: cover part of the figure, and what is left becomes perfectly normal.',
    ],
    demo: 'impossible-object',
    demoNote: 'A shared showcase with one camera control: the tribar, the staircase, the cube, and as a fourth item Hogarth’s engraving of 1754. It packs in at least twenty absurdities at once.',
    twist: 'Hogarth’s Satire on False Perspective of 1754 is probably the first deliberately impossible picture, and it is in the public domain. The class got its name from the Penroses in 1958.',
  },

  'penrose-stairs': {
    lede: 'A staircase climbs through four right angles and arrives back where it started.',
    what: 'Every flight goes up. Walk all four, and you are back on the landing you set out from.',
    how: [
      'The depth relations at each step are consistent. What is not consistent is the height gained over the full circuit, and the visual system never adds that up.',
    ],
    demo: 'penrose-stairs',
    demoNote: 'Open geometry: three flights of steps laid along the same loop as the tribar, closed only in projection. Turn the camera and the gap shows.',
    twist: 'Escher’s Ascending and Descending, March 1960, grew straight out of the Penroses’ paper. The staircase itself appears in Reutersvärd’s work as early as 1937.',
  },

  'impossible-cube': {
    lede: 'A wireframe cube whose edges cross in a way no cube’s can.',
    what: 'Two edge crossings give contradictory answers about which edge is nearer.',
    how: [
      'Each overlap is accepted separately and is locally flawless. Together they are incompatible.',
    ],
    demo: 'impossible-cube',
    demoNote: 'Twelve bars of an ordinary cube, two of them drawn out of turn, so their overlaps contradict the other ten while each one on its own looks fine. Turning the camera is the exhibit.',
    twist: 'In Escher’s Belvedere, the boy sitting in the foreground holds exactly this kind of cube, in front of a building that makes the same mistake on an architectural scale.',
  },

  blivet: {
    lede: 'Two rectangular prongs at one end, three round ones at the other.',
    what: 'Your eye cannot travel from one end to the other: somewhere along the way the prongs stop matching up.',
    how: [
      'Figure and ground swap roles along the length of the object. What was a gap becomes a prong.',
      'The only way to resolve it is to shift your gaze, and that is exactly what Schuster pointed out in 1964.',
    ],
    demo: 'blivet',
    demoNote: 'You can slide a cover along the figure. With the other end covered, each end makes perfect sense; the contradiction exists only while both are in view.',
    twist: 'The best example of an illusion with no author to be found: folk knowledge that slipped into the literature sideways. Schuster, in 1964, only described it.',
  },

  'shepard-elephant': {
    lede: 'An elephant whose legs cannot be counted.',
    what: 'The gaps between the legs are legs too. Every attempt to count them comes to nothing.',
    how: [
      'Figure–ground ambiguity, applied locally: the gaps have been given feet, and there is nothing left to decide which regions own the contours.',
    ],
    demo: 'shepard-elephant',
    demoNote: 'We draw our own animal rather than copying Shepard’s. A slider moves the feet onto the right verticals and resolves everything, which explains it better than any caption.',
    twist: 'The same Shepard as the Shepard tables and the Shepard tone. Three entries in this catalogue from one person, in three different modalities.',
  },

  'sugihara-ambiguous-cylinder': {
    lede: 'Seen directly, circles. In the mirror behind them, squares.',
    what: 'A row of objects: round from the front, square in the mirror. Turn them through 180° and they swap.',
    how: [
      'One curved rim can give two different outlines from two viewpoints. For each view separately, the visual system fills in the simplest solid that fits it.',
      'The simplest solids come out different, and neither of them is a mistake.',
    ],
    demo: 'sugihara-ambiguous-cylinder',
    demoNote: 'The cylinder wall is computed from two given silhouettes. The construction is written out in full in the paper, so we implement the maths rather than copy a model. There is an STL export: you can print one and hold it.',
  },

  'escher-belvedere': {
    lede: 'A two-storey pavilion whose upper floor is turned through 90° from the lower one. They share their columns.',
    what: 'Eight columns hold up both floors at once. Taken one at a time, each stands correctly.',
    how: [
      'The columns are connected alternately front-to-back and back-to-front. Every single connection is plausible.',
    ],
    twist: 'We do not reproduce the lithograph: it is under copyright until 2043. The trick is free to use, though: anyone can build a pavilion of their own on the same columns. A different building, the same impossibility.',
  },

  'escher-waterfall': {
    lede: 'Water runs downhill and arrives at the top of the waterfall that feeds it.',
    what: 'A closed channel in which water flows endlessly down to its own source, turning a mill wheel as it goes.',
    how: [
      'Three Penrose triangles linked into a chain. The height gained over a circuit does not add up, and that is the only thing wrong with it.',
    ],
    twist: 'Escher saw the Penroses’ paper and built Waterfall straight out of tribars. The lithograph dates from 1961 and is still under copyright, so it is not reproduced here. The parts, though, are free for anyone to build a watercourse of their own.',
  },
};
