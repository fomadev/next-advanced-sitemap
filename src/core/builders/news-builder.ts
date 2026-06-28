/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../../types/sitemap.js';
import { escapeXml } from '../../utils/xml-escape.js';

export function buildNewsXml(news: SitemapEntry['news']): string {
  if (!news) return '';

  const nDate = news.publication_date instanceof Date ? news.publication_date.toISOString() : news.publication_date;
  
  let xml = '';
  xml += `    <news:news>\n`;
  xml += `      <news:publication>\n`;
  xml += `        <news:name>${escapeXml(news.name)}</news:name>\n`;
  xml += `        <news:language>${escapeXml(news.language)}</news:language>\n`;
  xml += `      </news:publication>\n`;
  xml += `      <news:publication_date>${nDate}</news:publication_date>\n`;
  xml += `      <news:title>${escapeXml(news.title)}</news:title>\n`;
  xml += `    </news:news>\n`;
  
  return xml;
}