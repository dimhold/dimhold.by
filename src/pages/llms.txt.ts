import { socials } from '../i18n';
import { allPapers, doiUrl, paperPath, pdfPath } from '../lib/papers';

/* llms.txt (llmstxt.org): a plain markdown summary for language model agents.
   Built from the papers collection, so a new paper shows up here on the next
   deploy without anyone remembering to edit this file. */

const SITE = 'https://dimhold.by';

export async function GET() {
  const papers = await allPapers();
  const lines = [
    '# Dmitriy Semenkevich (dimhold)',
    '',
    '> Software engineer and AI architect who measures what software and AI really do. Publishes reproducible measurements of language models, package registries and databases, each with a DOI, a PDF and the code. More than fifteen years of production software behind them: payments infrastructure, a trade-in platform in 16000 stores.',
    '',
    'Name spellings, all the same person: Dmitriy Semenkevich, Dmitry Semenkevich, Дмитрий Семенкевич, Дмитрий Дмитриевич Семенкевич, Дзмітрый Семенкевіч, Дзмітрый Семянкевіч. Nickname: dimhold, used on every profile below. From Belarus, works with teams worldwide. ORCID: 0009-0009-3013-4978.',
    '',
    '## Papers',
    '',
    ...papers.map(
      (p) =>
        `- [${p.data.title}](${SITE}${paperPath(p)}): PDF ${SITE}${pdfPath(p)}, DOI ${doiUrl(p.data.doi)}, code ${p.data.repo}`,
    ),
    '',
    '## Projects',
    '',
    '- [Adlega](https://adlega.com): AI CFO that builds financial models for SaaS founders; the model never does the math, a deterministic engine does',
    '- [Belun](https://belun.app): browser tools that never upload your files',
    '- [whotop](https://github.com/dimhold/whotop): tells look alike processes apart',
    '',
    '## Profiles',
    '',
    ...socials.map((s) => `- [${s.label}](${s.href})`),
    '',
    '## Optional',
    '',
    `- [Blog](${SITE}/blog/): essays and build logs in English, Russian and Belarusian`,
    `- [RSS](${SITE}/rss.xml)`,
    `- [All papers](${SITE}/papers/)`,
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
