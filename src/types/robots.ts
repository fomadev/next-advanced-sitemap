/*
 * Copyright (c) 2026 Fordima Inc. All rights reserved.
 * Licensed under the Fordima Public License (FPL) v1.0.
 * See the LICENSE file in the project root for full license information.
 */

/**
 * Main indexing robots of the global market with IDE autocompletion support.
 * The `(string & {})` type keeps suggestions while still allowing custom strings.
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
   * Identifier of the robot(s) targeted by the rule (autocompletion available for major bots).
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

  /**
   * HTTP cache duration in seconds (Cache-Control: max-age).
   * Default: 86400 (24h) with stale-while-revalidate.
   * Must be a finite number >= 0; negative, NaN, or Infinity values throw.
   */
  maxAge?: number;
}