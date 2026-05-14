/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry, SitemapOptions } from './types/sitemap.js';
import { generateXml } from './core/generator.js';

export * from './types/sitemap.js';

/**
 * Génère une réponse HTTP compatible Next.js (App Router) avec options de configuration.
 * * @param entries - Liste des entrées du sitemap
 * @param options - Options de génération facultatives (ex: autoLastmod)
 * @returns Une instance de Response contenant le flux XML configuré
 */
export function getServerSitemapResponse(
  entries: SitemapEntry[], 
  options: SitemapOptions = {}
): Response {
  const xml = generateXml(entries, options);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}