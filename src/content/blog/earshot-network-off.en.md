---
title: "earshot promised no network calls and onnxruntime broke that the day it went public"
description: "The earshot README says network calls: none. With the network cut it really works, 10 of 10 transcripts identical. With the network on, every start asks Hugging Face for the model revision. onnxruntime, pulled in for voice activity filtering, sends telemetry to Microsoft since 1.29.0. Offline sessions queue the event until the machine is online again. 2 environment variables bring it to 0 connections."
date: 2026-10-11
lang: en
translationKey: earshot-network-off
tags: ["networking", "dependencies"]
---
earshot, my local transcriber, has a green badge at the top of its README that says "Network calls: none". Further down the README says "No account, no key, no telemetry" and "After that you can run earshot with the network off". The `--help` text ends with "Nothing leaves the machine. There is no network call anywhere in the pipeline." The model is `base.en` from `faster-whisper`, 145 MB, downloaded once.

I wrote all of that from the design. Nobody had measured it, me included. The transcription code comes from a private project I wrote in late May and early June. In mid August I cut it down into earshot and wrote the README. This week I installed it from scratch in an empty folder, the way the README tells a stranger to do it. Then I watched its sockets.

## The setup

Ubuntu 24.04 on a 4 core VM, Python 3.12.3, Node 22, ffmpeg 6.1.1, earshot at commit `15da817`. `requirements.txt` pins only `faster-whisper==1.1.0` exactly, everything else is left to pip. On 11 October 2026 pip picked `huggingface_hub` 2.2.0 and `onnxruntime` 1.31.0.

To watch the network I ran the whole process tree, Node, ffmpeg and the Python sidecar, under `strace -f -e trace=connect`. To switch the network off I did not touch the machine. strace can make every `connect()` of the traced processes fail with `ENETUNREACH`, the error you get when there is no route to the network. The audio was 10 recordings of Harvard sentences from the Open Speech Repository, 342 seconds in total, fed through `earshot --source file`.

## With the network off it works

All 10 recordings were transcribed with the network cut. The text was identical to the run with the network on, 10 out of 10. Word error rate against the published sentences was 13.1%, mostly because the recordings are 8 kHz telephone audio. "The birch canoe slid" came out as "The birch can use lid". Startup took 1.6 seconds offline and 1.9 online, with no warning in the log.

The 145 MB is true for one file. `model.bin` is 145,216,508 bytes and the model folder is 148 MB. The Python virtualenv that runs it is 472 MB. 132 MB of that is PyAV with its own ffmpeg libraries. earshot never uses them for decoding, it runs the system ffmpeg and hands the sidecar raw samples. With `npm install` it comes to 658 MB on disk.

<figure class="fig">
<svg viewBox="0 0 640 288" role="img" aria-label="Bar chart of disk use in megabytes. model.bin 145, rest of the model folder 3, CTranslate2 141, PyAV with ffmpeg libraries 132, onnxruntime 69, numpy 68, other Python packages 62, node_modules 38. Total about 658 MB.">
<text class="f-label" x="0" y="18">earshot on disk after the README install, MB</text>
<text class="f-label" x="212" y="55" text-anchor="end">model.bin (base.en)</text>
<rect class="" style="fill:var(--accent)" x="220" y="43" width="380.0" height="16"/>
<text class="f-mono f-ink" x="606.0" y="55">145</text>
<text class="f-label" x="212" y="81" text-anchor="end">rest of the model folder</text>
<rect class="f-box"  x="220" y="69" width="7.9" height="16"/>
<text class="f-mono f-ink" x="233.9" y="81">3</text>
<text class="f-label" x="212" y="107" text-anchor="end">CTranslate2</text>
<rect class="f-box"  x="220" y="95" width="369.5" height="16"/>
<text class="f-mono f-ink" x="595.5" y="107">141</text>
<text class="f-label" x="212" y="133" text-anchor="end">PyAV with ffmpeg libraries</text>
<rect class="f-box"  x="220" y="121" width="345.9" height="16"/>
<text class="f-mono f-ink" x="571.9" y="133">132</text>
<text class="f-label" x="212" y="159" text-anchor="end">onnxruntime</text>
<rect class="f-box"  x="220" y="147" width="180.8" height="16"/>
<text class="f-mono f-ink" x="406.8" y="159">69</text>
<text class="f-label" x="212" y="185" text-anchor="end">numpy</text>
<rect class="f-box"  x="220" y="173" width="178.2" height="16"/>
<text class="f-mono f-ink" x="404.2" y="185">68</text>
<text class="f-label" x="212" y="211" text-anchor="end">other Python packages</text>
<rect class="f-box"  x="220" y="199" width="162.5" height="16"/>
<text class="f-mono f-ink" x="388.5" y="211">62</text>
<text class="f-label" x="212" y="237" text-anchor="end">node_modules (build tools)</text>
<rect class="f-box"  x="220" y="225" width="99.6" height="16"/>
<text class="f-mono f-ink" x="325.6" y="237">38</text>
<text class="f-label f-muted" x="220" y="270">total about 658 MB, the README number is the first bar</text>
</svg>
<figcaption>Measured with du in a fresh clone, 11 October 2026, after pip install -r python/requirements.txt, npm install and the model download. Megabytes are decimal.</figcaption>
</figure>

## With the network on it asks Hugging Face on every start

Every start of the sidecar opened a TLS connection to `huggingface.co`. With request logging on, it is 1 call:

```
GET https://huggingface.co/api/models/Systran/faster-whisper-base.en/revision/main
```

`faster-whisper` asks the Hub whether the model has a newer revision before it opens the cached files. Nothing about my audio goes there, but Hugging Face sees my IP address and the model name, every time I start earshot. `HF_HUB_OFFLINE=1` stops it. With it the sidecar made 0 connections to Hugging Face.

The bad network was worse. I pointed the Hub at an address that drops packets. The sidecar was ready after 135 seconds instead of 1.6. That is how long Linux waits before it gives up on a TCP handshake. Then I put in a proxy that accepts the connection and never replies, like a dead captive portal on hotel wifi. After 900 seconds the sidecar was still loading and I killed it. The HTTP client in `huggingface_hub` 2.2.0 is created with `timeout=None`.

## The second server is Microsoft

The process tree also connected to `mobile.events.data.microsoft.com`. It came from a thread of the Python sidecar. The address is compiled into the onnxruntime Python extension.

`faster-whisper` uses onnxruntime for one thing, the Silero voice activity filter. earshot's sidecar turns that filter on by default, though it already has a `--no-vad` flag whose help text says "earshot already segments". Node cuts the audio into utterances before Python sees it, so the filter repeats segmentation Node has already done.

onnxruntime sends telemetry on Linux since version 1.29.0. I scanned the wheels: 1.28.0 and older have no collector address, 1.29.0, 1.30.0 and 1.31.0 have it. An earshot install with 1.28.0 made 0 connections to Microsoft. When I wrote the README in mid August, pip installed 1.28.0, so the badge was true. I made the repository public on 17 August. 1.29.0 reached PyPI late that evening, UTC. Nothing in my code or requirements changed. From the next install on, the badge was false.

To be fair to Microsoft, the 1.29.0 release notes mention it in one line and name the switch, `ORT_DISABLE_TELEMETRY=1`. I just did not read the release notes of a dependency of a dependency.

An offline session with 1.31.0 left 1 event in a local queue, called `ProcessInfo`. I read it there. It has a hashed device id, the OS and version, the CPU model, total memory, the kind of VM, the network type ("Wired") and the full path of the Python executable, which contains your user name if the clone sits in your home directory. The raw device id is a UUID that onnxruntime writes to `~/.cache/Microsoft/DeveloperTools/.onnxruntime/deviceid`.

## Pulling the cable only delays it

With the network cut, the event is not dropped. onnxruntime keeps it in a SQLite file next to the device id, `onnxruntime.db`. In a clean cache folder 2 sessions offline left 2 events in the queue. Then I ran 1 session with the network on. During that session the sidecar connected to Microsoft. Afterwards the 2 offline events were gone from the queue.

<figure class="fig">
<svg viewBox="0 0 640 184" role="img" aria-label="3 sessions in a row. Session 1 with the network cut leaves 1 event in onnxruntime.db and no connection to Microsoft. Session 2 with the network cut leaves 2 events. Session 3 with the network on connects to mobile.events.data.microsoft.com, afterwards the 2 offline events are gone from the queue. The device id file is the same in all 3.">
<text class="f-label" x="0" y="18">one clean cache folder, 3 sessions in a row</text>
<rect class="f-box" x="5" y="36" width="202" height="104" rx="4"/>
<text class="f-label f-ink" x="17" y="58">session 1</text>
<text class="f-label f-muted" x="17" y="80">network cut</text>
<text class="f-mono f-ink" x="17" y="104">queue: 1 event</text>
<text class="f-label f-muted"  x="17" y="126">Microsoft: no connection</text>
<path class="f-line" d="M209 88 h8"/>
<rect class="f-box" x="219" y="36" width="202" height="104" rx="4"/>
<text class="f-label f-ink" x="231" y="58">session 2</text>
<text class="f-label f-muted" x="231" y="80">network cut</text>
<text class="f-mono f-ink" x="231" y="104">queue: 2 events</text>
<text class="f-label f-muted"  x="231" y="126">Microsoft: no connection</text>
<path class="f-line" d="M423 88 h8"/>
<rect class="f-box" x="433" y="36" width="202" height="104" rx="4"/>
<text class="f-label f-ink" x="445" y="58">session 3</text>
<text class="f-label " x="445" y="80">network on</text>
<text class="f-mono f-ink" x="445" y="104">offline events: gone</text>
<text class="f-label" style="fill:var(--accent)" x="445" y="126">Microsoft: connected</text>
<text class="f-label f-muted" x="5" y="166">same device id file in all 3</text>
</svg>
<figcaption>onnxruntime 1.31.0, queue counted with sqlite3 after each session, connections from strace. In a repeat run the 2 offline events were also gone after session 3 while 2 new events from that session were still waiting.</figcaption>
</figure>

The transcript stays on the machine, but a record of the machine and the session waits in the queue and most likely leaves the first time you are back online.

With both variables set the whole tree made 0 connections and wrote no device id file. The transcript was the same.

## What changes

The sidecar is spawned from `whisperRecognizer.ts` with an environment that sets `HF_HOME`. A comment there says "Nothing here needs to phone home once the model is on disk." Both variables belong right there. Until they are in the repository, set them yourself before you run earshot. Pinning `onnxruntime` below 1.29 would also work, but the next transitive dependency can do the same and I would again find out by accident.

The badge should become a test: a session under strace with the network cut that fails on any `connect()` to an IP address. I did not have that test, so the change in onnxruntime came in silently.

## What I did not check

Only Linux. The 1.29.0 notes say the switch covers telemetry outside Windows. I did not decrypt the TLS traffic, so what reached Microsoft is inferred from the local queue. I did not prove that the offline events left the queue because the upload succeeded. In a repeat run they were gone too, but 2 new events from the online session were still waiting. The proxy and dropped packet tests are 1 run each. Startup times are 3 runs per case, the word error rate 1 run per recording.
