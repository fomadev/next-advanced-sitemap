/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry, SitemapOptions, SitemapIndexEntry } from './types/sitemap.js';
import { RobotsOptions } from './types/robots.js';
import { generateXml } from './core/generator.js';
import { buildSitemapIndexXml } from './core/builders/index-builder.js';
import { buildRobotsText } from './core/builders/robots-builder.js';

// Utilitaires et Types Sitemap
export { chunkSitemapEntries } from './utils/chunker.js';
export * from './types/sitemap.js';

// Robots.txt Exports
export { buildRobotsText } from './core/builders/robots-builder.js';
export * from './types/robots.js';

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
 * ✨ v1.2.8 : Génère une instance de Response Next.js pour l'index de sitemaps.
 * Support complet de maxAge (v1.2.6), autoLastmod (v1.2.7) et échappement strict des URLs d'index (v1.2.8).
 * 
 * @param entries - Liste des sous-sitemaps composant l'index
 * @param options - Options de configuration (maxAge pour le cache, autoLastmod pour les dates dynamiques)
 * @returns Une instance de Response contenant le flux XML de l'index
 */
export function getServerSitemapIndexResponse(
  entries: SitemapIndexEntry[],
  options: Pick<SitemapOptions, 'maxAge' | 'autoLastmod'> = {}
): Response {
  // Passation de l'option autoLastmod au builder d'index
  const xml = buildSitemapIndexXml(entries, { autoLastmod: options.autoLastmod });

  const headers = new Headers({
    'Content-Type': 'application/xml; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });

  // ⚡ Alignement : Gestion dynamique du cache Edge/CDN pour la structure d'index
  if (options.maxAge !== undefined && options.maxAge >= 0) {
    headers.set('Cache-Control', `public, max-age=${options.maxAge}, must-revalidate`);
  } else {
    // Stratégie CDN par défaut haute performance
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
  }

  return new Response(xml, { status: 200, headers });
}

/**
 * 🛡️ v1.3.9 : Contrôle de l'en-tête de contenu (Text/Plain Response Guard)
 * Génère une instance de Response Next.js (App Router) pour le fichier robots.txt.
 * Applique automatiquement 'Content-Type: text/plain; charset=utf-8' pour éviter les erreurs d'interprétation HTML.
 * 
 * @param options - Options de configuration pour le robots.txt (règles, host, sitemaps, maxAge)
 * @returns Une instance de Response contenant le texte brut configuré
 */
export function getRobotsTextResponse(
  options: RobotsOptions
): Response {
  const content = buildRobotsText(options);

  const headers = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });

  if (options.maxAge !== undefined && options.maxAge >= 0) {
    headers.set('Cache-Control', `public, max-age=${options.maxAge}, must-revalidate`);
  } else {
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
  }

  return new Response(content, { status: 200, headers });
}