/**
 * Writes the author into a PDF's document properties.
 *
 * Chrome fills in the title when it prints a page and leaves the author empty,
 * whatever <meta name="author"> says. A reference manager or an indexer that
 * reads the file on its own, away from the page that links to it, then sees a
 * paper by nobody.
 *
 * The file is not rebuilt. One new copy of the Info dictionary is appended
 * after the end of the file with a cross-reference section that points at it
 * (an incremental update, PDF 32000-1 section 7.5.6), so every page, font and
 * byte that was there before stays exactly where it was. That matters: the
 * PDFs behind a DOI should not change shape because a property was filled in.
 *
 * Run alone, it stamps every PDF in public/papers that has no author yet:
 *   node scripts/pdf-author.mjs
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const AUTHOR = 'Dmitriy Semenkevich';

/** Returns true if the file was changed, false if it already named an author. */
export async function stampAuthor(file, author = AUTHOR) {
  // latin1 maps bytes to characters one to one, so offsets in the string are
  // offsets in the file.
  const pdf = (await readFile(file)).toString('latin1');

  const startxref = [...pdf.matchAll(/startxref\s+(\d+)/g)].pop();
  const trailer = [...pdf.matchAll(/trailer\s*<<([\s\S]*?)>>/g)].pop();
  if (!startxref || !trailer) throw new Error(`${file}: no classic trailer, cannot append to it`);

  const size = trailer[1].match(/\/Size\s+(\d+)/)?.[1];
  const root = trailer[1].match(/\/Root\s+(\d+ \d+ R)/)?.[1];
  const info = trailer[1].match(/\/Info\s+(\d+) (\d+) R/);
  if (!size || !root || !info) throw new Error(`${file}: trailer has no Size, Root or Info`);

  const [, num, gen] = info;
  // The last definition of the object wins, which is the one a reader uses.
  const body = [...pdf.matchAll(new RegExp(`(?:^|[\\r\\n])${num} ${gen} obj\\s*<<([\\s\\S]*?)>>\\s*endobj`, 'g'))].pop();
  if (!body) throw new Error(`${file}: Info object ${num} not found`);
  if (/\/Author\s*[(<]/.test(body[1]) && !/\/Author\s*\(\)/.test(body[1])) return false;

  const escaped = author.replace(/([\\()])/g, '\\$1');
  const entries = body[1].replace(/\/Author\s*\(\)/, '').trim();
  const base = pdf.endsWith('\n') ? pdf : pdf + '\n';
  const object = `${num} ${gen} obj\n<<${entries}\n/Author (${escaped})>>\nendobj\n`;
  const xrefAt = base.length + object.length;
  const tail =
    `xref\n${num} 1\n${String(base.length).padStart(10, '0')} ${String(gen).padStart(5, '0')} n \n` +
    `trailer\n<</Size ${size} /Root ${root} /Info ${num} ${gen} R /Prev ${startxref[1]}>>\n` +
    `startxref\n${xrefAt}\n%%EOF\n`;

  await writeFile(file, Buffer.from(base + object + tail, 'latin1'));
  return true;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'papers');
  for (const name of (await readdir(dir)).filter((n) => n.endsWith('.pdf')).sort()) {
    const changed = await stampAuthor(path.join(dir, name));
    console.log(`${name}  ${changed ? 'author added' : 'already has an author'}`);
  }
}
