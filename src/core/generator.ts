/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry, SitemapOptions } from '../types/sitemap.js';
import { buildUrlBaseXml } from './builders/url-builder.js';
import { buildImageXml } from './builders/image-builder.js';
import { buildVideoXml } from './builders/video-builder.js';
import { buildNewsXml } from './builders/news-builder.js';
import { validateCrossFields } from './validation/cross-validator.js';


export function generateXml(entries: SitemapEntry[], options: SitemapOptions = {}): string {
  const now = new Date().toISOString();
  let finalEntries = [...entries];

  if (options.sortByPriority) {
    finalEntries.sort((a, b) => {
      const priorityA = a.priority !== undefined ? (a.priority as number) : 0.5;
      const priorityB = b.priority !== undefined ? (b.priority as number) : 0.5;
      return priorityB - priorityA;
    });
  }
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n`;
  xml += `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\n`;
  xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  for (const entry of finalEntries) {
    // 💡 Normalisation préventive : Si l'utilisateur fournit "video" au lieu de "videos",
    // on s'assure que le tableau "videos" est peuplé pour l'analyse et la génération.
    const normalizedEntry = { ...entry };
    
    if ((entry as any).video && !normalizedEntry.videos) {
      normalizedEntry.videos = [((entry as any).video)];
    }

    validateCrossFields(normalizedEntry);

    xml += `  <url>\n`;
    
    // 1. Éléments de base et hreflang alternatifs
    xml += buildUrlBaseXml(normalizedEntry, options, now);

    // 2. Extension Images Google
    xml += buildImageXml(normalizedEntry.images);

    // 3. Extension Vidéos Google (Validations v1.1.3 & v1.1.4 intégrées)
    xml += buildVideoXml(normalizedEntry.videos);

    // 4. Extension News Google
    xml += buildNewsXml(normalizedEntry.news);

    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}