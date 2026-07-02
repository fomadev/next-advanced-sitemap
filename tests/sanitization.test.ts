/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('Auto-Trimming URL Sanitization (v1.0.7)', () => {
  it('should automatically trim leading and trailing spaces from the main URL', () => {
    const entries: SitemapEntry[] = [{ url: '   https://fomadev.com/trimmed-path   ' }];
    
    let xml = '';
    expect(() => { xml = generateXml(entries); }).not.toThrow();
    expect(xml).toContain('<loc>https://fomadev.com/trimmed-path</loc>');
  });

  it('should automatically trim spaces inside secondary media resources', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com',
        images: [{ loc: '   https://fomadev.com/image.jpg ' }]
      }
    ];

    let xml = '';
    expect(() => { xml = generateXml(entries); }).not.toThrow();
    expect(xml).toContain('<image:loc>https://fomadev.com/image.jpg</image:loc>');
  });

  it('should still throw an error if an unencoded space exists internally', () => {
    const entries: SitemapEntry[] = [{ url: ' https://fomadev.com/invalid internal space ' }];
    expect(() => generateXml(entries)).toThrow(
      '[next-advanced-sitemap] Malformed URL structure detected in main entry'
    );
  });
});