/* Exports the research catalogue into the site.

   research/ is gitignored on purpose — it is a working dossier and it is wrong in
   places until it is not. The site cannot depend on it at build time, so this script
   copies the finished part of it into src/lib/illusions/catalog.json, which IS committed.
   Run it by hand after a research wave; nothing in `npm run build` calls it.

   What crosses the line: entries that are `researched` (not stubs, not proposals) and
   that carry a Russian name. Everything else stays in the dossier. The Russian name is
   the gate because a name nobody has written in Russian is a name nobody has understood
   well enough to publish.

   Prose does NOT cross the line. `effect` and `mechanism` in the dossier are English
   working notes; the Russian copy lives in src/lib/illusions/ru.ts and is written by
   hand, one language at a time. Machine-translated perception writing reads like
   machine-translated perception writing.

   Usage: node scripts/gen-illusions.mjs */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const dossier = join(root, 'research', 'illusions');
const outDir = join(root, 'src', 'lib', 'illusions');

if (!existsSync(dossier)) {
  console.error(`no dossier at ${dossier} — this script only runs where the research lives`);
  process.exit(1);
}

const sources = JSON.parse(readFileSync(join(dossier, 'sources.json'), 'utf8'));
const all = readdirSync(join(dossier, 'entries')).filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(dossier, 'entries', f), 'utf8')));

const publishable = all
  .filter((e) => e.status === 'researched' && e.name?.ru)
  .sort((a, b) => a.id.localeCompare(b.id));

/* Only the sources these entries actually cite travel with them, and only the fields a
   reader needs to follow the reference: who, when, what, where to find it. */
const used = new Set();
for (const e of publishable) {
  for (const s of e.sources ?? []) used.add(s);
  if (e.first_described?.source) used.add(e.first_described.source);
}

const trimSource = (s) => ({
  authors: s.authors ?? [],
  year: s.year ?? null,
  title: s.title,
  container: s.container ?? '',
  locator: s.locator ?? '',
  publisher: s.publisher ?? '',
  url: s.url || '',
  doi: s.doi || '',
  lang: s.lang ?? '',
  type: s.type,
  primary: !!s.primary,
  /* The reader is owed the difference between a paper we read and a record we looked
     up. The dossier records it in the note; the site surfaces it as a flag. */
  unread: /NOT OPENED|has not been opened|not been read/i.test(s.note ?? ''),
});

const catalog = {
  generated: new Date().toISOString().slice(0, 10),
  /* Numbers for the section's own honesty line. The site says how much of the dossier
     it is showing, rather than implying it is showing all of it. */
  dossier: {
    researched: all.filter((e) => e.status === 'researched').length,
    leads: all.filter((e) => e.status === 'stub').length,
    unresolved: all.filter((e) => e.status === 'origin-unresolved').length,
    proposed: all.filter((e) => e.status === 'proposed').length,
    rows: all.filter((e) => e.status !== 'proposed').length,
    sources: Object.keys(sources).length,
    categories: new Set(all.filter((e) => e.status !== 'proposed').map((e) => `${e.modality}/${e.category}`)).size,
  },
  entries: publishable.map((e) => ({
    id: e.id,
    ru: e.name.ru,
    en: e.name.en,
    aka: e.aka ?? [],
    modality: e.modality,
    category: e.category,
    tier: e.tier ?? 'C',
    tags: e.tags ?? [],
    first: e.first_described
      ? {
          year: e.first_described.year,
          by: e.first_described.by,
          where: e.first_described.where,
          confidence: e.first_described.confidence,
          source: e.first_described.source ?? null,
        }
      : null,
    /* Kept only so an editor writing the Russian has the working notes to hand; the
       pages never render any of this. `mechanism` carries its own attribution in the
       dossier and that attribution has to survive the trip, otherwise the Russian gets
       written from a claim with no owner. */
    effectEn: e.effect ?? '',
    mechanismEn: (e.mechanism ?? []).map((m) => ({
      name: m.name,
      by: m.by ?? '',
      source: m.source ?? '',
    })),
    notesEn: e.notes ?? '',
    impl: {
      dim: e.implementation?.dim ?? '',
      interactive: !!e.implementation?.interactive,
      difficulty: e.implementation?.difficulty ?? null,
      notes: e.implementation?.notes ?? '',
    },
    difficulty: e.implementation?.difficulty ?? null,
    sources: e.sources ?? [],
  })),
  sources: Object.fromEntries([...used].filter((id) => sources[id]).sort().map((id) => [id, trimSource(sources[id])])),
};

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'catalog.json'), JSON.stringify(catalog, null, 1) + '\n');

const byMod = {};
for (const e of catalog.entries) (byMod[e.modality] ??= []).push(e);
console.log(`published ${catalog.entries.length} entries and ${Object.keys(catalog.sources).length} sources`);
for (const [m, l] of Object.entries(byMod).sort((a, b) => b[1].length - a[1].length)) console.log(`  ${m}: ${l.length}`);
console.log(`dossier behind it: ${catalog.dossier.rows} rows, ${catalog.dossier.categories} categories`);
