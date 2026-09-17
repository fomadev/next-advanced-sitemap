/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../types/sitemap.js';

/**
 * Serializes sitemap entries to a JSON string, for consumption by
 * dashboards, audit tooling, or a `/sitemap.json` debug route.
 *
 * v2.0.0.
 */
export function exportSitemapToJson(entries: SitemapEntry[], pretty = true): string {
  return JSON.stringify(entries, null, pretty ? 2 : undefined);
}

const CSV_COLUMNS = ['url', 'lastmod', 'changefreq', 'priority', 'imageCount', 'videoCount', 'hasNews', 'isRemoved'] as const;

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Serializes sitemap entries to CSV for SEO audits in spreadsheet tools
 * (Excel, Google Sheets). Media/hreflang payloads are summarized as
 * counts rather than expanded, since CSV has no native nested structure.
 *
 * v2.0.0.
 */
export function exportSitemapToCsv(entries: SitemapEntry[]): string {
  const lines = [CSV_COLUMNS.join(',')];

  for (const entry of entries) {
    const lastmod = entry.lastmod instanceof Date ? entry.lastmod.toISOString() : (entry.lastmod ?? '');
    const isRemoved = entry.isDeleted === true || Boolean(entry.expiresAt && new Date(entry.expiresAt).getTime() <= Date.now());

    const row = [
      entry.url,
      String(lastmod),
      entry.changefreq ?? '',
      entry.priority !== undefined ? String(entry.priority) : '',
      String(entry.images?.length ?? 0),
      String(entry.videos?.length ?? 0),
      entry.news ? 'true' : 'false',
      String(isRemoved),
    ];

    lines.push(row.map((value) => csvEscape(value)).join(','));
  }

  return lines.join('\n');
}
