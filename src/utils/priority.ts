/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { SitemapPriority } from '../types/sitemap.js';

export interface DepthPriorityOptions {
  /** Priority assigned to the site root. Default: 1.0. */
  base?: number;
  /** Priority subtracted per path segment of depth. Default: 0.2. */
  step?: number;
  /** Priority floor, never returned below this value. Default: 0.1. */
  min?: number;
}

/**
 * Computes a recommended `<priority>` value from a URL's path depth, so
 * `/` gets 1.0, `/blog` gets 0.8, `/blog/my-article` gets 0.6, and so on.
 * The result is rounded to one decimal place, matching sitemap protocol
 * conventions.
 *
 * v2.0.0.
 */
export function calculatePriorityByDepth(url: string, options: DepthPriorityOptions = {}): SitemapPriority {
  const base = options.base ?? 1.0;
  const step = options.step ?? 0.2;
  const min = options.min ?? 0.1;

  let pathname = '/';
  try {
    pathname = new URL(url).pathname;
  } catch {
    // Malformed URLs are reported downstream by sanitizeAndValidateUrl(); default to root depth.
  }

  const depth = pathname.split('/').filter(Boolean).length;
  const raw = base - depth * step;
  const clamped = Math.max(min, Math.min(base, raw));

  return Math.round(clamped * 10) / 10;
}
