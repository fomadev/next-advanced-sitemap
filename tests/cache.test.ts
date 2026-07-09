/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { getServerSitemapResponse } from '../src/index.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('Custom Cache-Control Configuration (v1.0.9 / v1.2.x Aligned)', () => {
  const mockEntries: SitemapEntry[] = [{ url: 'https://fomadev.com' }];

  it('should inject custom max-age header when maxAge option is specified', () => {
    const response = getServerSitemapResponse(mockEntries, { maxAge: 3600 });
    const cacheHeader = response.headers.get('Cache-Control');

    expect(cacheHeader).toBe('public, max-age=3600, must-revalidate');
  });

  it('should accept zero (0) as a valid maxAge parameter to bypass caching', () => {
    const response = getServerSitemapResponse(mockEntries, { maxAge: 0 });
    const cacheHeader = response.headers.get('Cache-Control');

    expect(cacheHeader).toBe('public, max-age=0, must-revalidate');
  });

  it('should fall back to standard CDN strategy if maxAge is omitted', () => {
    const response = getServerSitemapResponse(mockEntries, { autoLastmod: true });
    const cacheHeader = response.headers.get('Cache-Control');

    // 🚀 Mis à jour pour correspondre à la stratégie d'infrastructure unifiée de la v1.2.x
    expect(cacheHeader).toBe('public, max-age=86400, stale-while-revalidate=3600');
  });
});