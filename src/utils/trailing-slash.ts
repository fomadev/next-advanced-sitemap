/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { TrailingSlashMode } from '../types/sitemap.js';

/**
 * Normalizes the trailing slash of a URL's pathname according to `mode`.
 * The site root ("/") is always left untouched, and the query string /
 * hash fragment (if any) are preserved as-is.
 *
 * v2.0.0.
 */
export function normalizeTrailingSlash(url: string, mode: TrailingSlashMode): string {
  if (mode === 'preserve') return url;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    // Malformed URLs are reported downstream by sanitizeAndValidateUrl().
    return url;
  }

  if (parsed.pathname === '/' || parsed.pathname === '') {
    return url;
  }

  if (mode === 'add' && !parsed.pathname.endsWith('/')) {
    parsed.pathname += '/';
  } else if (mode === 'remove' && parsed.pathname.endsWith('/')) {
    parsed.pathname = parsed.pathname.replace(/\/+$/, '');
  }

  return parsed.toString();
}
