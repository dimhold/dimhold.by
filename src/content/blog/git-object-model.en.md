---
title: "A commit built by hand: 187 bytes"
description: "5 plumbing calls make a commit that git log reads. 11 revisions of one 1703 line file cost 187576 bytes loose against 16490 packed. The delta base turns out to be the newest version of the file."
date: 2011-12-07
lang: en
translationKey: git-object-model
---

My working git was 6 commands and one rule. The commands were `add`, `commit`, `pull`, `push`, `checkout` and `log`. The rule was that when the repository got into a state I did not recognize, I deleted the directory and cloned it again. The rule works. It also means I never knew what I was deleting.

So instead of learning a seventh command I built a commit by hand, out of plumbing only. Everything below is git 1.7.8, built from source, at the default compression level. Author and committer dates are pinned to one second so that every hash here reproduces.

The names come first, in a repository with nothing in it:

```
$ printf 'hello world\n' > a.txt
$ git hash-object a.txt
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ printf 'blob 12\0hello world\n' | sha1sum
3b18e512dba79e4c8300dd08aeb37f8e728b8dad  -
```

The name of an object is the sha1 of a header plus the content. The header is the type, a space, the length in bytes and a zero byte. Hashing the 12 bytes on their own gives `22596363b3de40b06f981fb85d82312e8c0ed511`, which this repository never refers to.

Then I copied `a.txt` to `b.txt` and wrote both:

```
$ git hash-object -w a.txt
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ git hash-object -w b.txt
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ find .git/objects -type f
.git/objects/3b/18e512dba79e4c8300dd08aeb37f8e728b8dad
```

2 files, one name, one object. The name is a function of those bytes, header included, so the same content under 2 paths cannot land in 2 objects. On disk the object is 28 bytes. 12 bytes of content and 8 bytes of header go into deflate and 28 come out. Compression added 8 bytes here.

<figure class="fig">
<svg viewBox="0 0 640 210" role="img" aria-label="The name of a git object is the sha1 of a header followed by the content. The header is the word blob, a space, the length 12 and a zero byte, then the twelve bytes of hello world. That gives 3b18e512, which is the name git stores the object under. Hashing the twelve bytes of content on their own gives 22596363, which appears nowhere in the repository.">
  <defs>
    <marker id="gArrow1" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="6" y="34" class="f-label f-muted">what git hashes</text>
  <rect x="150" y="44" width="130" height="30" rx="3" class="f-box"/>
  <text x="215" y="64" class="f-mono f-ink" text-anchor="middle">blob 12\0</text>
  <rect x="280" y="44" width="180" height="30" rx="3" class="f-box"/>
  <text x="370" y="64" class="f-mono f-ink" text-anchor="middle">hello world\n</text>
  <text x="215" y="92" class="f-label f-muted" text-anchor="middle">8 bytes of header</text>
  <text x="370" y="92" class="f-label f-muted" text-anchor="middle">12 bytes of content</text>
  <path d="M 462 59 L 494 59" class="f-line" marker-end="url(#gArrow1)"/>
  <text x="500" y="64" class="f-mono f-accent">3b18e512</text>
  <text x="500" y="92" class="f-label f-muted">name git stores</text>
  <text x="6" y="134" class="f-label f-muted">content on its own</text>
  <rect x="280" y="144" width="180" height="30" rx="3" class="f-plain" stroke-dasharray="4 3"/>
  <text x="370" y="164" class="f-mono f-muted" text-anchor="middle">hello world\n</text>
  <path d="M 462 159 L 494 159" class="f-line" marker-end="url(#gArrow1)"/>
  <text x="500" y="164" class="f-mono f-muted">22596363</text>
  <text x="500" y="192" class="f-label f-muted">git never uses it</text>
</svg>
<figcaption>The header is part of the input. Hash the content on its own and the name is a different one, which this repository never refers to.</figcaption>
</figure>



## A commit with no porcelain in it

A fresh repository, then 2 blobs, a tree, a commit and a ref. 5 calls:

```
$ git hash-object -w greeting.txt
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ git hash-object -w note.txt
1c59427adc4b205a270d8f810310394962e79a8b
$ printf '100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad\tgreeting.txt
100644 blob 1c59427adc4b205a270d8f810310394962e79a8b\tnote.txt
' | git mktree
b88f66c9fea440e76158a5d4dec51ecaf7e3f53d
$ echo handmade | git commit-tree b88f66c9fea440e76158a5d4dec51ecaf7e3f53d
b0eabc99e5bbf3ffdc8127c50e8ea05c0de3dfba
$ git update-ref refs/heads/master b0eabc99e5bbf3ffdc8127c50e8ea05c0de3dfba
```

The commit is 187 bytes of content and this is all of it:

```
$ git cat-file -p b0eabc99e5bbf3ffdc8127c50e8ea05c0de3dfba
tree b88f66c9fea440e76158a5d4dec51ecaf7e3f53d
author Dmitriy Semenkevich <dimhold@gmail.com> 1323253380 +0100
committer Dmitriy Semenkevich <dimhold@gmail.com> 1323253380 +0100

handmade
```

The tree is 76 bytes. The branch is a file with 40 hex digits and a newline in it:

```
$ wc -c .git/refs/heads/master
41 .git/refs/heads/master
$ cat .git/HEAD
ref: refs/heads/master
```

`git log --stat` reads that and prints my 2 files as added, which is what I came to see. A reader like `log` needs the objects and one ref. I had written both of those by hand.

Then this:

```
$ git status --short
D  greeting.txt
D  note.txt
?? greeting.txt
?? note.txt
```

Both files deleted and untracked at once. There was no `.git/index` on disk at all, because I built the tree with `mktree` and never went through the index. Git compares the index against HEAD, finds 2 files in HEAD and nothing in the index, then reports 2 deletions. The untracked list comes from walking the directory and keeping whatever the index does not mention, which is the same 2 files again. `git reset` with no arguments writes a 184 byte index from HEAD and the status goes quiet, with the ref left where it was. So the index is a third thing on disk, next to the objects and the refs. It holds the list of files git will put in the next commit. After `git reset` with no arguments that list is a copy of HEAD's tree, which is why the status goes quiet.

<figure class="fig">
<svg viewBox="0 0 640 250" role="img" aria-label="The chain built by hand out of five plumbing calls. The file refs/heads/master holds 41 bytes, the forty digits of the commit name and a newline. The commit b0eabc99 is 187 bytes and names one tree. The tree b88f66c9 is 76 bytes and names two blobs of 12 bytes each, greeting.txt and note.txt. Off to the side the index was never written, so git status reports both files as deleted and untracked until git reset rebuilds the index from HEAD.">
  <defs>
    <marker id="gArrow2" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <rect x="10" y="40" width="150" height="34" rx="4" class="f-plain"/>
  <text x="85" y="62" class="f-mono f-ink" text-anchor="middle">master</text>
  <text x="85" y="90" class="f-label f-muted" text-anchor="middle">branch, 41 bytes</text>
  <path d="M 162 57 L 194 57" class="f-line" marker-end="url(#gArrow2)"/>
  <rect x="200" y="40" width="150" height="34" rx="4" class="f-box"/>
  <text x="275" y="62" class="f-mono f-ink" text-anchor="middle">b0eabc99</text>
  <text x="275" y="90" class="f-label f-muted" text-anchor="middle">commit, 187 bytes</text>
  <path d="M 352 57 L 384 57" class="f-line" marker-end="url(#gArrow2)"/>
  <rect x="390" y="40" width="150" height="34" rx="4" class="f-box"/>
  <text x="465" y="62" class="f-mono f-ink" text-anchor="middle">b88f66c9</text>
  <text x="465" y="90" class="f-label f-muted" text-anchor="middle">tree, 76 bytes</text>
  <path d="M 465 96 L 465 122" class="f-line" marker-end="url(#gArrow2)"/>
  <path d="M 465 96 L 275 122" class="f-line" marker-end="url(#gArrow2)"/>
  <rect x="200" y="128" width="150" height="34" rx="4" class="f-box"/>
  <text x="275" y="150" class="f-mono f-ink" text-anchor="middle">3b18e512</text>
  <text x="275" y="178" class="f-label f-muted" text-anchor="middle">greeting.txt</text>
  <text x="275" y="196" class="f-label f-muted" text-anchor="middle">blob, 12 bytes</text>
  <rect x="390" y="128" width="150" height="34" rx="4" class="f-box"/>
  <text x="465" y="150" class="f-mono f-ink" text-anchor="middle">1c59427a</text>
  <text x="465" y="178" class="f-label f-muted" text-anchor="middle">note.txt</text>
  <text x="465" y="196" class="f-label f-muted" text-anchor="middle">blob, 12 bytes</text>
  <rect x="10" y="128" width="150" height="34" rx="4" class="f-plain" stroke-dasharray="4 3"/>
  <text x="85" y="150" class="f-mono f-accent" text-anchor="middle">.git/index</text>
  <text x="85" y="178" class="f-label f-accent" text-anchor="middle">index, never written</text>
  <text x="10" y="230" class="f-label f-muted">status reports D and ?? until git reset rebuilds it</text>
</svg>
<figcaption>5 plumbing calls produce this. The index is the one part mktree does not touch, which is what the status output was about.</figcaption>
</figure>



## What goes into the hash

`commit-tree` on the same tree with the same date and message gives `b0eabc99` again. One second later gives `47e87c9eaa1871559a5ee5c44ca3170cfc73f0a2`. The tree hashes to `b88f66c9` both times.

The tree is a function of the content. The commit carries the time and the author too. I did not run a rebase here, but this is where the new commit ids after a rebase come from, because the committer line gets written again for every commit that moves.

## What I thought a commit stored

I assumed a commit held a diff, because a diff is what `git show` prints. So I took `read-cache.c` out of the git source, 46456 bytes over 1703 lines. Then 11 commits: the file as it came, then 10 more, each rewriting a single line in the middle of it:

```
$ git diff --stat HEAD~1 HEAD
 read-cache.c |    2 +-
 1 files changed, 1 insertions(+), 1 deletions(-)
```

`count-objects -v` says count: 33. 33 objects for 11 commits, so 11 blobs and 11 trees under them. Every blob is a whole copy of the file, 16828 to 16833 bytes on disk depending on the revision. The loose objects add up to 187576 bytes. One rewritten comment line costs a full new blob.

Then `git gc`:

```
$ git count-objects -v
count: 0
size: 0
in-pack: 33
packs: 1
size-pack: 18
prune-packable: 0
garbage: 0
$ wc -c .git/objects/pack/*.pack
16490 .git/objects/pack/pack-d208f07049583dc92008db070bb8c6daa90890fa.pack
$ git verify-pack -v .git/objects/pack/pack-*.idx | grep ' blob '
1530d3b547cf0a52ec2f6f4ed20053f5229581ea blob   46468 13889 1783
4723c6ab5406c51c12595742b8770ebd36062d5b blob   16 29 15722 1 1530d3b547cf0a52ec2f6f4ed20053f5229581ea
7765d864e63e91df92c92c73404d6d857be734d3 blob   16 29 15802 1 1530d3b547cf0a52ec2f6f4ed20053f5229581ea
5790a91044e4fdf5b2eec515051a66c110e0daa4 blob   18 31 16439 1 1530d3b547cf0a52ec2f6f4ed20053f5229581ea
```

187576 bytes became 16490, a factor of 11.4. 4 of the 11 blob lines are above. Of the 7 I left out, 6 are 16 byte deltas and one is 14.

The base `1530d3b5` is the newest version of the file. The 10 older revisions are deltas against it at depth 1, between 14 and 18 bytes each. The revision I committed first is stored as an 18 byte delta from the last one. I read that size column twice before I believed it, because for a deltified object it holds the size of the delta:

```
$ git cat-file -s 4723c6ab5406c51c12595742b8770ebd36062d5b
46467
```

So diffs are real, but they sit a layer below the commit. The repack that `gc` runs computes them, backwards from the newest version here. A commit names a tree, that tree names the blob and the blob on disk is still a whole copy of `read-cache.c`.

<figure class="fig">
<svg viewBox="0 0 640 230" role="img" aria-label="The same eleven revisions of read-cache.c stored twice. Loose, each revision is a whole copy of the file at 16828 to 16833 bytes on disk. All 33 objects come to 187576 bytes. Packed, the newest revision is stored whole in 13889 bytes and the ten older ones are deltas of 14 to 18 bytes pointing at it, depth 1, for a pack of 16490 bytes.">
  <defs>
    <marker id="gArrow3" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="30" y="34" class="f-label f-muted">loose, 11 blobs</text>
  <rect x="30" y="56" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="70" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="84" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="98" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="112" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="126" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="140" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="154" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="168" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="182" width="180" height="12" rx="2" class="f-box"/>
  <rect x="30" y="196" width="180" height="12" rx="2" class="f-box"/>
  <text x="220" y="120" class="f-label f-muted">16828 to 16833 bytes each on disk</text>
  <text x="220" y="140" class="f-label f-ink">all 33 loose objects, 187576 bytes</text>
  <text x="430" y="34" class="f-label f-muted">packed, one file</text>
  <rect x="430" y="46" width="150" height="34" rx="3" class="f-box"/>
  <text x="505" y="68" class="f-mono f-ink" text-anchor="middle">1530d3b5</text>
  <path d="M 470 180 L 470 84" class="f-line" marker-end="url(#gArrow3)"/>
  <rect x="430" y="96" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 99 L 468 99" class="f-line"/>
  <rect x="430" y="105" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 108 L 468 108" class="f-line"/>
  <rect x="430" y="114" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 117 L 468 117" class="f-line"/>
  <rect x="430" y="123" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 126 L 468 126" class="f-line"/>
  <rect x="430" y="132" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 135 L 468 135" class="f-line"/>
  <rect x="430" y="141" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 144 L 468 144" class="f-line"/>
  <rect x="430" y="150" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 153 L 468 153" class="f-line"/>
  <rect x="430" y="159" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 162 L 468 162" class="f-line"/>
  <rect x="430" y="168" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 171 L 468 171" class="f-line"/>
  <rect x="430" y="177" width="4" height="5" rx="1" class="f-box"/>
  <path d="M 438 180 L 468 180" class="f-line"/>
  <text x="360" y="204" class="f-label f-muted">revision 10, stored whole, 13889</text>
  <text x="430" y="222" class="f-label f-ink">16490 bytes</text>
  <text x="30" y="222" class="f-label f-muted">revisions 0 to 9, deltas of 14 to 18 bytes, depth 1</text>
</svg>
<figcaption>11 whole copies against one whole copy plus 10 deltas. The deltas point at the newest revision, so the oldest one is reconstructed from the latest.</figcaption>
</figure>



## 41 bytes

The rule about deleting the directory is the part I wanted to fix. This runs on a copy of the repository taken before the `gc`:

```
$ git rev-parse HEAD
c4608054b7ae3474916ed487338c7d3a5c72ec20
$ git reset --hard HEAD~3
HEAD is now at 972ff27 revision 7
$ sed -n '853p' read-cache.c
	 * Trivial optimization, revision 7: if we find an entry that
$ git cat-file -t c4608054b7ae3474916ed487338c7d3a5c72ec20
commit
$ git reflog
972ff27 HEAD@{0}: reset: moving to HEAD~3
c460805 HEAD@{1}: commit: revision 10
```

Those are the first 2 of 12 reflog entries. The working tree went back 3 revisions. The commit I left is still an object and the reflog still names it. Getting it back took one `update-ref`. The `reset --hard` after that rewrote the index and 46 KB of working file out of objects that had not gone anywhere. `count-objects` reports 33 before and after all of it.

`git branch invoice-fix` writes a 41 byte ref and adds no object at all. It also writes a 167 byte reflog for the new branch, so a branch cost 208 bytes here. Cheap branching is a phrase I had repeated without a number behind it.

## What I did not check

How the repack picks the delta base and whether depth stays at 1 on a real history. The defaults here are a window of 10 and depth up to 50. 11 revisions of one text file are a friendly input for a window of 10.

A binary file, where the delta search has nothing to reuse. Text only here.

When an unreachable commit actually goes away. I measured that it survives the reset and stopped at `prune`.
