/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry, SitemapOptions } from '../types/sitemap.js';

/**
 * Enforces Google's strict production requirements on a single entry.
 * Activated via `SitemapOptions.strict: true` — throws a descriptive
 * error on the first violation, rather than silently emitting a sitemap
 * that scores below 100% in Search Console.
 *
 * v2.0.0.
 */
export function validateStrictMode(entry: SitemapEntry, options: SitemapOptions): void {
  if (!entry.url.startsWith('https://')) {
    throw new Error(
      `[next-advanced-sitemap] Strict mode violation on "${entry.url}": URLs must use HTTPS in strict mode.`
    );
  }

  if (entry.lastmod === undefined && !options.autoLastmod) {
    throw new Error(
      `[next-advanced-sitemap] Strict mode violation on "${entry.url}": "lastmod" is required in strict mode (define it explicitly or enable autoLastmod).`
    );
  }

  if (entry.changefreq === undefined) {
    throw new Error(
      `[next-advanced-sitemap] Strict mode violation on "${entry.url}": "changefreq" is required in strict mode.`
    );
  }

  if (entry.priority === undefined) {
    throw new Error(
      `[next-advanced-sitemap] Strict mode violation on "${entry.url}": "priority" is required in strict mode.`
    );
  }

  if (entry.videos?.length) {
    for (const video of entry.videos) {
      if (!video.content_loc && !video.player_loc) {
        throw new Error(
          `[next-advanced-sitemap] Strict mode violation on "${entry.url}": every video requires "content_loc" or "player_loc".`
        );
      }
    }
  }
}
