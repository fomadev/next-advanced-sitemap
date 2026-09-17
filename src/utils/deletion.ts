/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../types/sitemap.js';

/**
 * Resolves whether an entry is currently deleted or expired, without
 * applying any of the generation-time side effects (priority/changefreq
 * coercion, media stripping, homepage guardrail). Pure read-only check.
 *
 * v2.0.0.
 */
export function isEntryRemoved(entry: SitemapEntry): boolean {
  if (entry.isDeleted === true) return true;

  if (entry.expiresAt) {
    const expiry = entry.expiresAt instanceof Date ? entry.expiresAt : new Date(entry.expiresAt);
    if (!Number.isNaN(expiry.getTime()) && expiry.getTime() <= Date.now()) {
      return true;
    }
  }

  return false;
}

/**
 * Filters an array down to entries that are still active (neither
 * `isDeleted` nor past their `expiresAt`). Useful to keep a "clean" public
 * sitemap while retaining the removed records elsewhere for audit purposes.
 *
 * v1.5.1 / v2.0.0.
 */
export function filterActiveEntries(entries: SitemapEntry[]): SitemapEntry[] {
  return entries.filter((entry) => !isEntryRemoved(entry));
}

/**
 * Filters an array down to entries that are deleted or expired. Intended to
 * feed a dedicated "removed" sitemap (e.g. `sitemap-removed.xml`) so those
 * URLs can be submitted to Google for accelerated de-indexing.
 *
 * v1.5.3 / v2.0.0.
 */
export function filterRemovedEntries(entries: SitemapEntry[]): SitemapEntry[] {
  return entries.filter((entry) => isEntryRemoved(entry));
}
