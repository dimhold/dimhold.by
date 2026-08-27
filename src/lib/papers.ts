import { getCollection, type CollectionEntry } from 'astro:content';

export type Paper = CollectionEntry<'papers'>;

export async function allPapers(): Promise<Paper[]> {
  const papers = await getCollection('papers', ({ data }) => !data.draft);
  return papers.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function paperPath(paper: Paper): string {
  return `/papers/${paper.id}/`;
}

/** The PDF sits next to the page, not inside it, so the URL stays short. */
export function pdfPath(paper: Paper): string {
  return `/papers/${paper.id}.pdf`;
}

/** YYYY/MM/DD — the format the citation_publication_date tag is defined in. */
export function citationDate(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}/${p(date.getUTCMonth() + 1)}/${p(date.getUTCDate())}`;
}

export function doiUrl(doi: string): string {
  return `https://doi.org/${doi}`;
}

/**
 * How the paper asks to be cited. Kept in one place because it appears three
 * times — on the page, in the PDF and in anything that quotes it — and three
 * copies drift.
 */
export function citationLine(paper: Paper): string {
  const year = paper.data.date.getUTCFullYear();
  return `Semenkevich, D. (${year}). ${paper.data.title}. dimhold.by. https://doi.org/${paper.data.doi}`;
}
