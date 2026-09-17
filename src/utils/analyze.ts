/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../types/sitemap.js';
import { isEntryRemoved } from './deletion.js';

export interface SitemapAnalysisReport {
  totalUrls: number;
  withImages: number;
  withVideos: number;
  withNews: number;
  missingLastmod: number;
  missingPriority: number;
  deletedOrExpired: number;
  duplicateUrls: number;
  /** Overall health score from 0 to 100. */
  score: number;
  warnings: string[];
}

/**
 * Performs a dry-run analysis of a sitemap entry set without generating any
 * XML, returning a health score and human-readable warnings. Intended to be
 * logged during development/CI so a broken or incomplete dataset is caught
 * before it ever reaches Google.
 *
 * v2.0.0 (inspired by the "Dry Run Mode" / "SEO Health Score" roadmap ideas).
 */
export function analyzeSitemapEntries(entries: SitemapEntry[]): SitemapAnalysisReport {
  const warnings: string[] = [];
  const seen = new Set<string>();
  let duplicateUrls = 0;
  let withImages = 0;
  let withVideos = 0;
  let withNews = 0;
  let missingLastmod = 0;
  let missingPriority = 0;
  let deletedOrExpired = 0;

  for (const entry of entries) {
    if (seen.has(entry.url)) {
      duplicateUrls++;
    } else {
      seen.add(entry.url);
    }

    if (entry.images?.length) withImages++;
    if (entry.videos?.length) withVideos++;
    if (entry.news) withNews++;
    if (!entry.lastmod) missingLastmod++;
    if (entry.priority === undefined) missingPriority++;
    if (isEntryRemoved(entry)) deletedOrExpired++;
  }

  const total = entries.length;
  if (duplicateUrls > 0) warnings.push(`${duplicateUrls} duplicate URL(s) detected.`);
  if (missingLastmod > 0) warnings.push(`${missingLastmod} entr${missingLastmod === 1 ? 'y is' : 'ies are'} missing "lastmod" (consider autoLastmod: true).`);
  if (total === 0) warnings.push('No entries provided.');

  // Note: missing "priority" is not penalized — it is an optional field that
  // major search engines largely disregard; it is still reported for visibility.
  let score = 100;
  if (total > 0) {
    score -= Math.min(30, (duplicateUrls / total) * 100);
    score -= Math.min(20, (missingLastmod / total) * 100 * 0.2);
  }
  score = Math.max(0, Math.round(score));

  return {
    totalUrls: total,
    withImages,
    withVideos,
    withNews,
    missingLastmod,
    missingPriority,
    deletedOrExpired,
    duplicateUrls,
    score,
    warnings,
  };
}
