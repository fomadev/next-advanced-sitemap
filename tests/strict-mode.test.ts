/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('Strict Mode (v2.0.0, Breaking)', () => {
  it('should reject http:// URLs in strict mode', () => {
    const entries: SitemapEntry[] = [{ url: 'http://fomadev.com', lastmod: new Date(), changefreq: 'daily', priority: 1.0 }];
    expect(() => generateXml(entries, { strict: true })).toThrowError(/URLs must use HTTPS/);
  });

  it('should require lastmod unless autoLastmod is enabled', () => {
    const entries: SitemapEntry[] = [{ url: 'https://fomadev.com', changefreq: 'daily', priority: 1.0 }];
    expect(() => generateXml(entries, { strict: true })).toThrowError(/"lastmod" is required/);
    expect(() => generateXml(entries, { strict: true, autoLastmod: true })).not.toThrow();
  });

  it('should require changefreq and priority', () => {
    const base: SitemapEntry = { url: 'https://fomadev.com', lastmod: new Date() };
    expect(() => generateXml([{ ...base }], { strict: true })).toThrowError(/"changefreq" is required/);
    expect(() => generateXml([{ ...base, changefreq: 'daily' }], { strict: true })).toThrowError(/"priority" is required/);
  });

  it('should require content_loc or player_loc on every video', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com',
        lastmod: new Date(),
        changefreq: 'daily',
        priority: 1.0,
        videos: [{ thumbnail_loc: 'https://fomadev.com/t.jpg', title: 'T', description: 'D' }],
      },
    ];
    expect(() => generateXml(entries, { strict: true })).toThrowError(/content_loc.*player_loc/);
  });

  it('should pass for a fully compliant strict entry', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com',
        lastmod: new Date(),
        changefreq: 'daily',
        priority: 1.0,
        videos: [{ thumbnail_loc: 'https://fomadev.com/t.jpg', title: 'T', description: 'D', content_loc: 'https://fomadev.com/v.mp4' }],
      },
    ];
    expect(() => generateXml(entries, { strict: true })).not.toThrow();
  });

  it('should not enforce strict rules when strict is not set', () => {
    const entries: SitemapEntry[] = [{ url: 'http://fomadev.com' }];
    expect(() => generateXml(entries)).not.toThrow();
  });
});
