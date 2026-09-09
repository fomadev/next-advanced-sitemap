/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapIndexEntry, SitemapOptions } from '../../types/sitemap.js';
import { escapeXml } from '../../utils/xml-escape.js';
import { sanitizeAndValidateUrl } from './url-builder.js';

/**
 * Generates the raw XML structure for a sitemap index file.
 * v1.2.7: Auto date backfill support (Index Auto-Lastmod).
 * v1.2.8: Index URL escaping (Index Escaping & Query Parameters).
 */
export function buildSitemapIndexXml(
  entries: SitemapIndexEntry[],
  options: Pick<SitemapOptions, 'autoLastmod'> = {}
): string {
  // 🔥 Volume guardrail v1.2.5
  if (entries.length > 50000) {
    throw new Error(
      `[next-advanced-sitemap] Index volume threshold breach: A single sitemap index cannot contain more than 50,000 sub-sitemaps. Detected: ${entries.length}. Please leverage chunkSitemapEntries() to segment your dataset.`
    );
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const entry of entries) {
    // 🛡️ v1.2.8: Strict contract — SitemapIndexEntry only supports `loc`.
    // The old implicit fallback to `(entry as any).url` was removed because it
    // bypassed type safety and created an undocumented API surface.
    const cleanLoc = sanitizeAndValidateUrl(entry.loc, 'sitemap index location');
    
    xml += `  <sitemap>\n`;
    // 🛡️ v1.2.8: Strict cleaning and escaping of the index URL (Query params & reserved XML characters)
    xml += `    <loc>${escapeXml(cleanLoc)}</loc>\n`;
    
    // 🕒 v1.2.7: Date resolution
    const rawDate = entry.lastmod || (options.autoLastmod ? new Date() : undefined);
    
    if (rawDate) {
      const date = rawDate instanceof Date ? rawDate.toISOString() : rawDate;
      xml += `    <lastmod>${date}</lastmod>\n`;
    }
    
    xml += `  </sitemap>\n`;
  }

  xml += `</sitemapindex>`;
  return xml;
}