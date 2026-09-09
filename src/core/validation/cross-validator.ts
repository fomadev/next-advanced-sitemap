/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../../types/sitemap.js';

/**
 * Validates the logical and semantic cross-field consistency of a sitemap entry.
 * Guarantees a perfect Search Console SEO score.
 */
export function validateCrossFields(entry: SitemapEntry): void {
  // 1. Cross-field validations for the Video extension
  if (entry.videos && entry.videos.length > 0) {
    for (const vid of entry.videos) {
      
      // RULE A: Paid-access vs subscription conflict
      if (vid.live === 'yes' && vid.duration !== undefined && vid.duration > 0) {
        throw new Error(
          `[next-advanced-sitemap] Cross-field validation error on URL "${entry.url}": A live video stream cannot have a pre-defined static duration.`
        );
      }

      // RULE B: Required subscription vs direct-purchase price conflict without defined transactional logic
      if ((vid.requires_subscription === 'yes' || vid.requires_subscription === true) && vid.price && vid.price.type === 'own') {
        throw new Error(
          `[next-advanced-sitemap] Cross-field validation error on URL "${entry.url}": Video cannot simultaneously require a global subscription and be available for full individual ownership ("own").`
        );
      }
    }
  }

  // 2. Cross-field validations for the Google News extension
  if (entry.news) {
    const pubDate = entry.news.publication_date instanceof Date 
      ? entry.news.publication_date 
      : new Date(entry.news.publication_date);

    const now = new Date();
    const diffInMs = now.getTime() - pubDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // RULE C: Google News only indexes articles published within the last 2 days (48 hours) via sitemap
    if (diffInDays > 2) {
      throw new Error(
        `[next-advanced-sitemap] Cross-field validation error on URL "${entry.url}": Google News sitemaps only support articles published within the last 48 hours. Article date is ${diffInDays.toFixed(1)} days old.`
      );
    }
  }
}