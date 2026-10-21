---
title: "codecard refuses to render a snippet that names a codebase. It missed all 569 Kotlin package lines I gave it"
description: "codecard refuses to render a code card when the snippet names a codebase. I ran its guard over 9 public repositories and 31 leak shapes. It refused 2.2% of random windows of public code, partly because of a case flag that turns /users/ routes into build paths. It caught 0 of 569 Kotlin package lines because the rule wants a semicolon. Next to gitleaks 8.30.1 it caught 10 of 18 shapes that name a codebase and 6 of 13 secrets."
date: 2026-10-18
lang: en
translationKey: codecard-guard
tags: ["code-quality", "text"]
---
In August I opened [codecard](https://github.com/dimhold/codecard). It renders a code or log snippet as a card for a feed. Before drawing, it reads the text and refuses if the text names a codebase. That means a package line, an import of your own code, a build path with a username, an internal host or something shaped like a credential. It fails closed, with exit code 2 and no file. I made it this way because a warning printed at 1am gets scrolled past and the image stays on somebody's timeline.

The guard has 11 rules and 171 tests and they all pass. But every case in that suite was written for the suite. The example in the README is a Java file I made up so that it has exactly 5 leaks. The guard never saw code that I did not write, so I ran it on code I did not write.

I took codecard from GitHub at its last commit, `f10a09e`, on Python 3.12. Next to it I put 9 public repositories at their last commit before 1 October. They are in 8 languages from Java to Rust, among them `spring-petclinic` and `vite`. From each repository I took up to 300 files. From each file I took 2 windows of 15 lines, the top of the file and one random window from the rest. That second one is roughly what I copy when I want to show a function.

## How often it refuses public code

Everything in this corpus is already published, so every refusal here is a refusal of code that is not a secret. On the random windows from the middle of a file it refused 17 of 790, which is 2.2%. On the top of the file it refused 138 of 1200. 132 of those are C# files in MediatR, where the namespace sits in the first 15 lines. By its own definition the guard is right there, because a namespace does name the codebase. This one is public and `--guard off` exists for that case.

Some of the 17 are noise. In express it refused a test with the URL `/users/0-2`. Among other folders, the path rule looks for `/Users/` on macOS and `/home/` on Linux. But codecard compiles all its default rules with `re.I`, so a lowercase route matches too. Over all files of the corpus the path rule matches 107 lines and 23 of them match only because of that flag. In okhttp it refused imports of `org.robolectric` and `org.bouncycastle`. The private import rule has an allowlist of 26 group names and treats every other name as your own code.

2.2% is a price I accepted in August without knowing the number and now I know it. A refusal costs me one `--guard off`. The case flag is different, that one I have to fix.

## The line it promised to catch

Then I ran the guard on the declaration line of every file without sampling, one line at a time. Java gave 106 of 106 caught and C# gave 133 of 133. Kotlin gave 0 of 569.

<figure class="fig">
<svg viewBox="0 0 640 214" role="img" aria-label="The package-declaration rule of codecard ends with a semicolon. Two lines below it: the Java line package com.acmebank.ledger.settlement with a semicolon, caught in 106 of 106 Java files, and the same Kotlin line with no semicolon at the end, caught in 0 of 569 Kotlin files.">
  <text x="24" y="34" class="f-label f-muted">the rule:</text>
  <text x="110" y="34" textLength="218.4" lengthAdjust="spacingAndGlyphs" class="f-mono f-muted">^[ \t]*package\s+[\w.]+\s*</text>
  <text x="328.4" y="34" textLength="8.4" lengthAdjust="spacingAndGlyphs" class="f-mono f-accent">;</text>
  <text x="24" y="92" class="f-label f-ink">Java</text>
  <text x="110" y="92" textLength="319.2" lengthAdjust="spacingAndGlyphs" class="f-mono f-ink">package com.acmebank.ledger.settlement</text>
  <rect x="428.2" y="74" width="10.4" height="24" style="fill:var(--accent);fill-opacity:0.18;stroke:var(--accent);stroke-width:1"/>
  <text x="429.2" y="92" textLength="8.4" lengthAdjust="spacingAndGlyphs" class="f-mono f-accent">;</text>
  <text x="110" y="118" class="f-label f-muted">caught in 106 of 106 files</text>
  <text x="24" y="170" class="f-label f-ink">Kotlin</text>
  <text x="110" y="170" textLength="319.2" lengthAdjust="spacingAndGlyphs" class="f-mono f-ink">package com.acmebank.ledger.settlement</text>
  <rect x="428.2" y="152" width="10.4" height="24" style="fill:none;stroke:var(--accent);stroke-width:1;stroke-dasharray:3 2"/>
  <text x="447.6" y="168" class="f-label f-accent">the rule needs this</text>
  <text x="110" y="196" class="f-label f-accent">caught in 0 of 569 files</text>
</svg>
<figcaption>Package line of every file in the corpus, scanned alone. For C# the namespace rule allows a missing semicolon and caught 133 of 133.</figcaption>
</figure>

The rule wants a semicolon at the end of the package line and Kotlin does not put one there. When the rule fires, it prints the reason "a Java or Kotlin package name is your company and product, spelled out". I wrote that sentence and the regex while looking at a Java file. The tests for it are Java too.

It is worse than one missed line. I took the leaky example from the README and rewrote it as Kotlin. The guard still refuses it, with 4 findings: the import, the key, the host and the path. The package is not in the list. When I fix the 4 things it told me about, the card renders with `package com.acmebank.ledger.settlement` on line 1 and exit code 0. The same file with a semicolon gets exit code 2. At 1am the list looks complete, so I would fix the 4 and post.

## Next to a secret scanner

Then I wanted to know what the guard misses. Real leaks I can not count, so I wrote a list of 31 shapes that come out of an editor paste or a log. I ran them through codecard and through gitleaks 8.30.1, the scanner I would use on a repository. The secrets in the list are random strings of the right format, generated at run time.

<figure class="fig">
<svg viewBox="0 0 640 617" role="img" aria-label="A table of 31 leak shapes in 2 groups with 2 columns, codecard and gitleaks 8.30.1. Shapes that name a codebase: codecard caught 10 of 18, gitleaks 0. Secrets: codecard caught 6 of 13, gitleaks 12. 8 shapes pass both, all of them in the first group.">
  <text x="420" y="22" text-anchor="middle" class="f-label f-ink">codecard</text>
  <text x="540" y="22" text-anchor="middle" class="f-label f-ink">gitleaks</text>
  <text x="24" y="46" class="f-label f-muted">names the codebase (18)</text>
  <text x="420" y="46" text-anchor="middle" class="f-label f-muted">10</text>
  <text x="540" y="46" text-anchor="middle" class="f-label f-muted">0</text>
  <line x1="24" y1="51" x2="616" y2="51" class="f-line"/>
  <text x="330" y="69" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Java package</text>
  <circle cx="420" cy="65" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="65" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="86" text-anchor="end" class="f-mono f-accent" style="font-size:12px">Kotlin package</text>
  <circle cx="420" cy="82" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="82" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="103" text-anchor="end" class="f-mono f-ink" style="font-size:12px">C# namespace</text>
  <circle cx="420" cy="99" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="99" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="120" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Java import</text>
  <circle cx="420" cy="116" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="116" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="137" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Kotlin import</text>
  <circle cx="420" cy="133" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="133" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="154" text-anchor="end" class="f-mono f-accent" style="font-size:12px">Python import</text>
  <circle cx="420" cy="150" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="150" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="171" text-anchor="end" class="f-mono f-accent" style="font-size:12px">Go import</text>
  <circle cx="420" cy="167" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="167" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="188" text-anchor="end" class="f-mono f-accent" style="font-size:12px">TypeScript import</text>
  <circle cx="420" cy="184" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="184" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="205" text-anchor="end" class="f-mono f-ink" style="font-size:12px">C:\Users\ in a .NET trace</text>
  <circle cx="420" cy="201" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="201" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="222" text-anchor="end" class="f-mono f-ink" style="font-size:12px">/home/ path in an error</text>
  <circle cx="420" cy="218" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="218" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="239" text-anchor="end" class="f-mono f-ink" style="font-size:12px">/Users/ path in a stack</text>
  <circle cx="420" cy="235" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="235" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="256" text-anchor="end" class="f-mono f-ink" style="font-size:12px">path in a Python traceback</text>
  <circle cx="420" cy="252" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="252" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="273" text-anchor="end" class="f-mono f-accent" style="font-size:12px">path starting with ~</text>
  <circle cx="420" cy="269" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="269" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="290" text-anchor="end" class="f-mono f-ink" style="font-size:12px">https://*.internal URL</text>
  <circle cx="420" cy="286" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="286" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="307" text-anchor="end" class="f-mono f-accent" style="font-size:12px">*.internal:5432, no scheme</text>
  <circle cx="420" cy="303" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="303" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="324" text-anchor="end" class="f-mono f-accent" style="font-size:12px">*.svc.cluster.local</text>
  <circle cx="420" cy="320" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="320" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="341" text-anchor="end" class="f-mono f-accent" style="font-size:12px">host on the company domain</text>
  <circle cx="420" cy="337" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="337" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="358" text-anchor="end" class="f-mono f-ink" style="font-size:12px">10.x address</text>
  <circle cx="420" cy="354" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="354" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="24" y="376" class="f-label f-muted">secrets (13)</text>
  <text x="420" y="376" text-anchor="middle" class="f-label f-muted">6</text>
  <text x="540" y="376" text-anchor="middle" class="f-label f-muted">12</text>
  <line x1="24" y1="381" x2="616" y2="381" class="f-line"/>
  <text x="330" y="399" text-anchor="end" class="f-mono f-ink" style="font-size:12px">API_KEY = &quot;...&quot;</text>
  <circle cx="420" cy="395" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="395" r="5" style="fill:var(--accent)"/>
  <text x="330" y="416" text-anchor="end" class="f-mono f-ink" style="font-size:12px">.env line, no quotes</text>
  <circle cx="420" cy="412" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="412" r="5" style="fill:var(--accent)"/>
  <text x="330" y="433" text-anchor="end" class="f-mono f-ink" style="font-size:12px">YAML password, no quotes</text>
  <circle cx="420" cy="429" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="429" r="5" style="fill:var(--accent)"/>
  <text x="330" y="450" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Authorization: Bearer</text>
  <circle cx="420" cy="446" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="446" r="5" style="fill:var(--accent)"/>
  <text x="330" y="467" text-anchor="end" class="f-mono f-ink" style="font-size:12px">curl -H token header</text>
  <circle cx="420" cy="463" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="463" r="5" style="fill:var(--accent)"/>
  <text x="330" y="484" text-anchor="end" class="f-mono f-ink" style="font-size:12px">AWS key id AKIA...</text>
  <circle cx="420" cy="480" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="480" r="5" style="fill:var(--accent)"/>
  <text x="330" y="501" text-anchor="end" class="f-mono f-ink" style="font-size:12px">AWS secret key</text>
  <circle cx="420" cy="497" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="497" r="5" style="fill:var(--accent)"/>
  <text x="330" y="518" text-anchor="end" class="f-mono f-ink" style="font-size:12px">private key block</text>
  <circle cx="420" cy="514" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="514" r="5" style="fill:var(--accent)"/>
  <text x="330" y="535" text-anchor="end" class="f-mono f-ink" style="font-size:12px">JWT</text>
  <circle cx="420" cy="531" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="531" r="5" style="fill:var(--accent)"/>
  <text x="330" y="552" text-anchor="end" class="f-mono f-ink" style="font-size:12px">postgres://user:pass@</text>
  <circle cx="420" cy="548" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="548" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="569" text-anchor="end" class="f-mono f-ink" style="font-size:12px">JDBC ?password=</text>
  <circle cx="420" cy="565" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="565" r="5" style="fill:var(--accent)"/>
  <text x="330" y="586" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Slack webhook URL</text>
  <circle cx="420" cy="582" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="582" r="5" style="fill:var(--accent)"/>
  <text x="330" y="603" text-anchor="end" class="f-mono f-ink" style="font-size:12px">api_key=&quot;sk-proj-...&quot;</text>
  <circle cx="420" cy="599" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="599" r="5" style="fill:var(--accent)"/>
</svg>
<figcaption>31 leak shapes, one line each. A filled dot means the tool caught the line, a blue label means neither tool did. The secrets are random strings of the right format.</figcaption>
</figure>

The 2 tools barely overlap. Of the 18 shapes that name a codebase, codecard caught 10 and gitleaks none, which is fair, because gitleaks is built for secrets. Of the 13 secrets gitleaks caught 12 and codecard 6. Its credential rule only sees a value in quotes after a name like `api_key` or `password`. A line from a `.env` file renders. So do a password in YAML without quotes, an `Authorization: Bearer` header in a log and a Slack webhook URL. This one hurts a bit. I made the `ember` theme for failing logs and a log is exactly where a bearer token sits without quotes.

Together they caught 23 of 31. All 8 that neither of them caught name a codebase. Among them are the Kotlin package and an internal host without `https://` in front. The hardest is a host on the company's own domain and I do not know how to catch it without knowing the company. The README already says that the guard does not know what your company is called.

## The first line of the README

The README starts the install with `pip install codecard`. I ran it in a clean virtualenv and pip found no distribution. The name is not registered on PyPI at all. So the README of a tool that exists to stop leaks tells people to install a name that anyone can register. It has been like this since the middle of August and I did not notice.

## What I did not check

The 31 shapes are my own list, so they say which shapes pass and not how often people paste them. The corpus is 9 repositories and 1 random seed. A different window size could move the 2.2%. I did not run trufflehog. I also did not fix anything yet. The semicolon, the case flag, the unquoted secrets and the PyPI name are still open in codecard at `f10a09e`.
