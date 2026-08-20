# The three recordings

`public/audio/` holds one clip per mark on the hero picture. All three are mono,
44.1 kHz, and normalised to **−17 LUFS** so that moving between them does not
jump in volume — the ear notices a 2 dB step immediately, and three clips
mastered separately will always be that far apart.

## Where they came from

| File | Source | Cut |
| --- | --- | --- |
| `kenar.mp3` | «УРОК 12 ПЕНИЕ КЕНАРА» | 00:11.5 → 00:31.5, one take |
| `zoom.mp3` | «Веймаранер скулит и лает (HQ sound)» | 00:01.2–00:11.2 + 00:13.5–00:20.0 + 00:48.8–00:52.9, cross-faded |
| `dmitriy.mp3` | `data/me.mp3` | whole take, processed |

## How the canary window was chosen

The lesson video is seven minutes long. Splitting it into a song band
(2.2–7 kHz, where a canary's trill lives) and a voice band (120–900 Hz, where a
narrator would be) and scoring every 20-second window on song energy minus voice
energy found 00:11.5 — a stretch where the bird sings almost without pause and
nobody talks over it.

## How the dog window was chosen

The brief was whining with a little barking, not a barrage. Whines and barks
separate cleanly on two measurements: a whine is a narrow tonal cry with its
energy 400–1600 Hz, a bark is a short broadband slam with much more energy at
2–5 kHz and a fast attack. Scoring every window on whine count, penalised for
silence and for more than three barks, put the best material in the first twenty
seconds of the file — which then thinned out, so the clip is three stretches
cross-faded rather than one.

## What was done to the voice

Measured first. The presence band (1.5–4 kHz) sat **9.3 dB below** the mids,
which is what makes a recording sound like it is coming through a wall, and
there was almost nothing above 9 kHz.

The chain: two high-pass stages at 80 Hz, gentle broadband noise reduction, a
cut at 220 and 330 Hz to clear the mud, +4.5 dB at 3 kHz for presence, a dip at
6.5 kHz so the presence lift does not turn into a lisp, a small shelf at 10 kHz,
then 3:1 compression and normalisation.

Presence now sits 4.5 dB below the mids instead of 9.3.

Two things worth remembering for next time:

- **`alimiter` re-normalises by default.** Its `level` option is on unless you
  turn it off, so lowering `limit` makes the file *louder*, not quieter. Use
  `level=disabled` whenever it is being used as a ceiling.
- **The ceiling has to sit well under 0 dBFS before an mp3 encoder.** The
  decoder overshoots the sample peaks it was given; a file limited to −1 dBFS
  came back measuring +1.6. All three are limited to about −3 dBFS in PCM.
