/* * Copyright (c) 2026 Fordi / FomaDev.
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { getServerSitemapStreamResponse } from '../src/index.js';
import { SitemapEntry } from '../src/types/sitemap.js';

async function readAll(response: Response): Promise<string> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let output = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    output += decoder.decode(value, { stream: true });
  }
  return output;
}

async function* asyncEntries(entries: SitemapEntry[]): AsyncGenerator<SitemapEntry> {
  for (const entry of entries) {
    yield entry;
  }
}

describe('Streaming XML Generation (v2.0.0)', () => {
  it('should stream a valid urlset for a plain array', async () => {
    const entries: SitemapEntry[] = [{ url: 'https://fomadev.com/a' }, { url: 'https://fomadev.com/b' }];
    const response = getServerSitemapStreamResponse(entries);

    expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

    const xml = await readAll(response);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<loc>https://fomadev.com/a</loc>');
    expect(xml).toContain('<loc>https://fomadev.com/b</loc>');
    expect(xml.trim().endsWith('</urlset>')).toBe(true);
  });

  it('should stream lazily from an AsyncIterable source', async () => {
    const entries: SitemapEntry[] = [{ url: 'https://fomadev.com/x' }, { url: 'https://fomadev.com/y' }];
    const response = getServerSitemapStreamResponse(asyncEntries(entries));

    const xml = await readAll(response);
    expect(xml).toContain('<loc>https://fomadev.com/x</loc>');
    expect(xml).toContain('<loc>https://fomadev.com/y</loc>');
  });

  it('should sort a plain array by priority before streaming', async () => {
    const entries: SitemapEntry[] = [
      { url: 'https://fomadev.com/low', priority: 0.2 },
      { url: 'https://fomadev.com/high', priority: 0.9 },
    ];
    const response = getServerSitemapStreamResponse(entries, { sortByPriority: true });

    const xml = await readAll(response);
    expect(xml.indexOf('https://fomadev.com/high')).toBeLessThan(xml.indexOf('https://fomadev.com/low'));
  });

  it('should reject a plain array exceeding 50,000 entries', async () => {
    const entries: SitemapEntry[] = Array.from({ length: 50001 }, (_, i) => ({ url: `https://fomadev.com/${i}` }));
    const response = getServerSitemapStreamResponse(entries);

    await expect(readAll(response)).rejects.toThrow(/50,000/);
  });

  it('should apply strict-mode validation while streaming', async () => {
    const entries: SitemapEntry[] = [{ url: 'http://fomadev.com/insecure' }];
    const response = getServerSitemapStreamResponse(entries, { strict: true, autoLastmod: true });

    await expect(readAll(response)).rejects.toThrow(/HTTPS/);
  });
});
