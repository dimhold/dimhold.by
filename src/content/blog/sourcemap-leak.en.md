---
title: "Source maps in production. 55 of the top 1000 sites hand out their own code"
description: "I crawled the first 1000 domains of the Tranco list to see how many sites serve source maps with their original code inside sourcesContent. 87 served a map with source text. After sorting them by hand, 55 serve their own code, among them GitHub, Atlassian and Trello, while 19 only leak through an embedded vendor script."
date: 2026-10-02
lang: en
translationKey: sourcemap-leak
tags: ["code-quality", "networking", "statistics"]
---
Last November Apple launched the new web version of the App Store with source maps switched on. Within hours somebody had the whole Svelte and TypeScript frontend on GitHub. Nobody hacked anything. The developer who posted it used a browser extension that saves all resources of a page and the maps were simply among them. My first thought was that this is the kind of slip one team makes once. I believed the production build of any serious shop strips the maps or at least keeps them off the public server. I never checked that belief, so this time I decided to count.

A source map is a JSON file the bundler writes next to the compiled JavaScript. With it the browser shows real file names and line numbers when something throws. The compiled file names its map in its last line, `//# sourceMappingURL=app.js.map`. If the map also has a `sourcesContent` field, it carries the full text of every original file. Then anyone with `curl` gets the frontend back, with folders and internal names.

<figure class="fig">
<svg viewBox="0 0 640 280" role="img" aria-label="Three boxes from top to bottom. The minified JavaScript ends with a sourceMappingURL comment. An arrow labelled fetch leads to the .map file, a JSON with sources and sourcesContent. An arrow labelled sourcesContent leads to the original TypeScript file with real names.">
  <rect x="40" y="8" width="560" height="64" class="f-box"/>
  <text x="54" y="25" class="f-label f-ink">the .js the browser runs</text>
  <text x="54" y="44" class="f-mono f-muted">function t(e){…}();</text>
  <text x="54" y="61" class="f-mono f-muted">//# sourceMappingURL=app.js.map</text>
  <rect x="40" y="108" width="560" height="64" class="f-box"/>
  <text x="54" y="125" class="f-label f-ink">the .map it points at</text>
  <text x="54" y="144" class="f-mono f-muted">{ &quot;sources&quot;: [ &quot;…/featureFlag.ts&quot; ],</text>
  <text x="54" y="161" class="f-mono f-muted">  &quot;sourcesContent&quot;: [ &quot;export function…&quot; ] }</text>
  <rect x="40" y="208" width="560" height="64" class="f-box"/>
  <text x="54" y="225" class="f-label f-ink">the original file, back again</text>
  <text x="54" y="244" class="f-mono f-muted">export function checkFeatureFlag(k) {</text>
  <text x="54" y="261" class="f-mono f-muted">  return flags[k] ?? false }</text>
  <line x1="320" y1="72" x2="320" y2="108" class="f-line"/>
  <path d="M316,102 L320,108 L324,102Z" class="f-accent"/>
  <text x="332" y="94" class="f-label f-accent">fetch</text>
  <line x1="320" y1="172" x2="320" y2="208" class="f-line"/>
  <path d="M316,202 L320,208 L324,202Z" class="f-accent"/>
  <text x="332" y="194" class="f-label f-accent">sourcesContent</text>
</svg>
<figcaption>The compiled bundle names its own map. Fetch the map and read sourcesContent. The original file comes back with its real names.</figcaption>
</figure>

The setup is small. I took the first 1000 domains of Tranco list K25GW, a pinned snapshot from 2023, so the run can be repeated on the same list. Then I wrote a crawler of about 160 lines in Python 3.12 with `requests` 2.31 and BeautifulSoup 4.15. For each domain it fetches the homepage and takes up to 12 external scripts. In each script it looks for `sourceMappingURL`, fetches the map and checks whether `sourcesContent` has anything in it. The run takes about 4.5 minutes in 24 threads. I kept the paths of the files and did not keep their contents.

Of the 1000 domains, 686 answered with a page and 581 of those served external JavaScript. 206 shipped at least one `sourceMappingURL`, that is 30 percent of the sites that answered. The HTTP Archive counted 17 to 18 percent across their crawl in 2019. They counted only first party scripts and I counted every script on the page, so it is not the same measurement. 87 sites gave me a map with source text inside. Some maps are served under several domains of one owner. Counted once each, there are 199 maps, together about 182 megabytes of source text in 35466 files.

<figure class="fig">
<svg viewBox="0 0 640 238" role="img" aria-label="Funnel bars narrowing from the sites that answered down to the ones that serve their own code. answered 686, served JS 581, shipped map URL 206, served source 87, own code 55. The last two bars, served source and own code, are filled in the accent colour.">
  <text x="172" y="47.28" text-anchor="end" class="f-label f-ink">answered</text>
  <rect x="182" y="30" width="402.0" height="24" class="f-box"/>
  <text x="592.0" y="47.28" class="f-label f-muted">686</text>
  <text x="172" y="89.28" text-anchor="end" class="f-label f-ink">served JS</text>
  <rect x="182" y="72" width="340.5" height="24" class="f-box"/>
  <text x="530.5" y="89.28" class="f-label f-muted">581</text>
  <text x="172" y="131.28" text-anchor="end" class="f-label f-ink">shipped map URL</text>
  <rect x="182" y="114" width="120.7" height="24" class="f-box"/>
  <text x="310.7" y="131.28" class="f-label f-muted">206</text>
  <text x="172" y="173.28" text-anchor="end" class="f-label f-ink">served source</text>
  <rect x="182" y="156" width="51.0" height="24" style="fill:var(--accent)"/>
  <text x="241.0" y="173.28" class="f-label f-muted">87</text>
  <text x="172" y="215.28" text-anchor="end" class="f-label f-ink">own code</text>
  <rect x="182" y="198" width="32.2" height="24" style="fill:var(--accent)"/>
  <text x="222.2" y="215.28" class="f-label f-muted">55</text>
</svg>
<figcaption>Of 686 sites that answered, 206 shipped a sourceMappingURL and 87 served a map with source inside. After reading the paths by hand, 55 of them serve their own code.</figcaption>
</figure>

## Where my count fell apart

87 looked like a clean headline, but it was wrong. The first map I opened from Trello had files named `<anon>` and `<prelude>`, which is bundler glue. So I added a rule. A site leaks its own code if a map has files under `src/`, `app/`, `components/`, `pages/` or `lib/`. That gave 77. Then I noticed the rule also matched folders inside `node_modules`. After I dropped those together with vendor folders and public CDN hosts it became 67. I almost wrote 67 into this text.

Then I read the paths of the 67 site by site. The rule did not hold. Among Coursera's "own" files were `../../src/client.ts` and `../../src/eventbuilder.ts`, served from `browser.sentry-cdn.com`. That is the Sentry SDK with its own `src` folder. Coursera does have its own code in other maps, but these 2 files were not it. The University of Washington was Bootstrap and Popper only. Mirror.co.uk was the client part of Next.js. The EPA and NOAA each had 1 file, `src/index.js`. It came from a small library that Drupal ships in its core.

So I sorted all 87 by hand, by the host that served the map and by whose code the paths are. The verdicts are in a file next to the crawler, one line per site, so I can argue with myself later. A second pass moved 6 sites between groups, which shows how soft this split is.

- 55 sites serve maps with their own code, from their own domain or their own CDN.
- 19 sites only leak through an embedded vendor script. Sentry's CDN on HBO Max and savefrom.net, SpeedCurve's monitoring script on the LA Times and Nikkei, a Trustpilot widget, a HubSpot menu, ad scripts.
- 13 sites only expose public open source libraries or framework code.

<figure class="fig">
<svg viewBox="0 0 640 138" role="img" aria-label="One horizontal bar split into parts for the 87 sites whose maps carried source: 55 own code, own host, 19 only an embedded vendor script, 13 only open source libraries. The own code part is the largest and is filled in the accent colour.">
  <rect x="40.0" y="20" width="354.0" height="36" style="fill:var(--accent)" stroke="currentColor" stroke-opacity="0.35"/>
  <line x1="217.0" y1="56" x2="217.0" y2="73" class="f-line"/>
  <text x="223.0" y="78" text-anchor="start" class="f-label f-ink">55 own code, own host</text>
  <rect x="394.0" y="20" width="122.3" height="36" class="f-box" stroke="currentColor" stroke-opacity="0.35"/>
  <line x1="455.2" y1="56" x2="455.2" y2="93" class="f-line"/>
  <text x="449.2" y="98" text-anchor="end" class="f-label f-ink">19 only an embedded vendor script</text>
  <rect x="516.3" y="20" width="83.7" height="36" class="f-plain" stroke="currentColor" stroke-opacity="0.35"/>
  <line x1="558.2" y1="56" x2="558.2" y2="113" class="f-line"/>
  <text x="552.2" y="118" text-anchor="end" class="f-label f-ink">13 only open source libraries</text>
</svg>
<figcaption>I sorted the same 87 by hand by map host and file paths. Counted by owner, the 55 sites with their own code belong to 47 owners.</figcaption>
</figure>

Several of the 55 belong to one owner. Atlassian serves the same bundle on 3 of its domains, `bitbucket.org` among them, about 3400 files with paths like `services/wac-web/src/utils/feature-flags/check-feature-flag.ts`. Trello's maps come from the same Atlassian infrastructure. BuzzFeed and HuffPost share private `@buzzfeed` packages. Counted by owner it is 47. The 55 sites are 8.0 percent of the sites that answered.

## Who it is

Among them are GitHub, Atlassian, Trello, Goodreads, Eventbrite, Wix, Tencent, JD.com, Nvidia, Siemens, AMD. Also Red Hat, the Daily Mail, the Guardian, Deutsche Welle, weather.com and a few universities. GitHub's maps from `githubassets.com` have 786 files, with paths like `packages/client-env/client-env.ts` from their monorepo. The Daily Mail paths still contain the working folder of a TeamCity build agent. These are big companies with their own build infrastructure, TeamCity agents and monorepos, but I do not know how the maps got to the public server on any of them. My guess is the usual one: the map is built for an error tracker and then deployed together with the bundle. But I did not check this.

The crawler cannot read intent either. freeCodeCamp and WordPress serve maps of code that is public anyway. For them it may be a deliberate choice. The Bootstrap site is the same case. Font Awesome's maps carry the source of its paid Pro icon packages. Some of the others probably also decided that a frontend is not a secret, which is a reasonable position. But the 55 mixes both cases and I cannot separate them from outside.

The server does not help. Leaking maps came back with 7 different content types, from `application/json` to `text/plain`. One map had no type at all. None of them needed cookies or a login.

## What I did not check

Only the homepage and at most 12 scripts per site. Inner pages and lazy chunks were not touched, so 55 is a floor. Nothing behind a login was touched either. I did not look inside the files for keys or tokens, because I wanted the size of the exposure. The crawl ran once from one machine. A site can switch its maps off any day.

The check for my own deploys is one request. Take any script from the production page and read its last line. If there is a `sourceMappingURL`, try to fetch the map. A 404 or a map without `sourcesContent` is fine. If the map has text in `sourcesContent`, my crawler would have counted the site too.
