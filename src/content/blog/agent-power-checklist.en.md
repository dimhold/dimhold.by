---
title: "The shell gate I would have written lets through 4 of 5 irreversible commands"
description: "I counted what a shell agent gate that checks only the first command name would do with 12,607 commands from NL2Bash. It lets through 1,325 of 1,641 irreversible lines, mostly behind find and xargs."
date: 2021-12-19
lang: en
translationKey: agent-power-checklist
tags: ["agents", "linux", "llm"]
---
This year it moved from papers to demos: Codex writes a shell command from an English sentence. The research itself is older, there is the NL2Bash corpus from 2018 and the NLC2CMD competition at NeurIPS 2020. The next step is to let the model run the command itself.

For this I would first write a short list of dangerous commands: `rm`, `chmod`, `kill`, `curl`, `sudo`. They wait for a human. Everything else runs. I never checked such a list against real commands, I just believed that a dangerous command shows it in its first word. So I took the corpus and counted what this gate would see.

## The setup

In the full collection NL2Bash has 12,607 pairs of a one line bash command and its English description. The cleaned set in the paper is 9,305. Freelancers who know shell found the commands on forums, tutorials and blogs. They copied the description from the page or wrote it themselves.

I parsed every line with bashlex 0.16 and walked the whole tree. That means every command in a pipe or after `;` and `&&`, the command after `xargs` and `sudo`, inside `find -exec` and after `sh -c`. bashlex could not parse 136 lines, the other 12,471 are counted.

The gate I compare with is my plan from above, written as code. It takes the name of the first command in the line and asks a human if the name is in the list. In the end the list is not so short. It has `rm`, `chmod`, `kill`, `sed`, `mv`, `gzip`, `curl`, `sudo` and 88 other names. `mv` is in the gate list, but below I do not count it as irreversible.

Irreversible here means that the line deletes files or edits a file in place with `sed -i` or `perl -i`. Changing permissions or owner counts too. So does compressing a file so that the original is gone. Network and processes I counted separately, the same for `sudo` and installing packages.

## 81%

1,641 lines do something irreversible. The gate by first word asks a human for 316 of them and lets 1,325 through, which is 80.7%.

My first thought was that my classifier is broken. I took 30 random irreversible lines and read every one by hand. All 30 really do what the classifier says. Then I looked at what the missed lines start with. In 1,283 of the 1,325 the first command is `find`.

```
find / -type f -name *.mp3 -size +10M -exec rm {} \;
find . -name '*.pyc' -print0 | xargs -0 rm
find . -type d -exec chmod 755 {} \;
```

For the gate this is `find`, a search. 852 missed lines delete or change something through `find -exec` or `find -delete`. 443 more go through `xargs`. Only 30 have the dangerous command later in a pipe or a list. 742 of the 831 deleting lines start with `find`. In my head it was a reading command.

<figure class="fig">
<svg viewBox="0 0 680 212" role="img" aria-label="Irreversible lines in NL2Bash and what a gate by the first word does with them. Of 1,641 lines it asks a human for 316. It lets through 852 that act through find -exec or find -delete, 443 through xargs and 30 where the dangerous command comes later in the line. Of the 358 irreversible lines that do not start with find, it asks for 316 and misses 42.">
  <text x="20" y="22" class="f-mono f-ink" style="font-size:12px">all 1,641 irreversible lines</text>
  <rect x="20.0" y="32" width="123.2" height="30" class="f-accent"/>
  <rect x="143.2" y="32" width="332.3" height="30" class="f-muted"/>
  <rect x="475.5" y="32" width="172.8" height="30" class="f-muted" style="opacity:0.6"/>
  <rect x="648.3" y="32" width="11.7" height="30" class="f-muted" style="opacity:0.35"/>
  <text x="22" y="80" class="f-mono f-accent" style="font-size:11px">gate asks 316</text>
  <text x="149.2" y="80" class="f-mono f-ink" style="font-size:11px">find -exec / -delete 852</text>
  <text x="481.5" y="80" class="f-mono f-ink" style="font-size:11px">xargs 443</text>
  <text x="660" y="96" text-anchor="end" class="f-mono f-ink" style="font-size:11px">later in line 30</text>
  <line x1="654.1" x2="654.1" y1="62" y2="84" class="f-line"/>
  <text x="660" y="22" text-anchor="end" class="f-mono f-muted" style="font-size:11px">missed 1,325</text>
  <text x="20" y="140" class="f-mono f-ink" style="font-size:12px">the 358 of them that do not start with find</text>
  <rect x="20" y="150" width="564.9" height="30" class="f-accent"/>
  <rect x="584.9" y="150" width="75.1" height="30" class="f-muted"/>
  <text x="22" y="198" class="f-mono f-accent" style="font-size:11px">gate asks 316</text>
  <text x="660" y="198" text-anchor="end" class="f-mono f-ink" style="font-size:11px">missed 42</text>
</svg>
<figcaption>NL2Bash, 12,471 parsed lines, bashlex 0.16. Irreversible: deletes, edits in place, changes permissions or replaces a file by its archive.</figcaption>
</figure>

## The corpus is full of find

Here I have to be fair to the simple gate. In 7,519 lines of the 12,471 the first command is `find`, it is 60%. The paper says itself that `find` is disproportionately common in the corpus, because the first round of collection took only `find` commands. In a normal shell history I would expect much less of it.

Without the lines that start with `find` the picture is much better for the gate. There are 4,952 such lines, 358 of them are irreversible and the gate misses 42, which is 11.7%. So my naive list works not so bad when the dangerous word comes first. It fails on the lines where `find` or `xargs` stands in front of it. I would expect exactly such lines when an agent is asked to clean up a directory, but this I did not test.

Inside `find` lines 1,283 of 7,519 are irreversible (17.1%) and the gate misses all of them.

Permissions are a judgement call, `chmod 644` is not the same as `rm`. Without them 1,066 lines are left and the gate misses 969, which is 90.9%, even more than before.

## The description knew

I also wanted to see if the danger is visible from the text. I expected that many deleting commands have a text that does not sound like deleting, something like "tidy up" or "find the old logs".

In this corpus it is the opposite. Of 831 lines that delete files, 817 have remove, delete, clean or a plain `rm` in the description, 98.3%. The gate by first word asks a human for 59 of them, 7.1%.

But this number says little about real requests. The description was written by a person who already saw the command, so of course they wrote "delete". A user who asks an agent does not see the command yet.

5 of the 14 lines without such a word delete only a temporary file that the same line created. In 3 others the description asks only to find something while the command deletes it:

> find all the mp3 files in the entire file system whose size is bigger than 10MB

```
find / -type f -name *.mp3 -size +10M -exec rm {} \;
```

The same command is in the corpus 5 times. 4 descriptions say "delete them" and this one does not. It searches from the root of the disk.

<figure class="fig">
<svg viewBox="0 0 680 276" role="img" aria-label="A line from NL2Bash. The description is: find all the mp3 files in the entire file system whose size is bigger than 10MB. The command is find / -type f -name *.mp3 -size +10M -exec rm {} \;. A gate by the first word sees find and lets it run. The parsed line has rm inside -exec and deletes. Below, of 831 lines that delete files, 817 have remove, delete, clean or rm in the description and the gate by first word asks a human for 59.">
  <text x="20" y="22" class="f-label f-muted">description in the corpus</text>
  <text x="20" y="42" class="f-mono f-ink" style="font-size:11px">find all the mp3 files in the entire file system whose size is bigger than 10MB</text>
  <rect x="20" y="62" width="282.4" height="30" rx="3" class="f-plain"/>
  <text x="28" y="82" class="f-mono f-ink" style="font-size:12px">find / -type f -name *.mp3 -size +10M</text>
  <rect x="312.4" y="62" width="116.8" height="30" rx="3" class="f-box"/>
  <text x="320.4" y="82" class="f-mono f-accent" style="font-size:12px">-exec rm {} \;</text>
  <line x1="42" x2="42" y1="94" y2="126" class="f-line"/>
  <path d="M38 120 L42 126 L46 120" class="f-line"/>
  <line x1="370.8" x2="370.8" y1="94" y2="126" class="f-line"/>
  <path d="M366.8 120 L370.8 126 L370.84 120" class="f-line"/>
  <text x="20" y="142" class="f-label f-muted">gate by first word</text>
  <text x="20" y="160" class="f-mono f-ink" style="font-size:12px">find: a search, runs</text>
  <text x="429.2" y="142" text-anchor="end" class="f-label f-muted">parsed line</text>
  <text x="429.2" y="160" text-anchor="end" class="f-mono f-accent" style="font-size:12px">rm: deletes, ask a human</text>
  <line x1="20" x2="660" y1="180" y2="180" class="f-plain"/>
  <text x="20" y="196" class="f-label f-muted">of 831 lines that delete</text>
  <rect x="20" y="208" width="334.3" height="20" rx="2" class="f-accent"/>
  <rect x="20" y="208" width="340" height="20" rx="2" class="f-plain"/>
  <text x="370" y="223" class="f-mono f-ink" style="font-size:11px">817 description names the deletion</text>
  <rect x="20" y="242" width="24.1" height="20" rx="2" class="f-muted"/>
  <rect x="20" y="242" width="340" height="20" rx="2" class="f-plain"/>
  <text x="370" y="257" class="f-mono f-ink" style="font-size:11px">59 gate by first word asks a human</text>
</svg>
<figcaption>The description and the command are from the corpus as they are. The description was written after the command.</figcaption>
</figure>

## My checklist now

After this count I wrote down where the model should not have power, if I build such an agent:

1. The gate looks at the effect of every command in the parsed line. Commands in a pipe count, inside `find -exec` or `-delete` too, after `xargs`, `sudo` or `sh -c` too.
2. A line that the parser cannot read goes to a human. Here it was 136 of 12,607.
3. Deleting, editing in place, changing permissions and replacing a file by its archive always wait for a human, also inside `find`.
4. Network and processes also wait, the same for `sudo` and installing packages. The first word gate misses 113 of 766 such lines here, 27 of them start with `find`, 24 with `echo`.
5. The effect is compared with the request. If the request says "find" and the line deletes, it stops, even if the deletion itself would be allowed.

The last point I did not have before. The corpus cannot prove this point works, because its texts were written after the commands. Here it would catch only lines like the mp3 one, 3 of them.

## What I did not check

The classifier is my own rules on top of bashlex, not a real shell. I read 30 lines by hand, not all 1,641. `cp` and `mv` can overwrite a file silently, `tee` too. I did not count them as irreversible, there are 777 such lines more. Another 254 lines write into a file with `>`. With them the numbers would be bigger.

I did not run any model. The count is about commands that people wrote, a model can write different ones. And a line like `rm -rf "$dir/"` depends on the value of `$dir` and bashlex cannot see it.
