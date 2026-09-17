/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { generateXml } from '../src/core/generator.js';
import { filterActiveEntries, filterRemovedEntries, isEntryRemoved } from '../src/utils/deletion.js';
import { buildNoIndexTagHeader, getNoIndexHeaders } from '../src/utils/robots-tag.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('Deletion & Expiration Lifecycle (v2.0.0)', () => {
  it('should force priority 0.0 and changefreq "never" for isDeleted entries', () => {
    const entries: SitemapEntry[] = [{ url: 'https://fomadev.com/promo', isDeleted: true, priority: 0.9 }];
    const xml = generateXml(entries);

    expect(xml).toContain('<priority>0.0</priority>');
    expect(xml).toContain('<changefreq>never</changefreq>');
  });

  it('should strip image/video nodes from a deleted entry', () => {
    const entries: SitemapEntry[] = [
      {
        url: 'https://fomadev.com/promo',
        isDeleted: true,
        images: [{ loc: 'https://fomadev.com/img.jpg' }],
        videos: [{ thumbnail_loc: 'https://fomadev.com/t.jpg', title: 'T', description: 'D' }],
      },
    ];
    const xml = generateXml(entries);

    expect(xml).not.toContain('<image:image>');
    expect(xml).not.toContain('<video:video>');
  });

  it('should inject a removal XML comment above deleted entries', () => {
    const entries: SitemapEntry[] = [{ url: 'https://fomadev.com/promo', isDeleted: true }];
    const xml = generateXml(entries);

    expect(xml).toContain('<!-- Status: Pending Removal -->');
  });

  it('should treat a past expiresAt exactly like isDeleted', () => {
    const entries: SitemapEntry[] = [{ url: 'https://fomadev.com/webinar', expiresAt: '2020-01-01T00:00:00.000Z' }];
    const xml = generateXml(entries);

    expect(xml).toContain('<priority>0.0</priority>');
    expect(xml).toContain('<!-- Status: Pending Removal (Expired) -->');
  });

  it('should not treat a future expiresAt as removed', () => {
    const entries: SitemapEntry[] = [{ url: 'https://fomadev.com/webinar', expiresAt: '2099-01-01T00:00:00.000Z', priority: 0.7 }];
    const xml = generateXml(entries);

    expect(xml).toContain('<priority>0.7</priority>');
    expect(xml).not.toContain('Pending Removal');
  });

  it('should throw a guardrail error when the homepage is marked as deleted', () => {
    const entries: SitemapEntry[] = [{ url: 'https://fomadev.com', isDeleted: true }];
    expect(() => generateXml(entries)).toThrowError(/refusing to mark the homepage/);

    const entriesWithSlash: SitemapEntry[] = [{ url: 'https://fomadev.com/', isDeleted: true }];
    expect(() => generateXml(entriesWithSlash)).toThrowError(/refusing to mark the homepage/);
  });

  it('filterActiveEntries / filterRemovedEntries should partition a dataset correctly', () => {
    const entries: SitemapEntry[] = [
      { url: 'https://fomadev.com/a' },
      { url: 'https://fomadev.com/b', isDeleted: true },
      { url: 'https://fomadev.com/c', expiresAt: '2020-01-01T00:00:00.000Z' },
    ];

    expect(filterActiveEntries(entries).map((e) => e.url)).toEqual(['https://fomadev.com/a']);
    expect(filterRemovedEntries(entries).map((e) => e.url)).toEqual(['https://fomadev.com/b', 'https://fomadev.com/c']);
  });

  it('isEntryRemoved should be a pure read-only check', () => {
    expect(isEntryRemoved({ url: 'https://fomadev.com/a' })).toBe(false);
    expect(isEntryRemoved({ url: 'https://fomadev.com/a', isDeleted: true })).toBe(true);
  });

  it('buildNoIndexTagHeader / getNoIndexHeaders should expose the X-Robots-Tag directive', () => {
    expect(buildNoIndexTagHeader()).toBe('noindex, nofollow');
    expect(getNoIndexHeaders().get('X-Robots-Tag')).toBe('noindex, nofollow');
  });
});
