import { SitemapEntry } from '../types/sitemap.js';
import { escapeXml } from '../utils/xml-escape.js';

/**
 * Génère le flux XML complet du sitemap incluant les extensions Images, Vidéos et News.
 */
export function generateXml(entries: SitemapEntry[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n`;
  xml += `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\n`;
  xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  for (const entry of entries) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(entry.url)}</loc>\n`;

    // Métadonnées standard
    if (entry.lastmod) {
      const date = entry.lastmod instanceof Date ? entry.lastmod.toISOString() : entry.lastmod;
      xml += `    <lastmod>${date}</lastmod>\n`;
    }

    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }

    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    }

    // Extension Images
    if (entry.images?.length) {
      for (const img of entry.images) {
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