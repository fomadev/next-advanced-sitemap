/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry, SitemapOptions } from '../types/sitemap.js';
import { escapeXml } from '../utils/xml-escape.js';

/**
 * Valide de manière stricte le format et la structure d'une URL.
 */
function validateUrl(url: string, context: string): void {
  // 1. Vérification rapide du protocole
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new Error(
      `[next-advanced-sitemap] Invalid URL in ${context}: "${url}". URLs must start with http:// or https://`
    );
  }

  // 2. Sécurité v1.0.4 : Interdire strictement les espaces blancs non encodés
  if (url.includes(' ')) {
    throw new Error(
      `[next-advanced-sitemap] Malformed URL structure detected in ${context}: "${url}". Please verify spaces or special characters.`
    );
  }

  // 3. Validation fine de la structure globale via le moteur natif
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
}

/**
 * Génère le flux XML complet du sitemap incluant les extensions Images, Vidéos, News et Hreflang.
 */
export function generateXml(entries: SitemapEntry[], options: SitemapOptions = {}): string {
  const now = new Date().toISOString();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n`;
  xml += `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\n`;
  xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  for (const entry of entries) {
    // Validation URL principale
    validateUrl(entry.url, 'main entry');

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(entry.url)}</loc>\n`;

    // Support Hreflang (Internationalisation)
    if (entry.alternates?.length) {
      for (const alt of entry.alternates) {
        validateUrl(alt.href, 'alternate link');
        xml += `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />\n`;
      }
    }

    // --- LOGIQUE AUTO-LASTMOD ---
    let lastmodValue = entry.lastmod;
    
    // Si l'option est activée et que lastmod est absent, on injecte la date système actuelle
    if (options.autoLastmod && !lastmodValue) {
      lastmodValue = now;
    }

    if (lastmodValue) {
      const date = lastmodValue instanceof Date ? lastmodValue.toISOString() : lastmodValue;
      xml += `    <lastmod>${date}</lastmod>\n`;
    }

    // Autres métadonnées standard
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }

    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    }

    // Extension Images
    if (entry.images?.length) {
      for (const img of entry.images) {
        validateUrl(img.loc, 'image location');
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(img.loc)}</image:loc>\n`;
        if (img.title) xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
        if (img.caption) xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
        xml += `    </image:image>\n`;
      }
    }

    // Extension Vidéos
    if (entry.videos?.length) {
      for (const vid of entry.videos) {
        validateUrl(vid.thumbnail_loc, 'video thumbnail');
        if (vid.content_loc) validateUrl(vid.content_loc, 'video content location');
        if (vid.player_loc) validateUrl(vid.player_loc, 'video player location');

        xml += `    <video:video>\n`;
        xml += `      <video:thumbnail_loc>${escapeXml(vid.thumbnail_loc)}</video:thumbnail_loc>\n`;
        xml += `      <video:title>${escapeXml(vid.title)}</video:title>\n`;
        xml += `      <video:description>${escapeXml(vid.description)}</video:description>\n`;
        
        if (vid.content_loc) xml += `      <video:content_loc>${escapeXml(vid.content_loc)}</video:content_loc>\n`;
        if (vid.player_loc) xml += `      <video:player_loc>${escapeXml(vid.player_loc)}</video:player_loc>\n`;
        
        if (vid.publication_date) {
          const vDate = vid.publication_date instanceof Date ? vid.publication_date.toISOString() : vid.publication_date;
          xml += `      <video:publication_date>${vDate}</video:publication_date>\n`;
        }
        xml += `    </video:video>\n`;
      }
    }

    // Extension News
    if (entry.news) {
      const nDate = entry.news.publication_date instanceof Date ? entry.news.publication_date.toISOString() : entry.news.publication_date;
      xml += `    <news:news>\n`;
      xml += `      <news:publication>\n`;
      xml += `        <news:name>${escapeXml(entry.news.name)}</news:name>\n`;
      xml += `        <news:language>${escapeXml(entry.news.language)}</news:language>\n`;
      xml += `      </news:publication>\n`;
      xml += `      <news:publication_date>${nDate}</news:publication_date>\n`;
      xml += `      <news:title>${escapeXml(entry.news.title)}</news:title>\n`;
      xml += `    </news:news>\n`;
    }

    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}