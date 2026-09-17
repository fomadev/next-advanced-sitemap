/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Builds the standard `X-Robots-Tag` directive value used to signal that a
 * page must be removed from the search index while it is still reachable
 * (e.g. during the window between marking a `SitemapEntry` as deleted and
 * the page itself returning a hard 404/410).
 *
 * v1.5.4 / v2.0.0.
 */
export function buildNoIndexTagHeader(): string {
  return 'noindex, nofollow';
}

/**
 * Convenience helper returning a ready-to-use `Headers` instance carrying
 * the `X-Robots-Tag: noindex, nofollow` directive, for use in a Next.js
 * Route Handler response for a page that has been removed.
 *
 * v2.0.0.
 */
export function getNoIndexHeaders(): Headers {
  const headers = new Headers();
  headers.set('X-Robots-Tag', buildNoIndexTagHeader());
  return headers;
}
