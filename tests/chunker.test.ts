/* * Copyright (c) 2026 Fordi / FomaDev. 
 * Licensed under FomaDev Public License.
 * See LICENSE file in the project root for full license information.
 */

import { describe, it, expect } from 'vitest';
import { chunkSitemapEntries } from '../src/utils/chunker.js';
import { SitemapEntry } from '../src/types/sitemap.js';

describe('v1.2.4 Chunking Utility Suite', () => {

  it('should split a large array of entries into expected smaller chunks', () => {
    const mockEntries: SitemapEntry[] = [
      { url: 'https://fomadev.com/1' },
      { url: 'https://fomadev.com/2' },
      { url: 'https://fomadev.com/3' },
      { url: 'https://fomadev.com/4' },
      { url: 'https://fomadev.com/5' }
    ];

    const result = chunkSitemapEntries(mockEntries, 2);

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveLength(2);
    expect(result[0][0].url).toBe('https://fomadev.com/1');
    expect(result[1]).toHaveLength(2);
    expect(result[2]).toHaveLength(1);
    expect(result[2][0].url).toBe('https://fomadev.com/5');
  });

  it('should return a single chunk array if the limit is larger than array size', () => {
    const mockEntries: SitemapEntry[] = [
      { url: 'https://fomadev.com/1' },
      { url: 'https://fomadev.com/2' }
    ];

    const result = chunkSitemapEntries(mockEntries, 50000);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(2);
  });

  it('should safely return an empty array if input is empty', () => {
    const result = chunkSitemapEntries([], 10);
    expect(result).toHaveLength(0);
  });
});