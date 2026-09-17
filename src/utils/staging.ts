/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Default hostname fragments treated as non-production (v2.0.0).
 * Matching is a case-insensitive substring test against the URL's hostname.
 */
export const DEFAULT_STAGING_PATTERNS: readonly string[] = [
  'localhost',
  '127.0.0.1',
  '.vercel.app',
  '.netlify.app',
  'staging.',
  '.staging.',
];

/**
 * Detects whether a URL points to a non-production (staging/preview/local)
 * environment, to keep such URLs out of a public sitemap.
 *
 * @param url - Absolute URL to inspect.
 * @param patterns - Optional override list of hostname substrings to match.
 *   Defaults to {@link DEFAULT_STAGING_PATTERNS}.
 */
export function isStagingUrl(url: string, patterns: readonly string[] = DEFAULT_STAGING_PATTERNS): boolean {
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    // Malformed URLs are reported by sanitizeAndValidateUrl(); never treated as staging here.
    return false;
  }

  return patterns.some((pattern) => hostname.includes(pattern.toLowerCase()));
}
