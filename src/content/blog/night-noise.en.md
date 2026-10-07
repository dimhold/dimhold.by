---
title: "8 hours of snapshots and no gap. A quarter of the new processes the log caught were my logger"
description: "My process inspector whotop logged my Windows laptop every 5 minutes overnight. There was not one gap, so the laptop did not sleep. Until 01:58 my agent sessions were still building. In the 6 quiet hours after that, 30 percent of the 711 new processes caught were the logger itself, then Chrome extensions, WMI and Windows maintenance. All night 14 ports were held by dev servers up to 4 days old."
date: 2026-10-06
lang: en
translationKey: night-noise
tags: ["debugging", "agents"]
---
I wanted to know what my laptop does while I sleep. On the night of 28 September one of my Claude Code sessions started a loop with [whotop](https://github.com/dimhold/whotop) 0.4.1, `whotop ls --all --json` every 5 minutes until 8 in the morning. whotop is my own process inspector, I wrote it to find out what holds a port. The laptop runs Windows. My log does not record its build or the versions of Chrome, Postgres and Claude Code. The loop also wrote an index line per snapshot. If 2 snapshots were more than 7 minutes apart it marked GAP, so I would see when the laptop slept.

There is not a single GAP in the file. 96 snapshots, from 23:57 to 07:57 by the laptop clock, 303 to 305 seconds apart. A sleep shorter than a couple of minutes would not show, but the laptop did not sleep in any way I could see.

## The machine was busy all night

The process count started at 486, went up to 510 at 00:13 and was 467 in the morning. The lowest was 460, at 03:14 and again at 06:21. Over the night the log saw 1615 different processes. 415 of them were there in every snapshot, so they lived the whole night. Everything else came and went. I counted a process as new when its start time is later than the first snapshot. The key is pid plus start time, because Windows reuses pid numbers. That gives 1129 new processes.

Before calling this noise I had to cut off the part that was not. Until 01:58 my agent sessions were still working, with builds and an ssh to a server that built there too. The last command was a production build at 01:58:56. After that no agent ran a command until the morning except the logger loop itself, so the quiet part of the night is 6 hours, from 01:59 to 07:57. In it the log caught 711 new processes.

## The biggest source was the logger

I sorted the new processes by their parents and the largest group is whotop itself. Every snapshot is node, which starts PowerShell, which gets a console host, so 3 processes each 5 minutes. Over the whole night it is 285 of 1129, 25 percent. After 01:59 it is 216 of 711, 30 percent.

Then I checked when the other processes started relative to the logger and the share could be much bigger. On Windows whotop reads the process table with `Get-CimInstance Win32_Process`, the ports with `Get-NetTCPConnection` and the services with `Get-CimInstance Win32_Service`. All of this goes through WMI. WMI [loads its providers](https://learn.microsoft.com/en-us/windows/win32/wmisdk/provider-hosting-and-security) into a separate process called WmiPrvSE. After 01:59 there are 70 new WmiPrvSE. 40 of them started between 0.39 and 0.56 seconds after the logger's node. The same happened with bash in my Claude Code sessions. All 46 started 0.37 to 0.74 seconds after the logger and never at another moment. They came from 6 different sessions. Only one of them is the session that runs the loop. 28 console hosts started with them. If the logger sets them off, it is 330 of 711, 46 percent of the quiet part of the night.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Stacked bars, new processes caught per hour from midnight to 8 in the morning. 00:00 202 in total, logger 36, 01:00 220 in total, logger 36, 02:00 149 in total, logger 36, 03:00 115 in total, logger 33, 04:00 107 in total, logger 36, 05:00 112 in total, logger 36, 06:00 106 in total, logger 36, 07:00 118 in total, logger 36. A line after 01:58 marks the last command of an agent. After it the logger stays at 33 to 36 per hour and is the largest part of every bar.">
  <line x1="40" y1="236.0" x2="630" y2="236.0" class="f-plain"/>
  <text x="36" y="239.5" text-anchor="end" class="f-label f-muted">0</text>
  <line x1="40" y1="199.2" x2="630" y2="199.2" class="f-plain"/>
  <text x="36" y="202.7" text-anchor="end" class="f-label f-muted">50</text>
  <line x1="40" y1="162.4" x2="630" y2="162.4" class="f-plain"/>
  <text x="36" y="165.9" text-anchor="end" class="f-label f-muted">100</text>
  <line x1="40" y1="125.6" x2="630" y2="125.6" class="f-plain"/>
  <text x="36" y="129.1" text-anchor="end" class="f-label f-muted">150</text>
  <line x1="40" y1="88.8" x2="630" y2="88.8" class="f-plain"/>
  <text x="36" y="92.3" text-anchor="end" class="f-label f-muted">200</text>
  <line x1="40" y1="52.0" x2="630" y2="52.0" class="f-plain"/>
  <text x="36" y="55.5" text-anchor="end" class="f-label f-muted">250</text>
  <rect x="54" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="54" y="191.8" width="50" height="17.7" class="f-box"/>
  <rect x="54" y="163.1" width="50" height="28.7" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="54" y="150.6" width="50" height="12.5" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="54" y="87.3" width="50" height="63.3" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="79" y="81.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">202</text>
  <text x="79" y="252" text-anchor="middle" class="f-label f-muted">00:00</text>
  <rect x="128" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="128" y="193.3" width="50" height="16.2" class="f-box"/>
  <rect x="128" y="155.0" width="50" height="38.3" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="128" y="131.5" width="50" height="23.6" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="128" y="74.1" width="50" height="57.4" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="153" y="68.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">220</text>
  <text x="153" y="252" text-anchor="middle" class="f-label f-muted">01:00</text>
  <rect x="202" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="202" y="192.6" width="50" height="16.9" class="f-box"/>
  <rect x="202" y="167.6" width="50" height="25.0" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="202" y="143.3" width="50" height="24.3" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="202" y="126.3" width="50" height="16.9" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="227" y="120.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">149</text>
  <text x="227" y="252" text-anchor="middle" class="f-label f-muted">02:00</text>
  <rect x="276" y="211.7" width="50" height="24.3" style="fill:var(--accent)"/>
  <rect x="276" y="196.3" width="50" height="15.5" class="f-box"/>
  <rect x="276" y="180.1" width="50" height="16.2" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="276" y="165.3" width="50" height="14.7" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="276" y="151.4" width="50" height="14.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="301" y="145.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">115</text>
  <text x="301" y="252" text-anchor="middle" class="f-label f-muted">03:00</text>
  <rect x="350" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="350" y="194.0" width="50" height="15.5" class="f-box"/>
  <rect x="350" y="172.0" width="50" height="22.1" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="350" y="162.4" width="50" height="9.6" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="350" y="157.2" width="50" height="5.2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="375" y="151.2" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">107</text>
  <text x="375" y="252" text-anchor="middle" class="f-label f-muted">04:00</text>
  <rect x="424" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="424" y="193.3" width="50" height="16.2" class="f-box"/>
  <rect x="424" y="172.0" width="50" height="21.3" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="424" y="166.1" width="50" height="5.9" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="424" y="153.6" width="50" height="12.5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="449" y="147.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">112</text>
  <text x="449" y="252" text-anchor="middle" class="f-label f-muted">05:00</text>
  <rect x="498" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="498" y="192.6" width="50" height="16.9" class="f-box"/>
  <rect x="498" y="176.4" width="50" height="16.2" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="498" y="169.8" width="50" height="6.6" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="498" y="158.0" width="50" height="11.8" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="523" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">106</text>
  <text x="523" y="252" text-anchor="middle" class="f-label f-muted">06:00</text>
  <rect x="572" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="572" y="193.3" width="50" height="16.2" class="f-box"/>
  <rect x="572" y="169.8" width="50" height="23.6" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="572" y="159.5" width="50" height="10.3" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="572" y="149.2" width="50" height="10.3" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="597" y="143.2" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">118</text>
  <text x="597" y="252" text-anchor="middle" class="f-label f-muted">07:00</text>
  <line x1="190" y1="44" x2="190" y2="236" style="stroke:var(--accent);stroke-width:1.2;stroke-dasharray:4 3"/>
  <text x="196" y="42" class="f-label f-accent">last agent command 01:58</text>
  <rect x="44" y="10" width="11" height="11" style="fill:var(--accent)"/>
  <text x="60" y="19.5" class="f-label f-muted">my logger</text>
  <rect x="130.8" y="10" width="11" height="11" class="f-box"/>
  <text x="146.8" y="19.5" class="f-label f-muted">WMI hosts</text>
  <rect x="217.60000000000002" y="10" width="11" height="11" style="fill:var(--ink);fill-opacity:0.55"/>
  <text x="233.60000000000002" y="19.5" class="f-label f-muted">Chrome</text>
  <rect x="282.8" y="10" width="11" height="11" style="fill:var(--muted);fill-opacity:0.35"/>
  <text x="298.8" y="19.5" class="f-label f-muted">Windows</text>
  <rect x="355.20000000000005" y="10" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="371.20000000000005" y="19.5" class="f-label f-muted">agents and other</text>
</svg>
<figcaption>New processes by the hour of the snapshot that first saw them. 1129 over the night, 285 of them the logger itself. After 01:58 no agent ran a command.</figcaption>
</figure>

## What else woke up

Chrome is second. After 01:59 it started 169 new processes, 96 extension processes and 73 page renderers. That is 22 to 34 an hour until 8. The command line says `--extension-process` but not which extension, so I do not know which one restarts so often.

Windows itself started 97. Most are `svchost`, 69 of them. With the command line hidden I see only the name. Those with a clear name are more interesting. The Windows Modules Installer pair (TiWorker with TrustedInstaller) started 9 times over the night, 5 of them after 01:59, the last at 04:39. Search indexer processes came 7 times over the night, 4 of them after 01:59 and 3 of those between 07:26 and 07:35. `CompatTelRunner`, the compatibility telemetry, started at 03:19 and started a second copy of itself at 03:34. Microsoft [describes](https://learn.microsoft.com/en-us/windows/win32/taskschd/task-maintenence) maintenance as work that runs when the machine is idle and on AC power. That would fit if the laptop was plugged in, but the log does not say. I also did not log the Task Scheduler, so I can not say which of these starts were maintenance.

Postgres started 23 child processes, spread over all 6 hours. 5 of them also started right after the logger.

## What lived through the night

Among the 415 residents there were 9 `claude.exe` processes, one of them a daemon. The oldest was started on 21 September, a week before. Dev servers had 43 processes with 14 listening ports between them. The oldest of them was started just after midnight on 25 September, almost 4 days before the log. I wrote whotop because I once killed the wrong node holding a port. The log does not say if any of these 14 was still needed.

## What the log can not see

<figure class="fig">
<svg viewBox="0 0 640 214" role="img" aria-label="A timeline of 15 minutes with a snapshot every 303 seconds. A process that lives all night crosses every snapshot and is seen each time. A short process that happens to be alive during one snapshot is seen once. A short process between 2 snapshots is never seen.">
  <line x1="190" y1="186" x2="606" y2="186" class="f-line"/>
  <line x1="190.0" y1="182" x2="190.0" y2="190" class="f-line"/>
  <text x="190.0" y="204" text-anchor="middle" class="f-label f-muted">0 min</text>
  <line x1="328.7" y1="182" x2="328.7" y2="190" class="f-line"/>
  <text x="328.7" y="204" text-anchor="middle" class="f-label f-muted">5 min</text>
  <line x1="467.3" y1="182" x2="467.3" y2="190" class="f-line"/>
  <text x="467.3" y="204" text-anchor="middle" class="f-label f-muted">10 min</text>
  <line x1="606.0" y1="182" x2="606.0" y2="190" class="f-line"/>
  <text x="606.0" y="204" text-anchor="middle" class="f-label f-muted">15 min</text>
  <rect x="215.7" y="34" width="4" height="148" style="fill:var(--accent);fill-opacity:0.8"/>
  <text x="217.7" y="26" text-anchor="middle" class="f-label f-accent">snapshot</text>
  <rect x="355.8" y="34" width="4" height="148" style="fill:var(--accent);fill-opacity:0.8"/>
  <text x="357.8" y="26" text-anchor="middle" class="f-label f-accent">snapshot</text>
  <rect x="495.8" y="34" width="4" height="148" style="fill:var(--accent);fill-opacity:0.8"/>
  <text x="497.8" y="26" text-anchor="middle" class="f-label f-accent">snapshot</text>
  <text x="180" y="64" text-anchor="end" class="f-label f-ink">lives all night</text>
  <rect x="190.0" y="52" width="416.0" height="16" style="fill:var(--ink);fill-opacity:0.55"/>
  <text x="180" y="78" text-anchor="end" class="f-label f-muted">seen 3 times</text>
  <text x="180" y="108" text-anchor="end" class="f-label f-ink">short, hits a snapshot</text>
  <rect x="342.5" y="96" width="30.0" height="16" style="fill:var(--ink);fill-opacity:0.55"/>
  <text x="180" y="122" text-anchor="end" class="f-label f-muted">seen once</text>
  <text x="180" y="152" text-anchor="end" class="f-label f-ink">short, between snapshots</text>
  <rect x="407.2" y="140" width="23.1" height="16" style="fill:none;stroke:var(--muted);stroke-dasharray:3 2"/>
  <text x="180" y="166" text-anchor="end" class="f-label f-muted">never seen</text>
</svg>
<figcaption>A snapshot every 303 to 305 seconds sees only what is alive at that moment. 978 of the 1129 new processes were seen in one snapshot only, so the real number is higher.</figcaption>
</figure>

A snapshot every 5 minutes sees only what is alive at that moment. A process that lives 2 seconds between 2 snapshots is not in the log at all. This is where I went back and forth twice about the bash processes. First I took them as started by the snapshot, then I decided it was only the sampling. The timing above pushed me back. But a very short process started at random is also seen only if it runs during the query. So it would look tied to the logger too. The log can not separate these 2 cases. Chrome shows the random case for longer processes. Its 169 new processes were caught at all kinds of ages and never right after the logger.

978 of the 1129 new processes were seen in only one snapshot, so the real number of starts is higher. The logger also looks big partly because it is the only process guaranteed to be alive during every snapshot, so its 3 are never missed.

The log is also only a list of who runs. Resource use is not in it at all. whotop was not elevated, so in each snapshot 158 to 183 processes did not show their command line. For Postgres this means I can not tell autovacuum from a client connection. I logged only this one night.
