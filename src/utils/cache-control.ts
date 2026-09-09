/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Builds the HTTP Cache-Control header value according to a unified strategy.
 *
 * If `maxAge` is provided (>= 0), the response can be immediately revalidated
 * against the origin via `must-revalidate`. Otherwise, a high-performance
 * default CDN strategy is applied (24h cache + 1h stale-while-revalidate).
 *
 * Centralizing this logic guarantees that any evolution of the caching policy
 * is uniformly propagated to all response generators (v1.0.9 / v1.2.6 / v1.3.9).
 *
 * @param maxAge - HTTP cache duration in seconds (optional)
 * @returns The full Cache-Control header value
 */
export function buildCacheControlHeader(maxAge?: number): string {
  if (maxAge !== undefined && maxAge >= 0) {
    return `public, max-age=${maxAge}, must-revalidate`;
  }
  // Default high-performance CDN strategy
  return 'public, max-age=86400, stale-while-revalidate=3600';
}
