/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { calculatePriorityByDepth } from '../src/utils/priority.js';
import { isStagingUrl } from '../src/utils/staging.js';
import { normalizeTrailingSlash } from '../src/utils/trailing-slash.js';
import { exportSitemapToCsv, exportSitemapToJson } from '../src/utils/export.js';
import { diffSitemapEntries } from '../src/utils/diff.js';
import { analyzeSitemapEntries } from '../src/utils/analyze.js';
import { splitEntriesByType } from '../src/utils/split-by-type.js';
import { generateXml } from '../src/core/generator.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('calculatePriorityByDepth (v2.0.0)', () => {
  it('should assign 1.0 to the root, decreasing by depth', () => {
    expect(calculatePriorityByDepth('https://fomadev.com')).toBe(1.0);
    expect(calculatePriorityByDepth('https://fomadev.com/blog')).toBe(0.8);
    expect(calculatePriorityByDepth('https://fomadev.com/blog/my-article')).toBe(0.6);
  });

  it('should never go below the configured minimum', () => {
    expect(calculatePriorityByDepth('https://fomadev.com/a/b/c/d/e/f/g/h', { min: 0.1 })).toBeGreaterThanOrEqual(0.1);
  });
});

describe('isStagingUrl / excludeStaging (v2.0.0)', () => {
  it('should detect common non-production hosts', () => {
    expect(isStagingUrl('https://localhost:3000/x')).toBe(true);
    expect(isStagingUrl('https://my-app.vercel.app/x')).toBe(true);
    expect(isStagingUrl('https://staging.fomadev.com/x')).toBe(true);
    expect(isStagingUrl('https://fomadev.com/x')).toBe(false);
  });

  it('should exclude staging entries at generation time when enabled', () => {
    const entries: SitemapEntry[] = [{ url: 'https://fomadev.com/a' }, { url: 'https://my-app.vercel.app/preview' }];
    const xml = generateXml(entries, { excludeStaging: true });

    expect(xml).toContain('fomadev.com/a');
    expect(xml).not.toContain('vercel.app');
  });
});

describe('normalizeTrailingSlash / trailingSlash option (v2.0.0)', () => {
  it('should add, remove, or preserve trailing slashes without touching the root', () => {
    expect(normalizeTrailingSlash('https://fomadev.com/blog', 'add')).toBe('https://fomadev.com/blog/');
    expect(normalizeTrailingSlash('https://fomadev.com/blog/', 'remove')).toBe('https://fomadev.com/blog');
    expect(normalizeTrailingSlash('https://fomadev.com/', 'remove')).toBe('https://fomadev.com/');
    expect(normalizeTrailingSlash('https://fomadev.com/blog', 'preserve')).toBe('https://fomadev.com/blog');
  });

  it('should apply trailingSlash at generation time', () => {
    const xml = generateXml([{ url: 'https://fomadev.com/blog' }], { trailingSlash: 'add' });
    expect(xml).toContain('<loc>https://fomadev.com/blog/</loc>');
  });
});

describe('exportSitemapToJson / exportSitemapToCsv (v2.0.0)', () => {
  const entries: SitemapEntry[] = [{ url: 'https://fomadev.com/a', priority: 0.8, images: [{ loc: 'https://fomadev.com/i.jpg' }] }];

  it('should export valid JSON', () => {
    const json = JSON.parse(exportSitemapToJson(entries));
    expect(json[0].url).toBe('https://fomadev.com/a');
  });

  it('should export a CSV with a header row and one data row per entry', () => {
    const csv = exportSitemapToCsv(entries);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('url,lastmod,changefreq,priority,imageCount,videoCount,hasNews,isRemoved');
    expect(lines[1]).toContain('https://fomadev.com/a');
    expect(lines[1]).toContain('1'); // imageCount
  });
});

describe('diffSitemapEntries (v2.0.0)', () => {
  it('should report added, removed and changed URLs', () => {
    const previous: SitemapEntry[] = [{ url: 'https://fomadev.com/a', priority: 0.5 }, { url: 'https://fomadev.com/gone' }];
    const current: SitemapEntry[] = [{ url: 'https://fomadev.com/a', priority: 0.9 }, { url: 'https://fomadev.com/new' }];

    const diff = diffSitemapEntries(previous, current);
    expect(diff.added).toEqual(['https://fomadev.com/new']);
    expect(diff.removed).toEqual(['https://fomadev.com/gone']);
    expect(diff.changed).toEqual([{ url: 'https://fomadev.com/a', changes: ['priority'] }]);
  });
});

describe('analyzeSitemapEntries (v2.0.0)', () => {
  it('should score a clean dataset highly and flag duplicates', () => {
    const clean = analyzeSitemapEntries([{ url: 'https://fomadev.com/a', lastmod: new Date() }]);
    expect(clean.score).toBe(100);
    expect(clean.warnings).toEqual([]);

    const dirty = analyzeSitemapEntries([{ url: 'https://fomadev.com/a' }, { url: 'https://fomadev.com/a' }]);
    expect(dirty.duplicateUrls).toBe(1);
    expect(dirty.score).toBeLessThan(100);
  });
});

describe('splitEntriesByType (v2.0.0)', () => {
  it('should group entries by content type', () => {
    const entries: SitemapEntry[] = [
      { url: 'https://fomadev.com/a', images: [{ loc: 'https://fomadev.com/i.jpg' }] },
      { url: 'https://fomadev.com/b', videos: [{ thumbnail_loc: 't', title: 'T', description: 'D' }] },
      { url: 'https://fomadev.com/c', news: { name: 'N', language: 'en', publication_date: new Date(), title: 'T' } },
      { url: 'https://fomadev.com/d' },
    ];

    const split = splitEntriesByType(entries);
    expect(split.pages.length).toBe(4);
    expect(split.images.map((e) => e.url)).toEqual(['https://fomadev.com/a']);
    expect(split.videos.map((e) => e.url)).toEqual(['https://fomadev.com/b']);
    expect(split.news.map((e) => e.url)).toEqual(['https://fomadev.com/c']);
  });
});
