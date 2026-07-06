/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry, SitemapOptions, SitemapIndexEntry } from './types/sitemap.js';
import { generateXml } from './core/generator.js';
import { buildSitemapIndexXml } from './core/builders/index-builder.js';
export { chunkSitemapEntries } from './utils/chunker.js';

export * from './types/sitemap.js';

/**
 * Génère une réponse HTTP compatible Next.js (App Router) avec options de configuration.
 * v1.0.9 : Injection dynamique et personnalisable de l'en-tête Cache-Control via l'option maxAge.
 * 
 * @param entries - Liste des entrées du sitemap
 * @param options - Options de génération et de mise en cache (ex: autoLastmod, maxAge)
 * @returns Une instance de Response contenant le flux XML configuré
 */
export function getServerSitemapResponse(
  entries: SitemapEntry[], 
  options: SitemapOptions = {}
): Response {
  const xml = generateXml(entries, options);

  // Détermination de la stratégie de mise en cache (v1.0.9)
  const cacheControlHeader = options.maxAge !== undefined
    ? `public, max-age=${options.maxAge}, must-revalidate`
    : 'public, s-maxage=86400, stale-while-revalidate';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': cacheControlHeader,
    },
  });
}

/**
 * ✨ v1.2.0 : Génère une réponse HTTP Next.js (App Router) pour un Index de Sitemaps.
 * Permet de lister et de regrouper plusieurs sous-fichiers XML sitemaps.
 * 
 * @param entries - Liste des sous-sitemaps composant l'index
 * @param options - Options de configuration (ex: maxAge pour le cache)
 * @returns Une instance de Response contenant le flux XML de l'index
 */
export function getServerSitemapIndexResponse(
  entries: SitemapIndexEntry[],
  options: Pick<SitemapOptions, 'maxAge'> = {}
): Response {
  const xml = buildSitemapIndexXml(entries);

  // Détermination de la stratégie de mise en cache (v1.2.0)
  const cacheControlHeader = options.maxAge !== undefined
    ? `public, max-age=${options.maxAge}, must-revalidate`
    : 'public, s-maxage=86400, stale-while-revalidate';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': cacheControlHeader,
    },
  });
}