/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { buildSitemapIndexXml } from '../src/core/builders/index-builder.js';
import { SitemapIndexEntry } from '../src/types/sitemap.js';

describe('v1.2.0 Sitemap Index Core Suite', () => {

  it('should generate a standard root sitemap index structure correctly', () => {
    const entries: SitemapIndexEntry[] = [
      { loc: 'https://fomadev.com/sitemap-0.xml', lastmod: '2026-07-03T12:00:00.000Z' },
      { loc: 'https://fomadev.com/sitemap-1.xml' }
    ];

    const xml = buildSitemapIndexXml(entries);

    expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('<sitemap>');
    expect(xml).toContain('<loc>https://fomadev.com/sitemap-0.xml</loc>');
    expect(xml).toContain('<lastmod>2026-07-03T12:00:00.000Z</lastmod>');
    expect(xml).toContain('<loc>https://fomadev.com/sitemap-1.xml</loc>');
  });

  it('should support JavaScript Date object polymorphism for index entries', () => {
    const mockDate = new Date();
    const entries: SitemapIndexEntry[] = [
      { loc: 'https://fomadev.com/sitemap-products.xml', lastmod: mockDate }
    ];

    const xml = buildSitemapIndexXml(entries);
    expect(xml).toContain(`<lastmod>${mockDate.toISOString()}</lastmod>`);
  });

  it('should trigger the core validation rules if a sitemap loc URL is invalid', () => {
    const invalidEntries: SitemapIndexEntry[] = [
      { loc: 'ftp://bad-protocol.com/sitemap.xml' }
    ];

    expect(() => buildSitemapIndexXml(invalidEntries)).toThrowError(
      '[next-advanced-sitemap] Invalid URL in sitemap index location'
    );
  });
});