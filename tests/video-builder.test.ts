/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { buildVideoXml } from '../src/core/builders/video-builder.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('Video Builder Integration Tests', () => {
  const baseVideo = {
    thumbnail_loc: 'https://fomadev.com/thumb.jpg',
    title: 'Test Video',
    description: 'A video description',
    publication_date: '2026-06-29T12:00:00.000Z',
  };

  // =========================================================================
  // family_friendly
  // =========================================================================
  describe('buildVideoXml - family_friendly', () => {
    it('should not render <video:family_friendly> if it is undefined', () => {
      const videos: SitemapEntry['videos'] = [
        { ...baseVideo }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).not.toContain('<video:family_friendly>');
    });

    it('should transform boolean true to "yes"', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          family_friendly: true,
        }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).toContain('<video:family_friendly>yes</video:family_friendly>');
    });

    it('should transform boolean false to "no"', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          family_friendly: false,
        }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).toContain('<video:family_friendly>no</video:family_friendly>');
    });

    it('should allow strict string "yes"', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          family_friendly: 'yes',
        }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).toContain('<video:family_friendly>yes</video:family_friendly>');
    });

    it('should allow strict string "no"', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          family_friendly: 'no',
        }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).toContain('<video:family_friendly>no</video:family_friendly>');
    });

    it('should throw a fail-fast error when an invalid string value is passed', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          // @ts-expect-error - Testing runtime security barrier
          family_friendly: 'maybe',
        }
      ];

      expect(() => buildVideoXml(videos)).toThrowError(
        '[next-advanced-sitemap] Invalid value for family_friendly: "maybe". Expected boolean or strict string \'yes\' | \'no\'.'
      );
    });

    it('should throw a fail-fast error when an invalid type is passed', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          // @ts-expect-error - Testing runtime boundary exception
          family_friendly: 42,
        }
      ];

      expect(() => buildVideoXml(videos)).toThrowError(
        '[next-advanced-sitemap] Invalid value for family_friendly: "42". Expected boolean or strict string \'yes\' | \'no\'.'
      );
    });
  });

  // =========================================================================
  // v1.1.5 - requires_subscription
  // =========================================================================
  describe('buildVideoXml - v1.1.5 (requires_subscription)', () => {
    it('should not render <video:requires_subscription> if it is undefined', () => {
      const videos: SitemapEntry['videos'] = [
        { ...baseVideo }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).not.toContain('<video:requires_subscription>');
    });

    it('should transform boolean true to "yes"', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          requires_subscription: true,
        }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).toContain('<video:requires_subscription>yes</video:requires_subscription>');
    });

    it('should transform boolean false to "no"', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          requires_subscription: false,
        }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).toContain('<video:requires_subscription>no</video:requires_subscription>');
    });

    it('should allow strict string "yes"', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          requires_subscription: 'yes',
        }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).toContain('<video:requires_subscription>yes</video:requires_subscription>');
    });

    it('should allow strict string "no"', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          requires_subscription: 'no',
        }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).toContain('<video:requires_subscription>no</video:requires_subscription>');
    });

    it('should throw a fail-fast error when an invalid string value is passed', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          // @ts-expect-error - Testing runtime security barrier
          requires_subscription: 'maybe',
        }
      ];

      expect(() => buildVideoXml(videos)).toThrowError(
        "[next-advanced-sitemap] Invalid value for requires_subscription: \"maybe\". Expected boolean or strict string 'yes' | 'no'."
      );
    });

    it('should throw a fail-fast error when an invalid type is passed', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          // @ts-expect-error - Testing runtime boundary exception
          requires_subscription: 42,
        }
      ];

      expect(() => buildVideoXml(videos)).toThrowError(
        "[next-advanced-sitemap] Invalid value for requires_subscription: \"42\". Expected boolean or strict string 'yes' | 'no'."
      );
    });
  });

  // =========================================================================
  // v1.1.6 - price
  // =========================================================================
  describe('buildVideoXml - v1.1.6 (price)', () => {
    it('should correctly render complete price node with type="own"', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          price: { value: 19.99, currency: 'usd', type: 'own' }
        }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).toContain('<video:price currency="USD" type="own">19.99</video:price>');
    });

    it('should correctly render price without type and handle lowercase currency token transformation', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          price: { value: 15000, currency: 'cdf' }
        }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).toContain('<video:price currency="CDF">15000.00</video:price>');
    });

    it('should throw an error if price value is negative', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          price: { value: -5, currency: 'EUR' }
        }
      ];

      expect(() => buildVideoXml(videos)).toThrowError(
        '[next-advanced-sitemap] Invalid video price value: "-5". Value must be a positive number.'
      );
    });

    it('should throw an error if currency is not an ISO 4217 3-letter token', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          price: { value: 10, currency: 'US' } // Mauvais format
        }
      ];

      expect(() => buildVideoXml(videos)).toThrowError(
        '[next-advanced-sitemap] Invalid ISO 4217 currency code: "US". Currency must be exactly a 3-letter code.'
      );
    });
  });

  // =========================================================================
  // v1.1.7 - category & tags
  // =========================================================================
  describe('buildVideoXml - v1.1.7 (category & tags)', () => {
    it('should correctly render escaped category and tags array', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          category: '  Next.js & Architecture  ',
          tags: ['typescript', 'seo', ' web development ']
        }
      ];

      const xml = buildVideoXml(videos);
      expect(xml).toContain('<video:category>Next.js &amp; Architecture</video:category>');
      expect(xml).toContain('<video:tag>typescript</video:tag>');
      expect(xml).toContain('<video:tag>seo</video:tag>');
      expect(xml).toContain('<video:tag>web development</video:tag>');
    });

    it('should throw an error if category exceeds 256 characters', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          category: 'a'.repeat(257)
        }
      ];

      expect(() => buildVideoXml(videos)).toThrowError(
        '[next-advanced-sitemap] Invalid video category length: 257. Maximum allowed is 256 characters.'
      );
    });

    it('should throw an error if tags array contains more than 32 elements', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          tags: Array(33).fill('tag')
        }
      ];

      expect(() => buildVideoXml(videos)).toThrowError(
        '[next-advanced-sitemap] Invalid video tags count: 33. A video can have a maximum of 32 tags.'
      );
    });

    it('should throw an error if an empty tag is detected after trimming', () => {
      const videos: SitemapEntry['videos'] = [
        {
          ...baseVideo,
          tags: ['valid-tag', '   ', 'another-one']
        }
      ];

      expect(() => buildVideoXml(videos)).toThrowError(
        '[next-advanced-sitemap] Invalid video tag detected: tag cannot be empty or just whitespaces.'
      );
    });
  });
});