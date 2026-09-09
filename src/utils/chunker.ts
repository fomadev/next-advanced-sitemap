/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../types/sitemap.js';

/**
 * Splits a massive sitemap entries array into fixed-size sub-arrays.
 * v1.2.4: Pure list chunking helper (Chunking Utility) for large sitemaps.
 * * @param entries The full array of entries to segment.
 * @param size The maximum size of each segment (e.g. 10000 or 40000).
 * @returns A two-dimensional array containing the split sub-batches.
 */
export function chunkSitemapEntries(entries: SitemapEntry[], size: number): SitemapEntry[][] {
  if (!size || size <= 0) {
    return [entries];
  }
  
  const chunks: SitemapEntry[][] = [];
  for (let i = 0; i < entries.length; i += size) {
    chunks.push(entries.slice(i, i + size));
  }
  
  return chunks;
}