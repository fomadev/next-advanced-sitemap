/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Principaux robots d'indexation du marché mondial avec support d'autocomplétion IDE.
 * Le type `(string & {})` préserve la suggestion tout en autorisant des chaînes personnalisées.
 */
export type KnownUserAgent =
  | '*'
  | 'Googlebot'
  | 'Googlebot-Image'
  | 'Googlebot-News'
  | 'Googlebot-Video'
  | 'Bingbot'
  | 'Slurp'
  | 'DuckDuckBot'
  | 'Baiduspider'
  | 'YandexBot'
  | 'Sogou'
  | 'Exabot'
  | 'facebot'
  | 'ia_archiver'
  | 'Applebot'
  | 'Twitterbot'
  | 'GPTBot'
  | 'ChatGPT-User'
  | 'ClaudeBot'
  | 'PerplexityBot'
  | (string & {});

export interface RobotsRule {
  /**
   * Identifiant du ou des robots ciblés par la règle (autocomplétion disponible pour les principaux bots).
   */
  userAgent: KnownUserAgent | KnownUserAgent[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

export interface RobotsOptions {
  rules: RobotsRule | RobotsRule[];
  sitemap?: string | string[];
  host?: string;
}