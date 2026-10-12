---
title: "My fault injector hides outputSchema from strict clients. Claude Code 2.1.292 did not check it at all"
description: "The README of my MCP fault injector says it hides outputSchema because a strict client would reject a schema fault before the agent sees it. I ran 9 fault profiles through raw JSON-RPC, the TypeScript SDK 1.32.1, the Python SDK 2.3.0 and Claude Code 2.1.292. With the schema published, TypeScript after listTools and Python threw on 4 of 8 faults, including empty and truncate. Without listTools the TypeScript client checked nothing. Claude Code passed every schema fault to the model, which answered $40,718.77 each time. One fault never left my own server."
date: 2026-10-12
lang: en
translationKey: outputschema-trap
tags: ["agents", "reliability"]
---
In August I published [`fault-mcp`](https://github.com/dimhold/fault-mcp), an MCP server that breaks its own tools on purpose. One of its 6 faults is `schema`: the tool answers with a payload that does not match its declared shape. For example a number arrives as a string or a required field is missing. The README has a design note about it:

> A client that validates structured output rejects a `schema` fault at the transport boundary, so the agent never sees it and you end up measuring the client instead of the agent.

So the server hides `outputSchema` by default and there is a flag, `--advertise-output-schema`, to publish it. The repository has a test that the schema is hidden or listed. No test sends a schema fault through a client with the schema published. I never ran it through the agent I use every day either. The sentence names a trap without saying which clients fall into it and I took it as true because it sounded right.

## The setup

`fault-mcp` 0.1.0 from npm, the tool `get_account_balance`, account `ACC-4471`. The clean answer is 4,071,877 minor units, so $40,718.77, in `structuredContent` and as one line of text. I wrote 9 profiles with probability 1: a clean one, `error`, `empty`, `truncate`, 2 corruption strategies and 3 schema modes. I left `latency` out, it gives the right answer late. Each profile ran with the schema hidden and published.

On the SDK level there were 3 client libraries in 4 setups. Raw JSON-RPC over stdio without any SDK shows what the server put on the wire. The TypeScript `Client` from `@modelcontextprotocol/sdk` 1.32.1, once calling `callTool` directly and once after `listTools()`. And `ClientSession` from the Python `mcp` 2.3.0. Then the agent: Claude Code 2.1.292 with `claude-opus-5`, no built in tools, only this one MCP server, started from a fresh folder in `/tmp` with only the MCP config in it. Its stream log records the tool result as Claude Code passed it to the model. The server and the SDK clients ran on Node 22.23.1.

## What the SDK clients did

With the schema hidden all 5 clients, Claude Code included, returned whatever the server sent. The only exception is `wrong-container`, it has its own section below. With the schema published the picture splits.

<figure class="fig">
<svg viewBox="0 0 638 324" role="img" aria-label="A grid of 9 profiles, a clean one and 8 faults, by 6 columns. The first column is the schema hidden, the same for all 5 clients. The other 5 columns are the schema published: raw JSON-RPC, TypeScript SDK callTool without listing, TypeScript SDK after listTools, Python SDK, Claude Code. clean: all 5: passed, raw: passed, TS: passed, TS+list: passed, Python: passed, Claude: passed; error: all 5: passed, raw: passed, TS: passed, TS+list: passed, Python: passed, Claude: passed; empty: all 5: passed, raw: passed, TS: passed, TS+list: threw, Python: threw, Claude: passed; truncate: all 5: passed, raw: passed, TS: passed, TS+list: threw, Python: threw, Claude: passed; corrupt, plausible: all 5: passed, raw: passed, TS: passed, TS+list: passed, Python: passed, Claude: passed; corrupt, generic: all 5: passed, raw: passed, TS: passed, TS+list: passed, Python: passed, Claude: passed; schema, type-swap: all 5: passed, raw: passed, TS: passed, TS+list: threw, Python: threw, Claude: passed; schema, drop-required: all 5: passed, raw: passed, TS: passed, TS+list: threw, Python: threw, Claude: passed; schema, wrong-container: all 5: server, raw: server, TS: server, TS+list: server, Python: server, Claude: server.">
  <text x="239.5" y="16" text-anchor="middle" class="f-label f-muted">schema hidden</text>
  <text x="452.5" y="16" text-anchor="middle" class="f-label f-muted">schema published</text>
  <line x1="279" y1="22" x2="626" y2="22" class="f-line" style="opacity:0.5"/>
  <text x="239.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">all 5</text>
  <text x="310.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">raw</text>
  <text x="381.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">TS</text>
  <text x="452.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">TS+list</text>
  <text x="523.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Python</text>
  <text x="594.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Claude</text>
  <line x1="274" y1="48" x2="274" y2="268" class="f-line" style="stroke-dasharray:3 2"/>
  <text x="194" y="68" text-anchor="end" class="f-mono f-ink" style="font-size:11px">clean</text>
  <rect x="207" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="278" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="349" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="420" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="452.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="491" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="523.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="562" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <text x="194" y="92" text-anchor="end" class="f-mono f-ink" style="font-size:11px">error</text>
  <rect x="207" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="278" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="349" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="420" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="452.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="491" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="523.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="562" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <text x="194" y="116" text-anchor="end" class="f-mono f-ink" style="font-size:11px">empty</text>
  <rect x="207" y="102" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="116" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="278" y="102" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="116" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="349" y="102" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="116" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="420" y="102" width="65" height="20" rx="3" class="f-box"/>
  <text x="452.5" y="116" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">threw</text>
  <rect x="491" y="102" width="65" height="20" rx="3" class="f-box"/>
  <text x="523.5" y="116" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">threw</text>
  <rect x="562" y="102" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="116" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <text x="194" y="140" text-anchor="end" class="f-mono f-ink" style="font-size:11px">truncate</text>
  <rect x="207" y="126" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="140" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="278" y="126" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="140" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="349" y="126" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="140" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="420" y="126" width="65" height="20" rx="3" class="f-box"/>
  <text x="452.5" y="140" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">threw</text>
  <rect x="491" y="126" width="65" height="20" rx="3" class="f-box"/>
  <text x="523.5" y="140" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">threw</text>
  <rect x="562" y="126" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="140" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <text x="194" y="164" text-anchor="end" class="f-mono f-ink" style="font-size:11px">corrupt, plausible</text>
  <rect x="207" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="278" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="349" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="420" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="452.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="491" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="523.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="562" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <text x="194" y="188" text-anchor="end" class="f-mono f-ink" style="font-size:11px">corrupt, generic</text>
  <rect x="207" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="278" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="349" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="420" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="452.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="491" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="523.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="562" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <text x="194" y="212" text-anchor="end" class="f-mono f-ink" style="font-size:11px">schema, type-swap</text>
  <rect x="207" y="198" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="278" y="198" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="349" y="198" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="420" y="198" width="65" height="20" rx="3" class="f-box"/>
  <text x="452.5" y="212" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">threw</text>
  <rect x="491" y="198" width="65" height="20" rx="3" class="f-box"/>
  <text x="523.5" y="212" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">threw</text>
  <rect x="562" y="198" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <text x="194" y="236" text-anchor="end" class="f-mono f-ink" style="font-size:11px">schema, drop-required</text>
  <rect x="207" y="222" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="278" y="222" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="349" y="222" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <rect x="420" y="222" width="65" height="20" rx="3" class="f-box"/>
  <text x="452.5" y="236" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">threw</text>
  <rect x="491" y="222" width="65" height="20" rx="3" class="f-box"/>
  <text x="523.5" y="236" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">threw</text>
  <rect x="562" y="222" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">passed</text>
  <text x="194" y="260" text-anchor="end" class="f-mono f-ink" style="font-size:11px">schema, wrong-container</text>
  <rect x="207" y="246" width="65" height="20" rx="3" class="f-plain" style="fill:var(--muted);fill-opacity:0.18;stroke:var(--muted)"/>
  <text x="239.5" y="260" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">server</text>
  <rect x="278" y="246" width="65" height="20" rx="3" class="f-plain" style="fill:var(--muted);fill-opacity:0.18;stroke:var(--muted)"/>
  <text x="310.5" y="260" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">server</text>
  <rect x="349" y="246" width="65" height="20" rx="3" class="f-plain" style="fill:var(--muted);fill-opacity:0.18;stroke:var(--muted)"/>
  <text x="381.5" y="260" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">server</text>
  <rect x="420" y="246" width="65" height="20" rx="3" class="f-plain" style="fill:var(--muted);fill-opacity:0.18;stroke:var(--muted)"/>
  <text x="452.5" y="260" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">server</text>
  <rect x="491" y="246" width="65" height="20" rx="3" class="f-plain" style="fill:var(--muted);fill-opacity:0.18;stroke:var(--muted)"/>
  <text x="523.5" y="260" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">server</text>
  <rect x="562" y="246" width="65" height="20" rx="3" class="f-plain" style="fill:var(--muted);fill-opacity:0.18;stroke:var(--muted)"/>
  <text x="594.5" y="260" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">server</text>
  <text x="194" y="286" class="f-mono f-muted" style="font-size:10px">passed: the caller got a result</text>
  <text x="194" y="300" class="f-mono f-muted" style="font-size:10px">threw: the client raised</text>
  <text x="194" y="314" class="f-mono f-muted" style="font-size:10px">server: the server SDK refused to send it</text>
</svg>
<figcaption>TS is @modelcontextprotocol/sdk 1.32.1, Python is mcp 2.3.0, Claude is Claude Code 2.1.292. Only 2 clients react to the published schema and only once they have the tool list.</figcaption>
</figure>

The TypeScript client after `listTools` and the Python client threw on 4 of the 8 faults. 2 of them are the schema faults the README talks about. The other 2 surprised me: `empty` and `truncate`. Both drop `structuredContent` and a tool with an output schema must return it. Both clients raise "has an output schema but did not return structured content". So `truncate`, which is meant to be a quiet fault, becomes an exception before anything reads it.

The 2 corruptions passed every client in both modes. The plausible one returns the row of a neighbouring account under the requested id: $9,381.67 with the right types and fields, but for another account. A validator checks only the shape and the shape was fine.

The TypeScript client without `listTools` did not check anything against the output schema. I looked into the SDK code. The validators are built in `cacheToolMetadata` and that runs only when `listTools()` returns. `callTool` on its own finds no validator and returns the result. Python lists the tools itself when the name is unknown, so it validates either way. An eval harness that calls a tool by name without listing first gets the lenient behaviour from the strict SDK.

## The row nobody received

`wrong-container` put an array where the object was. It never reached any client, with or without the schema. Raw JSON-RPC got error -32602 "Invalid tools/call result" from the server itself.

faultmcp is built on the SDK's low level `Server`. The README even explains why: a fault injector must be able to return payloads a strict result type would refuse. But that `Server` wraps every `tools/call` handler and parses the result with `CallToolResultSchema` before sending it. The cast in TypeScript only silences the compiler. The runtime check in `Server` still runs. I checked 1.30.0, the lowest version the `package.json` of faultmcp allows. It does the same.

So one of my 3 schema modes has not worked through the transport on any version I checked. Its unit test calls `applyFault` directly and passes. I had 85 green tests and none of them sent this fault over a pipe.

## What the agent did

Claude Code was the client I cared about most, because it is the agent I use. I put a small tee between Claude Code and the server to see the wire. `tools/list` carried the full `outputSchema`, with `balance_minor` declared as an integer and all 4 fields required.

<figure class="fig">
<svg viewBox="0 0 640 280" role="img" aria-label="A diagram of the path of a tool result with the schema published: tool result, server SDK check, stdio, client check, model. Two lanes. For the TypeScript client after listTools and the Python client, wrong-container stops at the server SDK, empty, truncate, type-swap and drop-required stop at the client check, clean, error and both corruptions reach the model. For Claude Code 2.1.292, wrong-container stops at the server SDK and every other fault reaches the model, because the client does no check.">
  <rect x="14" y="16" width="100" height="40" rx="4" class="f-plain"/>
  <text x="64" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">tool result</text>
  <line x1="116" y1="36" x2="128" y2="36" class="f-line"/>
  <path d="M 128 36 l -6 -4 l 0 8 z" class="f-muted"/>
  <rect x="132" y="16" width="120" height="40" rx="4" class="f-box"/>
  <text x="192" y="33" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">server SDK</text>
  <text x="192" y="48" text-anchor="middle" class="f-mono f-muted" style="font-size:9.5px">CallToolResultSchema</text>
  <line x1="254" y1="36" x2="264" y2="36" class="f-line"/>
  <path d="M 264 36 l -6 -4 l 0 8 z" class="f-muted"/>
  <rect x="268" y="16" width="72" height="40" rx="4" class="f-plain"/>
  <text x="304" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">stdio</text>
  <line x1="342" y1="36" x2="356" y2="36" class="f-line"/>
  <path d="M 356 36 l -6 -4 l 0 8 z" class="f-muted"/>
  <rect x="360" y="16" width="140" height="40" rx="4" class="f-box"/>
  <text x="430" y="33" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">client</text>
  <text x="430" y="48" text-anchor="middle" class="f-mono f-muted" style="font-size:9.5px">outputSchema</text>
  <line x1="502" y1="36" x2="516" y2="36" class="f-line"/>
  <path d="M 516 36 l -6 -4 l 0 8 z" class="f-muted"/>
  <rect x="520" y="16" width="106" height="40" rx="4" class="f-plain"/>
  <text x="573" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">model</text>
  <line x1="14" y1="78" x2="626" y2="78" class="f-plain"/>
  <text x="14" y="94" class="f-label f-muted">TS after listTools, Python</text>
  <text x="192" y="118" text-anchor="middle" class="f-glyph f-ink">×</text>
  <text x="192" y="136" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">wrong-container</text>
  <text x="430" y="118" text-anchor="middle" class="f-glyph f-accent">×</text>
  <text x="500" y="136" text-anchor="end" class="f-mono f-accent" style="font-size:10.5px">empty, truncate</text>
  <text x="500" y="150" text-anchor="end" class="f-mono f-accent" style="font-size:10.5px">type-swap, drop-required</text>
  <text x="573" y="118" text-anchor="middle" class="f-glyph f-ink">✓</text>
  <text x="626" y="136" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">clean, error</text>
  <text x="626" y="150" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">2 corruptions</text>
  <line x1="14" y1="166" x2="626" y2="166" class="f-plain"/>
  <text x="14" y="182" class="f-label f-muted">Claude Code 2.1.292</text>
  <text x="192" y="206" text-anchor="middle" class="f-glyph f-ink">×</text>
  <text x="192" y="224" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">wrong-container</text>
  <text x="430" y="206" text-anchor="middle" class="f-glyph f-muted">→</text>
  <text x="430" y="224" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">no check</text>
  <text x="573" y="206" text-anchor="middle" class="f-glyph f-ink">✓</text>
  <text x="626" y="238" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">clean, error, empty,</text>
  <text x="626" y="252" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">truncate, 2 corruptions,</text>
  <text x="626" y="266" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">type-swap, drop-required</text>
</svg>
<figcaption>The first gate is in faultmcp's own SDK and fires with the schema hidden too. The second exists only in some clients.</figcaption>
</figure>

Then the `type-swap` fault sent `"balance_minor": "4071877"` as a string. Claude Code passed it to the model without any complaint. `drop-required` removed `account_id` and that passed too. Same with the schema hidden. Claude Code did not validate the structured output in any of my runs.

The model answered $40,718.77 in all 6 runs with these 2 faults. It never mentioned the missing account id or the number in quotes. In every run that gave a number it did warn that the `as_of` date was months old, but that is just the date in my fake ledger and not a fault. With `empty`, `truncate`, `error` and `wrong-container` it said every time that there was no balance. The plausible corruption went through as $9,381.67 both times.

I did not expect one more difference between clients. When `structuredContent` exists, Claude Code gives the model its JSON and not the text block. The generic corruption rewrites the text and the structured payload separately, so the text said `ACC-4476` while the structured part said `ACC-9471`. The model saw `ACC-9471` and caught the wrong account both times. A harness that reads `content[0].text` would get the true $40,718.77 under `ACC-4476`, while the model in Claude Code got `ACC-9471` with $43,035.36.

## So what does the flag measure

The README is right that a strict client can eat the fault before the agent sees it. But the protocol leaves it open. The spec version Claude Code negotiated, 2025-11-25, says clients SHOULD validate structured results, not MUST. The official TypeScript SDK is strict only after `listTools`, Python is always strict, Claude Code is not strict at all. With my server, a published schema changed 4 of 9 results in 2 clients and 0 of 9 in the agent.

The default to hide the schema stays, because with it hidden every client I tried got the same result. But the reason in the README should name which clients validate and say that `empty` and `truncate` turn into exceptions too. `wrong-container` has to be fixed or removed, because right now it tests the server SDK. I have not pushed any of it yet.

## What I did not check

The agent ran once per cell plus 2 extra runs with the tee. So the model numbers are counts of a handful of runs and not rates. I used only 1 model, `claude-opus-5`. I did not try Cursor, Codex CLI or any other agent and they may validate. Both SDKs were the latest releases on the day. The 2.x line of the TypeScript client, `@modelcontextprotocol/client` 2.3.1, I checked only on 3 faults. It behaved like 1.32.1, strict only after `listTools`. I only used stdio, not HTTP.
