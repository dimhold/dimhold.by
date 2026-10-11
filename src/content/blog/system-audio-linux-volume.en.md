---
title: "On Linux recording the speakers is free until you touch the volume"
description: "The earshot README says system audio works out of the box on Linux and that macOS has no capture API at all. The macOS line is wrong since macOS 13; a virtual device on Windows and macOS is still needed because of ffmpeg. On Linux the monitor is bit for bit at 100%, but on PulseAudio the output slider and mute reach it. On PipeWire the app slider does. With the PulseAudio output slider at 60% earshot cuts no clip at all from 10 spoken sentences."
date: 2026-10-11
lang: en
translationKey: system-audio-linux-volume
tags: ["linux", "debugging"]
---
earshot, my local transcriber, went public in August. Its README has a table I wrote about audio capture. Microphone works on all 3 systems. For system audio, meaning what the speakers are playing, the table says "works out of the box" on Linux. Windows needs Stereo Mix or VB-CABLE and "macOS 12 and later" needs BlackHole. Under the table I wrote that macOS gives an ordinary process no system audio capture API at all.

I wrote that line from memory. The memory is from the years when everybody installed Soundflower to record a Mac. I never checked if it was still true. The Linux row I never questioned either, because on my machine it just worked. This week I went through both rows.

## What the operating systems actually offer

I don't have a Windows or a Mac machine for this, so this part is from the documentation and from source code.

Windows has had loopback capture in WASAPI since Vista. You open a capture stream on a playback device with the `AUDCLNT_STREAMFLAGS_LOOPBACK` flag. There is also process loopback, which captures one application and its child processes. Microsoft lists Windows 10 build 20348 as its minimum. No Windows 10 client release reached that build, it is the build of Windows Server 2022, so in practice it means Windows 11 or that server. macOS got audio in ScreenCaptureKit with macOS 13. Since macOS 14.2 Core Audio also has `AudioHardwareCreateProcessTap`, a tap on the output of one process or of all of them. So my sentence about macOS is wrong for every version since 13.

earshot still needs a virtual device because of ffmpeg. earshot never opens an audio device itself, it starts ffmpeg, reads 16 kHz mono PCM from its stdout and leaves the platform to ffmpeg. Today, on 11 October, I listed `libavdevice` on the ffmpeg master branch. For Windows audio it has `dshow` and no WASAPI input. On macOS the `avfoundation` input has no ScreenCaptureKit code, so for audio it sees capture devices and nothing else.

<figure class="fig">
<svg viewBox="0 0 640 218" role="img" aria-label="Table. Linux: PulseAudio and PipeWire offer a monitor source, ffmpeg reads it with -f pulse, earshot needs nothing extra. Windows: WASAPI loopback since Vista and process loopback since Windows 10 build 20348, but ffmpeg has only dshow and no WASAPI input, so earshot needs Stereo Mix or VB-CABLE. macOS: ScreenCaptureKit audio since macOS 13 and a process tap since 14.2, but ffmpeg's avfoundation input sees capture devices only, so earshot needs BlackHole.">
  <text x="10" y="16" class="f-label f-muted">capturing what the speakers play, October 2026</text>
  <text x="110" y="48" class="f-label f-muted">what the OS offers, since</text>
  <text x="322" y="48" class="f-label f-muted">what ffmpeg reads</text>
  <text x="500" y="48" class="f-label f-muted">what earshot needs</text>
  <line x1="10" y1="60" x2="630" y2="60" class="f-plain"/>
  <text x="10" y="89" class="f-mono f-ink">Linux</text>
  <text x="110" y="81" class="f-mono f-ink">monitor source</text>
  <text x="110" y="97" class="f-label f-muted">PulseAudio, PipeWire</text>
  <text x="322" y="81" class="f-mono f-ink">-f pulse</text>
  <text x="322" y="97" class="f-label f-muted">reads the monitor</text>
  <text x="500" y="89" class="f-mono f-ink">nothing</text>
  <line x1="10" y1="110" x2="630" y2="110" class="f-plain"/>
  <text x="10" y="139" class="f-mono f-ink">Windows</text>
  <text x="110" y="131" class="f-mono f-ink">WASAPI loopback, Vista</text>
  <text x="110" y="147" class="f-label f-muted">process loopback, 20348</text>
  <text x="322" y="131" class="f-mono f-ink">-f dshow</text>
  <text x="322" y="147" class="f-label f-muted">no WASAPI input</text>
  <rect x="494" y="116" width="136" height="38" rx="3" class="f-box"/>
  <text x="500" y="131" class="f-mono f-ink">Stereo Mix</text>
  <text x="500" y="147" class="f-label f-muted">or VB-CABLE</text>
  <line x1="10" y1="160" x2="630" y2="160" class="f-plain"/>
  <text x="10" y="189" class="f-mono f-ink">macOS</text>
  <text x="110" y="181" class="f-mono f-ink">ScreenCaptureKit, 13</text>
  <text x="110" y="197" class="f-label f-muted">process tap, 14.2</text>
  <text x="322" y="181" class="f-mono f-ink">-f avfoundation</text>
  <text x="322" y="197" class="f-label f-muted">capture devices only</text>
  <rect x="494" y="166" width="136" height="38" rx="3" class="f-box"/>
  <text x="500" y="189" class="f-mono f-ink">BlackHole</text>
  <line x1="10" y1="210" x2="630" y2="210" class="f-plain"/>
</svg>
<figcaption>OS columns from Microsoft and Apple documentation, ffmpeg column from libavdevice on the master branch, 11 October 2026. Only the Linux row was run.</figcaption>
</figure>

## Linux, measured

The Linux row I could measure. The node I work on is a server without a sound card. So I unpacked PulseAudio 16.1 and PipeWire 1.0.5 with WirePlumber 0.4.17 from the Ubuntu 24.04 packages into a local folder and created virtual outputs. Both servers were driven by the same `pacat` and `pactl`, so the client side is identical. The test sound is 3 seconds of seeded noise plus a 1 kHz tone in 48 kHz stereo. Every capture is aligned to the original and compared sample by sample.

At 100% volume the monitor gives back the sound bit for bit. That is 144,000 of 144,000 frames, on both servers and in every run of the final harness.

Then I moved the slider on PulseAudio. With the output at 50% the capture is the original multiplied by 0.125, up to rounding of the last bit. That is 0.5 cubed, the volume curve of PulseAudio. Muting the output gives pure zeros. Setting the volume of a single application to 50% while it plays also gives 0.125. So on PulseAudio the monitor reads the sound after all of these controls.

It also remembers. After I turned one application down, its next stream started at 0.125 again. The server keeps that volume on disk, keyed by the role of the stream or, without a role, by the application id or name. For earshot that means the old setting of an app also applies to its next call.

I almost wrote that PipeWire behaves the same. On my first outputs it did. Then a check against the source showed why. I created those outputs through the PulseAudio compatibility layer of PipeWire. That layer turns on `monitor.channel-volumes` for them. PipeWire's own default is off. WirePlumber 0.4.17 leaves it off for real sound cards. So I made one more output directly in PipeWire with the default. On it the output at 50% and the muted output both gave the sound back bit for bit. The volume of the application still gave 0.125 and was still remembered.

<figure class="fig">
<svg viewBox="0 0 640 222" role="img" aria-label="Signal chain: application, app volume, mix, output volume and mute, speakers. The PulseAudio monitor branches off after output volume and mute: output at 50% gives 0.125 of the original and mute gives zeros. The PipeWire monitor with its default setting branches off before them: output volume and mute do not change the capture. App volume at 50% gives 0.125 on both, and the next stream of the same app starts at 0.125 again.">
  <text x="10" y="16" class="f-label f-muted">where the monitor reads, PulseAudio 16.1 and PipeWire 1.0.5</text>
  <rect x="10" y="30" width="100" height="34" rx="3" class="f-plain"/>
  <text x="60" y="51" text-anchor="middle" class="f-label f-ink">application</text>
  <line x1="111" y1="47" x2="122" y2="47" class="f-line"/>
  <path d="M124 47 l-5 -3 v6 z" class="f-muted"/>
  <rect x="125" y="30" width="108" height="34" rx="3" class="f-box"/>
  <text x="179" y="51" text-anchor="middle" class="f-label f-ink">app volume</text>
  <line x1="234" y1="47" x2="245" y2="47" class="f-line"/>
  <path d="M247 47 l-5 -3 v6 z" class="f-muted"/>
  <rect x="248" y="30" width="84" height="34" rx="3" class="f-plain"/>
  <text x="290" y="51" text-anchor="middle" class="f-label f-ink">mix</text>
  <line x1="333" y1="47" x2="344" y2="47" class="f-line"/>
  <path d="M346 47 l-5 -3 v6 z" class="f-muted"/>
  <rect x="347" y="30" width="150" height="34" rx="3" class="f-box"/>
  <text x="422" y="51" text-anchor="middle" class="f-label f-ink">output volume, mute</text>
  <line x1="498" y1="47" x2="509" y2="47" class="f-line"/>
  <path d="M511 47 l-5 -3 v6 z" class="f-muted"/>
  <rect x="512" y="30" width="100" height="34" rx="3" class="f-plain"/>
  <text x="562" y="51" text-anchor="middle" class="f-label f-ink">speakers</text>
  <text x="179" y="80" text-anchor="middle" class="f-label f-muted">app at 50%: ×0.125 on both</text>
  <text x="179" y="94" text-anchor="middle" class="f-label f-muted">remembered for the next stream</text>
  <line x1="339.5" y1="47" x2="339.5" y2="165" class="f-line" style="stroke:var(--accent)" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M339.5 167 l-4 -7 h8 z" style="fill:var(--accent)"/>
  <rect x="214.5" y="168" width="250" height="44" rx="3" class="f-box"/>
  <text x="339.5" y="186" text-anchor="middle" class="f-mono f-ink">PipeWire monitor, default</text>
  <text x="339.5" y="202" text-anchor="middle" class="f-label f-muted">output volume and mute: no effect</text>
  <line x1="504.5" y1="47" x2="504.5" y2="103" class="f-line" style="stroke:var(--accent)" stroke-width="2"/>
  <path d="M504.5 105 l-4 -7 h8 z" style="fill:var(--accent)"/>
  <rect x="379.5" y="106" width="250" height="44" rx="3" class="f-box"/>
  <text x="504.5" y="124" text-anchor="middle" class="f-mono f-ink">PulseAudio monitor</text>
  <text x="504.5" y="140" text-anchor="middle" class="f-label f-muted">output 50%: ×0.125, mute: zeros</text>
</svg>
<figcaption>3 runs on each output. At 100% every capture is bit for bit. The PipeWire output keeps the default monitor setting, the one WirePlumber 0.4.17 leaves for real sound cards.</figcaption>
</figure>

Switching the output is fine on both. I started recording from `@DEFAULT_MONITOR@`, switched the default output to another one and played there. Both servers moved the recording to the new monitor and the capture was bit for bit again.

## Where it starts to hurt

earshot does not send every sound to the model. It cuts the stream into 20 ms frames. A frame counts as speech when its RMS is at least 600 on the 16 bit scale. A clip is kept only if it has at least 300 ms of such frames. I picked these defaults and never thought about them together with the volume slider.

So I played a speech recording at different volumes. I captured it with ffmpeg 6.1.1 and the same arguments earshot builds on Linux, into a file instead of stdout. Then I fed the result to the segmenter of earshot at commit `15da817` with its default settings. The recording is 10 Harvard sentences from the Open Speech Repository, converted to stereo for playback. At 100% it peaks at about -12 dBFS and its loudest 20 ms frame has RMS about 3,500 to 3,650, depending on the run.

<figure class="fig">
<svg viewBox="0 0 640 162" role="img" aria-label="PulseAudio, output slider: 100% 10, 90% 10, 80% 10, 70% 8, 60% 0, 50% 0, 40% 0, 30% 0. PipeWire, output slider: 100% 10, 90% 10, 80% 10, 70% 10, 60% 10, 50% 10, 40% 10, 30% 10. PipeWire, app slider: 100% 10, 90% 10, 80% 10, 70% 9, 60% 0, 50% 0, 40% 0, 30% 0.">
  <text x="10" y="16" class="f-label f-muted">clips earshot cut from 10 sentences</text>
  <text x="226.9" y="42" text-anchor="middle" class="f-label f-muted">100%</text>
  <text x="280.6" y="42" text-anchor="middle" class="f-label f-muted">90%</text>
  <text x="334.4" y="42" text-anchor="middle" class="f-label f-muted">80%</text>
  <text x="388.1" y="42" text-anchor="middle" class="f-label f-muted">70%</text>
  <text x="441.9" y="42" text-anchor="middle" class="f-label f-muted">60%</text>
  <text x="495.6" y="42" text-anchor="middle" class="f-label f-muted">50%</text>
  <text x="549.4" y="42" text-anchor="middle" class="f-label f-muted">40%</text>
  <text x="603.1" y="42" text-anchor="middle" class="f-label f-muted">30%</text>
  <text x="190" y="73" text-anchor="end" class="f-label f-ink">PulseAudio, output slider</text>
  <rect x="203.0" y="55" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="226.9" y="74" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="256.8" y="55" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="280.6" y="74" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="310.5" y="55" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="334.4" y="74" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="364.3" y="55" width="47.8" height="28" rx="3" class="f-box" opacity="0.55"/>
  <text x="388.1" y="74" text-anchor="middle" class="f-mono f-ink">8</text>
  <rect x="418.0" y="55" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="441.9" y="74" text-anchor="middle" class="f-mono f-muted">0</text>
  <rect x="471.8" y="55" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="495.6" y="74" text-anchor="middle" class="f-mono f-muted">0</text>
  <rect x="525.5" y="55" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="549.4" y="74" text-anchor="middle" class="f-mono f-muted">0</text>
  <rect x="579.3" y="55" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="603.1" y="74" text-anchor="middle" class="f-mono f-muted">0</text>
  <text x="190" y="107" text-anchor="end" class="f-label f-ink">PipeWire, output slider</text>
  <rect x="203.0" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="226.9" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="256.8" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="280.6" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="310.5" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="334.4" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="364.3" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="388.1" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="418.0" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="441.9" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="471.8" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="495.6" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="525.5" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="549.4" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="579.3" y="89" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="603.1" y="108" text-anchor="middle" class="f-mono f-ink">10</text>
  <text x="190" y="141" text-anchor="end" class="f-label f-ink">PipeWire, app slider</text>
  <rect x="203.0" y="123" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="226.9" y="142" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="256.8" y="123" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="280.6" y="142" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="310.5" y="123" width="47.8" height="28" rx="3" class="f-box"/>
  <text x="334.4" y="142" text-anchor="middle" class="f-mono f-ink">10</text>
  <rect x="364.3" y="123" width="47.8" height="28" rx="3" class="f-box" opacity="0.55"/>
  <text x="388.1" y="142" text-anchor="middle" class="f-mono f-ink">9</text>
  <rect x="418.0" y="123" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="441.9" y="142" text-anchor="middle" class="f-mono f-muted">0</text>
  <rect x="471.8" y="123" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="495.6" y="142" text-anchor="middle" class="f-mono f-muted">0</text>
  <rect x="525.5" y="123" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="549.4" y="142" text-anchor="middle" class="f-mono f-muted">0</text>
  <rect x="579.3" y="123" width="47.8" height="28" rx="3" class="f-plain"/>
  <text x="603.1" y="142" text-anchor="middle" class="f-mono f-muted">0</text>
</svg>
<figcaption>10 Harvard sentences from the Open Speech Repository, captured from the monitor with earshot's ffmpeg arguments and cut by its segmenter with default settings: speech is RMS 600 or more, a clip needs 300 ms of it.</figcaption>
</figure>

On PulseAudio, with the output slider, earshot cuts 10 clips from the 10 sentences down to 80%. At 70% it cuts 8. From 60% down it cuts none. At 60% the loudest frames still pass 600, since 3,650 times 0.216 is about 790, but only 18 frames in the whole recording do. No clip collects 300 ms of them. On PipeWire the output slider changes nothing and earshot cuts all 10 clips even at 30%. The application slider brings the same cliff back there: 9 clips at 70%, none from 60% down. The 8 against 9 at 70% I put down to rounding and frame boundaries and did not check further. Nothing fails in any of these runs, ffmpeg and the segmenter keep running and the transcript stays empty.

My own harness also fooled me for a while. In the first runs the recorder started 1 second before playback and stopped 1 second after. Some captures lost up to a second at the start or a piece at the end. With 3 seconds on each side none of it came back. The lost ends were `pipewire-pulse` handing the recorder data in large chunks. Why the start went missing I don't know and I did not dig.

## What changes for earshot

The README row for Linux should not say only "works out of the box". It works, but what it records depends on the volume. On PulseAudio the output slider and mute decide if earshot hears speech at all. On PipeWire only the volume of the application does. In both cases an empty transcript comes with no error. The macOS line is simply wrong. It needs to go from the README and from `docs/audio-capture.md` too.

For Windows and macOS the honest fix is a native capture path next to ffmpeg. That means WASAPI loopback on one side and a process tap on the other. It is more code than earshot has today. I have not written it.

## What I did not check

Nothing here ran on Windows or macOS. I don't know if WASAPI loopback or a process tap sees the sound before or after the system volume.

All outputs were virtual. PulseAudio can apply part of the volume in the sound card hardware. In its source that part comes after the monitor, while mute is always done in software. So on a laptop with PulseAudio the cliff may sit lower on the slider and mute should still give silence. I read that in the code and could not run it. My PipeWire output only copies the default setting of a real card. It is not a real card either.

The cliff itself belongs to this one recording. A quieter call moves it up the slider and a louder one moves it down. The threshold of 600 can also be changed with `--threshold`.
