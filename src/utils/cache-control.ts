/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Builds the HTTP Cache-Control header value according to a unified strategy.
 *
 * If `maxAge` is provided (a finite, non-negative number of seconds), the
 * response can be immediately revalidated against the origin via
 * `must-revalidate`. If omitted, a high-performance default CDN strategy is
 * applied (24h cache + 1h stale-while-revalidate).
 *
 * Invalid values (negative numbers, NaN, Infinity, or non-numeric input) are
 * rejected with a clear error instead of silently producing a malformed
 * Cache-Control header or silently falling back to the default.
 *
 * Centralizing this logic guarantees that any evolution of the caching policy
 * is uniformly propagated to all response generators (v1.0.9 / v1.2.6 / v1.3.9).
 *
 * @param maxAge - HTTP cache duration in seconds (optional, finite and >= 0)
 * @returns The full Cache-Control header value
 */
export function buildCacheControlHeader(maxAge?: number): string {
  if (maxAge === undefined) {
    // Default high-performance CDN strategy
    return 'public, max-age=86400, stale-while-revalidate=3600';
  }

  if (typeof maxAge !== 'number' || !Number.isFinite(maxAge) || maxAge < 0) {
    throw new Error(
      `[next-advanced-sitemap] Invalid maxAge value: ${String(maxAge)}. Expected a finite, non-negative number of seconds.`
    );
  }

  return `public, max-age=${maxAge}, must-revalidate`;
}
