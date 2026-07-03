/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapEntry } from '../../types/sitemap.js';

/**
 * Valide la cohérence logique et sémantique croisée entre les différents champs d'une entrée.
 * Garantit un score SEO Search Console parfait.
 */
export function validateCrossFields(entry: SitemapEntry): void {
  // 1. Validations croisées sur l'extension Vidéo
  if (entry.videos && entry.videos.length > 0) {
    for (const vid of entry.videos) {
      
      // RÈGLE A : Conflit d'accès payant vs abonnement
      if (vid.live === 'yes' && vid.duration !== undefined && vid.duration > 0) {
        throw new Error(
          `[next-advanced-sitemap] Cross-field validation error on URL "${entry.url}": A live video stream cannot have a pre-defined static duration.`
        );
      }

      // RÈGLE B : Conflit d'abonnement requis vs Prix d'achat direct sans logique transactionnelle définie
      if (vid.requires_subscription === 'yes' && vid.price && vid.price.type === 'own') {
        throw new Error(
          `[next-advanced-sitemap] Cross-field validation error on URL "${entry.url}": Video cannot simultaneously require a global subscription and be available for full individual ownership ("own").`
        );
      }
    }
  }

  // 2. Validations croisées sur l'extension Google News
  if (entry.news) {
    const pubDate = entry.news.publication_date instanceof Date 
      ? entry.news.publication_date 
      : new Date(entry.news.publication_date);

    const now = new Date();
    const diffInMs = now.getTime() - pubDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // RÈGLE C : Google News n'indexe pas les articles de plus de 2 jours (48 heures) via sitemap
    if (diffInDays > 2) {
      throw new Error(
        `[next-advanced-sitemap] Cross-field validation error on URL "${entry.url}": Google News sitemaps only support articles published within the last 48 hours. Article date is ${diffInDays.toFixed(1)} days old.`
      );
    }
  }
}