/* Motion. The largest group in the catalogue and the most closely knit: nearly everything
   here comes back to one problem. An edge seen through a small window cannot tell you which
   way it is moving. */
import type { Group } from '../ru/types';

export const MOTION: Group = {
  autokinetic: {
    lede: 'A single point of light in total darkness starts to wander off on its own.',
    what: 'The point is fixed. After a few seconds it drifts sideways, comes back, jerks about. Every viewer gets a different direction and a different distance.',
    how: [
      'The eye is never still. In an ordinary room this does no harm: everything else shifts along with the point, and the system works out that it was the viewer who moved.',
      'In the dark there is nothing to compare against. The eye’s own drift and real movement of the point become indistinguishable, and the brain picks the second.',
    ],
    twist: 'Muzafer Sherif built his classic experiment on this effect. People were asked how far the point had moved, and within a group their answers converged on a shared number. There was no right answer at all. The same effect accounts for a good share of historical reports of unidentified objects in the night sky.',
  },

  barberpole: {
    lede: 'The stripes on the pole move sideways. They seem to go up.',
    what: 'A cylinder with slanted stripes turns about its vertical axis, so the stripes actually travel horizontally. What you see is stripes rising forever.',
    how: [
      'This is the aperture problem in its purest form. An edge seen through a limited window does not give away its direction: motion along the edge is invisible, only the component across it registers, and infinitely many real motions fit what you see.',
      'The only unambiguous signal comes from the ends of the stripes at the edges of the window. They move upwards, and the whole stripe goes with them.',
      'Turn the window through ninety degrees, change nothing about the motion itself, and the stripes will travel sideways. That one move makes the case.',
    ],
    demo: 'barberpole',
    demoNote: 'The slider changes the proportions of the window. The stripes behind it move exactly as before, not a degree different. The only thing that changes is which sides of the window carry more stripe ends, and the apparent direction flips with them.',
    twist: 'The best way into this whole category: almost everything else here is a variation on the same problem.',
  },

  'beta-movement': {
    lede: 'Two flashes in a row, and something flew between them.',
    what: 'A shape blinks on the left, then on the right. You don’t see two flashes. You see one shape that moved from one place to the other.',
    how: [
      'It is a correspondence problem: the two appearances are either two different objects or one object that moved. The system almost always goes for the second.',
      'This, and not “persistence of vision”, is what makes cinema work. The difference is worth keeping in mind. Persistence would explain why the frames don’t flicker, but it says nothing about why there is motion in them.',
    ],
    demo: 'phi-beta',
    demoNote: 'Shared with the phi phenomenon: a ring of dots with one missing, and a single slider for how long each frame lasts. In the middle of its range you see a dot jump into the gap, and that jump is beta movement.',
    twist: 'Joseph and Barbara Anderson took the persistence-of-vision story apart in 1978 and again in 1993. It is still in most textbooks.',
  },

  'biological-motion': {
    lede: 'Twelve dots. No silhouette, no outline, and you know at once that it’s a person walking.',
    what: 'The dots are attached to the joints of an invisible person. Standing still, they are a meaningless scatter. Set them moving and you get a gait, and with it sex, mood and intent.',
    how: [
      'The kinematics of living movement are handled by a dedicated system centred on the superior temporal sulcus. It has no use for a silhouette. All it needs is trajectories that fit together.',
      'The control is more striking than the effect. Scatter the dots across the field without changing a single trajectory and the person vanishes completely. Same local motions, no percept.',
    ],
    twist: 'Gunnar Johansson filmed this in 1973 with lights fixed to actors. Since then people have been shown to read from point-light figures the weight of a box being lifted, a faked gait, and the identity of a friend seen from behind.',
  },

  'breathing-square': {
    lede: 'A square turns behind four blocks without changing size. You see it breathe.',
    what: 'A square turns at a constant speed behind four occluders that keep hiding its corners. Between them you see only pieces of its sides, and together they make a square that swells and shrinks.',
    how: [
      'The aperture problem again: the ends of the visible pieces give local signals, and the system assembles them into a single change of shape. There is no such change.',
    ],
    demo: 'breathing-square',
    demoNote: 'The button makes the occluders see-through and outlines the whole square. It is rigid, turns at a steady speed and never changes size by a single pixel.',
    twist: 'It has no single famous author. Nicola Bruno wrote about “breathing illusions” of this kind in 2001, and the rotating square is the best known of them.',
  },

  'curveball-break': {
    lede: 'A curveball breaks at exactly the moment you stop looking at it.',
    what: 'The ball travels along a smooth arc. Shift your gaze to one side and it suddenly kinks.',
    how: [
      'Central vision keeps position and spin apart. The periphery adds them together, and the spin leaks into the path you see.',
      'That is why the break comes exactly when you switch from central to peripheral viewing, wherever the ball happens to be in its flight.',
    ],
    twist: 'The illusion settled an argument baseball had been having for a hundred years: does a curveball really break? It doesn’t. What breaks is your view of it.',
  },

  'dual-axis': {
    lede: 'A ring spins about a vertical axis. Or a horizontal one. You choose without knowing it.',
    what: 'The rotating ring can be read in two ways that cannot both be true. It switches when you follow a different part of it.',
    how: [
      'A flat projection of a rotating ring fits two rigid 3D motions equally well. Nothing in the image favours either one.',
      'Unlike the Necker cube, this one can be steered: just latch your eyes onto a different stretch of the outline.',
    ],
    twist: 'First prize in the Best Illusion of the Year Contest in 2019, made by one person with nothing but procedural graphics.',
  },

  enigma: {
    lede: 'A 1981 painting that turned out to be a scientific instrument.',
    what: 'A dense fan of radial lines with coloured rings on top. The rings fill with a fast flow, as if liquid were being pumped round them.',
    how: [
      'The speed of that flow follows, almost perfectly, the rate of microsaccades: the tiny jerks the eye makes all the time.',
      'Troncoso and colleagues measured both at once and found a direct relationship. The illusion stopped being a curiosity and became a way of seeing what microsaccades contribute to perception.',
    ],
    demo: 'enigma',
    demoNote: 'Line density and ring width are adjustable. The geometry is our own: Leviant’s painting is under copyright, and we are not going to trace it.',
    twist: 'Isia Leviant made it as a painting. Fifteen years later he published a paper about it in the Proceedings of the Royal Society.',
  },

  'flash-lag': {
    lede: 'A flash right beside a moving object seems to lag behind it.',
    what: 'A bar sweeps round a circle, and at some moment a second bar flashes next to it, exactly in line. You see the flash trailing behind.',
    how: [
      'Explanation one, extrapolation: vision knows about its own delay and pushes the moving object forward to make up for it. The flash can’t be pushed anywhere, because it isn’t moving.',
      'Explanation two, postdiction: where the flash was is decided by what happens after it. The moment is assembled in hindsight.',
      'Explanation three, differential latency: the flash and the motion are simply processed at different speeds.',
    ],
    twist: 'The argument is still open, and this catalogue won’t settle it. Donald MacKay described the effect as early as 1958; Romi Nijhawan rediscovered and named it in 1994, and it was his paper that set off thirty years of argument over the cause.',
  },

  'fraser-wilcox': {
    lede: 'Repeating gradients from dark to light move like an escalator.',
    what: 'A still picture. Rings of repeating brightness steps creep steadily in one direction.',
    how: [
      'The asymmetric luminance gradient does it: dark and light are processed with different delays, and where they meet a false motion signal appears.',
      'Akiyoshi Kitaoka has since sorted the optimised luminance profiles into types, up to Type V.',
    ],
    demo: 'peripheral-drift',
    demoNote: 'One renderer serves three entries: this one, the peripheral drift illusion and Rotating Snakes. Each ring repeats four steps of brightness. One slider sets the number of rings; the other, the brightness order, has three positions. Kitaoka’s order drifts, a symmetric order doesn’t move at all, and the reversed order drifts the other way.',
    twist: 'It gets its own entry for a reason: this is the priority claim that Rotating Snakes rests on.',
  },

  'freezing-rotation': {
    lede: 'The rotation stops without slowing down.',
    what: 'A pattern rotates. Add a second component of motion and the rotation freezes, though physically it carries on at the same speed.',
    how: [
      'The two components cancel each other out in the signal the visible rotation is built from. The rotation itself never stops.',
    ],
  },

  'frequency-doubling': {
    lede: 'Twice as many stripes as were drawn.',
    what: 'A coarse grating flickers rapidly in counterphase. Count the stripes and you get double the real number.',
    how: [
      'The visual system responds to this kind of flicker non-linearly: the signal is rectified, and its spatial frequency doubles. The magnocellular pathway is the likely source.',
    ],
    demo: 'frequency-doubling',
    demoNote: 'You set the grating frequency and the flicker rate. You can count the stripes and be wrong by exactly a factor of two, which is unusually precise for a perceptual demonstration.',
    twist: 'One of very few illusions in routine clinical use: frequency-doubling perimetry, which screens for glaucoma, is built on it.',
  },

  'kinetic-depth': {
    lede: 'A flat tangle of lines. Set it turning and it becomes solid.',
    what: 'The shadow of a bent wire is a meaningless snarl. As soon as the wire turns, its shape becomes obvious and unambiguous.',
    how: [
      'Shape is recovered from the relative speeds of points, on one assumption: the object is rigid and doesn’t bend as it moves.',
      'It is a strong assumption and usually a true one. It is what makes the problem solvable.',
    ],
    demo: 'kinetic-depth',
    demoNote: 'A cloud of dots on an invisible cylinder. Stopped, it is a flat scatter; running, it is a cylinder. The direction of rotation also flips on its own, so you get a second illusion for free.',
  },

  'motion-aftereffect': {
    lede: 'Watch a waterfall for a minute, then look at the rock beside it. The rock will move upwards.',
    what: 'After a long look at motion in one direction, a still scene drifts the opposite way while staying perfectly still.',
    how: [
      'Direction is signalled by cells, each tuned to one direction. They work in opposing pairs, and at rest their signals balance out.',
      'Prolonged motion one way tires one half of the pair. The balance tips, and with no motion at all the system reports motion backwards.',
      'This was the first evidence that perception has parts that can be tired out separately.',
    ],
    demo: 'motion-aftereffect',
    demoNote: 'Sixty seconds of adaptation on a timer, then a still image and a stopwatch: how long did your aftereffect last? The number is yours, not a textbook’s.',
    twist: 'The oldest entry in the catalogue with an unbroken written record: Aristotle, Lucretius, Purkyně in 1820, Robert Addams in 1834. Addams was describing an actual waterfall, the Falls of Foyers in Scotland.',
  },

  'motion-binding': {
    lede: 'Four separate lines, or one diamond behind four blocks. It depends on whether you can see the blocks.',
    what: 'A diamond moves round a small circle with its corners hidden behind four occluders, so only the middles of its sides show. While the occluders are the same colour as the background, you see four lines, each going its own way. Make the occluders visible and the lines become a single diamond moving behind them.',
    how: [
      'Where the lines end at the edges of the occluders, their ends carry a false motion signal, the same line-end signal that drives the barber pole.',
      'A visible occluder explains where those ends come from: they mark where the object goes out of sight, not where it ends. The system discards them and binds the contours into one object.',
    ],
    demo: 'motion-binding',
    demoNote: 'A toggle shows or hides the occluders. The motion itself doesn’t change. What changes is the explanation vision can afford to accept.',
  },

  'motion-induced-blindness': {
    lede: 'A bright yellow dot simply disappears. For seconds. In perfectly healthy eyes.',
    what: 'Three yellow dots sit on a slowly rotating field of blue crosses. They vanish, one at a time or sometimes all together, and come back.',
    how: [
      'The moving pattern and the still dots compete for the same place in perception. It resembles binocular rivalry, only between layers of a single picture.',
      'Nothing dims or fades. The dot goes completely and instantly, and comes back just as instantly.',
    ],
    demo: 'motion-induced-blindness',
    demoNote: 'Hold the space bar down while a dot is missing. Each disappearance adds a bar to the chart below, its height showing how long the dot was gone, and the page keeps the average.',
    twist: 'It is unpleasant to experience, and that is the point. A bright, high-contrast, clearly visible object drops out of healthy vision, and there is nothing you can do about it.',
  },

  ouchi: {
    lede: 'A patch of checks floats free of the background at the slightest movement.',
    what: 'A field of vertical rectangular checks with a round inset made of the same checks laid horizontally. The inset slides about on its own, as if it were on a separate layer.',
    how: [
      'The two textures solve the aperture problem differently: checks elongated vertically give one estimate of direction, checks elongated horizontally give another.',
      'They can’t be reconciled into one surface, so the system puts them on two.',
    ],
    demo: 'ouchi',
    demoNote: 'Sliders set the check proportions and the size of the inset. The whole picture wobbles gently, background and inset together, so you don’t have to shake the screen, and the inset still seems to slide about on its own. Make the checks square and the effect disappears: there is nothing left to separate.',
    twist: 'Hajime Ōuchi printed it in 1977 in a book of optical art. Lothar Spillmann pulled it into science, and you can point to the exact moment it crossed over from design into research.',
  },

  'peripheral-drift': {
    lede: 'Out of the corner of your eye the picture creeps. Look straight at it and it stops.',
    what: 'A still sawtooth pattern of brightness drifts while it is off to the side, and freezes as soon as you look at it.',
    how: [
      'Regions of different brightness are processed at different speeds. Where they meet, the difference in timing turns into a false direction signal.',
      'At the centre of gaze, resolution is higher and processing times are more even, which is why the effect dies there.',
    ],
    demo: 'peripheral-drift',
    demoNote: 'The same renderer as Fraser–Wilcox and the Snakes, with the same three-position slider for the brightness order: Kitaoka’s order drifts, a symmetric one stays put, a reversed one drifts backwards. Keep your eyes on the red dot: there is motion everywhere except where you are looking.',
  },

  'phi-phenomenon': {
    lede: 'Motion with nothing moving. Something passed, yet nothing made the trip.',
    what: 'When two flashes alternate quickly, you see motion, and yet no object doing the moving. Just the bare sense that something passed between them.',
    how: [
      'Motion is computed separately from whatever is moving. Phi is the motion system filing its report at a moment when the recognition system has nothing to show.',
    ],
    demo: 'phi-beta',
    demoNote: 'A ring of eight dots, one of them missing, with the gap moving round from frame to frame: Steinman’s magni-phi. The slider sets how long each frame lasts. With long frames the dots just go out and come back one after another. In the middle you get beta movement, a dot jumping into the gap. With short frames you get pure phi: a kind of shadow runs round the ring while no dot moves. The page tells you which regime you are in.',
    twist: 'Popular accounts keep confusing phi with beta movement, to the point of claiming that cinema runs on phi. Cinema runs on beta.',
  },

  'pinna-brelstaff': {
    lede: 'Two rings start turning in opposite directions as you lean towards the screen.',
    what: 'Concentric rings of tilted squares. The picture itself is still; the rotation comes from your own movement towards it and away.',
    how: [
      'The tilted elements give oblique local motion signals. Pooled together, they add up to a rotation that isn’t there.',
      'Area MT carries the local signals as usual. The rotation itself first shows up one stage later, in MST, which reads motion across the whole field at once.',
    ],
    demo: 'pinna-brelstaff',
    demoNote: 'The page does the zooming so you don’t have to move your head. A toggle brings back the honest mode, “move yourself”, if you want to check.',
  },

  'reverse-phi': {
    lede: 'Flip the contrast on every other frame and the motion runs backwards.',
    what: 'A pattern moves to the right. Invert the brightness of every second frame, touch nothing else, and it moves to the left.',
    how: [
      'Low-level motion detectors compare brightness at neighbouring points at successive moments. Inverting the contrast flips the sign of that comparison, and the direction with it.',
      'The detector needs no object to do this. That is why reverse phi is the cleanest proof that motion is computed before objects are recognised.',
    ],
    demo: 'reverse-phi',
    demoNote: 'An inversion toggle. Nothing changes except the sign of the contrast, and the direction reverses instantly.',
  },

  'roget-palisade': {
    lede: 'The spokes of a wheel seen through a fence are curved. And they curve differently on either side of the axle.',
    what: 'A wheel rolls behind vertical slats. The spokes visible in the gaps are bent into arcs, and the arcs bow opposite ways on the left and on the right.',
    how: [
      'The gaps turn continuous motion into samples: each successive gap catches the spoke at a different point in its turn.',
      'The sequence of these fragments is put together into one curved spoke.',
    ],
    demo: 'roget-palisade',
    demoNote: 'Sliders set the slat width, the gap between the slats and the speed of rotation. Take the slat width down to zero and the fence disappears: the spokes are plain straight lines, and the curve exists only in the gaps.',
    twist: 'Peter Mark Roget, as in the thesaurus. His 1825 paper in the Philosophical Transactions turned up late in the making of this catalogue, in sources already collected but never properly read. It is the ancestor of the whole stroboscopic family, cinema included.',
  },

  'rotating-circles': {
    lede: 'The circles move in straight lines and at the same time circle round one another.',
    what: 'Eight circles, each swinging back and forth along its own straight line through the centre. You see them dancing in a ring.',
    how: [
      'Global pooling of motion overrides the correct local paths: the system prefers one coherent rotation to several unrelated straight lines.',
    ],
    demo: 'rotating-circles',
    demoNote: 'The button draws the trails: eight straight lines through the centre.',
  },

  'rotating-snakes': {
    lede: 'Rings of coloured segments turn. It’s a still picture: a screenshot rotates just as well.',
    what: 'Concentric rings built from a repeating set of four colours rotate smoothly and continuously. Not a single pixel changes.',
    how: [
      'It all comes down to the order of brightness within the set of four. An asymmetric sequence gives a false direction signal at every boundary.',
      'The pushes come from microsaccades and blinks: between them the picture holds still, and with each one it jumps.',
    ],
    demo: 'rotating-snakes',
    demoNote: 'The rings are built from the published luminance rule, not traced from Kitaoka’s image, which is under his copyright. That turns the rule into a control. The brightness-order slider has three positions: Kitaoka’s black, blue, white, yellow drifts; a symmetric order (black, blue, white, blue) doesn’t move at all; the reversed order drifts the other way. Another slider sets the number of rings. Wherever you look straight at the picture, the rotation stops.',
  },

  silencing: {
    lede: 'The dots stop changing colour as soon as the ring starts to rotate. They don’t really stop.',
    what: 'A ring of dots shimmers rapidly from colour to colour. Set the ring turning and the shimmering seems to stop. The rate of change is exactly the same.',
    how: [
      'Motion plus crowding: the signal that a colour has changed gets lost as soon as the objects start moving. The system doesn’t have time to pin the change on a particular dot.',
    ],
    demo: 'silencing',
    demoNote: 'A slider sets the rotation speed, and a menu picks the kind of change: colour, brightness or size. One button stops the rotation without touching the changes, and that is all the demonstration needs.',
    twist: 'Among the most startling entries here, and among the simplest. The two rarely go together.',
  },

  'stepping-feet': {
    lede: 'Two rectangles move at the same constant speed, and yet they step.',
    what: 'A light grey and a dark grey rectangle glide across black and white stripes. They seem to take turns stopping and stepping forward, like feet.',
    how: [
      'Perceived speed depends on contrast. When the edge of a rectangle matches the brightness of the stripe it is crossing, contrast drops and the rectangle seems to slow down.',
      'The light one loses contrast on the white stripes, the dark one on the black. Hence the alternation.',
    ],
    demo: 'stepping-feet',
    demoNote: 'Sliders control the brightness of each rectangle and the contrast of the stripes. Make both rectangles mid-grey: the stepping goes, the speed stays the same.',
  },

  'stroboscopic-effect': {
    lede: 'Under flickering light, rotation freezes, slows down or runs backwards.',
    what: 'Cyclic motion under intermittent light loses its true speed: a wheel stands still, creeps backwards or barely moves forward.',
    how: [
      'The flashes take samples of continuous motion. If the sampling rate can’t keep up with the frequency of the pattern, the reconstructed motion has nothing to do with the real one.',
    ],
    demo: 'wagon-wheel',
    demoNote: 'Shared with the wagon-wheel effect.',
    twist: 'Simon Stampfer’s stroboscopic discs of 1833 were an instrument for studying perception. Cinema grew out of that instrument.',
  },

  ternus: {
    lede: 'Three dots jump one place over. As a group or one at a time? The pause between frames decides.',
    what: 'You see either the whole trio move together, or the end dot hop over the other two. Nothing changes except the length of the blank gap.',
    how: [
      'The correspondence problem is solved by two systems with different time constants, and they compete.',
      'A short pause gives the win to the fast system, and you see a single element jump. A long pause gives it to the slow one, and you see the group move.',
    ],
    demo: 'ternus',
    demoNote: 'A pause slider in milliseconds. The switch usually falls somewhere around fifty; find yours. It is a genuine individual measurement.',
  },

  thaumatrope: {
    lede: 'A bird on one side, a cage on the other. Spin it and the bird is in the cage.',
    what: 'A cardboard disc on two strings. Spun fast, the two pictures merge into one.',
    how: [
      'The usual explanation is persistence of vision. The modern one is temporal summation: the visual system adds up whatever arrives within a short window, which is not the same thing.',
    ],
    twist: 'It is a toy more than an illusion. It stays in the catalogue because this is where the general public first learned that vision can be fooled systematically. Who invented it is disputed: John Ayrton Paris usually gets the credit, but Peter Mark Roget and William Henry Fitton both have claims.',
  },

  'tusi-couple': {
    lede: 'A dot travels in a dead straight line. The eye refuses to see it.',
    what: 'A small circle rolls inside one twice its size. Any point on the small circle then traces a straight line, a diameter. You see anything but a straight line.',
    how: [
      'Rotational signals drown out the correct straight path of the single point. There are too many of them, and they agree too well.',
    ],
    demo: 'tusi',
    demoNote: 'Pure geometry, accurate to the pixel. The trail button proves the path is a diameter.',
    twist: 'Nasir al-Din al-Tusi devised the mechanism in 1247 to patch a hole in Ptolemaic astronomy. It became an illusion 766 years later.',
  },

  'two-stroke-motion': {
    lede: 'Two frames on a loop, and motion in one direction that never ends.',
    what: 'Only two images alternate, with a brief blank inserted before the return to the first. The motion runs on continuously and never steps back.',
    how: [
      'Ordinary apparent motion supplies the forward stroke. The blank interval reverses the return stroke, turning it into more of the same forward motion, so there is nothing left to go back.',
    ],
    demo: 'reverse-phi',
    demoNote: 'This entry shares the reverse-phi demo, which has a switch of its own for it. “Just two frames” shows the grating in two positions with a brief grey blank before each return, and it keeps travelling the same way: that is George Mather’s two-stroke motion. Turn on the inversion as well and you get the four-stroke motion of Anstis and Rogers, where the contrast flips on every return instead.',
  },

  'wagon-wheel': {
    lede: 'On film, the wheel turns backwards. Sometimes off film too.',
    what: 'A spoked wheel, filmed or under a strobe, turns slowly backwards, stands still or barely creeps forward.',
    how: [
      'Under flickering light or on film it is simple: the sampling rate beats against the spoke frequency, and you get aliasing.',
      'The hard part is continuous light, where there is no sampling. One proposal is that the visual system does the sampling itself, and that is still disputed.',
    ],
    demo: 'wagon-wheel',
    demoNote: 'Two wheels side by side. The left one is drawn frame by frame at your screen’s refresh rate. At low speeds it turns as it should; once a spoke travels more than half the gap between spokes in a single frame, aliasing sets in, and the label underneath says when. The right one is smeared over a fifteenth of a second and doesn’t alias at any speed. Together they make sense of the argument about continuous light.',
    twist: 'Here the interesting question is not “why does this happen” but “does it happen at all”, at least under some conditions.',
  },

  zoetrope: {
    lede: 'A drum with slits and pictures inside. Spin it and the pictures move.',
    what: 'You look through the slits into the spinning drum and see continuous animation.',
    how: [
      'Beta movement does the work, and the slits act as a shutter: they keep the frames apart so they don’t smear into a ring.',
    ],
    twist: 'William Horner called it the daedaleum in 1834. The name “zoetrope” came later, along with commercial success.',
  },
};
