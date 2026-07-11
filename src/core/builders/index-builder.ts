/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapIndexEntry, SitemapOptions } from '../../types/sitemap.js';
import { escapeXml } from '../../utils/xml-escape.js';
import { sanitizeAndValidateUrl } from './url-builder.js';

/**
 * Génère la structure brute XML pour un fichier d'indexation de sitemaps.
 * v1.2.x : Support de l'auto-remplissage de date (Index Auto-Lastmod).
 */
export function buildSitemapIndexXml(
  entries: SitemapIndexEntry[],
  options: Pick<SitemapOptions, 'autoLastmod'> = {}
): string {
  // 🔥 Guardrail de volume v1.2.5
  if (entries.length > 50000) {
    throw new Error(
      `[next-advanced-sitemap] Index volume threshold breach: A single sitemap index cannot contain more than 50,000 sub-sitemaps. Detected: ${entries.length}. Please leverage chunkSitemapEntries() to segment your dataset.`
    );
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const entry of entries) {
    const targetLoc = entry.loc || (entry as any).url || '';
    const cleanLoc = sanitizeAndValidateUrl(targetLoc, 'sitemap index location');
    
    xml += `  <sitemap>\n`;
    xml += `    <loc>${escapeXml(cleanLoc)}</loc>\n`;
    
    // 🕒 v1.2.x : Détermination de la date (Priorité à la date explicite, fallback sur le système si autoLastmod est actif)
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