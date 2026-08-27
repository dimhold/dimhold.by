/**
 * Prints every paper page to a PDF next to it.
 *
 * Google Scholar does not index Zenodo, so the only way a measurement of ours
 * reaches Scholar is a PDF on this domain with Highwire Press meta tags on the
 * page that links to it. The tags are emitted by the layout; this script makes
 * the file they point at.
 *
 * The PDF is the paper page itself printed through the print stylesheet, so
 * there is one source of truth for the text. Chrome does the printing: it is
 * already on the machine, it honours `@media print`, and it needs no toolchain.
 *
 * Order matters. `astro build` writes dist, `astro preview` serves it on a real
 * origin so that /_astro assets resolve (they do not under file://), Chrome
 * prints each page, the files land in public/papers, and the next build copies
 * them into dist. Run `npm run build` again afterwards, or let the deploy do it.
 *
 * Usage: npm run pdf
 */
import { spawn } from 'node:child_process';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'papers');
const PORT = 4331;

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

function findChrome() {
  const hit = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!hit) {
    throw new Error(
      'No Chrome or Edge found. Printing needs one of:\n  ' + CHROME_CANDIDATES.join('\n  '),
    );
  }
  return hit;
}

/** The slugs come from the built output, so a paper cannot be missed or stale. */
async function builtSlugs() {
  const dir = path.join(root, 'dist', 'papers');
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

/* No shell here. Chrome lives under a path with a space in it, and cmd.exe
   splits on the space before the executable ever sees the argument. */
function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', ...opts });
    p.on('error', reject);
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

/** Waits for the preview server to answer rather than sleeping a guessed amount. */
async function waitForServer(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Preview server never answered at ${url}`);
}

const chrome = findChrome();
await mkdir(outDir, { recursive: true });

const slugs = await builtSlugs();
if (slugs.length === 0) {
  console.log('No papers in dist/papers. Run `npm run build` first.');
  process.exit(0);
}

const preview = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
  cwd: root,
  stdio: 'ignore',
  shell: process.platform === 'win32',
});

try {
  await waitForServer(`http://localhost:${PORT}/papers/`);

  for (const slug of slugs) {
    const out = path.join(outDir, `${slug}.pdf`);
    await run(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${out}`,
      `http://localhost:${PORT}/papers/${slug}/`,
    ]);
    const { size } = await stat(out);
    console.log(`${slug}.pdf  ${(size / 1024).toFixed(0)} KB`);
  }
} finally {
  preview.kill();
}

console.log(`\n${slugs.length} PDF(s) in public/papers. Run \`npm run build\` to ship them.`);
