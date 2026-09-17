/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../types/sitemap.js';

export interface SplitSitemapEntries {
  /** The full, unfiltered entry set — feed this to your default `sitemap.xml` route. */
  pages: SitemapEntry[];
  /** Entries carrying at least one image — feed this to a `sitemap-images.xml` route. */
  images: SitemapEntry[];
  /** Entries carrying at least one video — feed this to a `sitemap-videos.xml` route. */
  videos: SitemapEntry[];
  /** Entries carrying a Google News payload — feed this to a `sitemap-news.xml` route. */
  news: SitemapEntry[];
}

/**
 * Groups sitemap entries by content type so they can be served as separate,
 * per-type sitemap files (`sitemap-news.xml`, `sitemap-video.xml`,
 * `sitemap-images.xml`), which SEO teams commonly use to analyze which
 * section of a site indexes best.
 *
 * v2.0.0 (inspired by the "Multi-Sitemaps by Type" v3.1.0 roadmap item).
 */
export function splitEntriesByType(entries: SitemapEntry[]): SplitSitemapEntries {
  const images: SitemapEntry[] = [];
  const videos: SitemapEntry[] = [];
  const news: SitemapEntry[] = [];

  for (const entry of entries) {
    if (entry.images?.length) images.push(entry);
    if (entry.videos?.length) videos.push(entry);
    if (entry.news) news.push(entry);
  }

  return { pages: entries, images, videos, news };
}
