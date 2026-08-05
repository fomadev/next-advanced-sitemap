/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { buildSitemapIndexXml } from '../src/core/builders/index-builder.js';
import { getServerSitemapIndexResponse } from '../src/index.js';
import { SitemapIndexEntry } from '../src/types/sitemap.js';

describe('Sitemap Index Comprehensive Suite', () => {

  describe('Core XML Generation & Volume Guardrails (v1.2.5)', () => {
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

  describe('Index Auto-Lastmod Feature (v1.2.7)', () => {
    it('should inject current system date when autoLastmod is true and lastmod is missing', () => {
      const entries: SitemapIndexEntry[] = [
        { loc: 'https://fomadev.com/sitemap-dynamic.xml' }
      ];

      const xml = buildSitemapIndexXml(entries, { autoLastmod: true });
      
      expect(xml).toContain('<lastmod>2026-');
      expect(xml).toContain('Z</lastmod>');
    });

    it('should respect explicit lastmod date even if autoLastmod is enabled', () => {
      const entries: SitemapIndexEntry[] = [
        { loc: 'https://fomadev.com/sitemap-static.xml', lastmod: '2025-01-01T00:00:00.000Z' }
      ];

      const xml = buildSitemapIndexXml(entries, { autoLastmod: true });
      
      expect(xml).toContain('<lastmod>2025-01-01T00:00:00.000Z</lastmod>');
      expect(xml).not.toContain('2026-');
    });
  });

  describe('Index Escaping & Query Params Safety (v1.2.8)', () => {
    it('should safely escape complex URL query parameters (&, ?, =) in index locations', () => {
      const entries: SitemapIndexEntry[] = [
        { loc: 'https://fomadev.com/api/sitemap?page=1&category=tech&region=cd' }
      ];

      const xml = buildSitemapIndexXml(entries);

      expect(xml).toContain('<loc>https://fomadev.com/api/sitemap?page=1&amp;category=tech&amp;region=cd</loc>');
      expect(xml).not.toContain('&category=');
    });

    it('should handle reserved XML entities in dynamic route parameters cleanly', () => {
      const entries: SitemapIndexEntry[] = [
        { loc: 'https://fomadev.com/sitemap?filter=<active>&lang=fr' }
      ];

      const xml = buildSitemapIndexXml(entries);

      expect(xml).toContain('&lt;active&gt;');
      expect(xml).toContain('&amp;lang=fr');
    });
  });

  describe('Index String-Building Performance & Integrity', () => {
    it('should accurately build large index payloads using the buffer array join pattern', () => {
      const entries: SitemapIndexEntry[] = Array.from({ length: 1000 }, (_, i) => ({
        loc: `https://fomadev.com/sitemap-part-${i + 1}.xml`,
        lastmod: '2026-08-05T00:00:00.000Z'
      }));

      const xml = buildSitemapIndexXml(entries);

      expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
      expect(xml.endsWith('</sitemapindex>')).toBe(true);
      expect(xml).toContain('<loc>https://fomadev.com/sitemap-part-1.xml</loc>');
      expect(xml).toContain('<loc>https://fomadev.com/sitemap-part-1000.xml</loc>');
    });
  });
});