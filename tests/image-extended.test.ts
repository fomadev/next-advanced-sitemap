/*
 * Copyright (c) 2026 Fordima Inc. All rights reserved.
 * Licensed under the Fordima Public License (FPL) v1.0.
 * See the LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('Google Images SEO Local & Licensing (v1.1.0)', () => {
  
  it('should cleanly render geo_location and license tags when provided', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/gallery',
        images: [
          {
            loc: 'https://fomadev.com/images/boutique-dzoket.png',
            title: 'Dzoket Hardware Store',
            geo_location: 'Kinshasa, DRC',
            license: 'https://fomadev.com/licenses/fpl'
          }
        ]
      }
    ];

    const xml = generateXml(entries);

    expect(xml).toContain('<image:geo_location>Kinshasa, DRC</image:geo_location>');
    expect(xml).toContain('<image:license>https://fomadev.com/licenses/fpl</image:license>');
  });

  it('should enforce strict URL rules on license fields and execute trimming', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/gallery',
        images: [
          {
            loc: 'https://fomadev.com/images/item.png',
            license: '   https://fomadev.com/clean-license-url   ' // Test auto-trimming sur la licence
          }
        ]
      }
    ];

    const xml = generateXml(entries);
    expect(xml).toContain('<image:license>https://fomadev.com/clean-license-url</image:license>');
  });

  it('should throw an error if the license field is an invalid URL structure', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/gallery',
        images: [
          {
            loc: 'https://fomadev.com/images/item.png',
            license: 'invalid-license-string' // Doit provoquer une levée d'erreur
          }
        ]
      }
    ];

    expect(() => generateXml(entries)).toThrow();
  });
});