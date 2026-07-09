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
 * * @param entries - Liste des entrées du sitemap
 * @param options - Options de génération et de mise en cache (ex: autoLastmod, maxAge)
 * @returns Une instance de Response contenant le flux XML configuré
 */
export function getServerSitemapResponse(
  entries: SitemapEntry[], 
  options: SitemapOptions = {}
): Response {
  const xml = generateXml(entries, options);

  const headers = new Headers({
    'Content-Type': 'application/xml; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });

  // Détermination de la stratégie de mise en cache
  if (options.maxAge !== undefined && options.maxAge >= 0) {
    headers.set('Cache-Control', `public, max-age=${options.maxAge}, must-revalidate`);
  } else {
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
  }

  return new Response(xml, { status: 200, headers });
}

/**
 * ✨ v1.2.x : Génère une instance de Response Next.js pour l'index de sitemaps avec en-têtes optimisés.
 * Compression/Ajustement des en-têtes HTTP de l'Index (Index Cache-Control) et alignement CDN.
 * * @param entries - Liste des sous-sitemaps composant l'index
 * @param options - Options de configuration (ex: maxAge pour le cache)
 * @returns Une instance de Response contenant le flux XML de l'index
 */
export function getServerSitemapIndexResponse(
  entries: SitemapIndexEntry[],
  options: Pick<SitemapOptions, 'maxAge'> = {}
): Response {
  const xml = buildSitemapIndexXml(entries);

  const headers = new Headers({
    'Content-Type': 'application/xml; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });

  // ⚡ Alignement v1.2.x : Gestion dynamique du cache Edge/CDN pour la structure d'index
  if (options.maxAge !== undefined && options.maxAge >= 0) {
    headers.set('Cache-Control', `public, max-age=${options.maxAge}, must-revalidate`);
  } else {
    // Stratégie CDN par défaut haute performance
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
  }

  return new Response(xml, { status: 200, headers });
}