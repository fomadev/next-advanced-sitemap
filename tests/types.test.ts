/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator';
import { SitemapEntry } from '../src/types/sitemap';

describe('Strict SEO Enums and Types Validation (v1.0.5)', () => {
  it('should compile and successfully parse valid changefreq and priority values', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com',
        changefreq: 'daily',
        priority: 1.0
      }
    ];

    const xml = generateXml(entries);
    expect(xml).toContain('<changefreq>daily</changefreq>');
    expect(xml).toContain('<priority>1.0</priority>');
  });

  it('should accurately format float priority boundaries', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/docs',
        priority: 0.5
      }
    ];

    const xml = generateXml(entries);
    expect(xml).toContain('<priority>0.5</priority>');
  });
});