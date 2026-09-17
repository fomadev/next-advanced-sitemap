/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry, SitemapOptions } from '../types/sitemap.js';
import { buildUrlBaseXml } from './builders/url-builder.js';
import { buildImageXml } from './builders/image-builder.js';
import { buildVideoXml } from './builders/video-builder.js';
import { buildNewsXml } from './builders/news-builder.js';
import { createProcessingStats, processEntry, printDebugReport, ProcessedEntry } from './pipeline.js';


export function generateXml(entries: SitemapEntry[], options: SitemapOptions = {}): string {
  // 🔥 Volume guardrail (sitemaps.org): a single sitemap file must not exceed
  // 50,000 URLs. Aligned with the 50,000-entry index guardrail in index-builder.ts.
  if (entries.length > 50000) {
    throw new Error(
      `[next-advanced-sitemap] Sitemap volume threshold breach: A single sitemap cannot contain more than 50,000 URLs. Detected: ${entries.length}. Please leverage chunkSitemapEntries() to segment your dataset.`
    );
  }

  const now = new Date().toISOString();
  const stats = createProcessingStats();

  // 🚀 v2.0.0 pipeline: legacy `video` alias normalization, staging exclusion,
  // trailing-slash normalization, deletion/expiration coercion, cross-field
  // and (optional) strict-mode validation — all applied per entry.
  const processed: ProcessedEntry[] = [];
  for (const rawEntry of entries) {
    const result = processEntry(rawEntry, options, stats);
    if (result) processed.push(result);
  }

  if (options.sortByPriority) {
    processed.sort((a, b) => {
      const priorityA = a.entry.priority !== undefined ? (a.entry.priority as number) : 0.5;
      const priorityB = b.entry.priority !== undefined ? (b.entry.priority as number) : 0.5;
      return priorityB - priorityA;
    });
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n`;
  xml += `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\n`;
  xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  for (const { entry, removalComment } of processed) {
    if (removalComment) {
      xml += `  ${removalComment}\n`;
    }

    xml += `  <url>\n`;

    // 1. Base elements and alternative hreflang links
    xml += buildUrlBaseXml(entry, options, now);

    // 2. Google Images extension
    xml += buildImageXml(entry.images);

    // 3. Google Videos extension (built-in validations v1.1.3 & v1.1.4)
    xml += buildVideoXml(entry.videos);

    // 4. Google News extension
    xml += buildNewsXml(entry.news);

    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  if (options.debug) {
    printDebugReport(stats);
  }

  return xml;
}
