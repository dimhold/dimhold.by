---
title: "15 years after Simple Made Easy: 0 of my 102 local variables were final in 2013 and 91.6% of the code I keep is const now. I chose neither"
description: "In may 2013 I started a repository to translate a Rich Hickey talk into Russian. It is still at 0%. That same week I committed synchronized collections to a Java server. I rebuilt that shape and measured it. The commit did not move the failure rate at all. Then I ran the checklist from Simple Made Easy over my own code. 0 of my 102 local variables were final in 2013 and 91.6% of the code I keep is const now. I chose neither."
date: 2026-09-17
lang: en
translationKey: hickey-fifteen-years
---
On 10 May 2013 I created a repository to translate a Rich Hickey talk into Russian. The talk was Clojure Concurrency. The plan started with subtitles and ended with a Russian voiceover. The README still carries the progress table I wrote into it: English subtitles 5%, Russian translation 0%, voiceover 0%. The 2 rows that reached 99% are the ones where I recovered his artifacts, the slides plus the source of the program he demoed. I last touched that file on 23 October 2013.

That week is on record in other repositories too. On 11 May I added a background daemon to a Java server I was working on. On 15 May at 21:09 I committed to the same server a change titled "Add removeClientHandler and add synchronized collections".

So I spent a week translating a talk about concurrency while writing the thing it argues against. The talk with the checklist in it is a different one, Simple Made Easy from Strange Loop that September. I have used its vocabulary since 2013 without ever running its checklist over my own code.

## What the commit of 15 May bought

Simple Made Easy has a slide at 00:28:50 headed What's in your Toolkit. It puts constructs that complect in one column and simpler replacements in the other. On the complexity side: state, objects, methods, inheritance, switch, variables, loops, ORM and conditionals. On the Debugging slide, between 00:15:32 and 00:17:14, he has a name for what tests give you. "All of our guardrails will have failed us."

That server was a team repository and the class in question is not mine. It was a singleton holding 4 mutable collections. Every method that changed one wrapped it in `synchronized`. The getters handed back a live view instead of a copy.

`BenchDemon` is mine, added on 11 May, 63 lines with my name on all of them. Its work walks one of those views, `bench.addAll(Beeper.getInstance().getBench().keySet())`, on its own thread and with no lock. 4 days later my commit changed the other side. It took out the `synchronized` blocks and put `Collections.synchronizedSet` and `Hashtable` in their place. Each single operation became atomic. My walk stayed exactly as unsynchronized as before.

I rebuilt both shapes and measured them on javac and java 21.0.12, on 4 cores. A writer thread adds and removes. A reader thread walks the collection 50000 times and I count the reads that throw. The pause is how long the writer waits between mutations. Each cell is 5 sweeps.

| writer pause | before 15 May | after 15 May | copy taken under the lock |
|---|---|---|---|
| none | 80.1 to 88.4% | 79.7 to 90.7% | 0 |
| 10 us | 0.60 to 0.82% | 0.60 to 0.99% | 0 |
| 1 ms | 23 to 25 reads | 23 to 25 reads | 0 |

Every failure is a `ConcurrentModificationException`. The top row says more about the scheduler than about my code. It moves by 8 to 11 points between sweeps of one class file. At 1 ms, the slowest writer I measured, both shapes fail around 24 reads in 50000 and they do not differ from one another. That writer is still far busier than the server ever was, because the daemon sleeps 1000 ms between passes. The copy taken under the lock did not fail in any of the 15 measurements.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="A diagram of the shared collection in beeper-server in may 2013. A box holds a plain HashMap named bench. Inside the box a dashed region marked synchronized on bench contains the 2 methods that change it, addUserToBench and removeUserFromBench. Outside that region getBench hands back a live view of the same map, and an arrow leads to BenchDemon, which runs on its own thread and walks that view with no lock through addAll on its key set. Below, the measured failures per 50000 reads with the writer paused 1 millisecond between mutations, 5 sweeps: the shape before 15 may 23 to 25 reads, the same shape after the commit of 15 may 23 to 25 reads, and a copy taken under the lock 0.">
  <text x="20" y="18" class="f-label f-muted">beeper-server, may 2013</text>
  <rect x="20" y="30" width="270" height="130" rx="2" class="f-box"/>
  <text x="34" y="52" class="f-mono f-ink">bench = HashMap</text>
  <rect x="34" y="64" width="242" height="80" rx="2" class="f-plain" stroke-dasharray="3 3"/>
  <text x="46" y="82" class="f-label f-accent">synchronized (bench)</text>
  <text x="46" y="104" class="f-mono f-ink">addUserToBench()</text>
  <text x="46" y="126" class="f-mono f-ink">removeUserFromBench()</text>
  <text x="20" y="180" class="f-label f-muted">getBench() hands back a live view</text>
  <path d="M 290 95 L 360 95" class="f-line"/>
  <path d="M 352 91 L 360 95 L 352 99" class="f-line"/>
  <text x="366" y="44" class="f-label f-muted">BenchDemon, own thread</text>
  <text x="366" y="70" class="f-mono f-ink">processBench()</text>
  <text x="366" y="99" class="f-mono f-ink">addAll(.keySet())</text>
  <text x="366" y="128" class="f-mono f-ink">no lock</text>
  <text x="20" y="212" class="f-label f-muted">reads that threw, per 50000, writer paused 1 ms</text>
  <text x="20" y="238" class="f-label f-muted">before 15 may</text>
  <text x="300" y="238" class="f-mono f-ink">23 to 25</text>
  <text x="20" y="262" class="f-label f-muted">after 15 may</text>
  <text x="300" y="262" class="f-mono f-ink">23 to 25</text>
  <text x="20" y="286" class="f-label f-muted">copy under lock</text>
  <text x="300" y="286" class="f-mono f-accent">0</text>
</svg>
<figcaption>Where the lock sits and where the read goes. Both methods that change the map are guarded. The daemon that walks it is not, because the getter hands back a live view. Failures per 50000 reads with the writer paused 1 ms between mutations, 5 sweeps.</figcaption>
</figure>

In the server as it stood none of this could happen anyway. `Main` starts the network server and nothing else. `new BenchDemon` appears only in tests, which call the method inline without a thread. Both netty groups are built with 1 thread each, so every handler callback ran on the same event loop. I wrote a concurrency defense for a program whose handlers never ran in parallel and never started the part that would have needed one.

## The checklist, now

In 2026 an agent does the typing here and I write the rules it follows. So the corpus records my instructions. My habits are not in it.

I counted his rows with the TypeScript compiler API, 5.9.3 on node 22.23.1. A regex cannot tell a `for` inside a string from a `for` in code. For 2013 I used javalang 0.13.0 on python 3.12.3. Everything is taken at commit `d287db2` on git 2.43.0. The old repositories belong to a team, so I attributed them first: 42 Java files and 2268 lines, of which blame gives me 51.4%. Only files where I hold more than half go into the count. That leaves 24 files and 1200 lines.

| | Java, 2013, 1200 lines | ts and js, 2026, 15632 lines |
|---|---|---|
| objects | 23 classes, 107 methods | 0 classes, 0 class methods |
| inheritance | 4 `extends` | 0 |
| switch | 1 | 1 |
| variables | 102 locals, 0 of them final | 3071 `const` against 621 `let` |

That last cell is 83.2% across the whole corpus. In the 2303 lines I keep and rework it is 373 against 34, which is 91.6%. Next to 0 final locals in 2013 that looks like 13 years of taking his advice. It is not what happened. I never wrote a rule about `const`. There is no linter here to ask for one and `tsc --noEmit` does not care either way. It arrives because that is how TypeScript gets written in 2026 and because I write small Node scripts where a class has nowhere to appear. Those rows came out clean and nobody made a decision.

The ORM row reads 0 annotations. But `pom.xml` pulls `spring-data-jpa` with `hibernate-entitymanager`, while the Spring XML wires up an entity manager factory and a JPA transaction manager. The configuration got written and nobody ever wrote the mapping.

## The one row that still asks something

Conditionals is the row where a decision comes up on every line. His replacement for it is rules. I split the 2026 code in 2. What I keep and rework is 20 files. The measurement scripts I run once and abandon are 89.

The code I keep runs 16.7 branches per 100 lines. The scripts I throw away run 14.6. Medians per file say the same, 17.0 against 15.0, so one fat file is not carrying the sum. On the one row of his table that still costs me something, the code that has to survive is the denser one, which is the wrong way round. Branches here are `if`, ternary, `switch` and short circuit, taken from the syntax tree. Last week I published 21.9 for this repository, counted by keyword over a different set of paths and with loops included.

There is 1 place where I did it his way and I got there by accident. `src/lib/tells.ts` holds 19 mechanical checks on my writing. 15 of them are rows in a data table, each with an id and a regular expression. Those 53 lines hold 0 branches. The file runs 8.1 branches per 100 lines. That is the lowest of anything I keep above 100 lines and the next one up is 12.0.

The other 4 would not go into the table. They are the 3 dash checks plus the compound word check. Each needs something the matched text does not carry, like the length of the sentence or the language it is written in. They live in 2 functions of 40 lines holding 12 branches. That is 3.5 lines per rule inside the table against 10 lines and 3 branches per rule outside it.

<figure class="fig">
<svg viewBox="0 0 640 230" role="img" aria-label="Two bars comparing the 2 halves of src/lib/tells.ts. The first half is a data table: 15 rules in 53 lines with 0 branches, which is 3.5 lines per rule. The second half is written by hand: 4 rules in 40 lines with 12 branches, which is 10 lines per rule. The 4 that would not fit into the table are the 3 dash rules and the compound word rule.">
  <text x="20" y="18" class="f-label f-muted">src/lib/tells.ts, 19 checks</text>
  <text x="20" y="52" class="f-mono f-ink">as data</text>
  <rect x="120" y="38" width="233" height="18" rx="1" class="f-accent"/>
  <text x="20" y="74" class="f-label f-muted">15 rules, 53 lines, 0 branches</text>
  <text x="20" y="118" class="f-mono f-ink">by hand</text>
  <rect x="120" y="104" width="176" height="18" rx="1" class="f-muted"/>
  <text x="20" y="140" class="f-label f-muted">4 rules, 40 lines, 12 branches</text>
  <text x="20" y="180" class="f-label f-muted">lines per rule</text>
  <text x="200" y="180" class="f-mono f-accent">3.5</text>
  <text x="280" y="180" class="f-mono f-ink">10.0</text>
  <text x="20" y="212" class="f-label f-muted">the 4 that would not fit: 3 dash rules and the compound word rule</text>
</svg>
<figcaption>The 19 mechanical checks on my writing, split by how they are expressed. 15 are rows of data and cost 3.5 lines each with no branch at all. The 4 that would not fit cost 10 lines and 3 branches each.</figcaption>
</figure>

Being data did not make them right. Last week I published a check of 6 of these against what the manual promises. 2 had drifted and both are table rows. That is a weak comparison, since 5 of the 6 probed were table rows, but it is the comparison I have. The dash checks are 3 of those 4 and the manual restates them in prose in 5 documents besides the code.

## What I did not check

Whether 1200 lines is a sample of anything. Whether the Clojure course counts. It does not: blame hands me all 850 lines, but the repository was assembled in a single commit. It cannot separate my solutions from the skeleton the course handed out. The 2 populations of 2026 code differ in kind as well as in how long they live. The measurement scripts are long data grinders run once and what I keep is small orchestration modules. I left branch density out of the 2013 column, because Java of that era carries getters and setters that ts does not.

I have quoted that row for years and applied it once, in 53 lines, without noticing. The translation is still at 0%. The machine that writes these essays could finish those subtitles in an evening. Separate question: would finishing them count as applying him?
