---
title: "My MCP server without an SDK is 114 lines. A wrong line or envelope got silence 26 times out of 34"
description: "I wrote an MCP server for stdio without an SDK and spoiled its conversation with the official TypeScript and Python clients in 51 ways. A wrong field in the result mostly gets a clear error. A wrong line or envelope got silence in 26 cases of 34."
date: 2025-02-02
lang: en
translationKey: mcp-server-no-sdk
tags: ["agents", "reliability", "debugging"]
---

When my server answered an official MCP client for the first time, I put `tee` between them to see what the client really sends. Its side of the session was 6 lines of JSON. The first one ended with `"id":0` and I did not expect a zero there. A server that recognises notifications by `if (!id)` would never answer `initialize`.

When a protocol has an SDK I take the SDK and open the specification only after something hangs. I am not alone, all 19 reference servers in the MCP repository depend on an official SDK. This time I wrote the server without it, to learn what a client demands and what it does when the server is wrong. Writing the protocol by hand is not new, `mcp-go` is an implementation in Go made outside the official SDKs. I wanted to know what the clients forgive.

## The setup

The protocol revision is 2024-11-05 over stdio, on Node 22.13. My server gives 3 tools over a folder of markdown notes: list, search and read. It has no packages and takes 114 lines by `wc -l`.

I wrote the same tools on the TypeScript SDK 1.4.1 and got 50 lines, plus 17 packages with 440 files and 5.1 MB in `node_modules`. So the protocol cost me 64 lines. From spawn to the `initialize` response it is 39 ms against 81 ms, median of 30 runs on a 2-core virtual machine. An empty Node process answers in 33. A server of 12 lines with hardcoded answers also passed my test scenario.

The clients are the official ones, TypeScript SDK 1.4.1 and Python SDK 1.2.1, both from January. Between client and server I put a small proxy which spoils one thing per run. The scenario has 5 steps, from `initialize` to the second `tools/call`.

I prepared 51 deviations. 38 of them are forbidden by the text of the specification or by its `schema.json`, 6 are valid and 7 it does not decide, like a process that exits. I sorted them by hand and moved several after the first run. Then I checked the output of the proxy against the schema and the ids. The check caught 36 of the 38 and none of the 6.

It counts as silence when there is neither a response nor an error for 5 seconds. The slowest successful step took 1.7 s. I ran the whole list twice on 2 releases of Node 22 and the outcomes were the same.

Before the run I wrote down 4 guesses. TypeScript with its zod schemas is stricter than Python. A text line in stdout breaks both clients, so does an id returned as a string. Tools not declared in `capabilities` break both too.

## Fields are checked, envelopes are dropped

| what is broken | client | works | error | silence |
|---|---|---|---|---|
| lines and envelope, 17 | TypeScript | 7 | 0 | 10 |
| | Python | 1 | 0 | 16 |
| fields of the result, 18 | TypeScript | 1 | 17 | 0 |
| | Python | 6 | 12 | 0 |
| no complete line arrives, 3 | TypeScript | 0 | 0 | 3 |
| | Python | 0 | 0 | 3 |

<figure class="fig">
<svg viewBox="0 0 700 448" role="img" aria-label="Table of 38 forbidden server deviations and 2 clients, counts are works / error / silence. Lines and envelope, 17 rows: TypeScript 7 / 0 / 10, Python 1 / 0 / 16. Fields of the result, 18 rows: TypeScript 1 / 17 / 0, Python 6 / 12 / 0. No complete line arrives, 3 rows: TypeScript 0 / 0 / 3, Python 0 / 0 / 3.">
  <text x="10" y="18" text-anchor="start" class="f-label f-ink">lines and envelope</text>
  <text x="277" y="34" text-anchor="middle" class="f-label f-muted">TS</text>
  <text x="313" y="34" text-anchor="middle" class="f-label f-muted">Py</text>
  <text x="10" y="56" text-anchor="start" class="f-mono f-ink" style="font-size:11px">text line at the start</text>
  <rect x="264" y="46" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="46" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="74" text-anchor="start" class="f-mono f-ink" style="font-size:11px">text line on every call</text>
  <rect x="264" y="64" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="64" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="92" text-anchor="start" class="f-mono f-ink" style="font-size:11px">JSON log line at the start</text>
  <rect x="264" y="82" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="82" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="110" text-anchor="start" class="f-mono f-ink" style="font-size:11px">empty line after a message</text>
  <rect x="264" y="100" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="100" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="128" text-anchor="start" class="f-mono f-ink" style="font-size:11px">JSON on several lines</text>
  <rect x="264" y="118" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="118" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="146" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Content-Length header</text>
  <rect x="264" y="136" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="136" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="164" text-anchor="start" class="f-mono f-ink" style="font-size:11px">BOM at the start</text>
  <rect x="264" y="154" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="154" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="182" text-anchor="start" class="f-mono f-ink" style="font-size:11px">response in an array</text>
  <rect x="264" y="172" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="172" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="200" text-anchor="start" class="f-mono f-ink" style="font-size:11px">id as a string</text>
  <rect x="264" y="190" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="190" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="218" text-anchor="start" class="f-mono f-ink" style="font-size:11px">no id in the response</text>
  <rect x="264" y="208" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="208" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="236" text-anchor="start" class="f-mono f-ink" style="font-size:11px">id: null</text>
  <rect x="264" y="226" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="226" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="254" text-anchor="start" class="f-mono f-ink" style="font-size:11px">no jsonrpc field</text>
  <rect x="264" y="244" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="244" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="272" text-anchor="start" class="f-mono f-ink" style="font-size:11px">error: null with a result</text>
  <rect x="264" y="262" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="262" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="10" y="290" text-anchor="start" class="f-mono f-ink" style="font-size:11px">notification got an error</text>
  <rect x="264" y="280" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="280" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="308" text-anchor="start" class="f-mono f-ink" style="font-size:11px">notification got a result</text>
  <rect x="264" y="298" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="298" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="326" text-anchor="start" class="f-mono f-ink" style="font-size:11px">tools/list: result is an array</text>
  <rect x="264" y="316" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="316" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="344" text-anchor="start" class="f-mono f-ink" style="font-size:11px">ping: result null</text>
  <rect x="264" y="334" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="334" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="365" y="18" text-anchor="start" class="f-label f-ink">fields of the result</text>
  <text x="632" y="34" text-anchor="middle" class="f-label f-muted">TS</text>
  <text x="668" y="34" text-anchor="middle" class="f-label f-muted">Py</text>
  <text x="365" y="56" text-anchor="start" class="f-mono f-ink" style="font-size:11px">no protocolVersion</text>
  <rect x="619" y="46" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="46" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="74" text-anchor="start" class="f-mono f-ink" style="font-size:11px">no capabilities</text>
  <rect x="619" y="64" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="64" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="92" text-anchor="start" class="f-mono f-ink" style="font-size:11px">capabilities: {}</text>
  <rect x="619" y="82" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="655" y="82" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="110" text-anchor="start" class="f-mono f-ink" style="font-size:11px">tools: true</text>
  <rect x="619" y="100" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="100" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="128" text-anchor="start" class="f-mono f-ink" style="font-size:11px">no serverInfo</text>
  <rect x="619" y="118" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="118" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="146" text-anchor="start" class="f-mono f-ink" style="font-size:11px">no serverInfo.version</text>
  <rect x="619" y="136" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="136" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="164" text-anchor="start" class="f-mono f-ink" style="font-size:11px">instructions: null</text>
  <rect x="619" y="154" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="154" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="182" text-anchor="start" class="f-mono f-ink" style="font-size:11px">nextCursor: null</text>
  <rect x="619" y="172" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="172" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="200" text-anchor="start" class="f-mono f-ink" style="font-size:11px">no inputSchema</text>
  <rect x="619" y="190" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="190" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="218" text-anchor="start" class="f-mono f-ink" style="font-size:11px">inputSchema: {}</text>
  <rect x="619" y="208" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="208" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="236" text-anchor="start" class="f-mono f-ink" style="font-size:11px">input_schema</text>
  <rect x="619" y="226" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="226" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="254" text-anchor="start" class="f-mono f-ink" style="font-size:11px">description: null</text>
  <rect x="619" y="244" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="244" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="272" text-anchor="start" class="f-mono f-ink" style="font-size:11px">content is a string</text>
  <rect x="619" y="262" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="262" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="290" text-anchor="start" class="f-mono f-ink" style="font-size:11px">no content</text>
  <rect x="619" y="280" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="280" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="308" text-anchor="start" class="f-mono f-ink" style="font-size:11px">no type in content</text>
  <rect x="619" y="298" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="298" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="326" text-anchor="start" class="f-mono f-ink" style="font-size:11px">type: json</text>
  <rect x="619" y="316" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="316" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="344" text-anchor="start" class="f-mono f-ink" style="font-size:11px">text is a number</text>
  <rect x="619" y="334" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="334" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="362" text-anchor="start" class="f-mono f-ink" style="font-size:11px">isError as a string</text>
  <rect x="619" y="352" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="352" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="10" y="377" text-anchor="start" class="f-label f-ink">no complete line arrives</text>
  <text x="10" y="396" text-anchor="start" class="f-mono f-ink" style="font-size:11px">no newline at the end</text>
  <rect x="264" y="386" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="386" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="414" text-anchor="start" class="f-mono f-ink" style="font-size:11px">id 0 not answered</text>
  <rect x="264" y="404" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="404" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="432" text-anchor="start" class="f-mono f-ink" style="font-size:11px">ping not answered</text>
  <rect x="264" y="422" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="422" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="365" y="426" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="399" y="436" text-anchor="start" class="f-mono f-muted" style="font-size:11px">works</text>
  <rect x="475" y="426" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="509" y="436" text-anchor="start" class="f-mono f-muted" style="font-size:11px">error</text>
  <rect x="585" y="426" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="619" y="436" text-anchor="start" class="f-mono f-muted" style="font-size:11px">silence</text>
</svg>
<figcaption>38 things the specification forbids, one per run. TS is the TypeScript SDK client 1.4.1, Py is the Python SDK client 1.2.1. Silence means neither a response nor an error in 5 seconds.</figcaption>
</figure>

Both clients read in 2 stages. First the line has to become a JSON-RPC message, I call this the envelope. Then the result is checked by the schema of its method. If the second stage fails, the client says which field is wrong. Python says `serverInfo.version Field required`, TypeScript prints the zod path.

If the first stage fails, the request learns nothing and keeps waiting. For lines and envelope that was 26 cases of 34 and I did not see a single error. My first count was 30 of 38, but it included a server that does not answer `ping`. Nothing arrives there, so there is nothing to complain about. I moved 3 such rows to the bottom of the table.

They wait differently. TypeScript gave up after 60 seconds with `MCP error -32001: Request timed out`. Python has no timeout by default, although the specification says that implementations SHOULD have one. I waited 5 minutes once and stopped it.

In all 10 silent cases where a line had arrived the TypeScript client knew the reason and passed it to its `onerror` callback. But you have to set this callback yourself.

## 3 and a half guesses were wrong

Undeclared tools turned out to be fine for them. `capabilities: {}` is the only one of 38 forbidden things that worked in both clients. My server of 12 lines sends exactly this, so it passed the scenario without being valid MCP.

A string id works in TypeScript, because the client calls `Number()` on it. In Python it hangs. A text line in stdout did not stop TypeScript either, it reports the line to `onerror` and reads on. Python hung on `initialize` after the single line `notes server started`.

TypeScript is stricter about the fields, so I count half a guess. It refuses `null` where a field should be absent. I tried it on `nextCursor` and 3 others and Python accepts all 4.

The Python hang has a mechanism that I did not guess. In 1.2.1 a line that cannot be parsed is passed to `session.incoming_messages`, a stream without a buffer. If nobody reads the stream, the receive loop waits there and the correct response stays behind it. Notifications and unanswered requests from the server go into the same stream. The client example in the README of the package does not mention this stream.

<figure class="fig">
<svg viewBox="0 0 680 172" role="img" aria-label="How the Python SDK client 1.2.1 hangs. The server prints the line notes server started and then the correct response to id 0. Then the receive loop tries to pass the first line to incoming_messages, which has no buffer and no reader, so it waits. Nobody reads the response and initialize keeps waiting for id 0.">
  <text x="10" y="22" text-anchor="start" class="f-label f-muted">stdout of the server</text>
  <text x="270" y="22" text-anchor="start" class="f-label f-muted">receive loop</text>
  <text x="500" y="22" text-anchor="start" class="f-label f-muted">incoming_messages</text>
  <rect x="10" y="34" width="190" height="34" rx="4" class="f-box"/>
  <text x="20" y="55" text-anchor="start" class="f-mono f-accent" style="font-size:12px">notes server started</text>
  <rect x="10" y="104" width="190" height="34" rx="4" class="f-box"/>
  <text x="20" y="125" text-anchor="start" class="f-mono f-ink" style="font-size:12px">{ id: 0, result: ... }</text>
  <rect x="270" y="34" width="150" height="34" rx="4" class="f-box"/>
  <text x="345" y="55" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">send() waits</text>
  <rect x="500" y="34" width="170" height="52" rx="4" class="f-box"/>
  <text x="585" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">no buffer</text>
  <text x="585" y="74" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">nobody reads it</text>
  <rect x="270" y="104" width="150" height="52" rx="4" class="f-box"/>
  <text x="345" y="125" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">initialize()</text>
  <text x="345" y="144" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">waits for id 0</text>
  <line x1="200" y1="51" x2="268" y2="51" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="261,47 268,51 261,55" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <line x1="420" y1="51" x2="498" y2="51" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="491,47 498,51 491,55" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <line x1="200" y1="121" x2="268" y2="121" style="fill:none;stroke:var(--muted);stroke-width:1.5;stroke-dasharray:4 4"/>
  <polyline points="261,117 268,121 261,125" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <text x="105" y="156" text-anchor="middle" class="f-label f-muted">never read</text>
</svg>
<figcaption>Python SDK client 1.2.1. The loop is stuck handing over the bad line. The correct answer stays behind it.</figcaption>
</figure>

I let my script read that stream in the background and 9 hangs disappeared. 6 of them were forbidden lines. The other 3 were valid messages, 2 with a log notification and 1 with a `ping` from the server. So a correct server can hang this client too.

If the server process dies, TypeScript says `Connection closed` at once. Python waited 2 minutes for a process that no longer existed, then I stopped it.

## My own mistake

The first version of my server had 113 lines. It answered a line that is not JSON with error -32700 and `"id": null`, as JSON-RPC 2.0 asks. MCP says that all messages MUST follow JSON-RPC. But in its schema the id of an error is a string or an integer, so my polite answer was invalid MCP. I had the same error object among my own 38 rows, as a reply to a notification. Python hangs on it. The official clients do not send broken JSON, so in practice I would hardly meet it.

I fed 19 crooked lines to the SDK servers too. 4 of them are no messages at all and both servers stay silent on these. The process of the Python one exited on 4 others, for example on a notification it does not know or on `id: 1.5`. The TypeScript one survived all 19. My first version also answered requests with `id: null` and without `jsonrpc`. Now such lines go to stderr, which added one line.

## What I didn't check

Claude Desktop, where I would use such a server in the end. Inspector 0.3.0 stands on the TypeScript SDK, but I did not run it. I did not touch SSE or resources and everything ran on Linux. The list of deviations is mine, so 26 of 34 also depends on what I put there. I ran the long waits once, each on one deviation. The clients are from January and the behaviour may change in the next release.

For 3 tools that only read I would keep the 114 lines, but with the `schema.json` check in the tests, because I can't count on the client to tell me. For subscriptions or SSE I would take the SDK.
