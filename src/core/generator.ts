/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry, SitemapOptions } from '../types/sitemap.js';
import { escapeXml } from '../utils/xml-escape.js';

/**
 * Nettoie et valide de manière stricte le format et la structure d'une URL.
 * v1.0.7 : Intégration de l'Auto-Trimming (nettoyage des espaces de début et de fin)
 */
function sanitizeAndValidateUrl(rawUrl: string, context: string): string {
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
 * Génère le flux XML complet du sitemap incluant les extensions Images, Vidéos, News et Hreflang.
 * v1.1.0 : Prise en charge des attributs étendus <image:geo_location> et <image:license>
 */
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
    const cleanMainUrl = sanitizeAndValidateUrl(entry.url, 'main entry');

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(cleanMainUrl)}</loc>\n`;

    if (entry.alternates?.length) {
      for (const alt of entry.alternates) {
        const cleanAltUrl = sanitizeAndValidateUrl(alt.href, 'alternate link');
        xml += `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(cleanAltUrl)}" />\n`;
      }
    }

    let lastmodValue = entry.lastmod;
    if (options.autoLastmod && !lastmodValue) {
      lastmodValue = now;
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

    // Extension Images - enrichie en v1.1.0
    if (entry.images?.length) {
      for (const img of entry.images) {
        const cleanImgUrl = sanitizeAndValidateUrl(img.loc, 'image location');
        
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(cleanImgUrl)}</image:loc>\n`;
        if (img.title) xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
        if (img.caption) xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
        
        // SEO Local v1.1.0
        if (img.geo_location) {
          xml += `      <image:geo_location>${escapeXml(img.geo_location)}</image:geo_location>\n`;
        }
        
        // Gestion des Licences Google Images v1.1.0
        if (img.license) {
          const cleanLicenseUrl = sanitizeAndValidateUrl(img.license, 'image license URL');
          xml += `      <image:license>${escapeXml(cleanLicenseUrl)}</image:license>\n`;
        }
        
        xml += `    </image:image>\n`;
      }
    }

    // Extension Vidéos
    if (entry.videos?.length) {
      for (const vid of entry.videos) {
        const cleanThumbLoc = sanitizeAndValidateUrl(vid.thumbnail_loc, 'video thumbnail');
        const cleanContentLoc = vid.content_loc ? sanitizeAndValidateUrl(vid.content_loc, 'video content location') : undefined;
        const cleanPlayerLoc = vid.player_loc ? sanitizeAndValidateUrl(vid.player_loc, 'video player location') : undefined;

        xml += `    <video:video>\n`;
        xml += `      <video:thumbnail_loc>${escapeXml(cleanThumbLoc)}</video:thumbnail_loc>\n`;
        xml += `      <video:title>${escapeXml(vid.title)}</video:title>\n`;
        xml += `      <video:description>${escapeXml(vid.description)}</video:description>\n`;
        
        if (cleanContentLoc) xml += `      <video:content_loc>${escapeXml(cleanContentLoc)}</video:content_loc>\n`;
        if (cleanPlayerLoc) xml += `      <video:player_loc>${escapeXml(cleanPlayerLoc)}</video:player_loc>\n`;
        
        if (vid.publication_date) {
          const vDate = vid.publication_date instanceof Date ? vid.publication_date.toISOString() : vid.publication_date;
          xml += `      <video:publication_date>${vDate}</video:publication_date>\n`;
        }

        // Support du Live Streaming v1.1.1
        if (vid.live) {
          xml += `      <video:live>${vid.live}</video:live>\n`;
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