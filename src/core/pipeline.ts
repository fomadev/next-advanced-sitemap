/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry, SitemapOptions } from '../types/sitemap.js';
import { isStagingUrl } from '../utils/staging.js';
import { normalizeTrailingSlash } from '../utils/trailing-slash.js';
import { validateCrossFields } from './validation/cross-validator.js';
import { validateStrictMode } from './strict-validator.js';

export interface EntryProcessingStats {
  total: number;
  excludedStaging: number;
  markedForRemoval: number;
}

export function createProcessingStats(): EntryProcessingStats {
  return { total: 0, excludedStaging: 0, markedForRemoval: 0 };
}

export interface ProcessedEntry {
  entry: SitemapEntry;
  /** XML comment to inject immediately above the `<url>` block, if any. */
  removalComment?: string;
}

/**
 * Applies the v1.5.x/v2.0.0 deletion & expiration rules to a single entry:
 * forces `priority` to 0.0 and `changefreq` to 'never', strips image/video
 * nodes, and refuses to remove the site root (homepage guardrail).
 */
function applyDeletionRules(entry: SitemapEntry): { entry: SitemapEntry; isRemoval: boolean; reason?: 'deleted' | 'expired' } {
  let reason: 'deleted' | 'expired' | undefined;

  if (entry.isDeleted === true) {
    reason = 'deleted';
  } else if (entry.expiresAt) {
    const expiry = entry.expiresAt instanceof Date ? entry.expiresAt : new Date(entry.expiresAt);
    if (!Number.isNaN(expiry.getTime()) && expiry.getTime() <= Date.now()) {
      reason = 'expired';
    }
  }

  if (!reason) {
    return { entry, isRemoval: false };
  }

  let pathname = '/';
  try {
    pathname = new URL(entry.url).pathname;
  } catch {
    // Malformed URLs surface downstream via sanitizeAndValidateUrl(); nothing to guard here.
  }

  if (pathname === '/' || pathname === '') {
    throw new Error(
      `[next-advanced-sitemap] Guardrail: refusing to mark the homepage ("${entry.url}") as deleted/expired — this would de-index your entire site root.`
    );
  }

  return {
    entry: { ...entry, priority: 0.0, changefreq: 'never', images: undefined, videos: undefined },
    isRemoval: true,
    reason,
  };
}

/**
 * Runs a single raw entry through the full v2.0.0 generation pipeline:
 * legacy `video` -> `videos` normalization, staging exclusion, trailing
 * slash normalization, deletion/expiration coercion, cross-field
 * validation, and (optionally) strict-mode validation.
 *
 * Returns `null` when the entry must be dropped from output entirely
 * (currently: staging exclusion only — deleted/expired entries are kept
 * but coerced, never dropped, so their removal signal reaches Google).
 */
export function processEntry(
  rawEntry: SitemapEntry,
  options: SitemapOptions,
  stats: EntryProcessingStats
): ProcessedEntry | null {
  stats.total++;

  let entry: SitemapEntry = { ...rawEntry };

  // Preventive normalization: accept a singular "video" field as a convenience alias.
  if ((rawEntry as any).video && !entry.videos) {
    entry.videos = [(rawEntry as any).video];
  }

  if (options.excludeStaging) {
    const patterns = Array.isArray(options.excludeStaging) ? options.excludeStaging : undefined;
    if (isStagingUrl(entry.url, patterns)) {
      stats.excludedStaging++;
      return null;
    }
  }

  if (options.trailingSlash) {
    entry.url = normalizeTrailingSlash(entry.url, options.trailingSlash);
    if (entry.alternates?.length) {
      entry.alternates = entry.alternates.map((alt) => ({
        ...alt,
        href: normalizeTrailingSlash(alt.href, options.trailingSlash!),
      }));
    }
  }

  const deletion = applyDeletionRules(entry);
  entry = deletion.entry;

  let removalComment: string | undefined;
  if (deletion.isRemoval) {
    stats.markedForRemoval++;
    removalComment = deletion.reason === 'expired' ? '<!-- Status: Pending Removal (Expired) -->' : '<!-- Status: Pending Removal -->';
  }

  validateCrossFields(entry);

  if (options.strict) {
    validateStrictMode(entry, options);
  }

  return { entry, removalComment };
}

/**
 * Logs a concise, human-readable generation report to the console when
 * `options.debug` is enabled.
 */
export function printDebugReport(stats: EntryProcessingStats): void {
  console.log(
    `[next-advanced-sitemap] Generated sitemap — ${stats.total} entries received, ` +
      `${stats.excludedStaging} excluded (staging), ${stats.markedForRemoval} marked for removal.`
  );
}
