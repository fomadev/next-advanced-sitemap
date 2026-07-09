/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { buildSitemapIndexXml } from '../src/core/builders/index-builder.js';
import { getServerSitemapIndexResponse } from '../src/index.js';
import { SitemapIndexEntry } from '../src/types/sitemap.js';

describe('v1.2.6 Sitemap Index Complete Validation Suite', () => {

  describe('Core XML Generation & Volume Guardrails', () => {
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

  describe('HTTP Headers & CDN Cache-Control Integrity (v1.2.6)', () => {
    it('should apply custom max-age directive into sitemap index response headers', () => {
      const entries: SitemapIndexEntry[] = [{ loc: 'https://fomadev.com/sub-sitemap.xml' }];
      
      const response = getServerSitemapIndexResponse(entries, { maxAge: 7200 });
      const cacheControl = response.headers.get('Cache-Control');
      const contentType = response.headers.get('Content-Type');
      const xContentType = response.headers.get('X-Content-Type-Options');

      expect(cacheControl).toBe('public, max-age=7200, must-revalidate');
      expect(contentType).toBe('application/xml; charset=utf-8');
      expect(xContentType).toBe('nosniff');
    });

    it('should fallback to default high-performance CDN header when maxAge is omitted', () => {
      const entries: SitemapIndexEntry[] = [{ loc: 'https://fomadev.com/sub-sitemap.xml' }];
      
      const response = getServerSitemapIndexResponse(entries);
      const cacheControl = response.headers.get('Cache-Control');

      expect(cacheControl).toContain('public, max-age=86400, stale-while-revalidate=3600');
    });
  });
});