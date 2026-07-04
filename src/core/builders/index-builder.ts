/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapIndexEntry } from '../../types/sitemap.js';
import { escapeXml } from '../../utils/xml-escape.js';
import { sanitizeAndValidateUrl } from './url-builder.js';

/**
 * Génère la structure brute XML pour un fichier d'indexation de sitemaps.
 * v1.2.1 : Normalisation de l'arborescence (loc/url) pour garantir la tolérance du payload de l'index.
 */
export function buildSitemapIndexXml(entries: SitemapIndexEntry[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const entry of entries) {
    // 💡 Normalisation préventive : Récupère la localisation depuis "loc" ou bascule sur "url" si nécessaire
    const targetLoc = entry.loc || (entry as any).url || '';
    
    const cleanLoc = sanitizeAndValidateUrl(targetLoc, 'sitemap index location');
    
    xml += `  <sitemap>\n`;
    xml += `    <loc>${escapeXml(cleanLoc)}</loc>\n`;
    
    if (entry.lastmod) {
      const date = entry.lastmod instanceof Date ? entry.lastmod.toISOString() : entry.lastmod;
      xml += `    <lastmod>${date}</lastmod>\n`;
    }
    
    xml += `  </sitemap>\n`;
  }

  xml += `</sitemapindex>`;
  return xml;
}