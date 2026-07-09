/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { buildSitemapIndexXml } from '../src/core/builders/index-builder.js';
import { SitemapIndexEntry } from '../src/types/sitemap.js';

describe('v1.2.5 Sitemap Index Hybrid Date & Volume Guardrail Suite', () => {

  it('should accept and accurately parse a plain ISO string for lastmod', () => {
    const entries: SitemapIndexEntry[] = [
      { loc: 'https://fomadev.com/sitemap-articles.xml', lastmod: '2026-11-29T12:00:00.000Z' }
    ];

    const xml = buildSitemapIndexXml(entries);
    expect(xml).toContain('<lastmod>2026-11-29T12:00:00.000Z</lastmod>');
  });

  it('should accept and dynamically serialize native JavaScript Date objects (Polymorphism v1.2.3)', () => {
    const mockDate = new Date('2026-07-05T10:00:00.000Z');
    const entries: SitemapIndexEntry[] = [
      { loc: 'https://fomadev.com/sitemap-products.xml', lastmod: mockDate }
    ];

    const xml = buildSitemapIndexXml(entries);
    expect(xml).toContain(`<lastmod>${mockDate.toISOString()}</lastmod>`);
  });

  it('should fallback natively from url property to loc and pass validation', () => {
    const entries: any[] = [
      { url: 'https://fomadev.com/sitemap-fallback.xml', lastmod: '2026-07-05T00:00:00.000Z' }
    ];

    const xml = buildSitemapIndexXml(entries);
    expect(xml).toContain('<loc>https://fomadev.com/sitemap-fallback.xml</loc>');
  });

  it('should throw strict validation error for invalid index URLs', () => {
    const badEntries: SitemapIndexEntry[] = [
      { loc: 'https://fomadev.com/invalid space sitemap.xml' }
    ];

    expect(() => buildSitemapIndexXml(badEntries)).toThrowError(
      '[next-advanced-sitemap] Malformed URL structure detected in sitemap index location'
    );
  });

  it('should throw a strict volume guardrail exception if entries exceed 50,000 (v1.2.5)', () => {
    // Création d'un tableau virtuel de 50 001 entrées sans saturer la mémoire réelle
    const massiveEntries: SitemapIndexEntry[] = Array.from({ length: 50001 }, () => ({
      loc: 'https://fomadev.com/sitemap-mock.xml'
    }));

    expect(() => buildSitemapIndexXml(massiveEntries)).toThrowError(
      '[next-advanced-sitemap] Index volume threshold breach'
    );
  });
});