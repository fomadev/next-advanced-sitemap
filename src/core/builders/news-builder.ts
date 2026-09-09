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

  // ✨ Stock tickers validation and serialization (v1.1.8)
  if (news.stock_tickers) {
    if (!Array.isArray(news.stock_tickers)) {
      throw new Error(
        `[next-advanced-sitemap] Invalid news stock_tickers: property must be an array of strings.`
      );
    }

    const validatedTickers = news.stock_tickers
      .map(ticker => {
        const cleanTicker = ticker.trim();
        if (!cleanTicker) {
          throw new Error(
            `[next-advanced-sitemap] Invalid stock ticker detected: ticker element cannot be empty or just whitespaces.`
          );
        }
        if (!cleanTicker.includes(':')) {
          throw new Error(
            `[next-advanced-sitemap] Invalid stock ticker format: "${cleanTicker}". Expected "EXCHANGE:TICKER" format (e.g., "NASDAQ:AAPL").`
          );
        }
        return cleanTicker;
      });

    if (validatedTickers.length > 0) {
      // Google expects a comma-separated list (without extra whitespaces)
      const tickersString = validatedTickers.join(',');
      xml += `      <news:stock_tickers>${escapeXml(tickersString)}</news:stock_tickers>\n`;
    }
  }

  xml += `    </news:news>\n`;
  
  return xml;
}