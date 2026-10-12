---
title: "My fault injector replays a run from one seed. The profile turned out to be part of the seed"
description: "My MCP fault injector replayed 3000 calls byte for byte on 4 Node versions and an agent run 5 times. A rule inserted at the top of the profile changed 48.52% of results, a new seed 53.17%."
date: 2026-10-12
lang: en
translationKey: faultmcp-seed
tags: ["agents", "reliability"]
---
In August I published [`fault-mcp`](https://github.com/dimhold/fault-mcp), an MCP server that breaks its own tools on purpose. It has 6 fault types. `error` and `empty` announce themselves and `latency` gives the right answer late. The other 3 return something wrong and say nothing, `corrupt` among them. It is not the first tool of this kind. [`mcp-chaos`](https://github.com/ajinb/mcp-chaos) is about 2 months older, has a seed too and its README replays its demo from seed 42.

Earlier today I checked one sentence of the `fault-mcp` README against real clients and it held only for some of them. So I took the paragraph I was most sure about, the one called Reproducibility:

> The decision for a given call depends only on `(seed, tool name, call number)`. Call 7 rolls the same numbers whether or not calls 1 through 6 ever happened, so a bad run replays from the seed alone with no session to re-drive. Change the seed and you get a different run; keep it and you get the same one, on any machine.

I wrote that paragraph and the code under it. The tests check determinism in one process: the same seed and call number give the same decision and calls before it do not matter. CI runs them on Linux, Windows and macOS, but no test pins an actual value, so each machine only agrees with itself. I never replayed a whole run on another Node version and I never edited a profile and compared the result. "On any machine" was about the hash function. I had not run it anywhere else.

## The setup

`fault-mcp` 0.1.0 from npm, the bundled `chaos` profile (all 6 fault types, rules with probabilities from 5 to 15%) and seed 1337. A script makes a fixed list of calls to the 3 example tools. It prints the journal without the clock fields `ts` and `durationMs`, then a SHA-256 of it. In library mode my script replaces `setTimeout`, so a latency fault does not wait and the script records the delay it drew. The stdio client is `@modelcontextprotocol/sdk` 1.32.1. For the agent part I used Claude Code 2.1.292 with `claude-opus-5`, only this one MCP server, started from an empty folder.

## What held

3000 calls on Node 18.17.0, 20.18.1, 22.23.1 and 24.11.0 gave one hash. The same 3000 calls on a second host with Node 22.23.1 gave the same hash. Both hosts are x86_64 with the same CPU model, so "any machine" is still a bit wider than what I ran. Then 150 calls through the published CLI over stdio, with real sleeps. That took a minute and the journal matched the library journal in 150 of 150 lines.

The call number part also held. I moved all `search` calls to the front and put the other tools after them in reverse order. The fault type was the same on 300 of 300 (tool, call number) pairs and the `search` results were the same 100 of 100. With the counter set to 69 by hand, call 70 of `search` gave the same `error` as in the full run. Calls 1 to 69 really do not need to happen. This is where the 2 seed designs differ. In `mcp-chaos` the `FaultPlan` creates one `random.Random(seed)` for the whole plan and each call draws from it in turn. A call there depends on the calls before it, of any tool.

## The agent made the same 7 calls 5 times

Profile `flaky` with seed 1337. The prompt asked for the balances of ACC-1001 to ACC-1006, with one retry if a call fails. In all 5 runs the agent put 6 calls into one message, got `ETIMEDOUT` on ACC-1002 and retried it. Apart from the clock the journals were equal. Every answer had the same 6 numbers, 2 of them wrong. Calls 1 and 4 were corrupted. ACC-1001 came back as 76,462.65 PLN instead of 86,996.23 USD and ACC-1004 as 82,303.32 PLN instead of 58,115.28 PLN. The agent passed both on in all 5 runs. Its notes were about the `as_of` dates and, in 4 of 5 runs, about minor units. None of them questioned the 2 numbers.

Then I reversed the order of the accounts in the prompt and ran it twice.

<figure class="fig">
<svg viewBox="0 0 630 174" role="img" aria-label="Two agent runs of 7 tool calls each, both with seed 1337. prompt order: call 1 ACC-1001 corrupt, call 2 ACC-1002 error, call 3 ACC-1003 clean, call 4 ACC-1004 corrupt, call 5 ACC-1005 clean, call 6 ACC-1006 latency, call 7 ACC-1002 clean; reversed: call 1 ACC-1006 corrupt, call 2 ACC-1005 error, call 3 ACC-1004 clean, call 4 ACC-1003 corrupt, call 5 ACC-1002 clean, call 6 ACC-1001 latency, call 7 ACC-1005 clean. Call 1 and call 4 are corrupted in both rows, call 2 is an error, call 6 is late, call 7 is the retry. The accounts on those calls differ.">
  <text x="167" y="18" text-anchor="middle" class="f-label f-muted">call 1</text>
  <text x="237" y="18" text-anchor="middle" class="f-label f-muted">call 2</text>
  <text x="307" y="18" text-anchor="middle" class="f-label f-muted">call 3</text>
  <text x="377" y="18" text-anchor="middle" class="f-label f-muted">call 4</text>
  <text x="447" y="18" text-anchor="middle" class="f-label f-muted">call 5</text>
  <text x="517" y="18" text-anchor="middle" class="f-label f-muted">call 6</text>
  <text x="587" y="18" text-anchor="middle" class="f-label f-muted">call 7</text>
  <text x="122" y="57" text-anchor="end" class="f-mono f-ink" style="font-size:11px">prompt order</text>
  <rect x="135" y="32" width="64" height="44" rx="3" class="f-box" style="fill:var(--ink);fill-opacity:0.85"/>
  <text x="167" y="49" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">corrupt</text>
  <text x="167" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">ACC-1001</text>
  <rect x="205" y="32" width="64" height="44" rx="3" class="f-plain" style="stroke:var(--accent);stroke-width:2"/>
  <text x="237" y="49" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">error</text>
  <text x="237" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">ACC-1002</text>
  <rect x="275" y="32" width="64" height="44" rx="3" class="f-plain"/>
  <text x="307" y="49" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">clean</text>
  <text x="307" y="65" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1003</text>
  <rect x="345" y="32" width="64" height="44" rx="3" class="f-box" style="fill:var(--ink);fill-opacity:0.85"/>
  <text x="377" y="49" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">corrupt</text>
  <text x="377" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">ACC-1004</text>
  <rect x="415" y="32" width="64" height="44" rx="3" class="f-plain"/>
  <text x="447" y="49" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">clean</text>
  <text x="447" y="65" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1005</text>
  <rect x="485" y="32" width="64" height="44" rx="3" class="f-plain"/>
  <text x="517" y="49" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">latency</text>
  <text x="517" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">ACC-1006</text>
  <rect x="555" y="32" width="64" height="44" rx="3" class="f-plain"/>
  <text x="587" y="49" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">clean</text>
  <text x="587" y="65" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1002</text>
  <text x="122" y="109" text-anchor="end" class="f-mono f-ink" style="font-size:11px">reversed</text>
  <rect x="135" y="84" width="64" height="44" rx="3" class="f-box" style="fill:var(--ink);fill-opacity:0.85"/>
  <text x="167" y="101" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">corrupt</text>
  <text x="167" y="117" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">ACC-1006</text>
  <rect x="205" y="84" width="64" height="44" rx="3" class="f-plain" style="stroke:var(--accent);stroke-width:2"/>
  <text x="237" y="101" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">error</text>
  <text x="237" y="117" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">ACC-1005</text>
  <rect x="275" y="84" width="64" height="44" rx="3" class="f-plain"/>
  <text x="307" y="101" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">clean</text>
  <text x="307" y="117" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1004</text>
  <rect x="345" y="84" width="64" height="44" rx="3" class="f-box" style="fill:var(--ink);fill-opacity:0.85"/>
  <text x="377" y="101" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">corrupt</text>
  <text x="377" y="117" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">ACC-1003</text>
  <rect x="415" y="84" width="64" height="44" rx="3" class="f-plain"/>
  <text x="447" y="101" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">clean</text>
  <text x="447" y="117" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1002</text>
  <rect x="485" y="84" width="64" height="44" rx="3" class="f-plain"/>
  <text x="517" y="101" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">latency</text>
  <text x="517" y="117" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">ACC-1001</text>
  <rect x="555" y="84" width="64" height="44" rx="3" class="f-plain"/>
  <text x="587" y="101" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">clean</text>
  <text x="587" y="117" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1005</text>
  <text x="8" y="152" class="f-mono f-muted" style="font-size:10px">dark: quiet corruption, blue outline: error</text>
  <text x="8" y="166" class="f-mono f-muted" style="font-size:10px">under the fault: the account asked for on that call</text>
</svg>
<figcaption>Claude Code 2.1.292, profile flaky, seed 1337. The fault follows the call number. Which account it hits depends on the order the agent chose.</figcaption>
</figure>

The schedule stayed where it was, by call number. Call 1 was still corrupt and call 2 still timed out, but now call 1 was ACC-1006 and call 4 was ACC-1003. So the seed fixes the call number that breaks. The agent decides which account is on that number. If it changes the order, the same seed breaks different accounts. By the numbering an extra retry should do the same, though none of my runs had one. In these 7 runs Claude Code delivered the parallel calls in message order. I do not see anything that promises it.

## Where I was wrong

There is a comment in my selector:

> Probability 1 still draws, so that adding a certain rule in front of an uncertain one does not silently reshuffle the ones behind it.

I read it as "the profile is safe to edit". It is safe for one kind of edit. Every call has one random stream and the rules take numbers from it from top to bottom. Change a probability and every rule keeps its number in the stream. Only calls whose roll falls between the old and the new value move. Insert a rule at the top and every rule below gets the next number in the stream, which is a different number. A rule with `onCalls` is the exception. On other calls it is skipped without a draw.

The reason given in the comment is wrong too. A rule with probability 1 always fires and returns, so the rules behind it are never evaluated on that call. Its draw only changes the content of its own fault.

<figure class="fig">
<svg viewBox="0 0 634 250" role="img" aria-label="The first 6 random numbers of call 5 of get_account_balance, seed 1337: 0.810, 0.541, 0.161, 0.819, 0.036, 0.888. With the chaos profile as shipped the first 4 go to error, empty, latency and truncate without firing. The 5th, 0.036, fires schema. With a 2% error rule inserted first every rule gets the next number and truncate fires on the same 0.036. In both cases the numbers after it go to the content of the fault, not to a rule.">
  <text x="86" y="41" text-anchor="end" class="f-mono f-ink" style="font-size:11px">u</text>
  <text x="100" y="12" class="f-label f-muted">get_account_balance, call 5, seed 1337</text>
  <rect x="100" y="24" width="80" height="26" rx="3" class="f-plain"/>
  <text x="140" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0.810</text>
  <rect x="188" y="24" width="80" height="26" rx="3" class="f-plain"/>
  <text x="228" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0.541</text>
  <rect x="276" y="24" width="80" height="26" rx="3" class="f-plain"/>
  <text x="316" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0.161</text>
  <rect x="364" y="24" width="80" height="26" rx="3" class="f-plain"/>
  <text x="404" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0.819</text>
  <rect x="452" y="24" width="80" height="26" rx="3" class="f-plain" style="stroke:var(--accent);stroke-width:2"/>
  <text x="492" y="41" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0.036</text>
  <rect x="540" y="24" width="80" height="26" rx="3" class="f-plain"/>
  <text x="580" y="41" text-anchor="middle" class="f-mono f-muted" style="font-size:11px;opacity:0.5">0.888</text>
  <text x="100" y="84" class="f-label f-muted">chaos as shipped</text>
  <rect x="100" y="92" width="80" height="38" rx="3" class="f-plain"/>
  <text x="140" y="108" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">error</text>
  <text x="140" y="123" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0.08</text>
  <rect x="188" y="92" width="80" height="38" rx="3" class="f-plain"/>
  <text x="228" y="108" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">empty</text>
  <text x="228" y="123" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0.05</text>
  <rect x="276" y="92" width="80" height="38" rx="3" class="f-plain"/>
  <text x="316" y="108" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">latency</text>
  <text x="316" y="123" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0.1</text>
  <rect x="364" y="92" width="80" height="38" rx="3" class="f-plain"/>
  <text x="404" y="108" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">truncate</text>
  <text x="404" y="123" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0.08</text>
  <rect x="452" y="92" width="80" height="38" rx="3" class="f-box"/>
  <text x="492" y="108" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">schema</text>
  <text x="492" y="123" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0.06</text>
  <rect x="540" y="92" width="80" height="38" rx="3" class="f-plain"/>
  <text x="580" y="108" text-anchor="middle" class="f-mono f-muted" style="font-size:11px;opacity:0.5">corrupt</text>
  <text x="580" y="123" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0.15</text>
  <text x="86" y="115" text-anchor="end" class="f-mono f-accent" style="font-size:11px">schema</text>
  <text x="100" y="162" class="f-label f-muted">error p 0.02 inserted first</text>
  <rect x="100" y="170" width="80" height="38" rx="3" class="f-plain"/>
  <text x="140" y="186" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">error</text>
  <text x="140" y="201" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0.02</text>
  <rect x="188" y="170" width="80" height="38" rx="3" class="f-plain"/>
  <text x="228" y="186" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">error</text>
  <text x="228" y="201" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0.08</text>
  <rect x="276" y="170" width="80" height="38" rx="3" class="f-plain"/>
  <text x="316" y="186" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">empty</text>
  <text x="316" y="201" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0.05</text>
  <rect x="364" y="170" width="80" height="38" rx="3" class="f-plain"/>
  <text x="404" y="186" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">latency</text>
  <text x="404" y="201" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0.1</text>
  <rect x="452" y="170" width="80" height="38" rx="3" class="f-box"/>
  <text x="492" y="186" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">truncate</text>
  <text x="492" y="201" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0.08</text>
  <rect x="540" y="170" width="80" height="38" rx="3" class="f-plain"/>
  <text x="580" y="186" text-anchor="middle" class="f-mono f-muted" style="font-size:11px;opacity:0.5">schema</text>
  <text x="580" y="201" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0.06</text>
  <text x="86" y="193" text-anchor="end" class="f-mono f-accent" style="font-size:11px">truncate</text>
  <text x="100" y="242" class="f-mono f-muted" style="font-size:10px">a rule fires when its number is below p, the rest are not drawn</text>
</svg>
<figcaption>Each rule takes the next number from the call's stream. An inserted rule moves every rule below it by one number.</figcaption>
</figure>

I measured it on 30000 calls, 10000 per tool, with the seed fixed. The inserted rule is an `error` with p 0.02, so by itself it fires on about 2% of calls. Inserted first, it changed the result of 48.52% of all calls. A new seed as a control changed 53.17%. The same rule appended at the bottom changed 1.21%.

<figure class="fig">
<svg viewBox="0 0 620 226" role="img" aria-label="Bar chart, share of 30000 calls whose result changed after one profile edit, seed fixed: new seed (control) 53.17%, rule inserted first 48.52%, rule removed 36.77%, 2 rules swapped 13.96%, rule appended last 1.21%, first p 0.08 → 0.09 1.06%, last p 0.15 → 0.16 0.71%.">
  <text x="180" y="29" text-anchor="end" class="f-mono f-ink" style="font-size:11px">new seed (control)</text>
  <rect x="190" y="17" width="319.0" height="17" rx="2" class="f-plain" style="stroke-dasharray:3 2"/>
  <text x="515.0" y="29" class="f-mono f-ink" style="font-size:11px">53.17</text>
  <text x="180" y="55" text-anchor="end" class="f-mono f-ink" style="font-size:11px">rule inserted first</text>
  <rect x="190" y="43" width="291.1" height="17" rx="2" class="f-box"/>
  <text x="487.1" y="55" class="f-mono f-accent" style="font-size:11px">48.52</text>
  <text x="180" y="81" text-anchor="end" class="f-mono f-ink" style="font-size:11px">rule removed</text>
  <rect x="190" y="69" width="220.6" height="17" rx="2" class="f-box"/>
  <text x="416.6" y="81" class="f-mono f-ink" style="font-size:11px">36.77</text>
  <text x="180" y="107" text-anchor="end" class="f-mono f-ink" style="font-size:11px">2 rules swapped</text>
  <rect x="190" y="95" width="83.8" height="17" rx="2" class="f-box"/>
  <text x="279.8" y="107" class="f-mono f-ink" style="font-size:11px">13.96</text>
  <text x="180" y="133" text-anchor="end" class="f-mono f-ink" style="font-size:11px">rule appended last</text>
  <rect x="190" y="121" width="7.3" height="17" rx="2" class="f-box"/>
  <text x="203.3" y="133" class="f-mono f-ink" style="font-size:11px">1.21</text>
  <text x="180" y="159" text-anchor="end" class="f-mono f-ink" style="font-size:11px">first p 0.08 → 0.09</text>
  <rect x="190" y="147" width="6.4" height="17" rx="2" class="f-box"/>
  <text x="202.4" y="159" class="f-mono f-ink" style="font-size:11px">1.06</text>
  <text x="180" y="185" text-anchor="end" class="f-mono f-ink" style="font-size:11px">last p 0.15 → 0.16</text>
  <rect x="190" y="173" width="4.3" height="17" rx="2" class="f-box"/>
  <text x="200.3" y="185" class="f-mono f-ink" style="font-size:11px">0.71</text>
  <text x="190" y="218" class="f-mono f-muted" style="font-size:10px">% of 30000 calls with a different result</text>
</svg>
<figcaption>faultmcp 0.1.0, profile chaos, seed 1337, 10000 calls per tool.</figcaption>
</figure>

So a bug report that says "seed 1337 breaks it" is not enough. The profile has to travel with it rule for rule. Even editing the message text of the first rule changed 7.86% of the results. Inserting a rule at the top changed almost as much as a new seed. My README does not say this anywhere.

One smaller thing came up on the way. `--seed` and `FAULTMCP_SEED` go through `parseInt`, so `0x10` silently becomes seed 0 and `1337abc` becomes 1337. The startup line on stderr shows the seed it actually used, but nothing fails.

## What I did not check

Only x86_64 and only Linux. Proxied tools through `--upstream`, where the real server can answer differently between runs and a corrupted answer changes with it. Agents other than Claude Code and models other than `claude-opus-5`. 5 identical agent runs on one prompt say nothing about a long session, where the model has more chances to choose a different path. Also the journal has no field for the delay a latency fault drew. Only `durationMs` from the clock shows it, within 3 ms in my runs. The rule in the journal carries a default `ms: 2000` that looks like the delay and is not.

The Reproducibility paragraph needs the profile next to the seed and a word about call order. I have not changed it yet.
