---
title: "In 2022 the share of new GitHub repositories about AI did not grow. The stars did"
description: "I sampled 2 hours of every day of GH Archive in 2021 and 2022 and counted new GitHub repositories whose name or description is about AI. Among repositories with a description it is 1.36% in 2021 and 1.44% in 2022, so no jump. What changed is the stars: generative repositories went from 0.10% of all stars in 2021 to 3.07% in December 2022."
date: 2022-12-25
lang: en
translationKey: github-archive-ai-repos
tags: ["open-data", "machine-learning", "statistics"]
---
ChatGPT has been out for 3 weeks. I sampled GitHub events for this month and 4 of the 6 most starred repositories in my sample are about it. One is a list of prompts, the others are a browser extension, an unofficial API client and a WeChat bot. Around me people say that this year everybody started an AI project. I said it too, a few times. I never checked it, but the data to check it is public. GH Archive records every public event on GitHub, hour by hour, since February 2011.

So the question was simple. Did 2022 have more new AI repositories than 2021, as a share of all new ones?

## How I counted

Every hour of GH Archive is one gzipped file of JSON events, 30 to 200 MB in 2022. When somebody creates a repository there is a `CreateEvent` with `ref_type` set to `repository`. Its payload carries the description as it was at the moment of creation. That gives me 2 fields to read, the name and the description. Forks are a separate event and they are not in this count.

I took 2 hours of every day, 04:00 and 16:00 UTC, from 1 January 2021 to 24 December 2022. The first hour is daytime in Asia, the second one is morning in America. That is 1446 hours. 19 of them do not exist in GH Archive at all, 2 days in August 2021 and a week in October 2021. 1427 hours are left. My disk was almost full, so a small Python script read every file as a stream through `curl` and `gzip` and kept only the counts.

A repository counts as AI if its name or description says so. The words are machine learning, deep learning, neural, NLP, computer vision, TensorFlow, PyTorch, YOLO, "AI" as a separate word and a few more like Keras, BERT or Kaggle. Inside this I made a smaller group for the generative things: GPT, ChatGPT, OpenAI except its Gym, Stable Diffusion with its UIs like AUTOMATIC1111, DreamBooth, DALL-E, Midjourney, Whisper. Whisper is speech recognition, but it came from OpenAI in the same autumn and I kept it there.

Then I read 100 random repositories from 2022 by eye. 60 of them the label took and 40 a wider filter caught and the label dropped. The label is rarely wrong, but it misses a lot. "House price prediction" or a Vision Transformer project is usually machine learning and does not say the words. So every share below is a lower bound, measured the same way in both years.

## October 2022

The first result was 1.05% of new repositories in 2021 and 0.91% in 2022. Lower. In October 2022 it fell to 0.65% and I already had a sentence ready about everybody leaving AI for something else.

Then I looked at October itself. In September my sample had 444,234 new repositories and in October 677,185. I opened one hour, 10 October 16:00 UTC. It had 15,267 new repositories and 12,856 of them had no description. The 8 most active accounts made 125 to 241 repositories each in that one hour, with random names. 2 of them are called pgslotzaa and PGSLOTTH888, which looks like Thai online slot sites. It was spam. And not only in that hour, most of October looks like this.

In 2021 the sample has 1,434,695 new repositories with a description and in 2022 1,427,656. Almost the same number. The 25% growth of GitHub in my sample came only from repositories without a description, their share went from 61.5% to 69.3%. So I took the share among repositories that have a description. My assumption is that spam accounts mostly do not write one. The October hour supports it.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Share of new public GitHub repositories whose name or description is about AI or machine learning, by month, January 2021 to December 2022, sampled at 04:00 and 16:00 UTC every day. Among repositories with a description: Jan 21 1.76%, Feb 1.72%, Mar 1.28%, Apr 1.42%, May 1.95%, Jun 1.63%, Jul 1.11%, Aug 0.81%, Sep 1.28%, Oct 1.30%, Nov 1.30%, Dec 1.33%, Jan 22 1.33%, Feb 1.23%, Mar 1.26%, Apr 1.46%, May 1.51%, Jun 1.36%, Jul 1.61%, Aug 1.44%, Sep 1.46%, Oct 1.50%, Nov 1.47%, Dec 1.70%. Among all new repositories: Jan 21 1.14%, Feb 1.11%, Mar 0.97%, Apr 1.02%, May 1.27%, Jun 1.43%, Jul 0.98%, Aug 0.81%, Sep 0.95%, Oct 0.99%, Nov 0.95%, Dec 1.00%, Jan 22 0.96%, Feb 0.89%, Mar 0.87%, Apr 0.97%, May 1.06%, Jun 0.93%, Jul 0.99%, Aug 0.95%, Sep 0.87%, Oct 0.65%, Nov 0.93%, Dec 1.07%. The second line drops to 0.65% in October 2022, when spam accounts created many repositories without a description. The first line stays between 0.81% and 1.95%.">
  <line x1="56" y1="196.0" x2="650" y2="196.0" class="f-plain"/>
  <text x="50" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.0%</text>
  <line x1="56" y1="151.0" x2="650" y2="151.0" class="f-plain"/>
  <text x="50" y="155.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.5%</text>
  <line x1="56" y1="106.0" x2="650" y2="106.0" class="f-plain"/>
  <text x="50" y="110.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1.0%</text>
  <line x1="56" y1="61.0" x2="650" y2="61.0" class="f-plain"/>
  <text x="50" y="65.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1.5%</text>
  <line x1="56" y1="16.0" x2="650" y2="16.0" class="f-plain"/>
  <text x="50" y="20.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2.0%</text>
  <text x="56.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jan 21</text>
  <text x="133.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Apr</text>
  <text x="211.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jul</text>
  <text x="288.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Oct</text>
  <text x="365.9" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jan 22</text>
  <text x="443.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Apr</text>
  <text x="520.9" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jul</text>
  <text x="598.3" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Oct</text>
  <path d="M56.0,37.2L81.8,41.4L107.7,80.9L133.5,67.9L159.3,20.4L185.1,49.5L211.0,95.9L236.8,122.8L262.6,81.1L288.4,79.4L314.3,79.0L340.1,76.4L365.9,76.2L391.7,85.6L417.6,83.0L443.4,64.3L469.2,60.2L495.0,74.0L520.9,50.9L546.7,66.0L572.5,65.0L598.3,61.3L624.2,63.4L650.0,43.0" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M56.0,93.5L81.8,96.5L107.7,109.1L133.5,104.2L159.3,81.8L185.1,67.5L211.0,107.4L236.8,123.3L262.6,110.5L288.4,107.2L314.3,110.2L340.1,105.7L365.9,110.0L391.7,115.7L417.6,117.9L443.4,108.7L469.2,100.2L495.0,112.4L520.9,107.0L546.7,110.7L572.5,117.7L598.3,137.6L624.2,111.9L650.0,99.5" class="f-line" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <circle cx="56.0" cy="37.2" r="2.5" class="f-accent"/>
  <circle cx="81.8" cy="41.4" r="2.5" class="f-accent"/>
  <circle cx="107.7" cy="80.9" r="2.5" class="f-accent"/>
  <circle cx="133.5" cy="67.9" r="2.5" class="f-accent"/>
  <circle cx="159.3" cy="20.4" r="2.5" class="f-accent"/>
  <circle cx="185.1" cy="49.5" r="2.5" class="f-accent"/>
  <circle cx="211.0" cy="95.9" r="2.5" class="f-accent"/>
  <circle cx="236.8" cy="122.8" r="2.5" class="f-accent"/>
  <circle cx="262.6" cy="81.1" r="2.5" class="f-accent"/>
  <circle cx="288.4" cy="79.4" r="2.5" class="f-accent"/>
  <circle cx="314.3" cy="79.0" r="2.5" class="f-accent"/>
  <circle cx="340.1" cy="76.4" r="2.5" class="f-accent"/>
  <circle cx="365.9" cy="76.2" r="2.5" class="f-accent"/>
  <circle cx="391.7" cy="85.6" r="2.5" class="f-accent"/>
  <circle cx="417.6" cy="83.0" r="2.5" class="f-accent"/>
  <circle cx="443.4" cy="64.3" r="2.5" class="f-accent"/>
  <circle cx="469.2" cy="60.2" r="2.5" class="f-accent"/>
  <circle cx="495.0" cy="74.0" r="2.5" class="f-accent"/>
  <circle cx="520.9" cy="50.9" r="2.5" class="f-accent"/>
  <circle cx="546.7" cy="66.0" r="2.5" class="f-accent"/>
  <circle cx="572.5" cy="65.0" r="2.5" class="f-accent"/>
  <circle cx="598.3" cy="61.3" r="2.5" class="f-accent"/>
  <circle cx="624.2" cy="63.4" r="2.5" class="f-accent"/>
  <circle cx="650.0" cy="43.0" r="2.5" class="f-accent"/>
  <circle cx="56.0" cy="93.5" r="2" class="f-ink"/>
  <circle cx="81.8" cy="96.5" r="2" class="f-ink"/>
  <circle cx="107.7" cy="109.1" r="2" class="f-ink"/>
  <circle cx="133.5" cy="104.2" r="2" class="f-ink"/>
  <circle cx="159.3" cy="81.8" r="2" class="f-ink"/>
  <circle cx="185.1" cy="67.5" r="2" class="f-ink"/>
  <circle cx="211.0" cy="107.4" r="2" class="f-ink"/>
  <circle cx="236.8" cy="123.3" r="2" class="f-ink"/>
  <circle cx="262.6" cy="110.5" r="2" class="f-ink"/>
  <circle cx="288.4" cy="107.2" r="2" class="f-ink"/>
  <circle cx="314.3" cy="110.2" r="2" class="f-ink"/>
  <circle cx="340.1" cy="105.7" r="2" class="f-ink"/>
  <circle cx="365.9" cy="110.0" r="2" class="f-ink"/>
  <circle cx="391.7" cy="115.7" r="2" class="f-ink"/>
  <circle cx="417.6" cy="117.9" r="2" class="f-ink"/>
  <circle cx="443.4" cy="108.7" r="2" class="f-ink"/>
  <circle cx="469.2" cy="100.2" r="2" class="f-ink"/>
  <circle cx="495.0" cy="112.4" r="2" class="f-ink"/>
  <circle cx="520.9" cy="107.0" r="2" class="f-ink"/>
  <circle cx="546.7" cy="110.7" r="2" class="f-ink"/>
  <circle cx="572.5" cy="117.7" r="2" class="f-ink"/>
  <circle cx="598.3" cy="137.6" r="2" class="f-ink"/>
  <circle cx="624.2" cy="111.9" r="2" class="f-ink"/>
  <circle cx="650.0" cy="99.5" r="2" class="f-ink"/>
  <text x="592.3" y="141.6" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0.65%</text>
  <text x="644.0" y="35.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">1.70%</text>
  <text x="598.3" y="155.6" text-anchor="middle" class="f-label f-muted">spam in October</text>
  <line x1="56" y1="228" x2="78" y2="228" style="stroke:var(--accent);stroke-width:2"/>
  <text x="86" y="232" class="f-label f-muted">among new repositories with a description</text>
  <line x1="56" y1="246" x2="78" y2="246" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="86" y="250" class="f-label f-muted">among all new repositories</text>
</svg>
<figcaption>GH Archive, CreateEvent, 2 hours per day. December 2022 is counted to the 24th.</figcaption>
</figure>

With this denominator it is 1.36% in 2021 and 1.44% in 2022. Over the 24 months it jumps between 0.81% and 1.95%. December 2022 is 1.70%, but May 2021 was higher. If 2022 was an explosion of AI repositories, I cannot see it in what people create.

I was not the first to look. OSS Insight published a report in November 2022, with AI repositories found by their topics, for January to September. They wrote that the fast growth of open source AI was in 2016 and 2017 and after that it was slow. I have only 2 years, so I cannot say anything about 2016, but I also see no jump in 2022. Their period ends 5 weeks after Stable Diffusion released its weights and before ChatGPT.

## Where the change is

The generative group is small, but it moves. In my sample it is 255 repositories in the whole 2021 and 1152 in 2022. 70% of the 2022 ones are from September to December.

<figure class="fig">
<svg viewBox="0 0 680 222" role="img" aria-label="New repositories per week about GPT, ChatGPT, Stable Diffusion and other generative models in 2022, in 14 sampled hours per week (12 in the last one). By week starting: 01-03 7, 01-10 7, 01-17 9, 01-24 5, 01-31 10, 02-07 6, 02-14 6, 02-21 7, 02-28 13, 03-07 10, 03-14 13, 03-21 14, 03-28 5, 04-04 13, 04-11 10, 04-18 9, 04-25 9, 05-02 11, 05-09 14, 05-16 13, 05-23 6, 05-30 7, 06-06 7, 06-13 15, 06-20 9, 06-27 10, 07-04 7, 07-11 14, 07-18 9, 07-25 8, 08-01 9, 08-08 15, 08-15 9, 08-22 27, 08-29 18, 09-05 19, 09-12 25, 09-19 28, 09-26 24, 10-03 25, 10-10 34, 10-17 22, 10-24 19, 10-31 34, 11-07 31, 11-14 26, 11-21 26, 11-28 66, 12-05 155, 12-12 130, 12-19 126. The count is 7 to 15 per week in July and the first half of August, 18 to 34 after Stable Diffusion released its weights, and 155, 130 and 126 in the 3 weeks after ChatGPT came out on 30 November.">
  <line x1="56" y1="196.0" x2="650" y2="196.0" class="f-plain"/>
  <text x="50" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="56" y1="142.3" x2="650" y2="142.3" class="f-plain"/>
  <text x="50" y="146.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="56" y1="88.5" x2="650" y2="88.5" class="f-plain"/>
  <text x="50" y="92.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="56" y1="34.8" x2="650" y2="34.8" class="f-plain"/>
  <text x="50" y="38.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="56" y="14" class="f-label f-muted">per week</text>
  <rect x="57.0" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="68.6" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="80.3" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="91.9" y="190.6" width="9.6" height="5.4" rx="1" class="f-box"/>
  <rect x="103.6" y="185.3" width="9.6" height="10.8" rx="1" class="f-box"/>
  <rect x="115.2" y="189.6" width="9.6" height="6.4" rx="1" class="f-box"/>
  <rect x="126.9" y="189.6" width="9.6" height="6.4" rx="1" class="f-box"/>
  <rect x="138.5" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="150.2" y="182.0" width="9.6" height="14.0" rx="1" class="f-box"/>
  <rect x="161.8" y="185.3" width="9.6" height="10.8" rx="1" class="f-box"/>
  <rect x="173.5" y="182.0" width="9.6" height="14.0" rx="1" class="f-box"/>
  <rect x="185.1" y="180.9" width="9.6" height="15.1" rx="1" class="f-box"/>
  <rect x="196.8" y="190.6" width="9.6" height="5.4" rx="1" class="f-box"/>
  <rect x="208.4" y="182.0" width="9.6" height="14.0" rx="1" class="f-box"/>
  <rect x="220.1" y="185.3" width="9.6" height="10.8" rx="1" class="f-box"/>
  <rect x="231.7" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="243.4" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="255.0" y="184.2" width="9.6" height="11.8" rx="1" class="f-box"/>
  <rect x="266.6" y="180.9" width="9.6" height="15.1" rx="1" class="f-box"/>
  <rect x="278.3" y="182.0" width="9.6" height="14.0" rx="1" class="f-box"/>
  <rect x="289.9" y="189.6" width="9.6" height="6.4" rx="1" class="f-box"/>
  <rect x="301.6" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="313.2" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="324.9" y="179.9" width="9.6" height="16.1" rx="1" class="f-box"/>
  <rect x="336.5" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="348.2" y="185.3" width="9.6" height="10.8" rx="1" class="f-box"/>
  <rect x="359.8" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="371.5" y="180.9" width="9.6" height="15.1" rx="1" class="f-box"/>
  <rect x="383.1" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="394.8" y="187.4" width="9.6" height="8.6" rx="1" class="f-box"/>
  <rect x="406.4" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="418.1" y="179.9" width="9.6" height="16.1" rx="1" class="f-box"/>
  <rect x="429.7" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="441.4" y="167.0" width="9.6" height="29.0" rx="1" class="f-box"/>
  <rect x="453.0" y="176.7" width="9.6" height="19.3" rx="1" class="f-box"/>
  <rect x="464.6" y="175.6" width="9.6" height="20.4" rx="1" class="f-box"/>
  <rect x="476.3" y="169.1" width="9.6" height="26.9" rx="1" class="f-box"/>
  <rect x="487.9" y="165.9" width="9.6" height="30.1" rx="1" class="f-box"/>
  <rect x="499.6" y="170.2" width="9.6" height="25.8" rx="1" class="f-box"/>
  <rect x="511.2" y="169.1" width="9.6" height="26.9" rx="1" class="f-box"/>
  <rect x="522.9" y="159.4" width="9.6" height="36.6" rx="1" class="f-box"/>
  <rect x="534.5" y="172.3" width="9.6" height="23.7" rx="1" class="f-box"/>
  <rect x="546.2" y="175.6" width="9.6" height="20.4" rx="1" class="f-box"/>
  <rect x="557.8" y="159.4" width="9.6" height="36.6" rx="1" class="f-box"/>
  <rect x="569.5" y="162.7" width="9.6" height="33.3" rx="1" class="f-box"/>
  <rect x="581.1" y="168.1" width="9.6" height="27.9" rx="1" class="f-box"/>
  <rect x="592.8" y="168.1" width="9.6" height="27.9" rx="1" class="f-box"/>
  <rect x="604.4" y="125.0" width="9.6" height="71.0" rx="1" class="f-accent"/>
  <rect x="616.1" y="29.4" width="9.6" height="166.6" rx="1" class="f-accent"/>
  <rect x="627.7" y="56.3" width="9.6" height="139.8" rx="1" class="f-accent"/>
  <rect x="639.4" y="60.6" width="9.6" height="135.4" rx="1" class="f-accent"/>
  <line x1="440.4" y1="34" x2="440.4" y2="196" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="436.4" y="30" text-anchor="end" class="f-label f-muted">Stable Diffusion weights</text>
  <line x1="606.7" y1="34" x2="606.7" y2="196" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="602.7" y="30" text-anchor="end" class="f-label f-muted">ChatGPT</text>
  <text x="56.0" y="212" class="f-mono f-muted" style="font-size:11px">Jan</text>
  <text x="160.8" y="212" class="f-mono f-muted" style="font-size:11px">Mar</text>
  <text x="254.0" y="212" class="f-mono f-muted" style="font-size:11px">May</text>
  <text x="358.8" y="212" class="f-mono f-muted" style="font-size:11px">Jul</text>
  <text x="463.6" y="212" class="f-mono f-muted" style="font-size:11px">Sep</text>
  <text x="568.5" y="212" class="f-mono f-muted" style="font-size:11px">Nov</text>
</svg>
<figcaption>Weeks start on Monday. The last bar has 12 sampled hours instead of 14.</figcaption>
</figure>

In July and the first half of August it was 7 to 15 per week in my 14 sampled hours. Stable Diffusion released its weights on 22 August and from that week it was 18 to 34. ChatGPT came out on 30 November. That week has 66 and the next 3 weeks have 155, 130 and 126. The last of them is only 12 hours, because my data ends on 24 December. In December the generative group is 460 of 3268 AI repositories, 14%. As a share of everything created on GitHub it is still 0.15%.

A star is a `WatchEvent` in GH Archive and it has no description. So here I labeled repositories by the full name with the owner. This is how `openai/whisper` gets in.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Share of all GitHub stars in the sample that went to AI repositories, by month, January 2021 to December 2022. Generative repositories: Jan 21 0.17%, Feb 0.10%, Mar 0.14%, Apr 0.09%, May 0.10%, Jun 0.06%, Jul 0.12%, Aug 0.09%, Sep 0.05%, Oct 0.06%, Nov 0.08%, Dec 0.09%, Jan 22 0.06%, Feb 0.09%, Mar 0.05%, Apr 0.20%, May 0.20%, Jun 0.52%, Jul 0.19%, Aug 0.64%, Sep 1.43%, Oct 1.08%, Nov 0.75%, Dec 3.07%. Other AI and machine learning repositories: Jan 21 2.91%, Feb 2.63%, Mar 2.72%, Apr 2.65%, May 2.40%, Jun 2.68%, Jul 2.82%, Aug 2.62%, Sep 2.70%, Oct 2.35%, Nov 2.70%, Dec 2.32%, Jan 22 2.28%, Feb 2.16%, Mar 2.45%, Apr 2.46%, May 2.60%, Jun 2.44%, Jul 2.33%, Aug 2.20%, Sep 2.26%, Oct 2.18%, Nov 2.21%, Dec 2.32%. The second line stays between 2.16% and 2.91%. The first one is near 0.1% in 2021, 1.43% in September 2022 and 3.07% in December 2022.">
  <line x1="56" y1="196.0" x2="650" y2="196.0" class="f-plain"/>
  <text x="50" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.0%</text>
  <line x1="56" y1="144.6" x2="650" y2="144.6" class="f-plain"/>
  <text x="50" y="148.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1.0%</text>
  <line x1="56" y1="93.1" x2="650" y2="93.1" class="f-plain"/>
  <text x="50" y="97.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2.0%</text>
  <line x1="56" y1="41.7" x2="650" y2="41.7" class="f-plain"/>
  <text x="50" y="45.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3.0%</text>
  <text x="56.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jan 21</text>
  <text x="133.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Apr</text>
  <text x="211.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jul</text>
  <text x="288.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Oct</text>
  <text x="365.9" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jan 22</text>
  <text x="443.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Apr</text>
  <text x="520.9" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jul</text>
  <text x="598.3" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Oct</text>
  <path d="M56.0,187.3L81.8,190.9L107.7,188.9L133.5,191.5L159.3,191.0L185.1,192.9L211.0,190.0L236.8,191.6L262.6,193.5L288.4,193.0L314.3,191.9L340.1,191.4L365.9,193.1L391.7,191.6L417.6,193.2L443.4,185.9L469.2,185.8L495.0,169.0L520.9,186.4L546.7,162.8L572.5,122.6L598.3,140.6L624.2,157.6L650.0,38.2" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M56.0,46.6L81.8,60.7L107.7,56.2L133.5,59.9L159.3,72.4L185.1,58.1L211.0,50.8L236.8,61.2L262.6,57.0L288.4,75.1L314.3,57.1L340.1,76.9L365.9,78.7L391.7,84.9L417.6,70.2L443.4,69.7L469.2,62.2L495.0,70.7L520.9,76.3L546.7,83.0L572.5,79.8L598.3,83.7L624.2,82.6L650.0,76.9" class="f-line" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <circle cx="56.0" cy="187.3" r="2.5" class="f-accent"/>
  <circle cx="81.8" cy="190.9" r="2.5" class="f-accent"/>
  <circle cx="107.7" cy="188.9" r="2.5" class="f-accent"/>
  <circle cx="133.5" cy="191.5" r="2.5" class="f-accent"/>
  <circle cx="159.3" cy="191.0" r="2.5" class="f-accent"/>
  <circle cx="185.1" cy="192.9" r="2.5" class="f-accent"/>
  <circle cx="211.0" cy="190.0" r="2.5" class="f-accent"/>
  <circle cx="236.8" cy="191.6" r="2.5" class="f-accent"/>
  <circle cx="262.6" cy="193.5" r="2.5" class="f-accent"/>
  <circle cx="288.4" cy="193.0" r="2.5" class="f-accent"/>
  <circle cx="314.3" cy="191.9" r="2.5" class="f-accent"/>
  <circle cx="340.1" cy="191.4" r="2.5" class="f-accent"/>
  <circle cx="365.9" cy="193.1" r="2.5" class="f-accent"/>
  <circle cx="391.7" cy="191.6" r="2.5" class="f-accent"/>
  <circle cx="417.6" cy="193.2" r="2.5" class="f-accent"/>
  <circle cx="443.4" cy="185.9" r="2.5" class="f-accent"/>
  <circle cx="469.2" cy="185.8" r="2.5" class="f-accent"/>
  <circle cx="495.0" cy="169.0" r="2.5" class="f-accent"/>
  <circle cx="520.9" cy="186.4" r="2.5" class="f-accent"/>
  <circle cx="546.7" cy="162.8" r="2.5" class="f-accent"/>
  <circle cx="572.5" cy="122.6" r="2.5" class="f-accent"/>
  <circle cx="598.3" cy="140.6" r="2.5" class="f-accent"/>
  <circle cx="624.2" cy="157.6" r="2.5" class="f-accent"/>
  <circle cx="650.0" cy="38.2" r="2.5" class="f-accent"/>
  <circle cx="56.0" cy="46.6" r="2" class="f-ink"/>
  <circle cx="81.8" cy="60.7" r="2" class="f-ink"/>
  <circle cx="107.7" cy="56.2" r="2" class="f-ink"/>
  <circle cx="133.5" cy="59.9" r="2" class="f-ink"/>
  <circle cx="159.3" cy="72.4" r="2" class="f-ink"/>
  <circle cx="185.1" cy="58.1" r="2" class="f-ink"/>
  <circle cx="211.0" cy="50.8" r="2" class="f-ink"/>
  <circle cx="236.8" cy="61.2" r="2" class="f-ink"/>
  <circle cx="262.6" cy="57.0" r="2" class="f-ink"/>
  <circle cx="288.4" cy="75.1" r="2" class="f-ink"/>
  <circle cx="314.3" cy="57.1" r="2" class="f-ink"/>
  <circle cx="340.1" cy="76.9" r="2" class="f-ink"/>
  <circle cx="365.9" cy="78.7" r="2" class="f-ink"/>
  <circle cx="391.7" cy="84.9" r="2" class="f-ink"/>
  <circle cx="417.6" cy="70.2" r="2" class="f-ink"/>
  <circle cx="443.4" cy="69.7" r="2" class="f-ink"/>
  <circle cx="469.2" cy="62.2" r="2" class="f-ink"/>
  <circle cx="495.0" cy="70.7" r="2" class="f-ink"/>
  <circle cx="520.9" cy="76.3" r="2" class="f-ink"/>
  <circle cx="546.7" cy="83.0" r="2" class="f-ink"/>
  <circle cx="572.5" cy="79.8" r="2" class="f-ink"/>
  <circle cx="598.3" cy="83.7" r="2" class="f-ink"/>
  <circle cx="624.2" cy="82.6" r="2" class="f-ink"/>
  <circle cx="650.0" cy="76.9" r="2" class="f-ink"/>
  <text x="566.5" y="114.6" text-anchor="end" class="f-mono f-ink" style="font-size:11px">1.43%</text>
  <text x="644.0" y="30.2" text-anchor="end" class="f-mono f-ink" style="font-size:11px">3.07%</text>
  <line x1="56" y1="228" x2="78" y2="228" style="stroke:var(--accent);stroke-width:2"/>
  <text x="86" y="232" class="f-label f-muted">generative: GPT, ChatGPT, Stable Diffusion</text>
  <line x1="56" y1="246" x2="78" y2="246" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="86" y="250" class="f-label f-muted">other AI and machine learning</text>
</svg>
<figcaption>WatchEvent in GH Archive, 2 hours per day. Repositories are labeled by owner and name.</figcaption>
</figure>

The ordinary machine learning repositories got 2.64% of all stars in the sample in 2021 and 2.32% in 2022. No growth at all. The generative ones got 0.10% in 2021, 1.43% in September 2022 and 3.07% in December. In September the most starred generative repositories were `CompVis/stable-diffusion` and `openai/whisper`. The code of ChatGPT is not on GitHub. In December the first one is `f/awesome-chatgpt-prompts`, a list of text prompts.

In December 699 generative repositories got stars in my sample. Together they have 3.07% of all stars and the first 3 of them have 22% of that.

## What I did not check

- Topics. OSS Insight used them and I used names and descriptions. A description added after creation is not visible to me.
- 22 hours of every day. My numbers are counts in a sample. The real counts are much bigger and I did not try to scale them up.
- Stars of repositories that only the owner name marks as AI. I kept the full list only for names that passed the wider filter, plus the top 300 of every hour.
- Private repositories. GH Archive sees only public events.
- If the 1.4% is the same people. A student who makes a new `ML-Homework-3` every week counts every week.

December is not finished. If the ChatGPT weeks continue in January, the share among new repositories will finally move. We'll see.
