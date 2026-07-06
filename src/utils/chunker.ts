/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../types/sitemap.js';

/**
 * Sépare un tableau massif d'entrées de sitemap en sous-tableaux de taille fixe.
 * v1.2.4 : Helper pur de découpage de listes (Chunking Utility) pour sitemaps volumineux.
 * * @param entries Le tableau complet des entrées à segmenter.
 * @param size La taille maximale de chaque segment (ex: 10000 ou 40000).
 * @returns Un tableau à deux dimensions contenant les sous-paquets découpés.
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