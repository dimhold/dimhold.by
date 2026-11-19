---
title: "My local GPT-2 made 13 requests to huggingface.co before it answered"
description: "I keep GPT-2 on my machine so that my prompts stay there. With transformers 4.12.3 and the model already in the cache, one pipeline call still made 13 requests to huggingface.co. The prompt was in none of them, but without network the same call crashed. Behind a firewall that drops packets the crash took 187.8 seconds."
date: 2021-11-14
lang: en
translationKey: local-privacy
tags: ["llm", "networking", "machine-learning"]
---
The argument for keeping a model on my own machine is short. A hosted API gets every prompt I send with the full text and what happens with it after is a question of their policy. With a model on my disk there is no network in the loop, so nobody gets anything.

This week I wanted to write down why I keep the model local and the paragraph above was all I had. The second half of it I never checked. My "local" setup is `pipeline("text-generation", model="gpt2")` and a call. The weights are in the cache after the first run, so I assumed that after the first run nothing leaves the machine. I have never looked at the traffic of these lines, so I did.

## The setup

Versions current this week: Python 3.9, torch 1.10.0 on CPU, transformers 4.12.3 (released November 3), tokenizers 0.10.3. The model is GPT-2 small, 124M parameters. As a prompt I use a fake invoice line, `Invoice 4471 for ACME, net 30, total`. `ACME` works as a canary: if it appears in any byte of any request, the text has left.

All HTTPS of the process goes through mitmproxy with its certificate in `REQUESTS_CA_BUNDLE`, so I see every request in clear text with headers. Separately I ran the same script under `strace -f -e trace=connect` without any proxy. This catches every connection of every thread, also those that would not go through the proxy.

## What leaves

The first run with an empty cache downloaded about 550 MB, most of it the weights. This I expected, they have to come from somewhere.

The second run with everything in the cache made 13 requests. The third and fourth also 13. 12 of them are `HEAD` requests, one for each file the pipeline may need. `config.json` is asked 4 times. Some tokenizer files do not exist in this repository and answer 404, but they are asked anyway. The remaining request is `GET /api/models/gpt2`, which returns the list of files in the repository. Except this list nothing is downloaded, a `HEAD` only compares the ETag with the cache. About 4 KB goes out per call.

<figure class="fig">
<svg viewBox="0 0 680 325" role="img" aria-label="The 13 requests that one pipeline call with a full cache sends to huggingface.co, in order: HEAD config.json, HEAD config.json, HEAD pytorch_model.bin, HEAD tokenizer_config.json, HEAD config.json, GET /api/models/gpt2, HEAD vocab.json, HEAD merges.txt, HEAD tokenizer.json, HEAD added_tokens.json, HEAD special_tokens_map.json, HEAD tokenizer_config.json, HEAD config.json. The prompt stays on the machine: 0 of 13 requests contain it.">
  <rect x="20" y="40" width="200" height="150" rx="4" class="f-box"/>
  <text x="30" y="62" text-anchor="start" class="f-label f-ink" style="font-size:13px">my machine</text>
  <text x="30" y="92" text-anchor="start" class="f-muted" style="font-size:12px">the prompt:</text>
  <text x="30" y="110" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Invoice 4471 for</text>
  <text x="30" y="125" text-anchor="start" class="f-mono f-accent" style="font-size:11px">ACME, net 30, total</text>
  <text x="30" y="160" text-anchor="start" class="f-ink" style="font-size:13px">0 of 13 requests</text>
  <text x="30" y="176" text-anchor="start" class="f-muted" style="font-size:12px">contain it</text>
  <line x1="222" y1="115" x2="262" y2="115" class="f-line"/>
  <path d="M262 115 l-7 -4 v8 z" class="f-ink"/>
  <text x="270" y="26" text-anchor="start" class="f-label f-ink" style="font-size:12px">huggingface.co, one call with a full cache</text>
  <rect x="270" y="38" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="50" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 1</text>
  <text x="298" y="50" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="50" text-anchor="start" class="f-mono f-ink" style="font-size:10px">config.json</text>
  <rect x="270" y="57" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="69" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 2</text>
  <text x="298" y="69" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="69" text-anchor="start" class="f-mono f-ink" style="font-size:10px">config.json</text>
  <rect x="270" y="76" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="88" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 3</text>
  <text x="298" y="88" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="88" text-anchor="start" class="f-mono f-ink" style="font-size:10px">pytorch_model.bin</text>
  <rect x="270" y="95" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="107" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 4</text>
  <text x="298" y="107" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="107" text-anchor="start" class="f-mono f-ink" style="font-size:10px">tokenizer_config.json</text>
  <rect x="270" y="114" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="126" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 5</text>
  <text x="298" y="126" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="126" text-anchor="start" class="f-mono f-ink" style="font-size:10px">config.json</text>
  <rect x="270" y="133" width="390" height="16" rx="2" class="f-box"/>
  <text x="276" y="145" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 6</text>
  <text x="298" y="145" text-anchor="start" class="f-mono f-accent" style="font-size:10px">GET</text>
  <text x="340" y="145" text-anchor="start" class="f-mono f-ink" style="font-size:10px">/api/models/gpt2</text>
  <rect x="270" y="152" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="164" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 7</text>
  <text x="298" y="164" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="164" text-anchor="start" class="f-mono f-ink" style="font-size:10px">vocab.json</text>
  <rect x="270" y="171" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="183" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 8</text>
  <text x="298" y="183" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="183" text-anchor="start" class="f-mono f-ink" style="font-size:10px">merges.txt</text>
  <rect x="270" y="190" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="202" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 9</text>
  <text x="298" y="202" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="202" text-anchor="start" class="f-mono f-ink" style="font-size:10px">tokenizer.json</text>
  <rect x="270" y="209" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="221" text-anchor="start" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="298" y="221" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="221" text-anchor="start" class="f-mono f-ink" style="font-size:10px">added_tokens.json</text>
  <rect x="270" y="228" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="240" text-anchor="start" class="f-mono f-muted" style="font-size:10px">11</text>
  <text x="298" y="240" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="240" text-anchor="start" class="f-mono f-ink" style="font-size:10px">special_tokens_map.json</text>
  <rect x="270" y="247" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="259" text-anchor="start" class="f-mono f-muted" style="font-size:10px">12</text>
  <text x="298" y="259" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="259" text-anchor="start" class="f-mono f-ink" style="font-size:10px">tokenizer_config.json</text>
  <rect x="270" y="266" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="278" text-anchor="start" class="f-mono f-muted" style="font-size:10px">13</text>
  <text x="298" y="278" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="278" text-anchor="start" class="f-mono f-ink" style="font-size:10px">config.json</text>
  <text x="270" y="299" text-anchor="start" class="f-muted" style="font-size:11px">each HEAD: transformers, Python and torch versions,</text>
  <text x="270" y="314" text-anchor="start" class="f-mono f-muted" style="font-size:10px">session_id, file_type, using_pipeline</text>
</svg>
<figcaption>One pipeline call for GPT-2 with everything already in the cache, transformers 4.12.3. The text of the prompt is in none of the requests. What goes out is which files of which model I load, with a user agent.</figcaption>
</figure>

The canary is in 0 of the requests. The text of the prompt did not leave, so the main half of the argument holds. But every `HEAD` carries a user agent like this:

```
transformers/4.12.3; python/3.9.<patch>; session_id/<32 hex chars>; torch/1.10.0+cpu;
file_type/model; framework/pytorch; from_auto_class/True; using_pipeline/text-generation
```

So for every load the hub learns which model I use and that I call it through a text generation pipeline. It also gets my Python and torch versions and my IP address with the time. `session_id` is a `uuid4` created once per process (`file_utils.py`, line 253). In my 3 runs it had 3 different values. It links the requests of one process together. Between days only the IP address links them, if it did not change. It is public, it came in March with the pull request "Add transformers id to hub requests".

There is also `DISABLE_TELEMETRY=1`. With it the same 13 requests go out. The user agent loses `file_type`, `from_auto_class` and `using_pipeline` and gets `telemetry/off` instead, but `session_id` stays and the model name is in every URL anyway. So the flag cuts what they learn about how I use the model, but the traffic is the same 13 requests.

## The place where I was wrong

I was ready to write that the price of all this is 13 small requests. Then I turned the network off and the pipeline did not start.

There is no root on this machine, so I took the network away inside the process. Name lookup always fails, like on a laptop with the wireless off. The cache is complete, the URLs are the same. The docstring of `get_from_cache` says that if networking is off, it returns the last cached version. For the config and the weights it really does. Then the tokenizer asks `/api/models/gpt2` for the list of files and there is no `try` around this call. After 2.7 seconds the script ends with `requests.exceptions.ConnectionError`, with 550 MB of the model on the disk.

The second case is worse. When the packets are not rejected but silently dropped, like behind a firewall with DROP, the same crash comes after 187.8 seconds. Before the failing call there are 5 `HEAD` requests with a 10 second timeout each. The call to `/api/models` has no timeout at all, so it waits until the kernel gives up on the connection. In strace this wait is about 135 seconds. 50 plus 135 plus 3 seconds of start and model load gives the 187.8.

I checked the wheels of 4.10.3 and 4.11.3, the same call is there.

<figure class="fig">
<svg viewBox="0 0 680 228" role="img" aria-label="Time from start to the end of the script without network, with the full model in the cache. No DNS, no flag: 2.7 s, ConnectionError; packets dropped, no flag: 187.8 s, ConnectionError; no DNS, TRANSFORMERS_OFFLINE=1: 3.4 s, answer; packets dropped, TRANSFORMERS_OFFLINE=1: 4.0 s, answer.">
  <text x="20" y="33" text-anchor="start" class="f-ink" style="font-size:12px">no DNS</text>
  <text x="20" y="48" text-anchor="start" class="f-mono f-muted" style="font-size:10px">no flag</text>
  <rect x="230" y="24" width="5.7" height="22" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <text x="243.68421052631578" y="39" text-anchor="start" class="f-ink f-mono" style="font-size:11px">2.7 s, ConnectionError</text>
  <text x="20" y="77" text-anchor="start" class="f-ink" style="font-size:12px">packets dropped</text>
  <text x="20" y="92" text-anchor="start" class="f-mono f-muted" style="font-size:10px">no flag</text>
  <rect x="230" y="68" width="395.4" height="22" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <text x="617.3684210526317" y="83" text-anchor="end" class="f-ink f-mono" style="font-size:11px">187.8 s, ConnectionError</text>
  <text x="20" y="121" text-anchor="start" class="f-ink" style="font-size:12px">no DNS</text>
  <text x="20" y="136" text-anchor="start" class="f-mono f-muted" style="font-size:10px">TRANSFORMERS_OFFLINE=1</text>
  <rect x="230" y="112" width="7.2" height="22" rx="2" class="f-box" style=""/>
  <text x="245.1578947368421" y="127" text-anchor="start" class="f-accent f-mono" style="font-size:11px">3.4 s, answer</text>
  <text x="20" y="165" text-anchor="start" class="f-ink" style="font-size:12px">packets dropped</text>
  <text x="20" y="180" text-anchor="start" class="f-mono f-muted" style="font-size:10px">TRANSFORMERS_OFFLINE=1</text>
  <rect x="230" y="156" width="8.4" height="22" rx="2" class="f-box" style=""/>
  <text x="246.42105263157896" y="171" text-anchor="start" class="f-accent f-mono" style="font-size:11px">4.0 s, answer</text>
  <line x1="230" y1="202" x2="630" y2="202" class="f-line"/>
  <line x1="230" y1="202" x2="230" y2="206" class="f-line"/>
  <text x="230" y="218" text-anchor="middle" class="f-muted" style="font-size:10px">0 s</text>
  <line x1="356.3157894736842" y1="202" x2="356.3157894736842" y2="206" class="f-line"/>
  <text x="356.3157894736842" y="218" text-anchor="middle" class="f-muted" style="font-size:10px">60 s</text>
  <line x1="482.63157894736844" y1="202" x2="482.63157894736844" y2="206" class="f-line"/>
  <text x="482.63157894736844" y="218" text-anchor="middle" class="f-muted" style="font-size:10px">120 s</text>
  <line x1="608.9473684210526" y1="202" x2="608.9473684210526" y2="206" class="f-line"/>
  <text x="608.9473684210526" y="218" text-anchor="middle" class="f-muted" style="font-size:10px">180 s</text>
</svg>
<figcaption>Without network and without the flag the script crashes on the request for the list of files, even though all 550 MB are in the cache. With silently dropped packets the crash takes about 3 minutes. One run each.</figcaption>
</figure>

## The flag

The documentation has a section "Offline mode" with `TRANSFORMERS_OFFLINE=1`. It says that with it the script "should succeed without any hanging waiting to timeout". With the flag, both cases without network work and give the same text: 3.4 and 4.0 seconds from start to answer. Under strace with the flag the process makes 0 `connect()` calls of any kind, also no DNS. Without the flag the same strace shows 13 lookups to port 53, as many as requests.

As a side effect the load is faster: 2.1 seconds with the flag and 4.2 seconds without it under strace. These are single runs on a shared machine, so I trust only the direction.

So I still keep the model at home and the main reason did not change: the prompt stays on my machine. But "the weights are on disk" and "nothing goes to the network" turned out to be 2 different states. The difference is `TRANSFORMERS_OFFLINE=1` and I did not know about it until this week.

## What I did not check

- Only GPT-2 and only the PyTorch pipeline. Other models have other files and the number of requests will differ.
- The count of requests comes from the client code of 4.12.3. The status codes come from the server and the server can change any day.
- The network was removed inside the process by replacing name lookup, not by a real cable or a network namespace. A real outage may fail in another place, for example on the TLS handshake.
- I did not look at what the hub stores from these requests or for how long. I only see what leaves my machine.
- `datasets` has its own `HF_DATASETS_OFFLINE` and I did not measure it.
