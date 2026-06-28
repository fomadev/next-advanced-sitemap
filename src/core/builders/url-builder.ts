/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry, SitemapOptions } from '../../types/sitemap.js';
import { escapeXml } from '../../utils/xml-escape.js';

/**
 * Nettoie et valide de manière stricte le format et la structure d'une URL.
 * v1.0.7 : Intégration de l'Auto-Trimming (nettoyage des espaces de début et de fin)
 */
export function sanitizeAndValidateUrl(rawUrl: string, context: string): string {
  const url = rawUrl ? rawUrl.trim() : '';

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new Error(
      `[next-advanced-sitemap] Invalid URL in ${context}: "${url}". URLs must start with http:// or https://`
    );
  }

  if (url.includes(' ')) {
    throw new Error(
      `[next-advanced-sitemap] Malformed URL structure detected in ${context}: "${url}". Please verify spaces or special characters.`
    );
  }

  let isValid = false;
  if (typeof URL.canParse === 'function') {
    isValid = URL.canParse(url);
  } else {
    try {
      new URL(url);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  if (!isValid) {
    throw new Error(
      `[next-advanced-sitemap] Malformed URL structure detected in ${context}: "${url}". Please verify spaces or special characters.`
    );
  }

  return url;
}

/**
 * Génère le bloc XML de base pour un nœud URL (loc, alternates, lastmod, changefreq, priority).
 */
export function buildUrlBaseXml(entry: SitemapEntry, options: SitemapOptions, nowIso: string): string {
  let xml = '';
  
  const cleanMainUrl = sanitizeAndValidateUrl(entry.url, 'main entry');
  xml += `    <loc>${escapeXml(cleanMainUrl)}</loc>\n`;

  if (entry.alternates?.length) {
    for (const alt of entry.alternates) {
      const cleanAltUrl = sanitizeAndValidateUrl(alt.href, 'alternate link');
      xml += `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(cleanAltUrl)}" />\n`;
    }
  }

  let lastmodValue = entry.lastmod;
  if (options.autoLastmod && !lastmodValue) {
    lastmodValue = nowIso;
  }

  if (lastmodValue) {
    const date = lastmodValue instanceof Date ? lastmodValue.toISOString() : lastmodValue;
    xml += `    <lastmod>${date}</lastmod>\n`;
  }

  if (entry.changefreq) {
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
  }

  if (entry.priority !== undefined) {
    xml += `    <priority>${(entry.priority as number).toFixed(1)}</priority>\n`;
  }

  return xml;
}