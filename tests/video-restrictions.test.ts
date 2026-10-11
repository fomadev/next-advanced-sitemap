/*
 * Copyright (c) 2026 Fordima Inc. All rights reserved.
 * Licensed under the Fordima Public License (FPL) v1.0.
 * See the LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('v1.1.4: Video Restrictions & Platforms Layout validation', () => {

  it('should format restriction and platform objects into valid space-separated XML attributes', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/restricted-movie',
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/poster.jpg',
            title: 'Geo-blocked Content',
            description: 'Streaming exclusively available in selective vectors.',
            restriction: {
              relationship: 'allow',
              countries: ['cd', 'fr', 'us'] // Doit être auto-capitalisé en CD FR US
            },
            platform: {
              relationship: 'deny',
              platforms: ['tv', 'mobile']
            }
          }
        ]
      }
    ];

    const xml = generateXml(entries);

    expect(xml).toContain('<video:restriction relationship="allow">CD FR US</video:restriction>');
    expect(xml).toContain('<video:platform relationship="deny">tv mobile</video:platform>');
  });

  it('should throw an error if countries array is empty', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/error-restriction',
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/poster.jpg',
            title: 'Error Video',
            description: 'Testing structure validation.',
            restriction: { relationship: 'deny', countries: [] }
          }
        ]
      }
    ];

    expect(() => generateXml(entries)).toThrowError(
      '[next-advanced-sitemap] Invalid video restriction: countries array cannot be empty.'
    );
  });

  it('should throw an error if an invalid country code length is detected', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/error-country-code',
        videos: [
          {
            thumbnail_loc: 'https://fomadev.com/poster.jpg',
            title: 'Error Video',
            description: 'Testing structure validation.',
            restriction: { relationship: 'allow', countries: ['FRA', 'INVALID_CODE'] }
          }
        ]
      }
    ];

    expect(() => generateXml(entries)).toThrowError(
      '[next-advanced-sitemap] Invalid ISO country code detected: "INVALID_CODE". Must be a valid ISO 3166 code.'
    );
  });
});