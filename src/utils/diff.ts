/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../types/sitemap.js';

export interface SitemapEntryChange {
  url: string;
  changes: string[];
}

export interface SitemapDiffResult {
  /** URLs present in `current` but not in `previous`. */
  added: string[];
  /** URLs present in `previous` but not in `current`. */
  removed: string[];
  /** URLs present in both, with a per-field description of what changed. */
  changed: SitemapEntryChange[];
  /** Count of URLs present in both with no detected difference. */
  unchanged: number;
}

function normalizeDate(value: string | Date | undefined): string {
  if (!value) return '';
  return value instanceof Date ? value.toISOString() : value;
}

/**
 * Compares two sitemap snapshots (e.g. the last deployment's generated
 * entries vs. the current build) and reports what was added, removed, or
 * modified. Useful in CI/deployment logs to surface sitemap drift at a
 * glance.
 *
 * v2.0.0 (inspired by the "Sitemap Diff" v3.1.0 roadmap item).
 */
export function diffSitemapEntries(previous: SitemapEntry[], current: SitemapEntry[]): SitemapDiffResult {
  const previousByUrl = new Map(previous.map((entry) => [entry.url, entry]));
  const currentByUrl = new Map(current.map((entry) => [entry.url, entry]));

  const added: string[] = [];
  const changed: SitemapEntryChange[] = [];
  let unchanged = 0;

  for (const [url, currentEntry] of currentByUrl) {
    const previousEntry = previousByUrl.get(url);
    if (!previousEntry) {
      added.push(url);
      continue;
    }

    const fieldChanges: string[] = [];
    if (normalizeDate(previousEntry.lastmod) !== normalizeDate(currentEntry.lastmod)) {
      fieldChanges.push('lastmod');
    }
    if (previousEntry.priority !== currentEntry.priority) {
      fieldChanges.push('priority');
    }
    if (previousEntry.changefreq !== currentEntry.changefreq) {
      fieldChanges.push('changefreq');
    }
    if ((previousEntry.images?.length ?? 0) !== (currentEntry.images?.length ?? 0)) {
      fieldChanges.push('images');
    }
    if ((previousEntry.videos?.length ?? 0) !== (currentEntry.videos?.length ?? 0)) {
      fieldChanges.push('videos');
    }
    if (Boolean(previousEntry.isDeleted) !== Boolean(currentEntry.isDeleted)) {
      fieldChanges.push('isDeleted');
    }

    if (fieldChanges.length > 0) {
      changed.push({ url, changes: fieldChanges });
    } else {
      unchanged++;
    }
  }

  const removed: string[] = [];
  for (const url of previousByUrl.keys()) {
    if (!currentByUrl.has(url)) {
      removed.push(url);
    }
  }

  return { added, removed, changed, unchanged };
}
