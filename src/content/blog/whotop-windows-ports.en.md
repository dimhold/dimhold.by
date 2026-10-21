---
title: "On my Windows laptop whotop found who holds each port. 11 of its answers quoted a word that was not there"
description: "I took one snapshot from my Windows laptop at 01:59 and checked what whotop 0.4.1 said about each of the 33 processes holding a listening port. The port column held. 8 astro processes sat on a port their command line did not name and whotop showed the real one. But 11 rows quoted vite as evidence when the word is not in the command line. 8 inferred directories were the npx cache or a temp folder and the service names reached only the interactive screen."
date: 2026-11-21
lang: en
translationKey: whotop-windows-ports
tags: ["debugging", "networking"]
---
I wrote [whotop](https://github.com/dimhold/whotop) in August, after an evening when port 4310 was taken and I killed the wrong node. On 19 August I put the package on npm. The README promises one thing above the others: whotop says a value is unavailable and why instead of making a confident guess. Every role carries the rule that produced it.

I checked that promise on fixtures I recorded myself and on CI runners. I never took a real evening of my own machine and asked it, row by row, the one question the tool exists for. In October I wrote about [a night log of my laptop](https://dimhold.by/blog/night-noise/). The same log has the answer: 96 snapshots of `whotop ls --all --json`, version 0.4.1, on Windows, not elevated. I took the snapshot from 01:59 on 29 September, when my agent sessions had just stopped working. I looked only at the processes that hold a listening TCP socket.

There are 33 of them, out of 484 processes. whotop gave a role to 21: 20 node processes it calls dev servers and Postgres. The other 12 are unknown. 11 of those did not disclose a command line at all.

## The port part works

On Windows whotop asks PowerShell for the process table and the socket table in one call. The owning pid of each socket comes from the same moment as the process list. The README calls a port reported against the wrong process the one mistake this tool must not make. On this night I found nothing in the log that contradicts the port column.

I did not plan this example. 5 processes on my laptop were started as `astro preview --port 4321`, at different times over 2 days. I never stopped them. Only one of them, pid 23620, holds 4321. The socket table puts the other 4 on 4322, 4323, 4324 and 4325. Another 5 were started with `--port 4326` in the first 20 minutes after midnight and sit on 4326 to 4330. For 8 processes the port in the command line is not the port they hold.

<figure class="fig">
<svg viewBox="0 0 640 290" role="img" aria-label="Two columns. On the left 10 command lines, 5 of them astro preview --port 4321 and 5 of them --port 4326. On the right the port each process actually holds. asked 4321, holds 4321, asked 4321, holds 4322, asked 4321, holds 4323, asked 4321, holds 4324, asked 4321, holds 4325, asked 4326, holds 4326, asked 4326, holds 4327, asked 4326, holds 4328, asked 4326, holds 4329, asked 4326, holds 4330. Only 2 of the 10 hold the port their command line names.">
  <text x="145" y="24" text-anchor="middle" class="f-label f-muted">the command line asks</text>
  <text x="505" y="24" text-anchor="middle" class="f-label f-muted">the socket table says</text>
  <rect x="20" y="44" width="250" height="16" class="f-box"/>
  <text x="30" y="56" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="44" width="70" height="16" class="f-box"/>
  <text x="505" y="56" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">4321</text>
  <line x1="270" y1="52" x2="470" y2="52" style="stroke:var(--muted);stroke-width:1.2"/>
  <rect x="20" y="66" width="250" height="16" class="f-box"/>
  <text x="30" y="78" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="66" width="70" height="16" class="f-box"/>
  <text x="505" y="78" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4322</text>
  <line x1="270" y1="74" x2="470" y2="74" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="88" width="250" height="16" class="f-box"/>
  <text x="30" y="100" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="88" width="70" height="16" class="f-box"/>
  <text x="505" y="100" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4323</text>
  <line x1="270" y1="96" x2="470" y2="96" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="110" width="250" height="16" class="f-box"/>
  <text x="30" y="122" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="110" width="70" height="16" class="f-box"/>
  <text x="505" y="122" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4324</text>
  <line x1="270" y1="118" x2="470" y2="118" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="132" width="250" height="16" class="f-box"/>
  <text x="30" y="144" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="132" width="70" height="16" class="f-box"/>
  <text x="505" y="144" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4325</text>
  <line x1="270" y1="140" x2="470" y2="140" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="170" width="250" height="16" class="f-box"/>
  <text x="30" y="182" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="170" width="70" height="16" class="f-box"/>
  <text x="505" y="182" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">4326</text>
  <line x1="270" y1="178" x2="470" y2="178" style="stroke:var(--muted);stroke-width:1.2"/>
  <rect x="20" y="192" width="250" height="16" class="f-box"/>
  <text x="30" y="204" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="192" width="70" height="16" class="f-box"/>
  <text x="505" y="204" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4327</text>
  <line x1="270" y1="200" x2="470" y2="200" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="214" width="250" height="16" class="f-box"/>
  <text x="30" y="226" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="214" width="70" height="16" class="f-box"/>
  <text x="505" y="226" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4328</text>
  <line x1="270" y1="222" x2="470" y2="222" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="236" width="250" height="16" class="f-box"/>
  <text x="30" y="248" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="236" width="70" height="16" class="f-box"/>
  <text x="505" y="248" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4329</text>
  <line x1="270" y1="244" x2="470" y2="244" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="258" width="250" height="16" class="f-box"/>
  <text x="30" y="270" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="258" width="70" height="16" class="f-box"/>
  <text x="505" y="270" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4330</text>
  <line x1="270" y1="266" x2="470" y2="266" style="stroke:var(--accent);stroke-width:1.4"/>
</svg>
<figcaption>The 10 astro preview processes started with --port 4321 or --port 4326, snapshot at 01:59. 8 of them hold a port that is not in their command line.</figcaption>
</figure>

This is my August evening again. If I search the command lines for 4321, I get 5 candidates and 4 of them are wrong. `whotop port 4321` gives one pid.

## 11 rows quote evidence that is not there

All 11 astro processes, these 10 and one more started with `--port 4331`, are labelled `vite`. The reason printed next to each says "known dev server in the command line (vite)". There is no "vite" in any of these 11 command lines. They run `astro.js preview`.

I went to the code. The rule fires because the entry script is astro, which is fine. But the label and the reason are both built by a helper that looks for the first dev server token in the command line. When it finds none it returns the first token of the list anyway. That token is vite. The role is right. But the word in the label and in the reason comes from the fallback. The README says a classification you can not check is a guess with better manners. Here the command line was in the log, so I could check it.

## The directories are only inferred

whotop does not read another process's working directory on Windows. That would mean reading its memory, so it takes the longest absolute path from the command line and marks it `(inferred)`. For the 11 astro rows it is the project directory, which looks right, although I can not verify it from the log either.

For 7 more rows it says nothing useful. 6 `http-server` processes and 1 `serve` run from the npx cache, so the only path in their command line is that cache. whotop cuts it before `node_modules` and reports the cache directory. The 6 `http-server` rows get the same directory and can not be told apart by it. One of them holds 4310, the port from my August evening.

One row is wrong because of a bug in reading the path. The `ts-node-dev` server on port 4400 has 2 paths in its command line, a hook file in `D:/Temp` and then the project path. My expression that finds paths allows spaces inside a path. The first match runs over the space and takes the drive letter of the second path with it. whotop never sees the second path and the row says `D:/Temp`. I reproduced it on the published package: without the hook path the same command gives the project directory.

<figure class="fig">
<svg viewBox="0 0 640 166" role="img" aria-label="The command line of the ts-node-dev server, shortened. The path finder starts at D:/Temp, runs over the space and stops at the colon of the next drive letter. It keeps D:/Temp as the directory. The project path after it is never matched because its drive letter was eaten by the first match.">
  <text x="24" y="62" textLength="15.6" lengthAdjust="spacingAndGlyphs" class="f-mono f-muted">-r</text>
  <rect x="47.4" y="44" width="171.6" height="26" style="fill:var(--accent);fill-opacity:0.18;stroke:var(--accent);stroke-width:1"/>
  <text x="47.4" y="62" textLength="171.6" lengthAdjust="spacingAndGlyphs" class="f-mono f-ink">D:/Temp/hook-0417.js D</text>
  <rect x="219.0" y="44" width="273.0" height="26" style="fill:none;stroke:var(--muted);stroke-width:1;stroke-dasharray:3 2"/>
  <text x="219" y="62" textLength="273.0" lengthAdjust="spacingAndGlyphs" class="f-mono f-muted">:\work\api\node_modules\...\wrap.js</text>
  <text x="47.4" y="34" class="f-label f-accent">1st match, ends at the colon</text>
  <text x="219.0" y="88" class="f-label f-muted">never matched</text>
  <text x="24" y="124" class="f-label f-muted">reported as the directory:</text>
  <text x="274" y="124" class="f-mono f-accent">D:/Temp</text>
  <text x="24" y="150" class="f-label f-muted">same command without the hook path:</text>
  <text x="274" y="150" class="f-mono f-ink">D:\work\api</text>
</svg>
<figcaption>The path finder allows spaces inside a path. The first match takes the drive letter of the next path, so the project path is never read. Paths shortened.</figcaption>
</figure>

Of 20 node rows 8 have a directory that is technically marked inferred and is no help when I am about to kill something. 3 more rows got only the name of their script file as a label, but there the reason says honestly that nothing else matched. The README describes the directory problem with `claude.exe`, whose install folder looked like a working directory. I fixed that case in August and did not look for others.

<figure class="fig">
<svg viewBox="0 0 640 386" role="img" aria-label="A grid of the 20 node rows that hold a listening port, one row per process, with 3 columns: port, label evidence, directory. The port column is fine in every row. 11 rows quote vite as evidence and the word is not in the command line. 8 rows have an inferred directory that is the npx cache or the temp folder.">
  <text x="225" y="30" text-anchor="middle" class="f-label f-muted">port</text>
  <text x="375" y="30" text-anchor="middle" class="f-label f-muted">evidence</text>
  <text x="525" y="30" text-anchor="middle" class="f-label f-muted">directory</text>
  <text x="140" y="52" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4301 serve</text>
  <rect x="152" y="40" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="40" width="146" height="14" style="fill:var(--muted);fill-opacity:0.3"/>
  <text x="375" y="51" text-anchor="middle" class="f-label f-ink" style="font-size:11px">file name</text>
  <rect x="452" y="40" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="51" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">npx cache</text>
  <text x="140" y="69" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4310 http-server</text>
  <rect x="152" y="57" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="57" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="57" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="68" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">npx cache</text>
  <text x="140" y="86" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4311 http-server</text>
  <rect x="152" y="74" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="74" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="74" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="85" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">npx cache</text>
  <text x="140" y="103" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4312 http-server</text>
  <rect x="152" y="91" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="91" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="91" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="102" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">npx cache</text>
  <text x="140" y="120" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4313 http-server</text>
  <rect x="152" y="108" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="108" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="108" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="119" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">npx cache</text>
  <text x="140" y="137" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4314 http-server</text>
  <rect x="152" y="125" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="125" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="125" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="136" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">npx cache</text>
  <text x="140" y="154" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4315 http-server</text>
  <rect x="152" y="142" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="142" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="142" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="153" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">npx cache</text>
  <text x="140" y="171" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4321 astro</text>
  <rect x="152" y="159" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="159" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="170" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">quotes vite</text>
  <rect x="452" y="159" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="188" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4322 astro</text>
  <rect x="152" y="176" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="176" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="187" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">quotes vite</text>
  <rect x="452" y="176" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="205" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4323 astro</text>
  <rect x="152" y="193" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="193" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="204" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">quotes vite</text>
  <rect x="452" y="193" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="222" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4324 astro</text>
  <rect x="152" y="210" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="210" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="221" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">quotes vite</text>
  <rect x="452" y="210" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="239" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4325 astro</text>
  <rect x="152" y="227" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="227" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="238" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">quotes vite</text>
  <rect x="452" y="227" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="256" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4326 astro</text>
  <rect x="152" y="244" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="244" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="255" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">quotes vite</text>
  <rect x="452" y="244" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="273" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4327 astro</text>
  <rect x="152" y="261" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="261" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="272" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">quotes vite</text>
  <rect x="452" y="261" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="290" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4328 astro</text>
  <rect x="152" y="278" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="278" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="289" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">quotes vite</text>
  <rect x="452" y="278" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="307" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4329 astro</text>
  <rect x="152" y="295" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="295" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="306" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">quotes vite</text>
  <rect x="452" y="295" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="324" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4330 astro</text>
  <rect x="152" y="312" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="312" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="323" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">quotes vite</text>
  <rect x="452" y="312" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="341" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4331 astro</text>
  <rect x="152" y="329" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="329" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="340" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">quotes vite</text>
  <rect x="452" y="329" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="358" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4400 ts-node-dev</text>
  <rect x="152" y="346" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="346" width="146" height="14" style="fill:var(--muted);fill-opacity:0.3"/>
  <text x="375" y="357" text-anchor="middle" class="f-label f-ink" style="font-size:11px">file name</text>
  <rect x="452" y="346" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="357" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">temp folder</text>
  <text x="140" y="375" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8765 script</text>
  <rect x="152" y="363" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="363" width="146" height="14" style="fill:var(--muted);fill-opacity:0.3"/>
  <text x="375" y="374" text-anchor="middle" class="f-label f-ink" style="font-size:11px">file name</text>
  <rect x="452" y="363" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
</svg>
<figcaption>The 20 node rows with a listening port at 01:59. 11 labels quote a word that is not there, 8 directories say nothing about the project.</figcaption>
</figure>

## The service names stay on one screen

In this snapshot 163 of 484 processes hid their command line. The service registry, which whotop reads without elevation, named 115 of them. The warning in every snapshot says so. But I searched the whole night log for a service name and found none. The names are attached to the process, but only the interactive screen prints them. The listing, the port command and the JSON output drop them.

I reproduced it with a payload: a `svchost.exe` holding 135 with the service `RpcSs`. In the interactive screen it reads `svchost.exe [RpcSs]`. `whotop port 135` shows `unknown` and advises an elevated shell. `whotop ls RpcSs` finds nothing. On my laptop 4 of the 12 unknown listeners were `svchost`, which exists to host services. The log can not tell me which services they were, because the JSON had already dropped the names.

## What I did not check

I can not check the real working directory of any of these processes from the log. I did not run whotop elevated, so I do not know how many of the 11 silent listeners an elevated shell would name. Ports 139, 445 and 5357 belong to pid 4, `System`. whotop just says unknown there. The snapshot also has 25 sockets without an owning process, which no row shows.

It is one laptop and one snapshot, but the numbers do not move much over the night. 81 of 96 snapshots have 32 or 33 listeners with 21 named. The 11 vite labels are in 91 snapshots and the 7 npx directories in all 96.

None of the 3 problems is fixed in 0.4.1, the version on npm today.
