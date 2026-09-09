/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Construit la valeur de l'en-tête HTTP Cache-Control selon une stratégie unifiée.
 *
 * Si `maxAge` est fourni (>= 0), la réponse est validable immédiatement auprès de
 * l'origine via `must-revalidate`. Sinon, une stratégie CDN par défaut haute
 * performance est appliquée (24h de cache + 1h de stale-while-revalidate).
 *
 * Centraliser cette logique garantit que toute évolution de la politique de cache
 * est répercutée uniformément sur tous les générateurs de réponses (v1.0.9 / v1.2.6 / v1.3.9).
 *
 * @param maxAge - Durée de mise en cache HTTP en secondes (optionnelle)
 * @returns La valeur complète de l'en-tête Cache-Control
 */
export function buildCacheControlHeader(maxAge?: number): string {
  if (maxAge !== undefined && maxAge >= 0) {
    return `public, max-age=${maxAge}, must-revalidate`;
  }
  // Stratégie CDN par défaut haute performance
  return 'public, max-age=86400, stale-while-revalidate=3600';
}
