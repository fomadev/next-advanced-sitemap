/*
 * Copyright (c) 2026 Fordima Inc. All rights reserved.
 * Licensed under the Fordima Public License (FPL) v1.0.
 * See the LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { buildNewsXml } from '../src/core/builders/news-builder.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('buildNewsXml - Google News Extension Matrix', () => {
  const baseNews = {
    name: 'FomaDev Insights',
    language: 'fr',
    publication_date: '2026-07-01T10:00:00.000Z',
    title: 'FinTech Revolution in DRC & Beyond'
  };

  describe('Core Base Fields Rendering', () => {
    it('should return an empty string if news object is undefined', () => {
      const xml = buildNewsXml(undefined);
      expect(xml).toBe('');
    });

    it('should properly convert standard Date objects into ISO strings', () => {
      const newsData: SitemapEntry['news'] = {
        ...baseNews,
        publication_date: new Date('2026-07-01T15:30:00.000Z')
      };

      const xml = buildNewsXml(newsData);
      expect(xml).toContain('<news:publication_date>2026-07-01T15:30:00.000Z</news:publication_date>');
    });

    it('should cleanly escape special XML characters across strings', () => {
      const newsData: SitemapEntry['news'] = {
        name: 'Tech & Innovation <Studio>',
        language: 'en',
        publication_date: '2026-07-01T10:00:00.000Z',
        title: 'Building "Scalable" Architectures'
      };

      const xml = buildNewsXml(newsData);
      expect(xml).toContain('<news:name>Tech &amp; Innovation &lt;Studio&gt;</news:name>');
      expect(xml).toContain('<news:title>Building &quot;Scalable&quot; Architectures</news:title>');
    });
  });

  describe('v1.1.8 - stock_tickers Guardrails', () => {
    it('should render a clean comma-separated list without injecting extra spaces', () => {
      const newsData: SitemapEntry['news'] = {
        ...baseNews,
        stock_tickers: [' NASDAQ:AAPL ', ' NYSE:UBER  ']
      };

      const xml = buildNewsXml(newsData);
      expect(xml).toContain('<news:stock_tickers>NASDAQ:AAPL,NYSE:UBER</news:stock_tickers>');
    });

    it('should escape structural special characters if present inside stock tickers string stream', () => {
      const newsData: SitemapEntry['news'] = {
        ...baseNews,
        stock_tickers: ['NYSE:A&B']
      };

      const xml = buildNewsXml(newsData);
      expect(xml).toContain('<news:stock_tickers>NYSE:A&amp;B</news:stock_tickers>');
    });

    it('should throw an explicit fail-fast error if property is not an array', () => {
      const newsData: SitemapEntry['news'] = {
        ...baseNews,
        // @ts-expect-error - Simulating runtime dynamic mismatch bypass
        stock_tickers: 'NASDAQ:AAPL'
      };

      expect(() => buildNewsXml(newsData)).toThrowError(
        '[next-advanced-sitemap] Invalid news stock_tickers: property must be an array of strings.'
      );
    });

    it('should throw a clear runtime exception if an element reduces to an empty token', () => {
      const newsData: SitemapEntry['news'] = {
        ...baseNews,
        stock_tickers: ['NASDAQ:AAPL', '   ', 'NYSE:GOOG']
      };

      expect(() => buildNewsXml(newsData)).toThrowError(
        '[next-advanced-sitemap] Invalid stock ticker detected: ticker element cannot be empty or just whitespaces.'
      );
    });

    it('should throw an error if a token does not implement the split colon divider exchange token', () => {
      const newsData: SitemapEntry['news'] = {
        ...baseNews,
        stock_tickers: ['NASDAQ:AAPL', 'MALFORMED_TICKER']
      };

      expect(() => buildNewsXml(newsData)).toThrowError(
        '[next-advanced-sitemap] Invalid stock ticker format: "MALFORMED_TICKER". Expected "EXCHANGE:TICKER" format (e.g., "NASDAQ:AAPL").'
      );
    });
  });
});