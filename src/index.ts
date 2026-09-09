/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry, SitemapOptions, SitemapIndexEntry } from './types/sitemap.js';
import { RobotsOptions } from './types/robots.js';
import { generateXml } from './core/generator.js';
import { buildSitemapIndexXml } from './core/builders/index-builder.js';
import { buildRobotsText } from './core/builders/robots-builder.js';
import { buildCacheControlHeader } from './utils/cache-control.js';

// Sitemap utilities and types
export { chunkSitemapEntries } from './utils/chunker.js';
export { buildCacheControlHeader } from './utils/cache-control.js';
export * from './types/sitemap.js';

// Robots.txt Exports
export { buildRobotsText } from './core/builders/robots-builder.js';
export * from './types/robots.js';

/**
 * Generates an HTTP response compatible with Next.js (App Router) with configuration options.
 * v1.0.9: Dynamic and customizable Cache-Control header injection via the maxAge option.
 * 
 * @param entries - List of sitemap entries
 * @param options - Generation and caching options (e.g. autoLastmod, maxAge)
 * @returns A Response instance containing the configured XML stream
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

  // Unified shared cache strategy (v1.0.9 / v1.2.6 / v1.3.9)
  headers.set('Cache-Control', buildCacheControlHeader(options.maxAge));

  return new Response(xml, { status: 200, headers });
}

/**
 * ✨ v1.2.8: Generates a Next.js Response instance for the sitemap index.
 * Full support for maxAge (v1.2.6), autoLastmod (v1.2.7) and strict escaping of index URLs (v1.2.8).
 * 
 * @param entries - List of child sitemaps composing the index
 * @param options - Configuration options (maxAge for cache, autoLastmod for dynamic dates)
 * @returns A Response instance containing the XML index stream
 */
export function getServerSitemapIndexResponse(
  entries: SitemapIndexEntry[],
  options: Pick<SitemapOptions, 'maxAge' | 'autoLastmod'> = {}
): Response {
  // Forward the autoLastmod option to the index builder
  const xml = buildSitemapIndexXml(entries, { autoLastmod: options.autoLastmod });

  const headers = new Headers({
    'Content-Type': 'application/xml; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });

  // ⚡ Unified shared Edge/CDN cache strategy (v1.2.6)
  headers.set('Cache-Control', buildCacheControlHeader(options.maxAge));

  return new Response(xml, { status: 200, headers });
}

/**
 * 🛡️ v1.3.9: Content-Type header guard (Text/Plain Response Guard)
 * Generates a Next.js (App Router) Response instance for the robots.txt file.
 * Automatically applies 'Content-Type: text/plain; charset=utf-8' to avoid HTML interpretation errors.
 * 
 * @param options - Configuration options for robots.txt (rules, host, sitemaps, maxAge)
 * @returns A Response instance containing the configured plain-text content
 */
export function getRobotsTextResponse(
  options: RobotsOptions
): Response {
  const content = buildRobotsText(options);

  const headers = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });

  // Unified shared cache strategy (v1.3.9)
  headers.set('Cache-Control', buildCacheControlHeader(options.maxAge));

  return new Response(content, { status: 200, headers });
}