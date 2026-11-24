---
title: "The m in mTLS cost an RSA server 21% and an ECDSA server 189%"
description: "I measured what a client certificate adds to TLS 1.2 with OpenSSL 1.1.0g and nginx 1.12.2. The server handshake grew 1.21 times with RSA and 2.89 times with ECDSA. With tickets an expired client certificate kept getting 200 OK for almost 5 minutes."
date: 2018-01-28
lang: en
translationKey: mtls-overhead
tags: ["networking", "performance"]
---

Server CPU for one full handshake in microseconds. The second number is with a certificate from the client:

```
rsa   tls  942   mtls  1137
ec    tls  228   mtls   659
```

Before the run I had written down one guess for both lines. Twice as many certificates means about twice as much work on the server, whatever the keys are. The real factors are 1.21 and 2.89, so I missed in both directions.

I got here from the service mesh discussion. Istio 0.4 has a separate `istio-auth.yaml` which turns on mutual TLS between all sidecars and I was thinking about its cost as one number. My usual answer was that the handshake is expensive, so keep connections open. I repeated it for years and never measured which part is expensive and who pays for it.

The area is well walked. Adam Langley wrote in 2010 that TLS took less than 1% of CPU on Gmail frontends. Vincent Bernat in 2011 compared how unevenly the handshake loads the client and the server. Arnis Parsovs had a paper at NDSS 2014 about practical issues of client certificates in Apache and browsers. I wanted the numbers for 2 services talking to each other.

## The setup

OpenSSL 1.1.0g and nginx 1.12.2, both built from source, on 2 cores of a virtual machine with AES in hardware. Only TLS 1.2, because 1.3 is still a draft. ECDHE on P-256 and AES128-GCM everywhere, the whole chain is either RSA 2048 or ECDSA P-256, with one intermediate CA.

There are 2 tests. A C program keeps the client and the server in one process, passes bytes through memory and counts CPU of each side, 1000 handshakes per variant, medians of 5 runs. A control run later gave factors of 1.19 and 2.77, so I would not trust the second digit. Then one nginx worker gives a 1 KB file over loopback and I read its CPU from `/proc/PID/schedstat`.

## Who pays

<figure class="fig">
<svg viewBox="0 0 680 264" role="img" aria-label="CPU time of a full TLS 1.2 handshake, median of 5 runs. Server, RSA 2048, TLS: 942 µs, 1 signatures and 0 verifications; Server, RSA 2048, mTLS: 1137 µs, 1 signatures and 3 verifications; Server, ECDSA P-256, TLS: 228 µs, 1 signatures and 0 verifications; Server, ECDSA P-256, mTLS: 659 µs, 1 signatures and 3 verifications; Client, RSA 2048, TLS: 327 µs, 0 signatures and 3 verifications; Client, RSA 2048, mTLS: 1110 µs, 1 signatures and 3 verifications; Client, ECDSA P-256, TLS: 538 µs, 0 signatures and 3 verifications; Client, ECDSA P-256, mTLS: 609 µs, 1 signatures and 3 verifications.">
  <text x="150.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">CPU per full handshake, µs</text>
  <text x="8.0" y="42.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">server</text>
  <text x="142.0" y="63.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">RSA TLS</text>
  <rect x="150" y="52" width="227.7" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="383.7" y="63.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">942</text>
  <text x="490.0" y="63.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 sign, 0 verify</text>
  <text x="142.0" y="82.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">RSA mTLS</text>
  <rect x="150" y="71" width="274.8" height="14" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="430.8" y="82.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1137</text>
  <text x="490.0" y="82.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 sign, 3 verify</text>
  <text x="142.0" y="108.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ECDSA TLS</text>
  <rect x="150" y="97" width="55.1" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="211.1" y="108.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">228</text>
  <text x="490.0" y="108.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 sign, 0 verify</text>
  <text x="142.0" y="127.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ECDSA mTLS</text>
  <rect x="150" y="116" width="159.4" height="14" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="315.4" y="127.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">659</text>
  <text x="490.0" y="127.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 sign, 3 verify</text>
  <text x="8.0" y="156.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">client</text>
  <text x="142.0" y="177.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">RSA TLS</text>
  <rect x="150" y="166" width="79.1" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="235.1" y="177.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">327</text>
  <text x="490.0" y="177.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0 sign, 3 verify</text>
  <text x="142.0" y="196.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">RSA mTLS</text>
  <rect x="150" y="185" width="268.2" height="14" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="424.2" y="196.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1110</text>
  <text x="490.0" y="196.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 sign, 3 verify</text>
  <text x="142.0" y="222.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ECDSA TLS</text>
  <rect x="150" y="211" width="130.1" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="286.1" y="222.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">538</text>
  <text x="490.0" y="222.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0 sign, 3 verify</text>
  <text x="142.0" y="241.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ECDSA mTLS</text>
  <rect x="150" y="230" width="147.3" height="14" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="303.3" y="241.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">609</text>
  <text x="490.0" y="241.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 sign, 3 verify</text>
</svg>
<figcaption>A full handshake in one process over memory buffers, certificates signed by an intermediate CA. Next to each bar is what OpenSSL really called, counted by hooks.</figcaption>
</figure>

With RSA the signature is the expensive operation. `openssl speed` gives here 747 µs to sign and 22 µs to verify. With ECDSA it is the other way, 47 µs to sign and 84 to verify. I put hooks on these functions and counted the calls. Mutual authentication adds one signature to the client and 3 verifications to the server: the proof that the client has the key, the client certificate and the intermediate.

So with RSA the bill goes to the client, its handshake grew from 327 to 1110 µs. With ECDSA the server gets the expensive half. It still spends less than with RSA, 659 against 1137. I would choose ECDSA for mTLS. But my second guess, that ECDSA is cheaper for everybody, failed too. The client of plain TLS spends 538 µs with ECDSA and 327 with RSA.

The sum does not close. 3 ECDSA verifications are 252 µs by `openssl speed`, the server added 431. For RSA it is 66 against 195. I timed the steps alone in a small separate program. Unpacking the 2 client certificates and checking the chain, with 2 verifications inside, is 241 µs for ECDSA and 87 for RSA. The last verification makes it 325 and 109. Then OpenSSL unpacks the client certificate once more, because it decodes its own session before writing the ticket, 25 and 11 µs. About 80 µs are still missing with ECDSA and 75 with RSA. I don't know what they are.

## What is on the wire

<figure class="fig">
<svg viewBox="0 0 680 312" role="img" aria-label="Client and server lanes of a TLS 1.2 handshake. Flight 1, client: ClientHello. Flight 2, server: ServerHello, Certificate, ServerKeyExchange with a signature, for mTLS also CertificateRequest, then ServerHelloDone. Flight 3, client: for mTLS Certificate in clear text, then ClientKeyExchange, for mTLS CertificateVerify with a signature, ChangeCipherSpec, Finished. Flight 4, server: NewSessionTicket, which under mTLS carries the client certificate, ChangeCipherSpec, Finished.">
  <text x="70.0" y="18.0" text-anchor="middle" class="f-label f-ink" style="font-size:11px">client</text>
  <text x="610.0" y="18.0" text-anchor="middle" class="f-label f-ink" style="font-size:11px">server</text>
  <line x1="70" y1="26" x2="70" y2="278" class="f-plain"/>
  <line x1="610" y1="26" x2="610" y2="278" class="f-plain"/>
  <text x="340.0" y="42.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ClientHello</text>
  <line x1="74" y1="50" x2="606" y2="50" class="f-line"/>
  <path d="M598 45 L606 50 L598 55" class="f-line" style="fill:none"/>
  <text x="340.0" y="76.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ServerHello, Certificate</text>
  <text x="340.0" y="92.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ServerKeyExchange</text>
  <text x="340.0" y="108.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">CertificateRequest</text>
  <text x="340.0" y="124.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ServerHelloDone</text>
  <line x1="606" y1="132" x2="74" y2="132" class="f-line"/>
  <path d="M82 127 L74 132 L82 137" class="f-line" style="fill:none"/>
  <text x="340.0" y="158.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">Certificate: in clear text</text>
  <text x="340.0" y="174.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ClientKeyExchange</text>
  <text x="340.0" y="190.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">CertificateVerify</text>
  <text x="340.0" y="206.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ChangeCipherSpec, Finished</text>
  <line x1="74" y1="214" x2="606" y2="214" class="f-line"/>
  <path d="M598 209 L606 214 L598 219" class="f-line" style="fill:none"/>
  <text x="340.0" y="240.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">NewSessionTicket: 1008 / 624 B, was 160</text>
  <text x="340.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ChangeCipherSpec, Finished</text>
  <line x1="606" y1="264" x2="74" y2="264" class="f-line"/>
  <path d="M82 259 L74 264 L82 269" class="f-line" style="fill:none"/>
  <text x="340.0" y="298.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">TLS: 2504 / 1527 B, mTLS: 5336 / 2995 B</text>
</svg>
<figcaption>A full TLS 1.2 handshake. Lines in accent color appear or grow only with mutual authentication, the number of flights stays 4. Bytes are RSA and then ECDSA, chain with an intermediate.</figcaption>
</figure>

A full RSA handshake grew from 2504 to 5336 bytes, ECDSA from 1527 to 2995. The number of flights stayed 4, so there is no extra round trip. But the client certificate goes in clear text. I searched the handshake bytes for `sa/payments` from its name and found it in all 6 variants of keys and chains. Anyone on the wire can read which service is calling. The TLS 1.3 draft encrypts this message.

Then I tried to save and removed the intermediate. The ECDSA server without client certificates became slower, 328 µs instead of 228. It sent the same 1.3 KB. The counter showed one verification on a server that does not check anybody. When there is a trust store and no explicit chain, OpenSSL 1.1.0g builds the chain itself on every handshake, verifies its own certificate and sends the root too. With `SSL_MODE_NO_AUTO_CHAIN` it was 227 µs and about 900 bytes. nginx sets this flag already, I found it in `ngx_event_openssl.c`. My own code did not.

## Per request

Server CPU of nginx per request in µs, depending on how many requests one connection carries:

| | 1 | 1, resumed | 10 | 100 | 1000 |
|---|---|---|---|---|---|
| HTTP | 103 | | 48 | 40 | 40 |
| TLS, RSA | 1293 | 251 | 171 | 59 | 50 |
| mTLS, RSA | 1509 | 276 | 200 | 67 | 50 |
| TLS, ECDSA | 529 | 242 | 99 | 53 | 48 |
| mTLS, ECDSA | 987 | 305 | 161 | 59 | 49 |

My third guess was that at 100 requests per connection mTLS adds less than 10% to HTTP. It adds 46% with ECDSA and 66% with RSA. Giving away a 1 KB file is almost no work, so about 9 µs of encryption per request is loud here. Next to a handler which works for 1 ms it would be around 1%. At 1000 requests the m itself is gone, the difference between TLS and mTLS is about 1 µs and the runs overlap. Each message is 29 bytes longer.

The resumed column surprised me. A ticket skips all signatures and verifications, so I expected TLS and mTLS within 10%. For ECDSA it is 26% more. In the memory test it is 78 µs against 41. I blamed the size of the ticket first. It is 160 bytes without a client certificate, 624 with an ECDSA one and 1008 with RSA, because the server puts the whole client certificate inside. But the RSA ticket is the biggest one and it costs less, 58 µs against 39 without the certificate. Decrypting a ticket is about 1 µs for any of these sizes. What costs is unpacking the certificate from it. OpenSSL 1.1.0g decodes the public key right there, even if nobody will use it, 17 µs for P-256 and 1 for RSA 2048. The whole session with a certificate takes 25 µs more to parse with ECDSA and 11 more with RSA. That is 70% of the difference for ECDSA and a bit over half for RSA, the rest I did not find.

## Expired certificate, 200 OK

This made me look at what the server does with the unpacked certificate. I issued one for 60 seconds. At second 70 a new connection got 400 and `verify=FAILED:certificate has expired` in the log. In the same second a connection with a ticket got 200 and `verify=SUCCESS`.

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Timeline of 365 seconds. The client certificate is valid from 0 to 60 seconds. New full handshakes: 200 at 0 and 50 seconds, 400 at 70 and 200 seconds. Ticket 1, taken at 0 seconds: 200 at 0, 50, 70, 200 and 290 seconds, 400 at 315 and 345. Ticket 2, taken at 50 seconds: 200 at 70, 200, 290, 315 and 345 seconds, 400 at 365.">
  <rect x="170" y="24" width="77.4" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="160.0" y="35.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">certificate valid</text>
  <line x1="247.4" y1="18" x2="247.4" y2="166" class="f-plain" stroke-dasharray="4 4"/>
  <text x="160.0" y="74.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">new handshake</text>
  <line x1="170" y1="70" x2="660" y2="70" class="f-plain"/>
  <circle cx="170.0" cy="70" r="6" style="fill:var(--ink);stroke:none"/>
  <circle cx="234.5" cy="70" r="6" style="fill:var(--ink);stroke:none"/>
  <path d="M255.3 65 L265.3 75 M255.3 75 L265.3 65" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <path d="M422.9 65 L432.9 75 M422.9 75 L432.9 65" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <text x="160.0" y="112.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ticket from 0 s</text>
  <line x1="170" y1="108" x2="660" y2="108" class="f-plain"/>
  <circle cx="170.0" cy="108" r="6" style="fill:var(--ink);stroke:none"/>
  <circle cx="234.5" cy="108" r="6" style="fill:var(--ink);stroke:none"/>
  <circle cx="260.3" cy="108" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="427.9" cy="108" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="543.9" cy="108" r="6" style="fill:var(--accent);stroke:none"/>
  <path d="M571.2 103 L581.2 113 M571.2 113 L581.2 103" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <path d="M609.9 103 L619.9 113 M609.9 113 L619.9 103" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <text x="160.0" y="150.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ticket from 50 s</text>
  <line x1="170" y1="146" x2="660" y2="146" class="f-plain"/>
  <circle cx="260.3" cy="146" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="427.9" cy="146" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="543.9" cy="146" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="576.2" cy="146" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="614.9" cy="146" r="6" style="fill:var(--accent);stroke:none"/>
  <path d="M635.7 141 L645.7 151 M635.7 151 L645.7 141" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <text x="170.0" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="247.4" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <text x="324.7" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">120</text>
  <text x="402.1" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">180</text>
  <text x="479.5" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">240</text>
  <text x="556.8" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <text x="634.2" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">360</text>
  <text x="160.0" y="186.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">s</text>
</svg>
<figcaption>nginx 1.12.2 with ssl_verify_client on and the default ssl_session_timeout of 5 minutes. A circle is 200, a cross is 400. The certificate expired at 60 seconds.</figcaption>
</figure>

It went on until the ticket itself expired, 5 minutes by default in nginx. A ticket taken at second 50 still worked at second 345, 285 seconds after the end of the certificate. The `$ssl_client_verify` field in the log gives no sign of it, because nginx reports the result saved in the session. For me the real lifetime of a short certificate is now its own plus `ssl_session_timeout`.

## What I didn't check

There is no network here, only loopback, so nothing about latency. The ratio between sign and verify belongs to this build and this processor. I forced P-256 for the key exchange, while 1.1.0 prefers X25519 by default. Envoy uses BoringSSL and Go has its own `crypto/tls`, I measured neither and I don't know if they check the expiry again on resumption. No CRL and no OCSP. With them the server part would grow, but I can't say how much.
