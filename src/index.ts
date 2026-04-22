import { SitemapEntry } from './types/sitemap';
import { generateXml } from './core/generator';

export * from './types/sitemap';

/**
 * Génère une réponse HTTP compatible Next.js (App Router)
 */
export function getServerSitemapResponse(entries: SitemapEntry[]): Response {
  const xml = generateXml(entries);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}